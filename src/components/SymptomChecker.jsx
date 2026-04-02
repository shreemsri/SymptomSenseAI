import { useState, useRef, useEffect } from "react";
import { Search, Info, AlertTriangle, UserPlus, CheckCircle } from "lucide-react";
import { allSymptoms } from "../data/diseases";
import { calculateDiseaseMatches } from "../utils/scoring";
import { callGeminiAPI } from "../utils/gemini";
import { SymptomTag } from "./SymptomTag";
import { DiseaseCard } from "./DiseaseCard";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const SymptomChecker = ({ onResultsChange }) => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [analysisResults, setAnalysisResults] = useState(null);
  const [geminiResult, setGeminiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const wrapperRef = useRef(null);

  const filteredSymptoms = allSymptoms.filter(
    sym => sym.toLowerCase().includes(searchInput.toLowerCase()) && !selectedSymptoms.includes(sym)
  ).slice(0, 8); // show max 8

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const addSymptom = (sym) => {
    if (!selectedSymptoms.includes(sym)) {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
    setSearchInput("");
    setShowDropdown(false);
  };

  const removeSymptom = (symToRemove) => {
    setSelectedSymptoms(selectedSymptoms.filter(sym => sym !== symToRemove));
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    setGeminiResult(null);

    // 1. Local calculation
    const matches = calculateDiseaseMatches(selectedSymptoms);
    setAnalysisResults(matches);
    
    if (onResultsChange) {
      onResultsChange(matches);
    }

    if (matches.length > 0) {
      const topDisease = matches[0];
      
      const prompt = `A patient reports these symptoms: ${selectedSymptoms.join(", ")}. The most likely condition is ${topDisease.name} with ${topDisease.confidence}% confidence. Respond in exactly this JSON format:
{
  "explanation": "2-sentence simple explanation of the condition",
  "nextSteps": ["step 1", "step 2", "step 3"],
  "redFlags": ["red flag 1", "red flag 2"],
  "specialist": "which doctor to see"
}`;

      const fallback = {
        explanation: `${topDisease.name} is a medical condition characterized by ${selectedSymptoms.slice(0, 2).join(" and ")}. Please consult a medical professional for accurate diagnosis.`,
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
      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-2">How are you feeling?</h2>
        <p className="text-slate-400 mb-6 font-medium">Add all the symptoms you are currently experiencing.</p>
        
        {/* Search Input Box */}
        <div className="relative mb-4" ref={wrapperRef}>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-slate-500" size={20} />
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
              placeholder="e.g. fever, headache, fatigue..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
          </div>
          
          {/* Autocomplete Dropdown */}
          {showDropdown && searchInput.length > 0 && filteredSymptoms.length > 0 && (
            <div className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl shadow-black/50 max-h-60 overflow-auto">
              {filteredSymptoms.map((sym, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-4 py-3 hover:bg-slate-700/60 text-slate-200 transition-colors capitalize first:rounded-t-xl last:rounded-b-xl border-b border-slate-700/50 last:border-0"
                  onClick={() => addSymptom(sym)}
                >
                  {sym}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Symptoms */}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSymptoms.map((sym, idx) => (
              <SymptomTag key={idx} text={sym} onRemove={() => removeSymptom(sym)} />
            ))}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={selectedSymptoms.length === 0 || isLoading}
          className="w-full md:w-auto px-8 py-3 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 font-bold rounded-xl transition-colors shadow-lg shadow-sky-500/20"
        >
          {isLoading ? "Analyzing..." : "Analyze Symptoms"}
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
              <DiseaseCard key={idx} disease={disease} confidence={disease.confidence} severity={disease.severity} />
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
              <div className="bg-sky-900/20 border border-sky-800 rounded-2xl p-5">
                <h4 className="font-semibold text-sky-300 mb-2 flex items-center gap-2">
                  <Activity size={16} /> Overview
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">{geminiResult.explanation}</p>
              </div>
              
              <div className="bg-indigo-900/20 border border-indigo-800 rounded-2xl p-5">
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
              <div className="bg-emerald-900/20 border border-emerald-800 rounded-2xl p-5">
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

              <div className="bg-red-900/20 border border-red-800 rounded-2xl p-5">
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
