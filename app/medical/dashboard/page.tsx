"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, FileText, Users, TrendingUp, Stethoscope, Activity, Plus, BarChart3 } from "lucide-react"

export default function MedicalDashboard() {
  const router = useRouter()

  const dashboardOptions = [
    {
      title: "AI Agent Orchestration",
      description: "Multi-agent AI system for comprehensive medical diagnosis",
      icon: Brain,
      color: "#D6F32F",
      path: "/medical/ai-orchestration",
      isNew: true
    },
    {
      title: "Patient Management",
      description: "Manage patient records and medical history",
      icon: Users,
      color: "white",
      path: "/medical/patients"
    },
    {
      title: "Medical Analytics",
      description: "View diagnostic trends and performance metrics",
      icon: BarChart3,
      color: "white",
      path: "/medical/analytics"
    },
    {
      title: "Research Portal",
      description: "Access medical literature and research tools",
      icon: FileText,
      color: "white",
      path: "/medical/research"
    },
    {
      title: "Clinical Workflow",
      description: "Streamlined clinical decision support",
      icon: Stethoscope,
      color: "white",
      path: "/medical/workflow"
    },
    {
      title: "Health Monitoring",
      description: "Real-time patient monitoring and alerts",
      icon: Activity,
      color: "white",
      path: "/medical/monitoring"
    }
  ]

  const recentStats = [
    { label: "Diagnoses Today", value: "24", change: "+12%" },
    { label: "Patients Seen", value: "18", change: "+8%" },
    { label: "AI Accuracy", value: "94.2%", change: "+2.1%" },
    { label: "Avg. Time Saved", value: "18min", change: "+5min" }
  ]

  return (
    <div className="min-h-screen bg-[#FFFFF4] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-instrument-serif font-bold text-[#151616] mb-2">
            Medical AI Command Center
          </h1>
          <p className="text-xl font-poppins text-[#151616]/70">
            AI-powered medical diagnosis system for clinicians
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {recentStats.map((stat, index) => (
            <Card key={stat.label} className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-poppins text-[#151616]/60 mb-1">{stat.label}</p>
                    <p className="text-2xl font-poppins font-bold text-[#151616]">{stat.value}</p>
                  </div>
                  <div className="text-xs font-poppins text-green-600 bg-green-100 px-2 py-1 rounded">
                    {stat.change}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Dashboard Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {dashboardOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card 
                  className={`border-2 border-[#151616] shadow-[8px_8px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#151616] transition-all duration-200 cursor-pointer h-full relative ${
                    option.isNew ? 'ring-4 ring-[#D6F32F]' : ''
                  }`}
                  onClick={() => router.push(option.path)}
                >
                  {option.isNew && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="bg-[#D6F32F] border-2 border-[#151616] rounded-full px-3 py-1">
                        <span className="text-xs font-poppins font-bold text-[#151616]">NEW</span>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-16 h-16 rounded-xl border-2 border-[#151616] flex items-center justify-center"
                        style={{ backgroundColor: option.color }}
                      >
                        <Icon
                          className="w-8 h-8"
                          style={{ color: option.color === "#D6F32F" ? "#151616" : "#151616" }}
                        />
                      </div>
                      {option.isNew && (
                        <div className="animate-pulse">
                          <Plus className="w-6 h-6 text-[#D6F32F]" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl font-poppins font-bold text-[#151616] mb-2">
                      {option.title}
                    </CardTitle>
                    <CardDescription className="text-[#151616]/70 font-poppins">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Button
                      className={`w-full border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium ${
                        option.color === "#D6F32F" 
                          ? "bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616]"
                          : "bg-white hover:bg-[#FFFFF4] text-[#151616]"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(option.path)
                      }}
                    >
                      {option.isNew ? "Start Diagnosis" : "Open"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}