export const diseases = [
  {
    name: "Fungal infection",
    symptoms: ["itching", "skin rash", "nodal skin eruptions", "dischromic patches", "redness", "scaling", "ringworm", "cracked skin", "peeling skin"],
    severity: "mild",
    specialist: "Dermatologist"
  },
  {
    name: "Allergy",
    symptoms: ["continuous sneezing", "shivering", "chills", "watering from eyes", "runny nose", "congestion", "cough", "itchy nose", "red eyes"],
    severity: "mild",
    specialist: "Allergist"
  },
  {
    name: "GERD",
    symptoms: ["stomach pain", "acidity", "ulcers on tongue", "vomiting", "cough", "chest pain", "heartburn", "acid reflux", "difficulty swallowing", "sore throat"],
    severity: "moderate",
    specialist: "Gastroenterologist"
  },
  {
    name: "Chronic cholestasis",
    symptoms: ["itching", "vomiting", "yellowish skin", "nausea", "loss of appetite", "abdominal pain", "yellowing of eyes", "dark urine", "pale stool", "fatigue"],
    severity: "moderate",
    specialist: "Gastroenterologist"
  },
  {
    name: "Drug reaction",
    symptoms: ["itching", "skin rash", "stomach pain", "burning micturition", "spotting urination", "hives", "fever", "swelling", "blisters", "breathing difficulty"],
    severity: "severe",
    specialist: "General Physician"
  },
  {
    name: "Peptic ulcer",
    symptoms: ["vomiting", "loss of appetite", "abdominal pain", "passage of blood", "internal itching", "stomach pain", "nausea", "bloating", "heartburn", "weight loss"],
    severity: "moderate",
    specialist: "Gastroenterologist"
  },
  {
    name: "AIDS",
    symptoms: ["muscle wasting", "patches in throat", "high fever", "extra marital contacts", "weight loss", "fatigue", "night sweats", "swollen lymph nodes", "chronic diarrhea", "recurrent infections"],
    severity: "severe",
    specialist: "Infectious Disease Specialist"
  },
  {
    name: "Diabetes",
    symptoms: ["fatigue", "weight loss", "restlessness", "lethargy", "irregular sugar level", "blurred and distorted vision", "obesity", "excessive hunger", "increased urination", "excessive thirst"],
    severity: "moderate",
    specialist: "Endocrinologist"
  },
  {
    name: "Gastroenteritis",
    symptoms: ["vomiting", "sunken eyes", "dehydration", "diarrhea", "nausea", "stomach cramps", "fever", "headache", "muscle aches", "chills"],
    severity: "moderate",
    specialist: "General Physician"
  },
  {
    name: "Bronchial Asthma",
    symptoms: ["fatigue", "cough", "high fever", "breathlessness", "family history", "mucoid sputum", "wheezing", "chest tightness", "shortness of breath", "rapid breathing"],
    severity: "severe",
    specialist: "Pulmonologist"
  },
  {
    name: "Hypertension",
    symptoms: ["headache", "chest pain", "dizziness", "loss of balance", "lack of concentration", "palpitations", "shortness of breath", "nosebleeds", "blurred vision", "fatigue"],
    severity: "moderate",
    specialist: "Cardiologist"
  },
  {
    name: "Migraine",
    symptoms: ["acidity", "indigestion", "headache", "blurred and distorted vision", "excessive hunger", "stiff neck", "depression", "irritability", "visual disturbances", "nausea"],
    severity: "moderate",
    specialist: "Neurologist"
  },
  {
    name: "Cervical spondylosis",
    symptoms: ["back pain", "weakness in limbs", "neck pain", "dizziness", "loss of balance", "muscle weakness", "tingling", "numbness", "stiff neck", "headache"],
    severity: "moderate",
    specialist: "Orthopedist"
  },
  {
    name: "Paralysis",
    symptoms: ["vomiting", "headache", "weakness of one body half", "altered sensorium", "loss of balance", "muscle weakness", "numbness", "difficulty speaking", "vision loss", "confusion"],
    severity: "severe",
    specialist: "Neurologist"
  },
  {
    name: "Jaundice",
    symptoms: ["itching", "vomiting", "fatigue", "weight loss", "high fever", "yellowish skin", "dark urine", "abdominal pain", "nausea", "loss of appetite"],
    severity: "moderate",
    specialist: "Gastroenterologist"
  },
  {
    name: "Malaria",
    symptoms: ["chills", "vomiting", "high fever", "sweating", "headache", "nausea", "muscle pain", "fatigue", "chest pain", "cough"],
    severity: "severe",
    specialist: "General Physician"
  },
  {
    name: "Chicken pox",
    symptoms: ["itching", "skin rash", "fatigue", "lethargy", "high fever", "loss of appetite", "headache", "mild fever", "swollen lymph nodes", "malaise"],
    severity: "moderate",
    specialist: "General Physician"
  },
  {
    name: "Dengue",
    symptoms: ["skin rash", "chills", "joint pain", "vomiting", "fatigue", "high fever", "headache", "nausea", "loss of appetite", "pain behind the eyes"],
    severity: "severe",
    specialist: "General Physician"
  },
  {
    name: "Typhoid",
    symptoms: ["chills", "vomiting", "fatigue", "high fever", "nausea", "constipation", "abdominal pain", "diarrhea", "toxic look (typhos)", "belly pain"],
    severity: "severe",
    specialist: "General Physician"
  },
  {
    name: "Pneumonia",
    symptoms: ["chills", "fatigue", "cough", "high fever", "breathlessness", "sweating", "malaise", "phlegm", "chest pain", "fast heart rate"],
    severity: "severe",
    specialist: "Pulmonologist"
  }
];

export const allSymptoms = [...new Set(diseases.flatMap(d => d.symptoms))].sort();
