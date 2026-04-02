import { AlertTriangle, Activity } from "lucide-react";

export const DiseaseCard = ({ disease, confidence, severity }) => {
  let severityColor = "bg-green-500/20 text-green-300 border-green-500/30";
  let barColor = "bg-green-500";
  
  if (severity === "moderate") {
    severityColor = "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    barColor = "bg-yellow-500";
  } else if (severity === "severe") {
    severityColor = "bg-red-500/20 text-red-300 border-red-500/30";
    barColor = "bg-red-500";
  }

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 relative overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-sky-500/10 hover:border-slate-600">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity size={18} className="text-sky-400" />
            {disease.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1">Specialist: {disease.specialist}</p>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${severityColor}`}>
          <AlertTriangle size={12} />
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-slate-300">Confidence Match</span>
          <span className="font-bold text-white">{confidence}%</span>
        </div>
        <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`} 
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
};
