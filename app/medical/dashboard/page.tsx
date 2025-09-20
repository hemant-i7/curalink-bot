"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageProcessor } from "@/components/medical/image-processor";
import { PatientHistory } from "@/components/medical/patient-history";
import { 
  Brain, 
  Activity, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Heart,
  Thermometer,
  Zap,
  Globe,
  Shield
} from "lucide-react";

export default function MedicalDashboard() {
  const [realtimeStats, setRealtimeStats] = useState({
    activeDiagnoses: 24,
    completedToday: 156,
    avgAccuracy: 94.2,
    emergencyCases: 3,
    agentsOnline: 5,
    responseTime: 2.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeStats(prev => ({
        ...prev,
        activeDiagnoses: prev.activeDiagnoses + Math.floor(Math.random() * 3) - 1,
        avgAccuracy: 94.2 + (Math.random() - 0.5) * 2,
        responseTime: 2.3 + (Math.random() - 0.5) * 0.5
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const recentCases = [
    {
      id: "C001",
      patient: "Patient A",
      condition: "Dengue Fever",
      confidence: "89%",
      urgency: "high",
      time: "5 min ago",
      language: "Hindi"
    },
    {
      id: "C002", 
      patient: "Patient B",
      condition: "Migraine",
      confidence: "94%",
      urgency: "medium",
      time: "12 min ago",
      language: "Tamil"
    },
    {
      id: "C003",
      patient: "Patient C", 
      condition: "Pneumonia",
      confidence: "87%",
      urgency: "high",
      time: "18 min ago",
      language: "English"
    }
  ];

  const agentStatus = [
    { name: "Bhasha", type: "Translator", status: "active", load: 85 },
    { name: "Lakshan", type: "Symptom Analyzer", status: "active", load: 72 },
    { name: "Shodh", type: "Researcher", status: "active", load: 91 },
    { name: "Suraksha", type: "Risk Assessor", status: "active", load: 68 },
    { name: "Nidan", type: "Aggregator", status: "active", load: 79 }
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-instrument-serif font-bold text-[#151616] mb-2">
            Medical AI Command Center
          </h1>
          <p className="text-[#151616]/70 font-poppins">
            Real-time monitoring of AI medical diagnosis system
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-poppins text-[#151616]">System Online</span>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#151616]" />
                </div>
                <div>
                  <p className="text-2xl font-poppins font-bold text-[#151616]">
                    {realtimeStats.activeDiagnoses}
                  </p>
                  <p className="text-sm font-poppins text-[#151616]/70">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl border-2 border-[#151616] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-poppins font-bold text-[#151616]">
                    {realtimeStats.completedToday}
                  </p>
                  <p className="text-sm font-poppins text-[#151616]/70">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#151616]" />
                </div>
                <div>
                  <p className="text-2xl font-poppins font-bold text-[#151616]">
                    {realtimeStats.avgAccuracy.toFixed(1)}%
                  </p>
                  <p className="text-sm font-poppins text-[#151616]/70">Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl border-2 border-[#151616] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-poppins font-bold text-[#151616]">
                    {realtimeStats.emergencyCases}
                  </p>
                  <p className="text-sm font-poppins text-[#151616]/70">Emergency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl border-2 border-[#151616] flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#151616]" />
                </div>
                <div>
                  <p className="text-2xl font-poppins font-bold text-[#151616]">
                    {realtimeStats.agentsOnline}
                  </p>
                  <p className="text-sm font-poppins text-[#151616]/70">Agents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#151616]" />
                </div>
                <div>
                  <p className="text-2xl font-poppins font-bold text-[#151616]">
                    {realtimeStats.responseTime.toFixed(1)}s
                  </p>
                  <p className="text-sm font-poppins text-[#151616]/70">Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2">
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Diagnoses
              </CardTitle>
              <CardDescription className="font-poppins">
                Latest AI-processed medical cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCases.map((case_, index) => (
                  <motion.div
                    key={case_.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl border-2 border-[#151616] flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-[#151616]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-poppins font-medium text-[#151616]">
                            {case_.patient}
                          </p>
                          <Badge variant="neutral" className="text-xs">
                            {case_.language}
                          </Badge>
                        </div>
                        <p className="text-sm font-poppins text-[#151616]/70">
                          {case_.condition}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${getUrgencyColor(case_.urgency)} text-white text-xs`}>
                          {case_.urgency}
                        </Badge>
                        <span className="text-sm font-poppins font-medium text-[#151616]">
                          {case_.confidence}
                        </span>
                      </div>
                      <p className="text-xs font-poppins text-[#151616]/60">
                        {case_.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Agent Status */}
        <div>
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Agent Status
              </CardTitle>
              <CardDescription className="font-poppins">
                Real-time agent performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentStatus.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#151616]/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <div>
                        <p className="font-poppins font-medium text-[#151616] text-sm">
                          {agent.name}
                        </p>
                        <p className="text-xs font-poppins text-[#151616]/70">
                          {agent.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-poppins font-medium text-[#151616]">
                        {agent.load}%
                      </p>
                      <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#D6F32F] transition-all duration-300"
                          style={{ width: `${agent.load}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Additional Features */}
      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="images">Medical Images</TabsTrigger>
          <TabsTrigger value="history">Patient History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="mt-6">
          <ImageProcessor />
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <PatientHistory userId="demo-user-123" />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616]">
                System Analytics
              </CardTitle>
              <CardDescription className="font-poppins">
                Performance metrics and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                  <h3 className="font-poppins font-bold text-[#151616] mb-2">Diagnosis Accuracy</h3>
                  <p className="text-3xl font-poppins font-bold text-green-600">94.2%</p>
                  <p className="text-sm font-poppins text-[#151616]/70">+2.1% from last week</p>
                </div>
                <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                  <h3 className="font-poppins font-bold text-[#151616] mb-2">Avg Response Time</h3>
                  <p className="text-3xl font-poppins font-bold text-blue-600">2.3s</p>
                  <p className="text-sm font-poppins text-[#151616]/70">-0.5s improvement</p>
                </div>
                <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                  <h3 className="font-poppins font-bold text-[#151616] mb-2">Cases Processed</h3>
                  <p className="text-3xl font-poppins font-bold text-purple-600">1,247</p>
                  <p className="text-sm font-poppins text-[#151616]/70">This week</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                System Alerts
              </CardTitle>
              <CardDescription className="font-poppins">
                Important notifications and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-poppins font-medium text-red-800">High Priority Case</p>
                    <p className="text-sm font-poppins text-red-600">Patient with chest pain requires immediate attention</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-poppins font-medium text-yellow-800">System Maintenance</p>
                    <p className="text-sm font-poppins text-yellow-600">Scheduled maintenance in 2 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-poppins font-medium text-green-800">System Update</p>
                    <p className="text-sm font-poppins text-green-600">New AI model deployed successfully</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Configuration
              </CardTitle>
              <CardDescription className="font-poppins">
                Configure AI agents and system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                    <h3 className="font-poppins font-bold text-[#151616] mb-2">Safety Mode</h3>
                    <p className="text-sm font-poppins text-[#151616]/70 mb-3">
                      Conservative approach for patient safety
                    </p>
                    <Button className="bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616] border-2 border-[#151616] font-poppins">
                      Configure
                    </Button>
                  </div>
                  <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                    <h3 className="font-poppins font-bold text-[#151616] mb-2">Language Support</h3>
                    <p className="text-sm font-poppins text-[#151616]/70 mb-3">
                      Manage supported Indian languages
                    </p>
                    <Button variant="reverse" className="border-2 border-[#151616] font-poppins">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}