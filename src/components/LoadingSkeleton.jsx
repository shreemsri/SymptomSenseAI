export const LoadingSkeleton = () => {
  return (
    <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-6 shadow-lg animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-slate-700/80" />
        <div className="flex flex-col gap-2 flex-grow">
          <div className="h-4 bg-slate-700/80 rounded max-w-xs" />
          <div className="h-3 bg-slate-700/80 rounded max-w-[150px]" />
        </div>
      </div>
      
      <div className="space-y-3 mt-6">
        <div className="h-3 bg-slate-700/80 rounded w-full" />
        <div className="h-3 bg-slate-700/80 rounded w-11/12" />
        <div className="h-3 bg-slate-700/80 rounded w-full" />
        <div className="h-3 bg-slate-700/80 rounded w-4/5" />
      </div>

      <div className="mt-6 flex gap-3">
        <div className="h-8 bg-slate-700/80 rounded-lg w-24" />
        <div className="h-8 bg-slate-700/80 rounded-lg w-24" />
      </div>
    </div>
  );
};
