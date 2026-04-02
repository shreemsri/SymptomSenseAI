import { useState } from "react";
import { ArrowLeft, User, Lock, Moon, Sun } from "lucide-react";

export const LoginPage = ({ onNavigate, isDark, toggleTheme }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Dummy authentication delay
    setTimeout(() => {
      setIsLoading(false);
      onNavigate('app');
    }, 800);
  };

  return (
    <div className="bg-background min-h-screen font-body flex items-center justify-center p-6 relative transition-colors duration-300">
      
      {/* Top Absolute Nav for returning or Theme switch */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 w-full pr-12 max-w-6xl mx-auto">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-on-surface/70 hover:text-on-surface font-bold text-sm tracking-uppercase uppercase transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-surface shadow-sm border border-surface-container-highest hover:bg-surface-container-low transition-colors text-on-surface">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Main Login Card */}
      <div className="premium-card w-full max-w-md p-10 flex flex-col gap-8 animate-fade-up relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-surface-container-low border border-surface-container-highest rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
             <span className="material-symbols-outlined text-3xl text-primary">health_and_safety</span>
          </div>
          <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Welcome Back</h2>
          <p className="text-sm text-on-surface/60 font-medium">Log in to view your patient dashboard.</p>
        </div>

        {/* Mock auth form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full bg-surface-container-low border border-surface-container-highest focus:border-primary px-12 py-4 rounded-xl text-on-surface placeholder:text-on-surface/40 focus:ring-4 focus:ring-primary/10  transition-all text-sm font-medium outline-none"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 group-focus-within:text-primary transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-surface-container-low border border-surface-container-highest focus:border-primary px-12 py-4 rounded-xl text-on-surface placeholder:text-on-surface/40 focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-on-surface hover:bg-on-surface/90 text-surface font-bold py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover-scale disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-on-surface/50 font-medium px-4">
          *This is a mock gateway for Hackathon demonstration. Any credentials will be accepted without cloud transmission.
        </p>
      </div>

    </div>
  );
};
