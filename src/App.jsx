import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { SymptomChecker } from './components/SymptomChecker';
import { DiabetesChecker } from './components/DiabetesChecker';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';

function App() {
  const [appState, setAppState] = useState('landing');
  const [activeTab, setActiveTab] = useState('checker');
  const [isDark, setIsDark] = useState(false);
  
  // Storage logic for theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('symptom_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const nextTheme = !prev;
      if (nextTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('symptom_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('symptom_theme', 'light');
      }
      return nextTheme;
    });
  };

  // Biomarker logic
  const [symptomResults, setSymptomResults] = useState(null);
  const [diabetesResults, setDiabetesResults] = useState(null);

  if (appState === 'landing') {
    return <LandingPage onNavigate={setAppState} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  if (appState === 'login') {
    return <LoginPage onNavigate={setAppState} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onNavigate={setAppState} 
      isDark={isDark} 
      toggleTheme={toggleTheme}
    >
      {activeTab === 'checker' && (
        <SymptomChecker onResultsChange={setSymptomResults} />
      )}
      {activeTab === 'diabetes' && (
        <DiabetesChecker onResultsChange={setDiabetesResults} />
      )}
      {activeTab === 'dashboard' && (
        <Dashboard 
          symptomResults={symptomResults} 
          diabetesResults={diabetesResults} 
          onNavigate={setActiveTab}
        />
      )}
    </Layout>
  );
}

export default App;
