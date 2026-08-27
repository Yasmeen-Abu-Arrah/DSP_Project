import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from dsp_core import (
    generate_signal,
    compute_dtft,
    convolve_signals,
)

# ----- Page configuration & light‑theme style -----
st.set_page_config(page_title="DSP Project", layout="centered")
custom_css = """
body {
    background: #fafafa;
    color: #212529;
    font-family: 'Inter', sans-serif;
}
[data-testid=\"stSidebar\"] {
    background: #ffffff;
    border-right: 1px solid #ddd;
    box-shadow: 2px 0 5px rgba(0,0,0,0.05);
}
button {
    background: #1976d2;
    border: none;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: background .2s ease;
}
button:hover { background: #1565c0; }
"""
st.markdown(f"<style>{custom_css}</style>", unsafe_allow_html=True)

# ----- Sidebar Controls -----
st.sidebar.title("🛠️ DSP Controls")
func_options = {
    "Impulse (δ[n])": "impulse",
    "Step (u[n])": "step",
    "Ramp (r[n])": "ramp",
    "Exponential (a^n)": "exponential",
    "Sinusoid (sin(2πf₀n))": "sinusoid",
}
selected_func = st.sidebar.selectbox("Select singularity function", list(func_options.keys()))
A = st.sidebar.slider("Scaling factor A", -5.0, 5.0, 1.0, 0.1)
n0 = st.sidebar.slider("Shift n₀ (samples)", -20, 20, 0, 1)
freq = st.sidebar.slider("Sinusoid frequency (cycles/sample)", 0.0, 0.5, 0.1, 0.01) if func_options[selected_func] == "sinusoid" else None
delay_ms = st.sidebar.slider("Delay (ms)", 0, 2000, 0, 10)

st.title("📊 DSP Analysis Interface")

# Generate two independent signals (x and h)
st.subheader("Signal 1 (x[n])")
A2 = st.sidebar.slider("Scaling factor A₂", -5.0, 5.0, 1.0, 0.1, key="A2")
n02 = st.sidebar.slider("Shift n₀₂ (samples)", -20, 20, 0, 1, key="n02")
freq2 = st.sidebar.slider("Sinusoid freq₂ (cycles/sample)", 0.0, 0.5, 0.1, 0.01, key="freq2") if func_options[selected_func] == "sinusoid" else None

# Generate signals
x = generate_signal(func_options[selected_func], A, n0, freq, length=64)
h = generate_signal(func_options[selected_func], A2, n02, freq2, length=64)

# Compute DTFTs
X_mag = compute_dtft(x)
H_mag = compute_dtft(h)

# Convolution (manual summation)
y = convolve_signals(x, h)
Y_mag = compute_dtft(y)

# ----- Plotting -----
fig, axs = plt.subplots(3, 2, figsize=(12, 10))
# Subfigure 1 – x[n]
axs[0, 0].stem(range(len(x)), x, basefmt=" ")
axs[0, 0].set_title("x[n]")
axs[0, 0].set_xlabel("n")
axs[0, 0].set_ylabel("x[n]")
# Subfigure 2 – |X(f)|
freq_axis = np.linspace(-0.5, 0.5, len(X_mag))
axs[0, 1].plot(freq_axis, X_mag)
axs[0, 1].set_title("|X(f)|")
axs[0, 1].set_xlabel("f (cycles/sample)")
# Subfigure 3 – h[n]
axs[1, 0].stem(range(len(h)), h, basefmt=" ")
axs[1, 0].set_title("h[n]")
axs[1, 0].set_xlabel("n")
axs[1, 0].set_ylabel("h[n]")
# Subfigure 4 – |H(f)|
axs[1, 1].plot(freq_axis, H_mag)
axs[1, 1].set_title("|H(f)|")
axs[1, 1].set_xlabel("f (cycles/sample)")
# Subfigure 5 – y[n] = x[n] * h[n]
axs[2, 0].stem(range(len(y)), y, basefmt=" ")
axs[2, 0].set_title("y[n] = x[n] * h[n]")
axs[2, 0].set_xlabel("n")
axs[2, 0].set_ylabel("y[n]")
# Subfigure 6 – |Y(f)|
axs[2, 1].plot(freq_axis, Y_mag)
axs[2, 1].set_title("|Y(f)|")
axs[2, 1].set_xlabel("f (cycles/sample)")

plt.tight_layout()
st.pyplot(fig)

# Download button for the combined figure
buf = st.download_button(
    label="Download Figure (PNG)",
    data=fig.canvas.tostring_png(),
    file_name="dsp_analysis.png",
    mime="image/png",
)
