import { Activity, Heart, LayoutDashboard } from "lucide-react";

export const Layout = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: "checker", label: "Diagnostics", icon: Activity },
    { id: "diabetes", label: "Risk Analysis", icon: Heart },
    { id: "dashboard", label: "Patient History", icon: LayoutDashboard },
  ];

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden min-h-screen">
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 py-4 bg-[#0b1326]/60 backdrop-blur-xl border-b border-sky-400/10 z-50">
        <div className="flex items-center gap-3">
          <span className="text-xl font-headline font-black tracking-tighter text-white">SymptomSense AI 🏥</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-headline text-sm tracking-wider uppercase font-bold transition-colors duration-300 ${
                  isActive ? "text-sky-400 border-b-2 border-sky-400" : "text-slate-400 hover:text-sky-300"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <button className="bg-gradient-to-r from-primary to-primary-container text-[#00354a] px-6 py-2 rounded-full font-headline font-bold text-sm tracking-wide shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all active:scale-95">
          Download Report
        </button>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full flex overflow-x-auto p-2 gap-2 border-t border-white/5 bg-[#131b2e]/80 backdrop-blur-xl z-50 hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive 
                  ? "text-sky-400" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </div>

      <main className="pt-24 px-6 pb-20 md:pb-12 min-h-screen radial-gradient-overlay">
        <div class="max-w-7xl mx-auto w-full">
           {children}
        </div>
      </main>
      
      <footer className="px-6 py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-slate-500 text-[10px] font-label uppercase tracking-widest">© 2026 SymptomSense AI. For clinical reference only.</p>
            <p className="text-slate-600 text-[10px] mt-1">Not a substitute for professional medical advice, diagnosis, or treatment.</p>
          </div>
          <div className="flex gap-8">
            <a className="text-slate-500 hover:text-sky-400 text-xs font-medium transition-colors" href="#">Privacy Protocol</a>
            <a className="text-slate-500 hover:text-sky-400 text-xs font-medium transition-colors" href="#">Compliance</a>
            <a className="text-slate-500 hover:text-sky-400 text-xs font-medium transition-colors" href="#">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
