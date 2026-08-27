# DSP Project – Streamlit Front‑End (Light Theme, Full Analysis)

## Overview
A clean, **light‑theme** web UI built with **Streamlit** that lets you:
- Select a discrete‑time singularity function.
- Adjust scaling, shift, and optional delay.
- Generate two independent signals, view stem plots, compute DTFT magnitudes, perform convolution (manual summation), and display all results in a single 3 × 2 figure as required by the project specification.

## Setup
```bash
# Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## Run
```bash
streamlit run app.py
```

Open the displayed URL (usually `http://localhost:8501`).

## Features
- Light‑theme UI with subtle hover animations.
- Signal selection, scaling, shift, and delay controls.
- Automatic generation of the required 3 × 2 figure and export as PNG.

## Extending
Add more singularity functions to `dsp_core.py` and expose them in the sidebar.
