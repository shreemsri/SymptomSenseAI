import { useState } from 'react';
import { Layout } from './components/Layout';
import { SymptomChecker } from './components/SymptomChecker';
import { DiabetesChecker } from './components/DiabetesChecker';
import { Dashboard } from './components/Dashboard';

function App() {
  const [activeTab, setActiveTab] = useState('checker');
  
  // Lift up state to pass to Dashboard
  const [symptomResults, setSymptomResults] = useState(null);
  const [diabetesResults, setDiabetesResults] = useState(null);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
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
