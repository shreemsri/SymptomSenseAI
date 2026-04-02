import { diseases } from "../data/diseases";

export const calculateDiseaseMatches = (selectedSymptoms) => {
  if (!selectedSymptoms || selectedSymptoms.length === 0) return [];
  
  const results = diseases.map(disease => {
    const matchedCount = disease.symptoms.filter(sym => selectedSymptoms.includes(sym)).length;
    // Base confidence logic on fraction of disease symptoms matched, and fraction of selected symptoms that belong to disease
    // Added a slight bonus for multiple matches to boost the top results
    let baseConfidence = (matchedCount / disease.symptoms.length) * 100;
    
    // Normalize to max 100%
    const confidence = Math.min(100, Math.round(baseConfidence + (matchedCount > 1 ? matchedCount * 2 : 0)));
    
    return {
      ...disease,
      matchedCount,
      confidence
    };
  });
  
  // Return top 3 matches sorted by confidence descending
  return results
    .filter(r => r.matchedCount > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
};

export const calculateDiabetesRiskScore = (vitals) => {
  const { age, bmi, glucose, bloodPressure, insulin, skinThickness, pregnancies, pedigree } = vitals;
  
  // Formula: score = (glucose/200)*35 + (BMI/50)*25 + (age/100)*15 + (insulin/900)*10 + (pedigree/2.5)*15
  let score = 
    ((Number(glucose) || 100) / 200) * 35 + 
    ((Number(bmi) || 25) / 50) * 25 + 
    ((Number(age) || 30) / 100) * 15 + 
    ((Number(insulin) || 100) / 900) * 10 + 
    ((Number(pedigree) || 0.5) / 2.5) * 15;
    
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  let riskLabel = "Low Risk";
  let color = "text-green-500";
  if (score >= 66) {
    riskLabel = "High Risk";
    color = "text-red-500";
  } else if (score >= 36) {
    riskLabel = "Moderate Risk";
    color = "text-yellow-500";
  }
  
  return { score, label: riskLabel, color };
};
