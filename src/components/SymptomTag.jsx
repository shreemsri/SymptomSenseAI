import { X } from "lucide-react";

export const SymptomTag = ({ text, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-sky-500/20 text-sky-200 border border-sky-500/30 transition-colors">
      {text}
      <button
        type="button"
        onClick={onRemove}
        className="text-sky-300 hover:text-white focus:outline-none transition-colors"
      >
        <span className="sr-only">Remove {text}</span>
        <X size={14} />
      </button>
    </span>
  );
};
