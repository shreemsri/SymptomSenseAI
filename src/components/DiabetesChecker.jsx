import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
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

  // Recharts data format
  const chartData = [{ name: "Risk", value: riskResult.score, fill: riskResult.color.replace("text-", "").replace("-500", "") }];
  const getFillHex = () => {
    if (riskResult.score >= 66) return "#ef4444"; // red-500
    if (riskResult.score >= 36) return "#eab308"; // yellow-500
    return "#22c55e"; // green-500
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Col: Inputs */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-2">Vitals & Measurements</h2>
          <p className="text-slate-400 mb-8 font-medium">Enter your latest readings for an accurate risk assessment.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
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
            className="mt-8 w-full md:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            {isLoading ? "Generating AI Plan..." : "Generate AI Risk Plan"}
          </button>
        </div>

        {/* Right Col: Gauge & Score */}
        <div className="flex flex-col gap-4">
           {/* Gauge Card */}
           <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden h-[300px]">
             <h3 className="text-lg font-semibold text-slate-300 absolute top-6">Calculated Risk Score</h3>
             
             <div className="w-[200px] h-[200px] mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" cy="50%" 
                    innerRadius="80%" outerRadius="100%" 
                    barSize={15} 
                    data={[{ value: riskResult.score }]}
                    startAngle={220} endAngle={-40}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background={{ fill: '#334155' }}
                      dataKey="value"
                      cornerRadius={30}
                      fill={getFillHex()}
                      isAnimationActive={true}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                
                {/* Center text inside the gauge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
                  <span className={`text-5xl font-black ${riskResult.color}`}>{riskResult.score}</span>
                  <span className="text-slate-400 text-sm font-medium mt-1">/ 100</span>
                </div>
             </div>
             
             <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold bg-slate-900 ${riskResult.color} border border-slate-700`}>
                {riskResult.label}
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
  <div className="space-y-2">
    <div className="flex justify-between items-center text-sm font-medium">
      <label className="text-slate-300 flex items-center gap-1.5"><Icon size={14} className="text-slate-500"/>{label}</label>
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
      className="w-full accent-emerald-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);
