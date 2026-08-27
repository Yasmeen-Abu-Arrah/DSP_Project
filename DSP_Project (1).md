Digital Signal Processing 

Project 

# **Digital Signal Processing Project** 

### Discrete-Time Signals, Convolution, and DTFT 

**Programming Languages:** C++, Java, Python, or MATLAB 

**Discrete-Time Range:** 



**Normalized Frequency Range:** 

_−_ 0 _._ 5 _≤ f ≤_ 0 _._ 5 

## **1. General Instructions** 

This project consists of **two independent parts** . 

- **Part I:** Implementation of common discrete-time singularity functions. 

- **Part II:** Convolution and DTFT analysis using the functions developed in Part I. 

The project may be implemented using one of the following programming languages: 

- C++ 

- Java 

- Python 

- MATLAB 

For all discrete-time signals, use 



For frequency-domain calculations, use normalized frequency in cycles/sample: 



All discrete-time signals should be displayed using stem plots or an equivalent discretetime representation. 

1 

Digital Signal Processing 

Project 

## **– 2. Part I Discrete-Time Singularity Functions** 

### **2.1 Objective** 

Develop a set of reusable functions for generating common discrete-time singularity functions. 

The following five functions must be implemented: 



Each signal must be implemented as a separate function so that it can be called later from Part II. 

### **2.2 Scaling and Shifting** 

The functions should allow the generation of scaled and shifted signals of the general form 



where: 

- _A_ is the scaling factor. 

- _n_ 0 is the time shift. 

- _s_ [ _n_ ] is one of the five basic functions. 

Examples include: 







and 



### **2.3 Required Output** 

The student should demonstrate the implemented functions by plotting different scaled and shifted versions of the five basic signals. 

All signals should be plotted over 



using a discrete-time stem plot. The plots should contain: 

- Appropriate title. 

2 

Digital Signal Processing 

Project 

- Horizontal axis labeled _n_ . 

- Vertical axis labeled _x_ [ _n_ ]. 

- Clearly visible discrete samples. 

- Grid where appropriate. 

The functions developed in Part I should be reused in Part II. 

## **– 3. Part II Convolution and DTFT Analysis** 

### **3.1 Objective** 

Develop a program that uses the functions from Part I to generate two discrete-time signals 



The two signals may be any scaled and/or shifted versions of the singularity functions defined in Part I. 

The program must then: 

1. Plot the two signals in the time domain. 

2. Calculate and plot the DTFT of each signal. 

3. Calculate their convolution. 

4. Plot the convolution in the time domain. 

5. Calculate and plot the DTFT of the convolution. 

6. Verify the DTFT convolution property. 

### **– 3.2 Step 1 Generate Two Signals** 

Use the functions developed in Part I to generate two signals: 



and 



For example: 



and 



The student should be able to change the signal types, scaling factors, and shifts. 

3 

Digital Signal Processing 

Project 

### **– 3.3 Step 2 Plot the Two Signals** 

Plot the two signals in the time domain: 



and 



The signals should be displayed as discrete-time stem plots. 

### **– 3.4 Step 3 Calculate the DTFT** 

For a signal _x_ [ _n_ ], calculate the DTFT directly from its definition. Using normalized frequency _f_ in cycles/sample: 



Similarly, calculate 



The frequency range must be 



Use a sufficiently large number of frequency samples, for example 1000 or more, to obtain a smooth frequency-domain plot. 

The magnitude spectra should be calculated as 



and 



The student may also plot the phase if desired, but the required result is the magnitude spectrum. 

### **– 3.5 Step 4 Calculate the Convolution** 

Calculate the convolution of the two signals using 



where 



4 

Digital Signal Processing 

Project 

The convolution must be implemented using the summation. 

**Do not use a built-in convolution function** such as MATLAB’s `conv()` or an equivalent library function as the main implementation. 

The purpose is to demonstrate understanding of the discrete-time convolution operation. 

### **– 3.6 Step 5 DTFT of the Convolution** 

Calculate the DTFT of the convolution result: 



Then calculate its magnitude: 



The frequency range must again be 



### **3.7 Required Figure** 

All the main results of Part II should be displayed in **one figure** containing six subfigures arranged as 



The recommended arrangement is: 



Thus: 

- **Subfigure 1:** _x_ [ _n_ ] 

- **Subfigure 2:** _|X_ ( _f_ ) _|_ 

- **Subfigure 3:** _h_ [ _n_ ] 

- **Subfigure 4:** _|H_ ( _f_ ) _|_ 

- **Subfigure 5:** _y_ [ _n_ ] = _x_ [ _n_ ] _∗ h_ [ _n_ ] 

- **Subfigure 6:** _|Y_ ( _f_ ) _|_ 

5 

Digital Signal Processing 

Project 

The time-domain plots should use 



and the frequency-domain plots should use 



The frequency-domain horizontal axis must be labeled 



## **4. Example** 

Use the functions from Part I to generate, for example, 



and 



Then: 

1. Plot _x_ [ _n_ ] and _h_ [ _n_ ]. 

2. Calculate _X_ ( _f_ ) and _H_ ( _f_ ). 

3. Calculate 



4. Calculate _Y_ ( _f_ ). 

5. Calculate _X_ ( _f_ ) _H_ ( _f_ ). 

6. Compare _Y_ ( _f_ ) with _X_ ( _f_ ) _H_ ( _f_ ). 

7. Display all required results in the 3 _×_ 2 figure. 

## **5. Important Requirements** 

1. The discrete-time range must be 



2. The normalized frequency range must be 



3. The singularity functions in Part I must be implemented as separate reusable functions. 

6 

Digital Signal Processing 

Project 

4. Part II should use the functions developed in Part I. 

5. The convolution must be calculated using the convolution summation and not a built-in convolution command. 

6. The DTFT must be calculated directly from 



7. A built-in FFT function should not be used as the main method for calculating the DTFT. 

8. All discrete-time signals must be displayed using stem plots or an equivalent discretetime representation. 

9. The main results of Part II must be displayed in one 3 _×_ 2 **figure** . 

## **6. Submission Requirements** 

Each student should submit: 

1. Complete source code. 

2. A short report explaining the implementation. 

3. Required plots. 

4. At least one demonstration example for Part I. 

5. At least one complete demonstration for Part II. 

The student should be able to explain the implemented singularity functions, convolution algorithm, DTFT calculation, and the relationship between convolution in the time domain and multiplication in the frequency domain. 

## **Good Luck!** 

7 

