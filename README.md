<div align="center">
  <img src="https://img.shields.io/badge/CodeCure%20AI-SPIRIT'26-0e172a?style=for-the-badge&logo=medapps&logoColor=38bdf8" alt="CodeCure AI SPIRIT'26 Hackathon" />
  <img src="https://img.shields.io/badge/Stitch%20UI-Aetheris%20Clinical-060e20?style=for-the-badge&logo=css3&logoColor=38bdf8" alt="Stitch UI Framework" />
  <br/>
  
  # 🏥 SymptomSense AI 
  **Next-Gen Offline-Resilient Clinical Triage Engine**

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#disclaimer">Disclaimer</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS_4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Chart.js_Radar-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="ChartJS" />
    <img src="https://img.shields.io/badge/Gemini%202.0%20Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  </p>
</div>

<br/>

> **🚀 V2.0 Architect Update:** SymptomSense now features a completely custom **Light/Dark Mode** semantic routing architecture (Landing → Login → App). We've replaced the dark-navy terminal theme with a premium, human-centered medical UI. Crucially, the app now uses a **Zero-Downtime Offline NLP Fallback Engine**—meaning even if the Gemini API quota drops to 0, your triage engine flawlessly reverts to a deterministic local dictionary mesh to keep your hackathon demo running 100% offline!

<br/>

## 🌟 Overview

**SymptomSense AI** is a fully browser-compatible health-tech application built entirely for the frontend layout. With zero dependency on a backend server or a physical database, it utilizes a hardcoded medical JSON dataset mapped seamlessly with the **Google Gemini 2.0 Flash API**.

It empowers users to evaluate acute symptoms and chronic risk indicators (such as Type 2 Diabetes) locally on their device, generating smart, context-aware AI insights directly within their browser! 

---

## 🚀 Features

### 💬 1. Conversational Symptom Checker (Offline-Resilient!)
- **Gemini NLP Extraction**: Type your symptoms in plain English sentences. The Gemini engine intelligently strips out core symptoms, maps them to medical terms, and displays extracted data tags instantly!
- **⚡ Failsafe Offline Matrix**: If API Rate Limits are hit during a live demo, the engine instantly intercepts the 429 error and reroutes your string into a proprietary local `diseases.js` keyword scanner to safely compute results without HTTP access.
- **Gemini Triage**: Securely calls the Gemini API to explain the condition, output actionable next steps, identify red flags, and recommend specialized physicians.

### 🩸 2. Diabetes Risk Gauge
- **Vitals Interactive Sliders**: Input precise vitals (Age, BMI, Glucose, Insulin, BP, etc.) via premium UI sliders featuring responsive mint CSS tracking.
- **Mathematical Scoring Engine**: Instantly view your calculated risk score out of 100 mapped seamlessly onto an SVG radial gauge without any library overhead!
- **AI Preventative Plans**: Generates customized diet boundaries and lifestyle modifications on the fly based on biomarker variables.

### 📊 3. Health Synthesis Dashboard
- **React-ChartJS-2 Radar**: Synthesizes Symptom Confidence, Diabetes Risk, and base Health metrics into a visually stunning, premium-grade Clinical Radar Chart.
- **Executive Summary**: Synthesizes all independent datasets into one conclusive clinical priority and definitive next step via the AI.
- **One-Click Export**: Downloads all predictions, scores, and Gemini recommendations into a secure, portable `.txt` report.

### 🌓 4. Dynamic Theme Routing Engine
- Fully functional pure-React state routing transitioning gracefully from a **Pill-Navigation Landing Page**, to a **Glassmorphic Login Gateway**, into the actual App.
- Universal **Light/Dark Theme Switch** mapping standard Tailwind layout variables via standard CSS roots stored gracefully in browser `localStorage`. 

---

## 💻 Tech Stack

- **Framework**: `React ^18.x`, `Vite`
- **Styling**: `Tailwind CSS v4` + Dynamic `:root/.dark` semantic maps
- **Charting Engine**: `Chart.js` + `react-chartjs-2`
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
*(Note: If your API key returns Google's "Free Tier Limit 0" error due to region/workspace locks, SymptomSense will gracefully failover to its offline heuristic engine—so you can STILL hack!)*

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
