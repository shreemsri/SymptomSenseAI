import { Activity, Heart, LayoutDashboard } from "lucide-react";

export const Layout = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: "checker", label: "DIAGNOSTICS", icon: Activity },
    { id: "diabetes", label: "RISK ANALYSIS", icon: Heart },
    { id: "dashboard", label: "PATIENT HISTORY", icon: LayoutDashboard },
  ];

  return (
    <div className="bg-[#F5F4F0] text-[#1A1A2E] font-body selection:bg-[#00C9A7]/20 selection:text-[#1A1A2E] overflow-x-hidden min-h-screen">
      <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-[#E5E4E0] z-50 transition-all">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-headline font-bold text-[#1A1A2E]">SymptomSense</span>
        </div>
        
        {/* Desktop Nav - Centered Pills */}
        <div className="hidden md:flex items-center gap-2 bg-[#F9F9F8] p-1.5 rounded-full border border-[#E5E4E0]">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`font-label text-xs tracking-wider uppercase font-bold px-6 py-2 rounded-full transition-all duration-300 ${
                  isActive ? "bg-white text-[#1A1A2E] shadow-sm border border-[#E5E4E0]/50" : "text-[#7B7B8F] hover:text-[#1A1A2E]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button className="bg-[#00C9A7] text-white px-6 py-2.5 rounded-full font-label font-bold text-sm shadow-md hover:bg-[#00B4D8] hover-scale transition-colors">
          Download Report
        </button>
      </nav>

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 w-full flex justify-around p-3 border-t border-[#E5E4E0] bg-white/90 backdrop-blur-xl z-50">
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
