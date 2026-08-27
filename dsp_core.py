import numpy as np

def impulse(length=64, A=1, n0=0):
    x = np.zeros(length)
    idx = n0 % length
    x[idx] = A
    return x

def step(length=64, A=1, n0=0):
    x = np.zeros(length)
    start = max(0, n0)
    x[start:] = A
    return x

def rectN(length=64, N=10, A=1, n0=0):
    x = np.zeros(length)
    x[(np.arange(length) - n0 >= -N) & (np.arange(length) - n0 <= N)] = 1
    return A * x

def sgn(n, A=1, n0=0):
    x = np.sign(n - n0)
    return A * x

def ramp(length=64, A=1, n0=0):
    n = np.arange(length) - n0
    return A * n * (n >= 0)

def exponential(length=64, A=1, n0=0, a=0.9):
    n = np.arange(length) - n0
    return A * (a ** n) * (n >= 0)

def sinusoid(length=64, A=1, n0=0, f=0.1):
    n = np.arange(length) - n0
    return A * np.sin(2 * np.pi * f * n)

def cosinusoid(length=64, A=1, n0=0, f=0.1):
    n = np.arange(length) - n0
    return A * np.cos(2 * np.pi * f * n)

def generate_signal(func_name, A=1, n0=0, freq=None, length=64):
    if func_name == "impulse":
        return impulse(length, A, n0)
    if func_name == "step":
        return step(length, A, n0)
    if func_name == "ramp":
        return ramp(length, A, n0)
    if func_name == "exponential":
        return exponential(length, A, n0)
    if func_name == "sinusoid":
        return sinusoid(length, A, n0, f=freq or 0.1)
    if func_name == "rectN":
        return rectN(length, A, n0, width=10)
    if func_name == "cosinusoid":
        return cosinusoid(length, A, n0, f=freq or 0.1)
    if func_name == "sgn":
        return sgn(np.arange(length), A=A, n0=n0)
    raise ValueError(f"Unknown function {func_name}")

def compute_dtft(signal, num_points=1024):
    n = np.arange(len(signal))
    f = np.linspace(-0.5, 0.5, num_points, endpoint=False)
    exponent = np.exp(-2j * np.pi * np.outer(f, n))
    X = exponent @ signal
    return np.abs(X)

def convolve_signals(x, h):
    N = len(x) + len(h) - 1
    y = np.zeros(N)
    for n in range(N):
        acc = 0.0
        for k in range(len(x)):
            if 0 <= n - k < len(h):
                acc += x[k] * h[n - k]
        y[n] = acc
    return y
