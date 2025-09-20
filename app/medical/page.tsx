"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Languages, 
  FileText, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  User,
  MapPin,
  Calendar,
  Upload,
  Settings,
  Stethoscope,
  Search,
  BookOpen,
  Shield,
  TrendingUp,
  Users,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface DiagnosisResult {
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
  processingMetadata?: {
    processingTime: string;
    agentsUsed: string[];
    timestamp: string;
    apiStatus: 'active' | 'fallback' | 'error';
    sessionId: string;
  };
}

const SUPPORTED_LANGUAGES = [
  { code: "english", name: "English", native: "English" },
  { code: "hindi", name: "Hindi", native: "हिंदी" },
  { code: "marathi", name: "Marathi", native: "मराठी" },
  { code: "tamil", name: "Tamil", native: "தமிழ்" },
  { code: "telugu", name: "Telugu", native: "తెలుగు" },
  { code: "bengali", name: "Bengali", native: "বাংলা" },
  { code: "gujarati", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kannada", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "malayalam", name: "Malayalam", native: "മലയാളം" },
  { code: "punjabi", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "urdu", name: "Urdu", native: "اردو" }
];

const AI_AGENTS = [
  {
    id: "translator",
    name: "Language Translator",
    nickname: "Bhasha",
    description: "Translates symptoms from Indian languages to medical English",
    icon: Languages,
    color: "#D6F32F",
    status: "ready"
  },
  {
    id: "symptom-analyzer", 
    name: "Symptom Analyzer",
    nickname: "Lakshan",
    description: "Analyzes and structures patient symptoms clinically",
    icon: Activity,
    color: "#151616",
    status: "ready"
  },
  {
    id: "researcher",
    name: "Medical Researcher", 
    nickname: "Shodh",
    description: "Searches current medical literature and evidence",
    icon: BookOpen,
    color: "#D6F32F",
    status: "ready"
  },
  {
    id: "risk-assessor",
    name: "Risk Assessment",
    nickname: "Suraksha", 
    description: "Evaluates patient-specific risk factors",
    icon: Shield,
    color: "#151616",
    status: "ready"
  },
  {
    id: "aggregator",
    name: "Diagnosis Aggregator",
    nickname: "Nidan",
    description: "Combines all insights into final diagnosis",
    icon: Brain,
    color: "#D6F32F", 
    status: "ready"
  }
];

export default function MedicalDiagnosisPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  
  // Form state
  const [symptoms, setSymptoms] = useState("");
  const [language, setLanguage] = useState("english");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");

  const handleDiagnosis = async () => {
    if (!symptoms.trim()) {
      toast.error("Please enter patient symptoms");
      return;
    }

    setIsProcessing(true);
    setDiagnosis(null);

    try {
      // Simulate real-time agent activation
      const agentSequence = [
        { id: "translator", delay: 2000 },
        { id: "symptom-analyzer", delay: 3000 },
        { id: "researcher", delay: 4000 },
        { id: "risk-assessor", delay: 2500 },
        { id: "aggregator", delay: 3500 }
      ];

      // Start the API call
      const apiPromise = fetch("/api/medical/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms,
          language,
          age: age ? parseInt(age) : undefined,
          gender,
          location,
          medicalHistory: medicalHistory.split(",").map(h => h.trim()).filter(Boolean)
        }),
      });

      // Simulate agent processing in parallel with API call
      const agentSimulation = async () => {
        for (const agent of agentSequence) {
          setActiveAgent(agent.id);
          await new Promise(resolve => setTimeout(resolve, agent.delay));
        }
      };

      // Run both in parallel
      const [response] = await Promise.all([apiPromise, agentSimulation()]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to process diagnosis");
      }

      const result = await response.json();
      setDiagnosis(result.diagnosis);
      
      // Show success message with processing time if available
      const processingTime = result.diagnosis?.processingMetadata?.processingTime;
      const successMessage = processingTime 
        ? `Diagnosis completed in ${processingTime}!`
        : "Diagnosis completed successfully!";
      
      toast.success(successMessage);

      // Show API status
      const apiStatus = result.diagnosis?.processingMetadata?.apiStatus;
      if (apiStatus === 'fallback') {
        toast.warning("Using demo mode - Configure Perplexity API key for full functionality");
      } else if (apiStatus === 'error') {
        toast.error("API connection issues detected");
      }

    } catch (error) {
      console.error("Diagnosis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to process diagnosis";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setActiveAgent(null);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flex">
      {/* Options Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white border-r-2 border-[#151616] shadow-[4px_0px_0px_0px_#151616] p-6 overflow-y-auto"
          >
            <div className="mb-6">
              <h2 className="text-xl font-poppins font-bold text-[#151616] mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Medical Team
              </h2>
              <p className="text-sm text-[#151616]/70 font-poppins">
                Specialized agents working together for accurate diagnosis
              </p>
            </div>

            {/* Agent Status */}
            <div className="space-y-3 mb-6">
              {AI_AGENTS.map((agent) => {
                const Icon = agent.icon;
                const isActive = activeAgent === agent.id;
                const isCompleted = isProcessing && AI_AGENTS.findIndex(a => a.id === activeAgent) > AI_AGENTS.findIndex(a => a.id === agent.id);
                
                return (
                  <motion.div
                    key={agent.id}
                    className={`p-3 rounded-xl border-2 border-[#151616] transition-all duration-200 ${
                      isActive 
                        ? "bg-[#D6F32F] shadow-[2px_2px_0px_0px_#151616]" 
                        : isCompleted
                        ? "bg-green-100 shadow-[2px_2px_0px_0px_#151616]"
                        : "bg-white"
                    }`}
                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-[#151616] flex items-center justify-center"
                        style={{ backgroundColor: isActive ? "#151616" : agent.color }}
                      >
                        {isActive ? (
                          <Loader2 className="w-4 h-4 text-white animate-spin" />
                        ) : isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Icon className="w-4 h-4" style={{ color: agent.color === "#D6F32F" ? "#151616" : "white" }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-poppins font-medium text-sm text-[#151616]">
                          {agent.nickname}
                        </p>
                        <p className="text-xs text-[#151616]/70 font-poppins">
                          {agent.name}
                        </p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-[#151616] rounded-full animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <h3 className="font-poppins font-bold text-[#151616] text-sm">Options</h3>
              
              <div className="space-y-2">
                <Label className="text-sm font-poppins text-[#151616]">Model Selection</Label>
                <Select defaultValue="sonar-large">
                  <SelectTrigger className="border-2 border-[#151616]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sonar-large">Sonar Large (Recommended)</SelectItem>
                    <SelectItem value="sonar-small">Sonar Small (Faster)</SelectItem>
                    <SelectItem value="sonar-huge">Sonar Huge (Most Accurate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-poppins text-[#151616]">Analysis Depth</Label>
                <Select defaultValue="comprehensive">
                  <SelectTrigger className="border-2 border-[#151616]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quick">Quick Analysis</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-poppins text-[#151616]">Safety Mode</Label>
                <Select defaultValue="conservative">
                  <SelectTrigger className="border-2 border-[#151616]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (Recommended)</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-instrument-serif font-bold text-[#151616] mb-2">
                AI Medical Diagnosis
              </h1>
              <p className="text-[#151616]/70 font-poppins">
                Multi-agent AI system powered by Perplexity Sonar models
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-poppins text-[#151616]/60">
                  Real-time AI orchestration active
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-poppins font-medium text-[#151616]">System Status</p>
                <p className="text-xs font-poppins text-green-600">All Agents Online</p>
              </div>
              <Button
                variant="reverse"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="border-2 border-[#151616]"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
              <CardHeader>
                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" />
                  Patient Information
                </CardTitle>
                <CardDescription className="font-poppins">
                  Enter patient symptoms and details for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-poppins text-[#151616]">Symptoms *</Label>
                  <Textarea
                    placeholder="Describe patient symptoms in detail..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="min-h-[120px] border-2 border-[#151616] font-poppins"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-poppins text-[#151616]">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="border-2 border-[#151616]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name} ({lang.native})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-poppins text-[#151616]">Age</Label>
                    <Input
                      type="number"
                      placeholder="Patient age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="border-2 border-[#151616]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="font-poppins text-[#151616]">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="border-2 border-[#151616]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="font-poppins text-[#151616]">Location</Label>
                    <Input
                      placeholder="City, State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="border-2 border-[#151616]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-poppins text-[#151616]">Medical History</Label>
                  <Input
                    placeholder="Comma-separated conditions (e.g., diabetes, hypertension)"
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    className="border-2 border-[#151616]"
                  />
                </div>

                <Button
                  onClick={handleDiagnosis}
                  disabled={isProcessing || !symptoms.trim()}
                  className="w-full bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 font-poppins font-bold"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing Diagnosis...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Start AI Diagnosis
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
              <CardHeader>
                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Diagnosis Results
                </CardTitle>
                <CardDescription className="font-poppins">
                  AI-generated medical analysis and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isProcessing ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#151616]" />
                      <p className="font-poppins text-[#151616]">
                        AI agents are analyzing patient data...
                      </p>
                    </div>
                    <Progress value={((AI_AGENTS.findIndex(a => a.id === activeAgent) + 1) / AI_AGENTS.length) * 100} className="h-2" />
                  </div>
                ) : diagnosis ? (
                  <Tabs defaultValue="diagnosis" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
                      <TabsTrigger value="tests">Tests</TabsTrigger>
                      <TabsTrigger value="insights">Insights</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="diagnosis" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getUrgencyColor(diagnosis.urgencyLevel)} text-white`}>
                            {diagnosis.urgencyLevel.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-poppins text-[#151616]/70">
                            Urgency Level
                          </span>
                        </div>
                        
                        <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                          <h3 className="font-poppins font-bold text-[#151616] mb-2">
                            Primary Diagnosis
                          </h3>
                          <p className="text-lg font-poppins text-[#151616]">
                            {diagnosis.primaryDiagnosis.condition}
                          </p>
                          <p className="text-sm font-poppins text-[#151616]/70">
                            Confidence: {diagnosis.primaryDiagnosis.confidence}
                          </p>
                        </div>

                        {diagnosis.differentialDiagnosis.length > 0 && (
                          <div className="space-y-2">
                            <h3 className="font-poppins font-bold text-[#151616]">
                              Differential Diagnoses
                            </h3>
                            {diagnosis.differentialDiagnosis.map((diff, index) => (
                              <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg border border-[#151616]/20">
                                <span className="font-poppins text-[#151616]">{diff.condition}</span>
                                <span className="text-sm font-poppins text-[#151616]/70">{diff.confidence}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="tests" className="space-y-4">
                      {diagnosis.recommendedTests && diagnosis.recommendedTests.length > 0 ? (
                        <div className="space-y-2">
                          <h3 className="font-poppins font-bold text-[#151616]">
                            Recommended Tests
                          </h3>
                          {diagnosis.recommendedTests.map((test, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-[#FFFFF4] rounded-lg">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="font-poppins text-[#151616]">{test}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[#151616]/70 font-poppins">No specific tests recommended at this time.</p>
                      )}
                      
                      <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                        <h3 className="font-poppins font-bold text-[#151616] mb-2">
                          Clinical Notes
                        </h3>
                        <p className="font-poppins text-[#151616]/80">
                          {diagnosis.clinicalNotes}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-4">
                      {/* Processing Metadata */}
                      {diagnosis.processingMetadata && (
                        <div className="p-4 bg-[#D6F32F]/10 rounded-xl border border-[#151616]/20 mb-4">
                          <h4 className="font-poppins font-bold text-[#151616] mb-2">Processing Information</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-poppins font-medium text-[#151616]">Processing Time:</span>
                              <p className="font-poppins text-[#151616]/70">{diagnosis.processingMetadata.processingTime}</p>
                            </div>
                            <div>
                              <span className="font-poppins font-medium text-[#151616]">API Status:</span>
                              <p className={`font-poppins ${
                                diagnosis.processingMetadata.apiStatus === 'active' ? 'text-green-600' :
                                diagnosis.processingMetadata.apiStatus === 'fallback' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {diagnosis.processingMetadata.apiStatus === 'active' ? 'Real-time AI' :
                                 diagnosis.processingMetadata.apiStatus === 'fallback' ? 'Demo Mode' : 'Error'}
                              </p>
                            </div>
                            <div>
                              <span className="font-poppins font-medium text-[#151616]">Agents Used:</span>
                              <p className="font-poppins text-[#151616]/70">{diagnosis.processingMetadata.agentsUsed.join(', ')}</p>
                            </div>
                            <div>
                              <span className="font-poppins font-medium text-[#151616]">Timestamp:</span>
                              <p className="font-poppins text-[#151616]/70">
                                {new Date(diagnosis.processingMetadata.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Agent Insights */}
                      <div className="space-y-3">
                        <h4 className="font-poppins font-bold text-[#151616]">Agent Insights</h4>
                        {Object.entries(diagnosis.agentInsights).map(([agent, insight]) => (
                          <div key={agent} className="p-3 bg-white rounded-xl border border-[#151616]/20">
                            <h5 className="font-poppins font-medium text-[#151616] capitalize mb-1">
                              {agent === 'translator' ? '🗣️ Bhasha (Translator)' :
                               agent === 'symptomAnalyzer' ? '📊 Lakshan (Symptom Analyzer)' :
                               agent === 'researcher' ? '📚 Shodh (Researcher)' :
                               agent === 'riskAssessment' ? '🛡️ Suraksha (Risk Assessment)' :
                               agent.replace(/([A-Z])/g, ' $1').trim()}
                            </h5>
                            <p className="text-sm font-poppins text-[#151616]/70">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center py-8 text-[#151616]/70">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-poppins">
                      Enter patient symptoms to start AI diagnosis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}