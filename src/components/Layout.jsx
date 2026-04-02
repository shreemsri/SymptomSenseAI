import { Brain, Activity, UserCircle, LogOut, Sun, Moon } from "lucide-react";

export const Layout = ({ children, activeTab, setActiveTab, onNavigate, isDark, toggleTheme }) => {
  const navItems = [
    { id: "checker", label: "Diagnostics", icon: Brain },
    { id: "diabetes", label: "Risk Analysis", icon: Activity },
    { id: "dashboard", label: "Patient History", icon: UserCircle },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/20 selection:text-on-surface overflow-x-hidden min-h-screen transition-colors duration-300">
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-4 bg-surface/70 backdrop-blur-xl border-b border-surface-container-highest z-50 transition-all">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-headline font-bold text-on-surface">SymptomSense</span>
        </div>
        
        {/* Desktop Nav - Centered Pills */}
        <div className="hidden md:flex items-center gap-2 bg-surface-container-low p-1.5 rounded-full border border-surface-container-highest">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-label text-xs tracking-wider uppercase font-bold px-6 py-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-surface text-on-surface shadow-sm border border-surface-container-highest" : "text-on-surface/50 hover:text-on-surface"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => onNavigate('landing')} className="hidden sm:flex p-2 rounded-full text-on-surface/50 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={20} />
          </button>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label font-bold text-sm shadow-md hover:bg-primary/90 transition-colors">
            Download Report
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full flex justify-around p-3 border-t border-surface-container-highest bg-surface/90 backdrop-blur-xl z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                isActive ? "text-[#00C9A7]" : "text-[#7B7B8F] hover:text-[#1A1A2E]"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              {item.label}
            </button>
          );
        })}
      </div>

      <main className="pt-28 px-4 md:px-8 pb-24 md:pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
           {children}
        </div>
      </main>
      
      <footer className="px-8 py-12 border-t border-[#E5E4E0] bg-[#F9F9F8]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#1A1A2E] font-headline text-lg mb-1">SymptomSense</p>
            <p className="text-[#7B7B8F] text-xs">For clinical demonstration only. Not professional medical advice.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-[#7B7B8F] hover:text-[#1A1A2E] text-xs font-bold transition-colors" href="#">Privacy</a>
            <a className="text-[#7B7B8F] hover:text-[#1A1A2E] text-xs font-bold transition-colors" href="#">Terms</a>
            <a className="text-[#7B7B8F] hover:text-[#1A1A2E] text-xs font-bold transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
