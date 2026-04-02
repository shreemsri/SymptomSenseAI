import { useState, useEffect } from "react";
import { Activity, Thermometer, ShieldAlert, Heart, Droplets, Info } from "lucide-react";
import { calculateDiabetesRiskScore } from "../utils/scoring";
import { callGeminiAPI } from "../utils/gemini";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const DiabetesChecker = ({ onResultsChange }) => {
  const [vitals, setVitals] = useState({
    age: 45,
    bmi: 25,
    glucose: 100,
    bloodPressure: 80,
    insulin: 40,
    skinThickness: 20,
    pregnancies: 0,
    pedigree: 0.5
  });

  const [riskResult, setRiskResult] = useState({ score: 0, label: "Unknown", color: "text-slate-500" });
  const [geminiResult, setGeminiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-recalculate locally when sliders change
  useEffect(() => {
    const result = calculateDiabetesRiskScore(vitals);
    setRiskResult(result);
  }, [vitals]);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleCheckRisk = async () => {
    setIsLoading(true);
    setGeminiResult(null);

    if (onResultsChange) {
       onResultsChange(riskResult);
    }

    const prompt = `A patient has these vitals: Age=${vitals.age}, BMI=${vitals.bmi}, Glucose=${vitals.glucose}mg/dL, BP=${vitals.bloodPressure}mmHg. Their diabetes risk score is ${riskResult.score}/100 (${riskResult.label}). Give a response in exactly this JSON format:
{
  "tip1": "one personalized diet tip based on vitals",
  "tip2": "one personalized lifestyle tip based on vitals",
  "urgency": "should they see a doctor now, soon, or routine checkup"
}`;

    const fallback = {
      tip1: "Focus on a balanced diet rich in whole grains and vegetables.",
      tip2: "Maintain moderate daily exercise, at least 30 minutes a day.",
      urgency: riskResult.score > 65 ? "See a doctor soon for evaluation" : "Routine checkup"
    };

    const result = await callGeminiAPI(prompt, fallback);
    setGeminiResult(result);
    setIsLoading(false);
  };

  // Custom SVG Gauge calculation
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (riskResult.score / 100) * circumference;

  return (
    <div className="space-y-8 pb-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 glass-card mt-8 p-6 md:p-8 rounded-3xl relative overflow-hidden group animate-fade-up">
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
          <div className="relative z-10 mb-8">
            <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Diabetes Risk Analysis</h2>
            <p className="text-slate-500 text-sm mt-1">Metabolic predictive modeling based on clinical biomarkers.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 relative z-10 animate-fade-up">
            <InputGroup 
              label="Age (years)" name="age" value={vitals.age} min={1} max={100} icon={Activity}
              onChange={handleSliderChange} 
            />
            <InputGroup 
              label="BMI (kg/m²)" name="bmi" value={vitals.bmi} min={10} max={50} icon={Activity}
              onChange={handleSliderChange} 
            />
             <InputGroup 
              label="Glucose (mg/dL)" name="glucose" value={vitals.glucose} min={50} max={300} icon={Droplets}
              onChange={handleSliderChange} 
            />
             <InputGroup 
              label="Blood Pressure (mmHg)" name="bloodPressure" value={vitals.bloodPressure} min={40} max={140} icon={Heart}
              onChange={handleSliderChange} 
            />
             <InputGroup 
              label="Insulin (µU/ml)" name="insulin" value={vitals.insulin} min={0} max={900} icon={Thermometer}
              onChange={handleSliderChange} 
            />
             <InputGroup 
              label="Skin Thickness (mm)" name="skinThickness" value={vitals.skinThickness} min={0} max={100} icon={Activity}
              onChange={handleSliderChange} 
            />
             <InputGroup 
              label="Pedigree Function" name="pedigree" value={vitals.pedigree} min={0} max={2.5} step={0.1} icon={Activity}
              onChange={handleSliderChange} 
            />
             <InputGroup 
              label="Pregnancies" name="pregnancies" value={vitals.pregnancies} min={0} max={15} icon={Activity}
              onChange={handleSliderChange} 
            />
          </div>

          <button
            onClick={handleCheckRisk}
            disabled={isLoading}
            className="mt-12 group w-full relative z-10 font-headline bg-gradient-to-r from-primary to-primary-container text-[#00354a] font-bold py-4 rounded-xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover-lift neon-glow shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating AI Plan..." : "Generate AI Risk Plan"}
          </button>
        </div>

        {/* Right Col: Gauge & Score */}
        <div className="flex flex-col gap-6">
           {/* Gauge Card */}
           <div className="glass-card flex-1 min-h-[350px] p-8 rounded-3xl border border-white/5 flex flex-col justify-center items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 select-none pointer-events-none opacity-5">
                <span className="text-8xl font-headline font-black text-white leading-none">RISK</span>
              </div>
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-white/5" cx="128" cy="128" fill="transparent" r={radius} stroke="currentColor" strokeWidth="8"></circle>
                  <circle 
                    className={`${riskResult.color} outline-none drop-shadow-[0_0_12px_rgba(currentColor,0.6)]`} 
                    cx="128" cy="128" 
                    fill="transparent" 
                    r={radius} 
                    stroke="currentColor" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    strokeWidth="12" 
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-headline font-black text-white">{riskResult.score}</span>
                  <span className="text-[10px] font-label text-slate-500 uppercase tracking-[0.3em] mt-1">Score / 100</span>
                </div>
              </div>
             
              <div className="mt-8 text-center relative z-10 w-full flex justify-center">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold uppercase tracking-wider relative shadow-inner shadow-black/50">
                  <span className={`w-2 h-2 rounded-full ${riskResult.color.replace('text-', 'bg-')} shadow-[0_0_8px_currentColor]`}></span>
                  <span className={riskResult.color}>{riskResult.label}</span>
                </div>
              </div>
           </div>

           {/* Urgency Alert Card - ONLY SHOW WHEN AI PROCESSED */}
           {geminiResult && !isLoading && (
              <div className={`rounded-2xl p-5 border shadow-lg ${
                  riskResult.score > 65 
                    ? "bg-red-500/20 border-red-500/30 text-red-200" 
                    : riskResult.score > 35 
                      ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-200"
                      : "bg-green-500/20 border-green-500/30 text-green-200"
                }`}>
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert size={20} />
                  <h4 className="font-bold">Medical Urgency</h4>
                </div>
                <p className="text-sm font-medium leading-relaxed">{geminiResult.urgency}</p>
              </div>
           )}
        </div>
      </div>

      {isLoading && <LoadingSkeleton />}

      {geminiResult && !isLoading && (
        <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
          <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-2xl p-6">
             <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><Activity size={18}/>Diet Strategy</h4>
             <p className="text-slate-300 text-sm leading-relaxed">{geminiResult.tip1}</p>
          </div>
          <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-2xl p-6">
             <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2"><Heart size={18}/>Lifestyle Change</h4>
             <p className="text-slate-300 text-sm leading-relaxed">{geminiResult.tip2}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, name, value, min, max, step = 1, icon: Icon, onChange }) => (
  <div className="space-y-4">
    <div className="flex justify-between text-xs font-label uppercase tracking-wider">
      <span className="text-slate-400 flex items-center gap-1.5"><Icon size={14} className="text-slate-500"/>{label}</span>
      <span className="text-sky-400 font-bold">{value}</span>
    </div>
    <input 
      type="range" 
      name={name} 
      min={min} 
      max={max} 
      step={step}
      value={value} 
      onChange={onChange}
      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-400"
    />
  </div>
);
