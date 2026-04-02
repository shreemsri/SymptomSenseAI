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

  const [riskResult, setRiskResult] = useState({ score: 0, label: "Unknown", color: "text-[#7B7B8F]" });
  const [geminiResult, setGeminiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const result = calculateDiabetesRiskScore(vitals);
    // Map old dark colors to new light colors safely
    let lightColor = "#7B7B8F";
    if (result.color.includes("emerald")) lightColor = "#00C9A7";
    if (result.color.includes("yellow")) lightColor = "#FF9F1C";
    if (result.color.includes("red")) lightColor = "#ef4444";
    setRiskResult({ ...result, hexColor: lightColor });
  }, [vitals]);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleCheckRisk = async () => {
    setIsLoading(true);
    setGeminiResult(null);

    if (onResultsChange) onResultsChange(riskResult);

    const prompt = `A patient has these vitals: Age=${vitals.age}, BMI=${vitals.bmi}, Glucose=${vitals.glucose}mg/dL, BP=${vitals.bloodPressure}mmHg. Their diabetes risk score is ${riskResult.score}/100 (${riskResult.label}). Give a response in exactly this JSON format:
{
  "tip1": "one personalized diet tip based on vitals",
  "tip2": "one personalized lifestyle tip based on vitals",
  "urgency": "should they see a doctor now, soon, or routine checkup"
}`;

    const fallback = {
      tip1: "Focus on a balanced diet rich in whole grains, fiber, and lean proteins.",
      tip2: "Maintain moderate daily exercise, at least 30 minutes of brisk walking.",
      urgency: riskResult.score > 65 ? "Requires medical evaluation soon." : "Routine preventative checkups."
    };

    const result = await callGeminiAPI(prompt, fallback);
    setGeminiResult(result);
    setIsLoading(false);
  };

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (riskResult.score / 100) * circumference;

  return (
    <div className="space-y-8 pb-8 animate-fade-up">
      <div className="grid lg:grid-cols-5 gap-8">
        
        {/* Left Col: Inputs (60%) */}
        <div className="lg:col-span-3 premium-card p-6 md:p-10 mb-2">
          <div className="mb-8">
            <h2 className="text-3xl font-headline text-[#1A1A2E] tracking-tight">Vitals & Assessment</h2>
            <p className="text-[#7B7B8F] text-sm mt-2">Adjust your clinical biomarkers to calculate risk.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            <InputGroup label="Age (years)" name="age" value={vitals.age} min={1} max={100} icon={Activity} onChange={handleSliderChange} />
            <InputGroup label="BMI (kg/m²)" name="bmi" value={vitals.bmi} min={10} max={50} icon={Activity} onChange={handleSliderChange} />
            <InputGroup label="Glucose (mg/dL)" name="glucose" value={vitals.glucose} min={50} max={300} icon={Droplets} onChange={handleSliderChange} />
            <InputGroup label="Blood Pressure" name="bloodPressure" value={vitals.bloodPressure} min={40} max={140} icon={Heart} onChange={handleSliderChange} />
            <InputGroup label="Insulin (µU/ml)" name="insulin" value={vitals.insulin} min={0} max={900} icon={Thermometer} onChange={handleSliderChange} />
            <InputGroup label="Skin Thickness" name="skinThickness" value={vitals.skinThickness} min={0} max={100} icon={Activity} onChange={handleSliderChange} />
            <InputGroup label="Pedigree Func" name="pedigree" value={vitals.pedigree} min={0} max={2.5} step={0.1} icon={Activity} onChange={handleSliderChange} />
            <InputGroup label="Pregnancies" name="pregnancies" value={vitals.pregnancies} min={0} max={15} icon={Activity} onChange={handleSliderChange} />
          </div>

          <button
            onClick={handleCheckRisk}
            disabled={isLoading}
            className="mt-12 w-full bg-[#1A1A2E] hover:bg-[#2A2A3E] text-white font-body font-bold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all hover-scale shadow-xl shadow-[#1A1A2E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Generating AI Plan..." : "Generate AI Risk Plan"}
          </button>
        </div>

        {/* Right Col: Gauge & Score (40%) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="premium-card flex-1 min-h-[400px] p-8 flex flex-col justify-center items-center relative overflow-hidden bg-white">
              <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                  <circle cx="128" cy="128" fill="transparent" r={radius} stroke="#E5E4E0" strokeWidth="12"></circle>
                  <circle 
                    cx="128" cy="128" 
                    fill="transparent" 
                    r={radius} 
                    stroke={riskResult.hexColor || "#00C9A7"} 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    strokeWidth="12" 
                    style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
                    strokeLinecap="round"
                  ></circle>
                </svg>
                <div className="absolute flex flex-col items-center mt-2">
                  <span className="text-6xl font-headline font-bold text-[#1A1A2E]">{riskResult.score}</span>
                  <span className="text-xs font-label text-[#7B7B8F] uppercase tracking-[0.2em] font-medium mt-1 pr-1">SCORE / 100</span>
                </div>
              </div>
             
              <div className="text-center w-full flex justify-center mb-10">
                <div 
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm border shadow-sm"
                  style={{ backgroundColor: `${riskResult.hexColor}15`, color: riskResult.hexColor, borderColor: `${riskResult.hexColor}30` }}
                >
                  {riskResult.label} Risk
                </div>
              </div>

              {/* Mini Breakdown */}
              <div className="w-full space-y-4 px-2">
                 <MiniBar label="Glucose Risk" value={((vitals.glucose - 50) / 250) * 100} color="#FF9F1C" />
                 <MiniBar label="BMI Risk" value={((vitals.bmi - 10) / 40) * 100} color="#00C9A7" />
                 <MiniBar label="Age Risk" value={(vitals.age / 100) * 100} color="#1A1A2E" />
              </div>
           </div>

           {/* Urgency Alert Card */}
           {geminiResult && !isLoading && (
              <div className="rounded-2xl p-6 border shadow-sm animate-fade-up"
                   style={{ backgroundColor: `${riskResult.hexColor}10`, borderColor: `${riskResult.hexColor}20` }}>
                <div className="flex items-center gap-3 mb-2" style={{ color: riskResult.hexColor }}>
                  <ShieldAlert size={22} />
                  <h4 className="font-bold font-headline text-lg">Medical Urgency</h4>
                </div>
                <p className="text-[#1A1A2E] text-sm leading-relaxed">{geminiResult.urgency}</p>
              </div>
           )}
        </div>
      </div>

      {isLoading && <LoadingSkeleton />}

      {geminiResult && !isLoading && (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-up">
          <div className="premium-card p-8 border-l-4 border-[#00C9A7]">
             <h4 className="text-[#1A1A2E] font-bold text-lg mb-4 flex items-center gap-2"><Activity size={20} className="text-[#00C9A7]"/> Diet Strategy</h4>
             <p className="text-[#7B7B8F] leading-relaxed">{geminiResult.tip1}</p>
          </div>
          <div className="premium-card p-8 border-l-4 border-[#00B4D8]">
             <h4 className="text-[#1A1A2E] font-bold text-lg mb-4 flex items-center gap-2"><Heart size={20} className="text-[#00B4D8]"/> Lifestyle Change</h4>
             <p className="text-[#7B7B8F] leading-relaxed">{geminiResult.tip2}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, name, value, min, max, step = 1, icon: Icon, onChange }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-4 relative z-10">
      <div className="flex justify-between font-label text-xs uppercase tracking-widest font-bold">
        <span className="text-[#7B7B8F] flex items-center gap-1.5"><Icon size={14} className="text-[#00C9A7]"/>{label}</span>
      </div>
      <div className="flex items-center justify-between">
         <span className="text-2xl font-headline font-bold text-[#1A1A2E]">{value}</span>
      </div>
      <div className="relative w-full h-1.5 bg-[#E5E4E0] rounded-full">
         {/* Custom track styling inline for the gradient up to thumb */}
         <div 
           className="absolute top-0 left-0 h-full bg-[#00C9A7] rounded-full"
           style={{ width: `${percentage}%` }}
         />
         <input 
           type="range" 
           name={name} 
           min={min} 
           max={max} 
           step={step}
           value={value} 
           onChange={onChange}
           className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
         />
         {/* Custom visual thumb */}
         <div 
           className="absolute top-1/2 -mt-3 w-6 h-6 bg-white border-2 border-[#00C9A7] rounded-full shadow-md pointer-events-none transition-transform"
           style={{ left: `calc(${percentage}% - 12px)` }}
         />
      </div>
    </div>
  );
}

const MiniBar = ({ label, value, color }) => (
  <div className="flex items-center justify-between text-xs font-label">
    <span className="text-[#7B7B8F] font-bold w-24 truncate">{label}</span>
    <div className="flex-1 mx-3 h-1.5 bg-[#E5E4E0] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);
