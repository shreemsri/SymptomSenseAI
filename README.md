<div align="center">
  <img src="https://img.shields.io/badge/CodeCure%20AI-SPIRIT'26-0e172a?style=for-the-badge&logo=medapps&logoColor=38bdf8" alt="CodeCure AI SPIRIT'26 Hackathon" />
  <br/>
  
  # 🏥 SymptomSense AI 
  **Smart Symptom Checker & Triage Assistant**

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#disclaimer">Disclaimer</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  </p>
</div>

<br/>

## 🌟 Overview

**SymptomSense AI** is a fully browser-compatible health-tech application built entirely for the frontend layout. With zero dependency on a backend server or a physical database, it utilizes a hardcoded medical JSON dataset mapped seamlessly with the **Google Gemini 2.0 Flash API**.

It empowers users to evaluate acute symptoms and chronic risk indicators (such as Type 2 Diabetes) locally on their device, generating smart, context-aware AI insights directly within their browser!

---

## 🚀 Features

### 🩺 1. Smart Symptom Checker
- **Live Autocomplete Search**: Quickly find symptoms from a curated list of top conditions.
- **Local Scoring Engine**: Matches symptoms locally to compute the top 3 probable diseases with animated confidence dials.
- **Gemini Triage**: Securely calls the Gemini API to explain the condition, output actionable next steps, identify red flags, and recommend specialized physicians.

### 🩸 2. Diabetes Risk Gauge
- **Vitals Interactive Sliders**: Input precise vitals (Age, BMI, Glucose, Insulin, BP, etc.).
- **Weighted Local Algorithms**: Instantly view your risk score out of 100 on an animated Recharts radial gauge.
- **AI Preventative Plans**: Generates customized diet boundaries and lifestyle modifications on the fly. 

### 📊 3. Health Synthesis Dashboard
- **Aggregate Scoring**: Compiles an overall physical wellness score using dual results from Symptom and Diabetes checkers.
- **Executive AI Summary**: Synthesizes all data points into one conclusive clinical priority and definitive next step.
- **One-Click Export**: Downloads all predictions, scores, and Gemini recommendations into a portable `.txt` report.

---

## 💻 Tech Stack

- **Framework**: `React ^18.x`, `Vite`
- **Styling**: `Tailwind CSS v4`
- **Charting Engine**: `Recharts`
- **Icons**: `Lucide React`
- **AI / LLM**: `Google Gemini 2.0 Flash` (Serverless Edge-Requests)

---

## ⚙️ Installation & Usage

### 1. Clone the Repository
```bash
git clone https://github.com/shreemsri/SymptomSenseAI.git
cd codecure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup the AI API Key
Create a `.env` file at the root of your project and insert your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Local Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173/` in your browser. Complete execution happens directly inside your web client! ⚡

---

## 🛡️ Disclaimer

> **⚠️ NOT MEDICAL ADVICE**  
> *SymptomSense AI is an informational tool constructed for hackathon demonstration. It is not designed to replace professional clinical consultations, diagnostics, or therapies. Do not base medical decisions entirely on AI predictions.*

<br/>

<div align="center">
  <sub>Developed for the <b>SPIRIT'26 Hackathon</b> at IIT BHU Varanasi.</sub>
</div>
