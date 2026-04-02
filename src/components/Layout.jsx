import { Activity, Heart, LayoutDashboard } from "lucide-react";

export const Layout = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: "checker", label: "Symptom Checker", icon: Activity },
    { id: "diabetes", label: "Diabetes Risk", icon: Heart },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 w-full h-16 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              SymptomSense AI <span className="text-xl" role="img" aria-label="hospital">🏥</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Powered by Gemini AI</p>
          </div>
          
          <nav className="hidden md:flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex overflow-x-auto p-2 gap-2 border-t border-slate-800 hide-scrollbar">
           {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive 
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/10 via-slate-900/0 to-slate-900/0 pointer-events-none" />
        <div className="relative z-10 animate-fade-in">
           {children}
        </div>
      </main>
      
      <footer className="py-6 border-t border-slate-800 text-center text-sm text-slate-500">
        <p>Built for CodeCure AI Hackathon SPIRIT'26 • IIT BHU Varanasi</p>
      </footer>
    </div>
  );
};
