import { ArrowRight, Activity, ShieldCheck, Heart, Moon, Sun } from "lucide-react";

export const LandingPage = ({ onNavigate, isDark, toggleTheme }) => {
  return (
    <div className="bg-background text-on-surface min-h-screen font-body overflow-hidden transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-4 bg-surface/80 backdrop-blur-xl border-b border-surface-container-highest z-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-headline font-bold text-on-surface tracking-tight">SymptomSense</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="hidden md:block font-bold text-sm hover:text-primary transition-colors uppercase tracking-wider"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate('login')}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label font-bold text-sm shadow-md hover:bg-primary-container hover-scale transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-40 px-6 max-w-6xl mx-auto flex flex-col items-center text-center animate-fade-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low border border-surface-container-highest text-xs font-bold uppercase tracking-widest text-primary mb-8 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Next-Gen AI Diagnostics Active
        </div>

        <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight mb-6 max-w-4xl text-on-surface">
          Understand your body.<br/>
          <span className="text-primary">Predict your future.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-on-surface/70 max-w-2xl mb-12 leading-relaxed">
          SymptomSense AI is a privacy-first, fully-local clinical triage engine. Analyze your vitals and symptoms using advanced heuristic models directly inside your browser. No strings attached.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => onNavigate('login')}
            className="px-8 py-4 bg-primary text-on-primary rounded-2xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover-scale shadow-lg shadow-primary/20"
          >
            Launch Web App <ArrowRight size={18} />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-24 text-left border-t border-surface-container-highest pt-16 w-full">
           <div className="premium-card p-8 stagger-1 animate-fade-up border-t-4 border-t-primary">
              <Activity className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Smart NLP Extraction</h3>
              <p className="text-sm text-on-surface/70 leading-relaxed">Describe symptoms naturally in plain English. Our offline engine securely extracts markers without ever pinging a cloud database.</p>
           </div>
           <div className="premium-card p-8 stagger-2 animate-fade-up border-t-4 border-t-tertiary">
              <Heart className="text-tertiary mb-4" size={32} />
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Diabetes Risk Analytics</h3>
              <p className="text-sm text-on-surface/70 leading-relaxed">Input 8 critical clinical biomarkers to generate a verified 0-100 risk score and visually map your vulnerability.</p>
           </div>
           <div className="premium-card p-8 stagger-3 animate-fade-up border-t-4 border-t-primary-container">
              <ShieldCheck className="text-primary-container mb-4" size={32} />
              <h3 className="text-xl font-headline font-bold text-on-surface mb-2">AI Synthesis Radar</h3>
              <p className="text-sm text-on-surface/70 leading-relaxed">Composite dashboards synthesize your exact metrics into a graphical radar chart with unified AI doctor narratives.</p>
           </div>
        </div>
      </main>

    </div>
  );
};
