/* ================================================================
   DSP Signal Analyzer — script.js
   Pure JS DSP core + Plotly charts + Duolingo‑style rendering
   ================================================================ */

(() => {
  "use strict";

  const $ = id => document.getElementById(id);

  /* ── Duolingo‑matched plot colors ─────────────────────────── */
  const C = {
    green:     "#58cc02",
    greenFill: "#d7ffb8",
    blue:      "#1cb0f6",
    blueFill:  "#ddf4ff",
    purple:    "#ce82ff",
    purpleFill:"#f3e8ff",
  };

  /* ════════════════════════════════════════════════════════════
     DSP CORE
     ════════════════════════════════════════════════════════════ */

  function impulse(N, A, n0) {
    const x = new Float64Array(N);
    const i = ((n0 % N) + N) % N;
    x[i] = A;
    return x;
  }

  function step(N, A, n0) {
    const x = new Float64Array(N);
    for (let i = Math.max(n0, 0); i < N; i++) x[i] = A;
    return x;
  }

  function ramp(N, A, n0) {
    const x = new Float64Array(N);
    for (let i = 0; i < N; i++) { const m = i - n0; x[i] = m >= 0 ? A * m : 0; }
    return x;
  }

  function exponential(N, A, n0, a = 0.9) {
    const x = new Float64Array(N);
    for (let i = 0; i < N; i++) { const m = i - n0; x[i] = m >= 0 ? A * Math.pow(a, m) : 0; }
    return x;
  }

  function sinusoid(N, A, n0, f = 0.1) {
    const x = new Float64Array(N);
    for (let i = 0; i < N; i++) x[i] = A * Math.sin(2 * Math.PI * f * (i - n0));
    return x;
  }

  function gen(type, N, A, n0, freq) {
    switch (type) {
      case "impulse":     return impulse(N, A, n0);
      case "step":        return step(N, A, n0);
      case "ramp":        return ramp(N, A, n0);
      case "exponential": return exponential(N, A, n0);
      case "sinusoid":    return sinusoid(N, A, n0, freq);
      default: return new Float64Array(N);
    }
  }

  /* ── DTFT — direct definition (no FFT) ────────────────────── */
  function dtft(sig, pts) {
    const N = sig.length;
    const freqs = new Float64Array(pts);
    const mags  = new Float64Array(pts);
    for (let k = 0; k < pts; k++) {
      const f = -0.5 + k / pts;
      freqs[k] = f;
      let re = 0, im = 0;
      for (let n = 0; n < N; n++) {
        const a = -2 * Math.PI * f * n;
        re += sig[n] * Math.cos(a);
        im += sig[n] * Math.sin(a);
      }
      mags[k] = Math.sqrt(re * re + im * im);
    }
    return { freqs, mags };
  }

  /* ── Convolution — manual summation ───────────────────────── */
  function convolve(x, h) {
    const Ny = x.length + h.length - 1;
    const y = new Float64Array(Ny);
    for (let n = 0; n < Ny; n++) {
      let s = 0;
      for (let k = 0; k < x.length; k++) {
        const j = n - k;
        if (j >= 0 && j < h.length) s += x[k] * h[j];
      }
      y[n] = s;
    }
    return y;
  }

  /* ════════════════════════════════════════════════════════════
     PLOTLY HELPERS — Duolingo flat style
     ════════════════════════════════════════════════════════════ */

  /** Proper stem plot: vertical lines from 0 → y + filled markers */
  function stemTraces(y, color, fillColor) {
    const xs = [], ys = [];
    for (let i = 0; i < y.length; i++) {
      xs.push(i, i, null);
      ys.push(0, y[i], null);
    }
    return [
      {
        x: xs, y: ys,
        mode: "lines",
        line: { color, width: 2 },
        hoverinfo: "skip", showlegend: false,
      },
      {
        x: Array.from({ length: y.length }, (_, i) => i),
        y: Array.from(y),
        mode: "markers",
        marker: {
          color: fillColor, size: 8,
          line: { color, width: 2 },
        },
        hovertemplate: "n = %{x}<br>value = %{y:.4f}<extra></extra>",
        showlegend: false,
      },
    ];
  }

  function lineFill(xArr, yArr, color, fillColor) {
    return {
      x: Array.from(xArr),
      y: Array.from(yArr),
      mode: "lines",
      line: { color, width: 2.5 },
      fill: "tozeroy",
      fillcolor: fillColor,
      hovertemplate: "f = %{x:.3f}<br>mag = %{y:.4f}<extra></extra>",
      showlegend: false,
    };
  }

  function layout(title, xLabel, yLabel) {
    return {
      title: {
        text: `<b>${title}</b>`,
        font: { family: "Nunito", size: 15, color: "#4b4b4b" },
        x: 0.03, xanchor: "left",
      },
      xaxis: {
        title: { text: xLabel, font: { family: "Nunito", size: 12, color: "#777" } },
        gridcolor: "#eee", zerolinecolor: "#ccc", zerolinewidth: 2,
        tickfont: { family: "Nunito", size: 11, color: "#777" },
      },
      yaxis: {
        title: { text: yLabel, font: { family: "Nunito", size: 12, color: "#777" } },
        gridcolor: "#eee", zerolinecolor: "#ccc", zerolinewidth: 2,
        tickfont: { family: "Nunito", size: 11, color: "#777" },
      },
      margin: { l: 52, r: 16, t: 40, b: 44 },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor:  "rgba(0,0,0,0)",
      font: { family: "Nunito" },
      hovermode: "closest",
    };
  }

  const cfg = { responsive: true, displayModeBar: false };

  /* ════════════════════════════════════════════════════════════
     UPDATE
     ════════════════════════════════════════════════════════════ */

  function updateAll() {
    const N   = +$("sigLen").value;
    const pts = +$("dtftPts").value;

    const x = gen($("func1").value, N, +$("scale1").value, +$("shift1").value, +$("freq1").value);
    const h = gen($("func2").value, N, +$("scale2").value, +$("shift2").value, +$("freq2").value);
    const y = convolve(x, h);

    const Xd = dtft(x, pts);
    const Hd = dtft(h, pts);
    const Yd = dtft(y, pts);

    Plotly.react("plot1", stemTraces(x, C.green, C.greenFill),
                 layout("x[n]", "n", "x[n]"), cfg);
    Plotly.react("plot2", [lineFill(Xd.freqs, Xd.mags, C.green, C.greenFill)],
                 layout("|X(f)|", "f (cycles/sample)", "Magnitude"), cfg);

    Plotly.react("plot3", stemTraces(h, C.blue, C.blueFill),
                 layout("h[n]", "n", "h[n]"), cfg);
    Plotly.react("plot4", [lineFill(Hd.freqs, Hd.mags, C.blue, C.blueFill)],
                 layout("|H(f)|", "f (cycles/sample)", "Magnitude"), cfg);

    Plotly.react("plot5", stemTraces(y, C.purple, C.purpleFill),
                 layout("y[n] = x[n] ∗ h[n]", "n", "y[n]"), cfg);
    Plotly.react("plot6", [lineFill(Yd.freqs, Yd.mags, C.purple, C.purpleFill)],
                 layout("|Y(f)|", "f (cycles/sample)", "Magnitude"), cfg);
  }

  /* ════════════════════════════════════════════════════════════
     UI WIRING
     ════════════════════════════════════════════════════════════ */

  function bind(id, dispId, fmt) {
    const el = $(id), d = $(dispId);
    el.addEventListener("input", () => {
      d.textContent = fmt ? fmt(el.value) : el.value;
      updateAll();
    });
  }

  bind("scale1",  "scale1_val",  v => (+v).toFixed(1));
  bind("shift1",  "shift1_val");
  bind("freq1",   "freq1_val",   v => (+v).toFixed(2));
  bind("scale2",  "scale2_val",  v => (+v).toFixed(1));
  bind("shift2",  "shift2_val");
  bind("freq2",   "freq2_val",   v => (+v).toFixed(2));
  bind("sigLen",  "sigLen_val");
  bind("dtftPts", "dtftPts_val");

  function toggleFreq(selId, wrapId) {
    const w = $(wrapId);
    $(selId).value === "sinusoid" ? w.classList.add("visible") : w.classList.remove("visible");
  }

  $("func1").addEventListener("change", () => { toggleFreq("func1", "freq1_wrap"); updateAll(); });
  $("func2").addEventListener("change", () => { toggleFreq("func2", "freq2_wrap"); updateAll(); });

  /* ── Export combined PNG ───────────────────────────────────── */
  $("downloadBtn").addEventListener("click", async () => {
    const ids = ["plot1","plot2","plot3","plot4","plot5","plot6"];
    const canvas = document.createElement("canvas");
    canvas.width = 1600; canvas.height = 960;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 1600, 960);

    const pw = 800, ph = 320;
    for (let i = 0; i < ids.length; i++) {
      const url = await Plotly.toImage($(ids[i]), { format: "png", width: pw, height: ph });
      const img = new Image();
      await new Promise(r => { img.onload = r; img.src = url; });
      ctx.drawImage(img, (i % 2) * pw, Math.floor(i / 2) * ph, pw, ph);
    }
    const a = document.createElement("a");
    a.download = "dsp_analysis.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  });

  /* ── Init ──────────────────────────────────────────────────── */
  toggleFreq("func1", "freq1_wrap");
  toggleFreq("func2", "freq2_wrap");
  updateAll();

})();
