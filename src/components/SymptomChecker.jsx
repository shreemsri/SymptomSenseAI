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

    const extractionPrompt = `Extract the core medical symptoms from this patient statement: "${searchInput}". 
Only use exact symptom names from this approved list: ${allSymptoms.join(", ")}.
If none match perfectly, choose the closest semantic match from the list.
Respond in exactly this JSON format and nothing else:
{
  "extractedSymptoms": ["symptom1", "symptom2"]
}`;
    
    const extractionFallback = { extractedSymptoms: [] };
    const extractedData = await callGeminiAPI(extractionPrompt, extractionFallback);
    
    let workingSymptoms = extractedData?.extractedSymptoms || [];
    
    // OFFLINE FALLBACK: If Gemini is rate-limited (limit:0), use deterministic string matching
    if (extractedData?.error === "RATE_LIMIT" || workingSymptoms.length === 0) {
      console.warn("API Rate Limit hit or no symptoms extracted. Falling back to offline dictionary match.");
      workingSymptoms = allSymptoms.filter(sym => 
        searchInput.toLowerCase().includes(sym.toLowerCase())
      );
      
      if (workingSymptoms.length === 0) {
         setError("Google Space/Region API limit hit. Please type exact symptom keywords like 'fever' or 'headache' for the offline engine to match.");
         setIsLoading(false);
         return;
      }
      
      // Wipe the error if offline match succeeded
      setError(null);
    }

    setSelectedSymptoms(workingSymptoms);



    const matches = calculateDiseaseMatches(workingSymptoms);
    setAnalysisResults(matches);
    
    if (onResultsChange) onResultsChange(matches);

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
    <div className="flex flex-col items-center pb-8 animate-fade-up">
      {/* Centered Main Checker Card */}
      <div className="w-full max-w-3xl glass-panel premium-card p-8 md:p-10 mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white border border-[#E5E4E0] rounded-2xl shadow-sm text-[#00C9A7]">
            <Activity size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-headline text-[#1A1A2E] tracking-tight">Symptom Checker</h2>
        </div>
        
        <div className="relative group mb-8">
           <textarea
             rows="4"
             className="w-full bg-[#F9F9F8] border border-[#E5E4E0] focus:border-[#00C9A7] transition-all p-6 rounded-2xl text-[#1A1A2E] placeholder:text-[#7B7B8F] focus:ring-4 focus:ring-[#00C9A7]/10 font-body text-lg resize-none shadow-sm"
             placeholder="Describe your symptoms naturally... (e.g., 'I have a sharp pain in my lower back, and a slight fever.')"
             value={searchInput}
             onChange={(e) => setSearchInput(e.target.value)}
             disabled={isLoading}
           />
           <div className="absolute top-6 right-6 text-[#00C9A7] transition-all group-focus-within:scale-110 pointer-events-none">
             <Sparkles size={24} />
           </div>
        </div>

        {selectedSymptoms.length > 0 && (
          <div className="mb-8 animate-fade-up">
            <p className="text-xs font-label text-[#7B7B8F] uppercase tracking-[0.1em] mb-3">Extracted Bio-Markers</p>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((sym, idx) => (
                <div key={idx} className="bg-white border border-[#00C9A7]/30 text-[#00C9A7] px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                  {sym}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-[#ef4444]/5 border border-[#ef4444]/20 text-[#ef4444] rounded-xl flex items-start gap-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={searchInput.trim().length === 0 || isLoading}
          className="w-full bg-gradient-to-r from-[#00C9A7] to-[#00B4D8] text-white font-body font-bold py-5 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all hover-scale shadow-lg shadow-[#00C9A7]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">Analyzing Data...</span>
          ) : (
            <span className="flex items-center gap-2"><Search size={22} /> Analyze Symptoms</span>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="w-full max-w-3xl mb-12">
          <h3 className="text-xl font-headline text-[#1A1A2E] mb-6">Running Diagnostic Matrix...</h3>
          <LoadingSkeleton />
        </div>
      )}

      {/* Conditions Grid */}
      {analysisResults && !isLoading && (
        <div className="w-full space-y-6 mb-12 animate-fade-up">
          <div className="flex items-center gap-2 p-3 bg-[#FF9F1C]/10 border border-[#FF9F1C]/30 text-[#FF9F1C] rounded-xl text-sm font-medium">
            <AlertTriangle size={18} /> For informational purposes only. Not professional medical advice.
          </div>
          
          <h3 className="text-2xl font-headline text-[#1A1A2E] mb-4">Possible Conditions</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {analysisResults.map((disease, idx) => (
              <div key={idx} className={`stagger-${(idx % 3) + 1}`}>
                <DiseaseCard disease={disease} confidence={disease.confidence} severity={disease.severity} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clinical AI Insights */}
      {geminiResult && !isLoading && (
        <div className="w-full space-y-6 animate-fade-up">
          <h3 className="text-2xl font-headline text-[#1A1A2E] flex items-center gap-3">
            <Info size={28} className="text-[#00B4D8]" /> Clinical AI Breakdown
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="premium-card p-6 stagger-1">
                <h4 className="font-bold text-[#1A1A2E] mb-3 flex items-center gap-2">
                  <Activity size={18} className="text-[#00B4D8]" /> Overview
                </h4>
                <p className="text-[#7B7B8F] leading-relaxed text-sm">{geminiResult.explanation}</p>
              </div>
              
              <div className="premium-card p-6 stagger-2 bg-[#F9F9F8]">
                <h4 className="font-bold text-[#1A1A2E] mb-2 flex items-center gap-2">
                  <UserPlus size={18} className="text-[#00B4D8]" /> Recommended Specialist
                </h4>
                <div className="text-lg font-headline text-[#00C9A7]">
                  {geminiResult.specialist}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="premium-card p-6 border-t-4 border-[#00C9A7] stagger-3">
                <h4 className="font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-[#00C9A7]" /> Actionable Steps
                </h4>
                <ul className="space-y-3">
                  {geminiResult.nextSteps?.map((step, i) => (
                    <li key={i} className="text-[#7B7B8F] text-sm flex items-start gap-3">
                      <span className="text-[#00C9A7] font-bold">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-6 border-t-4 border-[#ef4444] stagger-1">
                <h4 className="font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-[#ef4444]" /> Red Flags to Watch
                </h4>
                <ul className="space-y-3">
                  {geminiResult.redFlags?.map((flag, i) => (
                    <li key={i} className="text-[#7B7B8F] text-sm flex items-start gap-3">
                      <span className="text-[#ef4444] font-bold">!</span>
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
