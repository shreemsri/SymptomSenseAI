import { AlertTriangle, Activity } from "lucide-react";

export const DiseaseCard = ({ disease, confidence, severity }) => {
  let severityColor = "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  let barColor = "bg-emerald-500";
  let borderColor = "border-l-emerald-500";
  
  if (severity === "moderate") {
    severityColor = "bg-tertiary/10 text-tertiary border-tertiary/30";
    barColor = "bg-tertiary";
    borderColor = "border-l-tertiary";
  } else if (severity === "severe") {
    severityColor = "bg-red-500/10 text-red-500 border-red-500/30";
    barColor = "bg-red-500";
    borderColor = "border-l-red-500";
  }

  return (
    <div className={`glass-card hover-lift rounded-2xl border border-white/5 border-l-4 ${borderColor} p-5 relative overflow-hidden animate-fade-up`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-400">vital_signs</span>
            {disease.name}
          </h3>
          <p className="text-[10px] font-label uppercase tracking-widest text-slate-400 mt-1">Specialist: {disease.specialist}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold border ${severityColor} shadow-inner`}>
          <AlertTriangle size={12} />
          {severity}
        </span>
      </div>
      
      <div className="space-y-1.5 relative z-10">
        <div className="flex justify-between font-label text-[10px] uppercase tracking-widest">
          <span className="text-slate-400">Confidence Match</span>
          <span className="font-bold text-sky-400">{confidence}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full rounded-full ${barColor} neon-glow transition-all duration-1000 ease-out`} 
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
