import { AlertTriangle, Activity } from "lucide-react";

export const DiseaseCard = ({ disease, confidence, severity }) => {
  let severityBadge = "bg-[#00C9A7]/10 text-[#00C9A7] border-[#00C9A7]/30";
  let barColor = "bg-[#00C9A7]";
  
  if (severity === "moderate") {
    severityBadge = "bg-[#FF9F1C]/10 text-[#FF9F1C] border-[#FF9F1C]/30";
    barColor = "bg-[#FF9F1C]";
  } else if (severity === "severe") {
    severityBadge = "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30";
    barColor = "bg-[#ef4444]";
  }

  return (
    <div className={`premium-card premium-card-hover p-6 relative overflow-hidden animate-fade-up`}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-lg font-headline text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00C9A7]">vital_signs</span>
            {disease.name}
          </h3>
          <p className="text-xs font-label text-on-surface/50 mt-1">Specialist: {disease.specialist}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] uppercase font-bold border ${severityBadge}`}>
          <AlertTriangle size={12} strokeWidth={2.5} />
          {severity}
        </span>
      </div>
      
      <div className="space-y-2 relative z-10">
        <div className="flex justify-between font-label text-xs">
          <span className="text-on-surface/50">Confidence Match</span>
          <span className="font-bold text-on-surface">{confidence}%</span>
        </div>
        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`} 
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
