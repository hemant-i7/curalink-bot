// Demo version with mock responses for testing without API keys

// Medical Agent Types
export interface PatientInput {
  symptoms: string;
  language: string;
  age?: number;
  gender?: string;
  location?: string;
  medicalHistory?: string[];
  uploadedFiles?: File[];
}

export interface DiagnosisResult {
  primaryDiagnosis: {
    condition: string;
    confidence: string;
    icd10Code?: string;
  };
  differentialDiagnosis: Array<{
    condition: string;
    confidence: string;
  }>;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  recommendedTests?: string[];
  clinicalNotes: string;
  agentInsights: {
    translator?: string;
    symptomAnalyzer?: string;
    researcher?: string;
    riskAssessment?: string;
  };
}

// Language Translator Agent (Demo)
export class LanguageTranslatorAgent {
  async translateSymptoms(symptoms: string, language: string): Promise<{
    translatedSymptoms: string;
    emergencyKeywords: string[];
    culturalContext: string;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock translation based on common symptoms
    const mockTranslations: Record<string, string> = {
      "बुखार और सिर दर्द": "fever and headache",
      "पेट में दर्द": "abdominal pain",
      "सांस लेने में तकलीफ": "difficulty breathing",
      "छाती में दर्द": "chest pain"
    };

    const translatedSymptoms = language === "english" 
      ? symptoms 
      : mockTranslations[symptoms] || symptoms;

    const emergencyKeywords = symptoms.toLowerCase().includes("chest") || 
                             symptoms.toLowerCase().includes("छाती") ||
                             symptoms.toLowerCase().includes("breathing") ||
                             symptoms.toLowerCase().includes("सांस")
      ? ["chest pain", "breathing difficulty"]
      : [];

    return {
      translatedSymptoms,
      emergencyKeywords,
      culturalContext: language !== "english" ? "Regional medical terminology preserved" : ""
    };
  }
}

// Symptom Analyzer Agent (Demo)
export class SymptomAnalyzerAgent {
  async analyzeSymptoms(symptoms: string, _patientInfo: Partial<PatientInput>): Promise<{
    structuredSymptoms: Array<{
      symptom: string;
      severity: number;
      duration: string;
      bodySystem: string;
    }>;
    redFlags: string[];
    urgencyScore: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerSymptoms = symptoms.toLowerCase();
    const structuredSymptoms = [];
    const redFlags = [];
    let urgencyScore = 3;

    // Analyze common symptoms
    if (lowerSymptoms.includes("fever") || lowerSymptoms.includes("बुखार")) {
      structuredSymptoms.push({
        symptom: "Fever",
        severity: 7,
        duration: "3 days",
        bodySystem: "General"
      });
      urgencyScore = Math.max(urgencyScore, 6);
    }

    if (lowerSymptoms.includes("chest pain") || lowerSymptoms.includes("छाती")) {
      structuredSymptoms.push({
        symptom: "Chest Pain",
        severity: 8,
        duration: "Acute",
        bodySystem: "Cardiovascular"
      });
      redFlags.push("Possible cardiac event");
      urgencyScore = 9;
    }

    if (lowerSymptoms.includes("headache") || lowerSymptoms.includes("सिर दर्द")) {
      structuredSymptoms.push({
        symptom: "Headache",
        severity: 6,
        duration: "2 days",
        bodySystem: "Neurological"
      });
    }

    if (lowerSymptoms.includes("breathing") || lowerSymptoms.includes("सांस")) {
      structuredSymptoms.push({
        symptom: "Dyspnea",
        severity: 7,
        duration: "Acute",
        bodySystem: "Respiratory"
      });
      redFlags.push("Respiratory distress");
      urgencyScore = Math.max(urgencyScore, 8);
    }

    return {
      structuredSymptoms,
      redFlags,
      urgencyScore
    };
  }
}

// Medical Researcher Agent (Demo)
export class MedicalResearcherAgent {
  async researchConditions(symptoms: string, location?: string): Promise<{
    relevantStudies: Array<{
      title: string;
      summary: string;
      evidenceLevel: number;
      source: string;
    }>;
    regionalPatterns: string;
    currentOutbreaks: string[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const lowerSymptoms = symptoms.toLowerCase();
    const relevantStudies = [];
    let regionalPatterns = "";
    let currentOutbreaks: string[] = [];

    if (lowerSymptoms.includes("fever")) {
      relevantStudies.push({
        title: "Fever Management in Tropical Climates: A Systematic Review",
        summary: "Evidence-based approaches to fever management in Indian subcontinent",
        evidenceLevel: 1,
        source: "Indian Journal of Medicine"
      });

      if (location?.toLowerCase().includes("delhi") || location?.toLowerCase().includes("mumbai")) {
        regionalPatterns = "Dengue fever cases increased by 40% during monsoon season";
        currentOutbreaks = ["Dengue", "Chikungunya"];
      }
    }

    if (lowerSymptoms.includes("chest")) {
      relevantStudies.push({
        title: "Acute Coronary Syndrome in South Asian Population",
        summary: "Higher prevalence of CAD in younger age groups in Indian population",
        evidenceLevel: 2,
        source: "Cardiology Research India"
      });
    }

    return {
      relevantStudies,
      regionalPatterns,
      currentOutbreaks
    };
  }
}

// Risk Assessment Agent (Demo)
export class RiskAssessmentAgent {
  async assessRisk(patientInfo: PatientInput, symptoms: string): Promise<{
    riskFactors: Array<{
      factor: string;
      impact: "low" | "medium" | "high";
      description: string;
    }>;
    overallRisk: "low" | "medium" | "high" | "critical";
    recommendations: string[];
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const riskFactors = [];
    let overallRisk: "low" | "medium" | "high" | "critical" = "low";
    const recommendations = [];

    // Age-based risk
    if (patientInfo.age && patientInfo.age > 60) {
      riskFactors.push({
        factor: "Advanced Age",
        impact: "high" as const,
        description: "Increased risk for cardiovascular and respiratory conditions"
      });
      overallRisk = "high";
    }

    // Gender-based risk
    if (patientInfo.gender === "male" && patientInfo.age && patientInfo.age > 45) {
      riskFactors.push({
        factor: "Male Gender + Age",
        impact: "medium" as const,
        description: "Higher cardiovascular risk in middle-aged males"
      });
      overallRisk = overallRisk === "low" ? "medium" : overallRisk;
    }

    // Location-based risk
    if (patientInfo.location?.toLowerCase().includes("delhi")) {
      riskFactors.push({
        factor: "Air Pollution Exposure",
        impact: "medium" as const,
        description: "High air pollution levels in Delhi increase respiratory risks"
      });
    }

    // Symptom-based risk
    if (symptoms.toLowerCase().includes("chest")) {
      overallRisk = "critical";
      recommendations.push("Immediate cardiac evaluation required");
      recommendations.push("ECG and cardiac enzymes");
    }

    if (symptoms.toLowerCase().includes("breathing")) {
      overallRisk = overallRisk === "low" ? "high" : "critical";
      recommendations.push("Oxygen saturation monitoring");
      recommendations.push("Chest X-ray recommended");
    }

    // Default recommendations
    if (recommendations.length === 0) {
      recommendations.push("Regular monitoring of vital signs");
      recommendations.push("Follow-up in 24-48 hours if symptoms persist");
    }

    return {
      riskFactors,
      overallRisk,
      recommendations
    };
  }
}

// Diagnosis Aggregator Agent (Demo)
export class DiagnosisAggregatorAgent {
  async aggregateDiagnosis(
    translatedSymptoms: string,
    symptomAnalysis: {
      structuredSymptoms: Array<{
        symptom: string;
        severity: number;
        duration: string;
        bodySystem: string;
      }>;
      redFlags: string[];
      urgencyScore: number;
    },
    researchFindings: {
      relevantStudies: Array<{
        title: string;
        summary: string;
        evidenceLevel: number;
        source: string;
      }>;
      regionalPatterns: string;
      currentOutbreaks: string[];
    },
    riskAssessment: {
      riskFactors: Array<{
        factor: string;
        impact: "low" | "medium" | "high";
        description: string;
      }>;
      overallRisk: "low" | "medium" | "high" | "critical";
      recommendations: string[];
    },
    patientInfo: PatientInput
  ): Promise<DiagnosisResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerSymptoms = translatedSymptoms.toLowerCase();
    let primaryDiagnosis = { condition: "Viral Syndrome", confidence: "75%" };
    let differentialDiagnosis = [
      { condition: "Upper Respiratory Infection", confidence: "20%" },
      { condition: "Stress-related symptoms", confidence: "5%" }
    ];
    let urgencyLevel: "low" | "medium" | "high" | "critical" = "medium";
    let recommendedTests = ["Complete Blood Count", "Basic Metabolic Panel"];
    let clinicalNotes = "Patient presents with common viral symptoms. Monitor for progression.";

    // Chest pain scenario
    if (lowerSymptoms.includes("chest")) {
      primaryDiagnosis = { condition: "Acute Coronary Syndrome", confidence: "85%", icd10Code: "I20.9" };
      differentialDiagnosis = [
        { condition: "Myocardial Infarction", confidence: "70%" },
        { condition: "Unstable Angina", confidence: "15%" },
        { condition: "Costochondritis", confidence: "10%" },
        { condition: "Gastroesophageal Reflux", confidence: "5%" }
      ];
      urgencyLevel = "critical";
      recommendedTests = ["ECG", "Cardiac Enzymes (Troponin)", "Chest X-ray", "Complete Blood Count"];
      clinicalNotes = "CRITICAL: Patient presents with chest pain. Immediate cardiac evaluation required. Consider STEMI protocol if ECG changes present.";
    }
    // Fever scenario
    else if (lowerSymptoms.includes("fever")) {
      if (patientInfo.location?.toLowerCase().includes("delhi") || 
          patientInfo.location?.toLowerCase().includes("mumbai")) {
        primaryDiagnosis = { condition: "Dengue Fever", confidence: "80%", icd10Code: "A90" };
        differentialDiagnosis = [
          { condition: "Viral Fever", confidence: "15%" },
          { condition: "Malaria", confidence: "3%" },
          { condition: "Typhoid", confidence: "2%" }
        ];
        urgencyLevel = "high";
        recommendedTests = ["Dengue NS1 Antigen", "Dengue IgM/IgG", "Complete Blood Count", "Platelet Count"];
        clinicalNotes = "High suspicion for dengue fever given seasonal pattern and location. Monitor platelet count closely for thrombocytopenia.";
      }
    }
    // Breathing difficulty
    else if (lowerSymptoms.includes("breathing") || lowerSymptoms.includes("dyspnea")) {
      primaryDiagnosis = { condition: "Acute Respiratory Distress", confidence: "78%" };
      differentialDiagnosis = [
        { condition: "Pneumonia", confidence: "40%" },
        { condition: "Asthma Exacerbation", confidence: "25%" },
        { condition: "Pulmonary Embolism", confidence: "10%" },
        { condition: "Heart Failure", confidence: "3%" }
      ];
      urgencyLevel = "high";
      recommendedTests = ["Chest X-ray", "Arterial Blood Gas", "D-dimer", "Complete Blood Count"];
      clinicalNotes = "Patient with respiratory symptoms requires immediate evaluation. Consider oxygen therapy if saturation <90%.";
    }

    return {
      primaryDiagnosis,
      differentialDiagnosis,
      urgencyLevel,
      recommendedTests,
      clinicalNotes,
      agentInsights: {
        translator: `Symptoms translated from ${patientInfo.language} with cultural context preserved`,
        symptomAnalyzer: `${symptomAnalysis.structuredSymptoms?.length || 0} symptoms analyzed, urgency score: ${symptomAnalysis.urgencyScore}/10`,
        researcher: `${researchFindings.relevantStudies?.length || 0} relevant studies found, regional patterns identified`,
        riskAssessment: `Overall risk: ${riskAssessment.overallRisk}, ${riskAssessment.riskFactors?.length || 0} risk factors identified`
      }
    };
  }
}

// Medical Coordinator - Main orchestrator (Demo)
export class MedicalCoordinatorAgent {
  private translator: LanguageTranslatorAgent;
  private symptomAnalyzer: SymptomAnalyzerAgent;
  private researcher: MedicalResearcherAgent;
  private riskAssessment: RiskAssessmentAgent;
  private aggregator: DiagnosisAggregatorAgent;

  constructor() {
    this.translator = new LanguageTranslatorAgent();
    this.symptomAnalyzer = new SymptomAnalyzerAgent();
    this.researcher = new MedicalResearcherAgent();
    this.riskAssessment = new RiskAssessmentAgent();
    this.aggregator = new DiagnosisAggregatorAgent();
  }

  async processDiagnosis(patientInput: PatientInput): Promise<DiagnosisResult> {
    try {
      console.log("Starting medical diagnosis process...");

      // Step 1: Translate symptoms if needed
      console.log("Step 1: Translating symptoms...");
      const translationResult = await this.translator.translateSymptoms(
        patientInput.symptoms,
        patientInput.language
      );

      // Step 2: Analyze symptoms
      console.log("Step 2: Analyzing symptoms...");
      const symptomAnalysis = await this.symptomAnalyzer.analyzeSymptoms(
        translationResult.translatedSymptoms,
        patientInput
      );

      // Step 3: Research medical literature
      console.log("Step 3: Researching medical literature...");
      const researchFindings = await this.researcher.researchConditions(
        translationResult.translatedSymptoms,
        patientInput.location
      );

      // Step 4: Assess patient risk
      console.log("Step 4: Assessing patient risk...");
      const riskAssessment = await this.riskAssessment.assessRisk(
        patientInput,
        translationResult.translatedSymptoms
      );

      // Step 5: Aggregate final diagnosis
      console.log("Step 5: Aggregating final diagnosis...");
      const finalDiagnosis = await this.aggregator.aggregateDiagnosis(
        translationResult.translatedSymptoms,
        symptomAnalysis,
        researchFindings,
        riskAssessment,
        patientInput
      );

      console.log("Diagnosis process completed successfully");
      return finalDiagnosis;
    } catch (error) {
      console.error("Error in medical diagnosis process:", error);
      return {
        primaryDiagnosis: {
          condition: "System Error",
          confidence: "0%"
        },
        differentialDiagnosis: [],
        urgencyLevel: "medium",
        clinicalNotes: "System error occurred. Please consult a physician immediately for proper evaluation.",
        agentInsights: {
          translator: "Error in translation process",
          symptomAnalyzer: "Error in symptom analysis",
          researcher: "Error in research process",
          riskAssessment: "Error in risk assessment"
        }
      };
    }
  }
}