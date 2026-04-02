import { useState, useEffect } from "react";
import { Download, AlertCircle, CheckCircle, ArrowRight, BrainCircuit } from "lucide-react";
import { callGeminiAPI } from "../utils/gemini";
import { LoadingSkeleton } from "./LoadingSkeleton";

// Chart.js imports
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const Dashboard = ({ symptomResults, diabetesResults, onNavigate }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const hasData = symptomResults && symptomResults.length > 0 && diabetesResults;

  useEffect(() => {
    if (hasData && !recommendation && !isLoading) {
      generateCompositeRecommendation();
    }
  }, [hasData]);

  const generateCompositeRecommendation = async () => {
    setIsLoading(true);
    const topDisease = symptomResults[0];
    
    const prompt = `A user has done two health checks. 
1) Symptom prediction: Most likely condition is ${topDisease.name} with ${topDisease.confidence}% confidence. 
2) Diabetes Risk Score is ${diabetesResults.score}/100 (${diabetesResults.label}). 
Provide a composite health recommendation based on both results combined. Respond in exactly this JSON format:
{
  "summary": "1-2 sentence overall summary",
  "priority": "what they should focus on first",
  "nextStep": "the single most important actionable step"
}`;

    const fallback = {
      summary: "Your health results show elevated risk factors requiring attention.",
      priority: "Address the acute symptoms while managing your lifestyle risk factors.",
      nextStep: "Schedule an appointment with a primary care physician to review these findings."
    };

    const result = await callGeminiAPI(prompt, fallback);
    setRecommendation(result);
    setIsLoading(false);
  };

  const handleDownload = () => {
    const topDisease = symptomResults?.[0];
    let content = `=============================\nSYMPTOMSENSE HEALTH REPORT\n=============================\n\n`;
    
    if (topDisease) {
      content += `[ SYMPTOMS ]\nMatch: ${topDisease.name} (${topDisease.confidence}%)\nSeverity: ${topDisease.severity.toUpperCase()}\n\n`;
    }
    if (diabetesResults) {
      content += `[ RISK ANALYSIS ]\nScore: ${diabetesResults.score}/100 (${diabetesResults.label})\n\n`;
    }
    if (recommendation) {
      content += `[ AI RECOMMENDATION ]\nSummary: ${recommendation.summary}\nPriority: ${recommendation.priority}\nStep: ${recommendation.nextStep}\n\n`;
    }
    content += `For clinical demonstration only. Not medical advice.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "health_report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-up">
        {/* Soft Illustration Placeholder */}
        <div className="relative w-32 h-32 mb-4">
           <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
             <circle cx="50" cy="50" r="48" fill="#F9F9F8" stroke="#E5E4E0" strokeWidth="2"/>
             <path d="M30 50 Q50 20 70 50 T70 80 Q50 90 30 80 Z" fill="#00C9A7" opacity="0.1"/>
             <path d="M50 35 V65 M35 50 H65" stroke="#00C9A7" strokeWidth="4" strokeLinecap="round" opacity="0.8"/>
           </svg>
           <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-sm border border-[#E5E4E0]">
             <BrainCircuit size={20} className="text-[#FF9F1C]" />
           </div>
        </div>
        
        <h2 className="text-4xl font-headline font-bold text-[#1A1A2E]">Your Health Story Starts Here</h2>
        <p className="text-[#7B7B8F] max-w-md text-lg">
          Complete the Symptom Checker and Diabetes Risk assessments to unlock your full AI health report.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md">
          <button 
            onClick={() => onNavigate('checker')}
            className="flex-1 px-6 py-4 bg-[#00C9A7] text-white rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover-scale shadow-md shadow-[#00C9A7]/20"
          >
            Check Symptoms <ArrowRight size={16} />
          </button>
          <button 
            onClick={() => onNavigate('diabetes')}
            className="flex-1 px-6 py-4 bg-white border-2 border-[#E5E4E0] text-[#1A1A2E] rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover-scale shadow-sm"
          >
            Analyze Risk <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Composite Calculations
  const symptomRiskPenalty = symptomResults[0].confidence * (symptomResults[0].severity === 'severe' ? 0.8 : 0.4);
  const diabetesRiskPenalty = diabetesResults.score * 0.5;
  const healthScore = Math.max(0, Math.round(100 - ((symptomRiskPenalty + diabetesRiskPenalty) / 2)));
  
  let scoreColor = "#00C9A7";
  if (healthScore < 50) scoreColor = "#ef4444";
  else if (healthScore < 75) scoreColor = "#FF9F1C";

  // Radar Chart Data (Biomarker Health)
  const radarData = {
    labels: ['Immunity', 'Metabolic', 'Cardiovascular', 'Stability', 'Vitality'],
    datasets: [
      {
        label: 'Current Biomarkers',
        data: [
          Math.max(20, 100 - symptomRiskPenalty), 
          Math.max(10, 100 - diabetesResults.score), 
          Math.max(20, 100 - (diabetesResults.score * 0.8)), 
          healthScore, 
          85 // Base vitality
        ],
        backgroundColor: 'rgba(0, 201, 167, 0.2)',
        borderColor: '#00C9A7',
        borderWidth: 2,
        pointBackgroundColor: '#00C9A7',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00C9A7'
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(26, 26, 46, 0.1)' },
        grid: { color: 'rgba(26, 26, 46, 0.05)' },
        pointLabels: {
          font: { family: "'DM Sans', sans-serif", size: 11, weight: 'bold' },
          color: '#7B7B8F'
        },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-headline font-bold text-[#1A1A2E] tracking-tight">Patient Dashboard</h2>
          <p className="text-[#7B7B8F] text-sm mt-1">AI synthesized health and biomarker tracking.</p>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isLoading}
          className="flex items-center gap-2 font-label text-sm px-6 py-3 bg-white border border-[#E5E4E0] text-[#1A1A2E] font-bold rounded-xl hover-scale shadow-sm disabled:opacity-50"
        >
          <Download size={18} className="text-[#00C9A7]" /> Export Summary
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Core Summary Cards Stack */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Health Score Main Card */}
          <div className="premium-card p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-[#7B7B8F] font-label text-xs uppercase tracking-[0.2em] mb-4 font-bold">Overall Wellness</h3>
            <div className={`text-7xl font-headline font-bold mb-2`} style={{ color: scoreColor }}>{healthScore}</div>
            <p className="text-xs text-[#7B7B8F] font-medium">Out of 100 points</p>
          </div>

          <div className="premium-card p-6 border-l-4 border-l-[#00B4D8]">
             <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] text-[#7B7B8F] font-bold tracking-widest uppercase">SYMPTOM CHECK</span>
             </div>
             <h4 className="text-[#1A1A2E] font-headline text-xl font-bold truncate">
               {symptomResults[0].name}
             </h4>
             <div className="mt-1 text-[#00B4D8] text-xs font-bold uppercase tracking-wider">
               {symptomResults[0].confidence}% Match System
             </div>
          </div>

          <div className="premium-card p-6 border-l-4" style={{ borderLeftColor: diabetesResults.hexColor || '#FF9F1C' }}>
             <div className="flex justify-between items-start mb-2">
               <span className="text-[10px] text-[#7B7B8F] font-bold tracking-widest uppercase">RISK SCORE</span>
             </div>
             <h4 className="text-[#1A1A2E] font-headline text-xl font-bold">
               {diabetesResults.score}/100
             </h4>
             <div className={`mt-1 text-xs font-bold uppercase tracking-wider`} style={{ color: diabetesResults.hexColor || '#FF9F1C' }}>
               {diabetesResults.label} Factor
             </div>
          </div>
        </div>

        {/* Radar Chart Panel */}
        <div className="lg:col-span-2 premium-card p-8 flex flex-col min-h-[400px]">
           <h3 className="text-[#1A1A2E] font-headline text-xl font-bold mb-6">Biomarker Health</h3>
           <div className="flex-1 w-full bg-[#F9F9F8] rounded-2xl border border-[#E5E4E0] p-4 flex items-center justify-center">
             <div className="w-full h-full max-h-[350px]">
               <Radar data={radarData} options={radarOptions} />
             </div>
           </div>
        </div>
      </div>

      {isLoading && <LoadingSkeleton />}

      {recommendation && !isLoading && (
        <div className="premium-card mt-8 p-8 md:p-10 border-t-8 border-t-[#00C9A7]">
          <h3 className="text-3xl font-headline font-bold text-[#1A1A2E] mb-8 flex items-center gap-3">
             <BrainCircuit size={32} className="text-[#00C9A7]" />
             AI Synthesis Report
          </h3>

          <div className="space-y-8">
            <div className="bg-[#F9F9F8] p-6 rounded-2xl border border-[#E5E4E0]">
              <h4 className="text-[#7B7B8F] font-label font-bold mb-3 uppercase text-xs tracking-[0.2em] flex items-center gap-2">
                Executive Narrative
              </h4>
              <p className="text-[#1A1A2E] leading-relaxed text-lg font-headline">
                {recommendation.summary}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="p-6 rounded-2xl border border-[#E5E4E0]">
                  <h4 className="text-[#FF9F1C] font-label font-bold mb-2 uppercase text-xs tracking-[0.2em]">Urgent Priority</h4>
                  <div className="text-[#1A1A2E] text-sm leading-relaxed mt-2">
                    {recommendation.priority}
                  </div>
               </div>
               <div className="bg-[#00C9A7]/10 p-6 rounded-2xl border border-[#00C9A7]/20">
                  <h4 className="text-[#00C9A7] font-label font-bold mb-2 uppercase text-xs tracking-[0.2em]">Key Next Step</h4>
                  <div className="text-[#1A1A2E] text-sm leading-relaxed mt-2 font-bold flex items-start gap-2">
                    <CheckCircle className="text-[#00C9A7] shrink-0" size={18} />
                    {recommendation.nextStep}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
