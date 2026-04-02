import { useState } from "react";
import { Search, Info, AlertTriangle, UserPlus, CheckCircle, Activity, Sparkles } from "lucide-react";
import { allSymptoms } from "../data/diseases";
import { calculateDiseaseMatches } from "../utils/scoring";
import { callGeminiAPI } from "../utils/gemini";
import { DiseaseCard } from "./DiseaseCard";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const SymptomChecker = ({ onResultsChange }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  
  const [analysisResults, setAnalysisResults] = useState(null);
  const [geminiResult, setGeminiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (searchInput.trim().length === 0) return;
    
    setIsLoading(true);
    setError(null);
    setGeminiResult(null);
    setAnalysisResults(null);
    setSelectedSymptoms([]);

    // 1. Natural Language Extraction via Gemini
    const extractionPrompt = `Extract the core medical symptoms from this patient statement: "${searchInput}". 
Only use exact symptom names from this approved list: ${allSymptoms.join(", ")}.
If none match perfectly, choose the closest semantic match from the list.
Respond in exactly this JSON format and nothing else:
{
  "extractedSymptoms": ["symptom1", "symptom2"]
}`;
    
    const extractionFallback = { extractedSymptoms: [] };
    const extractedData = await callGeminiAPI(extractionPrompt, extractionFallback);
    
    const workingSymptoms = extractedData?.extractedSymptoms || [];
    setSelectedSymptoms(workingSymptoms);

    if (workingSymptoms.length === 0) {
      setError("We couldn't identify specific symptoms from your description. Please try describing them differently with common medical terms.");
      setIsLoading(false);
      return;
    }

    // 2. Local calculation of disease matches
    const matches = calculateDiseaseMatches(workingSymptoms);
    setAnalysisResults(matches);
    
    if (onResultsChange) {
      onResultsChange(matches);
    }

    // 3. Clinical Insights via Gemini
    if (matches.length > 0) {
      const topDisease = matches[0];
      
      const prompt = `A patient reports these symptoms: ${workingSymptoms.join(", ")}. The most likely condition is ${topDisease.name} with ${topDisease.confidence}% confidence. Respond in exactly this JSON format:
{
  "explanation": "2-sentence simple explanation of the condition",
  "nextSteps": ["step 1", "step 2", "step 3"],
  "redFlags": ["red flag 1", "red flag 2"],
  "specialist": "which doctor to see"
}`;

      const fallback = {
        explanation: `${topDisease.name} is a medical condition characterized by ${workingSymptoms.slice(0, 2).join(" and ")}. Please consult a medical professional for accurate diagnosis.`,
        nextSteps: ["Rest and monitor symptoms", "Stay hydrated", "Seek medical evaluation"],
        redFlags: ["High fever", "Severe pain", "Difficulty breathing"],
        specialist: topDisease.specialist
      };

      const result = await callGeminiAPI(prompt, fallback);
      setGeminiResult(result);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 pb-8">
      <div className="glass-card p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-2 bg-sky-500/20 rounded-lg">
            <Activity className="text-sky-400" size={24} />
          </div>
          <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Symptom Checker</h2>
        </div>
        
        {/* Natural Language Text Area */}
        <div className="relative group mb-6 z-10 w-full">
           <textarea
             rows="3"
             className="w-full bg-surface-container-lowest border border-white/5 focus:border-sky-500 transition-all p-5 rounded-2xl text-white placeholder:text-slate-500 focus:ring-0 font-body resize-none shadow-inner"
             placeholder="Describe your symptoms in a few sentences... (e.g., 'I have been having a severe headache since this morning and I am feeling very nauseous and dizzy.')"
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             disabled={isLoading}
           />
           <div className="absolute top-4 right-4 text-sky-500/50 group-focus-within:text-sky-400 transition-colors pointer-events-none">
             <Sparkles size={20} />
           </div>
        </div>

        {/* Extracted Symptoms Tag Display */}
        {selectedSymptoms.length > 0 && (
          <div className="mb-8 relative z-10 animate-fade-in">
            <p className="text-xs font-label text-slate-500 uppercase tracking-[0.1em] mb-3">AI Extracted Symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((sym, idx) => (
                <div key={idx} className="bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium lowercase shadow-[0_0_8px_rgba(56,189,248,0.1)]">
                  {sym}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 relative z-10 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={searchInput.trim().length === 0 || isLoading}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-[#00354a] font-headline font-black py-4 rounded-xl uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 hover-lift disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">Analyzing...</span>
          ) : (
            <span className="flex items-center gap-2"><Search size={20} /> Analyze Symptoms</span>
          )}
        </button>
      </div>

      {/* Results Section */}
      {analysisResults && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 p-3 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 text-sm font-medium">
            <span className="text-xl">⚠️</span> This tool is for informational purposes only and is not a substitute for professional medical advice.
          </div>
          
          <h3 className="text-xl font-bold border-b border-slate-800 pb-2">Top Predicted Conditions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {analysisResults.map((disease, idx) => (
              <div key={idx} className={`stagger-${(idx % 3) + 1}`}>
                <DiseaseCard disease={disease} confidence={disease.confidence} severity={disease.severity} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Generating AI Insights...</h3>
          <LoadingSkeleton />
        </div>
      )}

      {/* AI Insights Section */}
      {geminiResult && !isLoading && (
        <div className="mt-8 space-y-4 animate-fade-in">
          <h3 className="text-xl font-bold text-sky-400 flex items-center gap-2">
            <Info size={20} /> AI Clinical Insights
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {/* Explanation & Specialist */}
            <div className="space-y-4">
              <div className="bg-sky-900/20 border border-sky-800 rounded-2xl p-5 hover-lift animate-fade-up stagger-1">
                <h4 className="font-semibold text-sky-300 mb-2 flex items-center gap-2">
                  <Activity size={16} /> Overview
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">{geminiResult.explanation}</p>
              </div>
              
              <div className="bg-indigo-900/20 border border-indigo-800 rounded-2xl p-5 hover-lift animate-fade-up stagger-2">
                <h4 className="font-semibold text-indigo-300 mb-2 flex items-center gap-2">
                  <UserPlus size={16} /> Recommended Specialist
                </h4>
                <div className="text-lg font-medium text-slate-200">
                  {geminiResult.specialist}
                </div>
              </div>
            </div>

            {/* Next Steps & Red Flags */}
            <div className="space-y-4">
              <div className="bg-emerald-900/20 border border-emerald-800 rounded-2xl p-5 hover-lift animate-fade-up stagger-3">
                <h4 className="font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} /> Actionable Next Steps
                </h4>
                <ul className="space-y-2">
                  {geminiResult.nextSteps?.map((step, i) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-emerald-500 font-bold mt-0.5">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5 hover-lift animate-fade-up stagger-1">
                <h4 className="font-semibold text-red-300 mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} /> Red Flags to Watch For
                </h4>
                <ul className="space-y-2">
                  {geminiResult.redFlags?.map((flag, i) => (
                    <li key={i} className="text-red-200 text-sm flex items-start gap-2 font-medium">
                      <span className="text-red-500 font-bold mt-0.5">!</span>
                      <span>{flag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
