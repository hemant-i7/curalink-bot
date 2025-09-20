"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Activity, Calendar, FileText, TrendingUp, MessageCircle, Stethoscope, Pill, AlertTriangle, Clock } from "lucide-react"

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.email) {
      // Check if user has completed their info
      const checkUserInfo = async () => {
        try {
          const response = await fetch('/api/user/info')
          const data = await response.json()
          if (!data.hasCompletedInfo && data.role === 'patient') {
            router.push('/faiz/info')
          } else if (data.role === 'clinician') {
            router.push('/medical/dashboard')
          }
        } catch (error) {
          console.error('Error checking user info:', error)
        }
      }
      checkUserInfo()
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#151616]/30 border-t-[#151616] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const healthStats = [
    {
      title: "Health Score",
      value: "85/100",
      change: "+5%",
      icon: Heart,
      color: "#D6F32F",
      description: "Based on your recent activities"
    },
    {
      title: "Symptoms Checked",
      value: "12",
      change: "+3",
      icon: Activity,
      color: "#151616",
      description: "This month"
    },
    {
      title: "Upcoming Appointments",
      value: "2",
      change: "Next: Tomorrow",
      icon: Calendar,
      color: "#D6F32F",
      description: "Scheduled consultations"
    },
    {
      title: "Health Reports",
      value: "8",
      change: "+2 new",
      icon: FileText,
      color: "#151616",
      description: "Lab results & diagnostics"
    }
  ]

  const recentActivities = [
    {
      type: "symptom_check",
      title: "Symptom Check Completed",
      description: "Headache and fatigue - Low risk detected",
      time: "2 hours ago",
      icon: Activity,
      status: "completed"
    },
    {
      type: "appointment",
      title: "Appointment Scheduled",
      description: "Dr. Sarah Wilson - General Checkup",
      time: "1 day ago",
      icon: Calendar,
      status: "scheduled"
    },
    {
      type: "report",
      title: "Lab Report Available",
      description: "Blood Test Results - All normal",
      time: "3 days ago",
      icon: FileText,
      status: "available"
    },
    {
      type: "medication",
      title: "Medication Reminder",
      description: "Time to take your evening medication",
      time: "5 hours ago",
      icon: Pill,
      status: "reminder"
    }
  ]

  const quickActions = [
    {
      title: "Check Symptoms",
      description: "AI-powered analysis",
      icon: Activity,
      color: "#D6F32F",
      href: "/patient/symptoms"
    },
    {
      title: "Schedule Appointment",
      description: "Book with providers",
      icon: Calendar,
      color: "white",
      href: "/patient/appointments"
    },
    {
      title: "Health Records",
      description: "View medical history",
      icon: FileText,
      color: "white",
      href: "/patient/records"
    },
    {
      title: "Health Chat",
      description: "AI health assistant",
      icon: MessageCircle,
      color: "white",
      href: "/patient/chat"
    }
  ]

  const upcomingAppointments = [
    {
      doctor: "Dr. Sarah Wilson",
      specialty: "General Physician",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "In-person"
    },
    {
      doctor: "Dr. Michael Chen",
      specialty: "Cardiologist",
      date: "Dec 28",
      time: "2:00 PM",
      type: "Video Call"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-instrument-serif font-bold text-[#151616] mb-2">
          Welcome back, {session.user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-[#151616]/70 font-poppins">
          Your personal health dashboard - track your wellness journey with AI-powered insights.
        </p>
      </motion.div>

      {/* Health Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {healthStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl border-2 border-[#151616] flex items-center justify-center"
                      style={{ backgroundColor: stat.color === "#D6F32F" ? "#D6F32F" : "white" }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: stat.color === "#D6F32F" ? "#151616" : "#151616" }}
                      />
                    </div>
                    <Badge variant="neutral" className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-poppins font-bold text-[#151616]">
                      {stat.value}
                    </p>
                    <p className="text-sm font-poppins font-medium text-[#151616]">
                      {stat.title}
                    </p>
                    <p className="text-xs font-poppins text-[#151616]/60">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616]">
                Quick Actions
              </CardTitle>
              <CardDescription className="font-poppins">
                Common health management tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.title}
                      onClick={() => router.push(action.href)}
                      className={`w-full justify-start gap-3 p-3 h-auto rounded-lg border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium ${
                        action.color === "#D6F32F" 
                          ? "bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616]"
                          : "bg-white hover:bg-[#FFFFF4] text-[#151616]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg border-2 border-[#151616] flex items-center justify-center flex-shrink-0 ${
                        action.color === "#D6F32F" ? "bg-white" : "bg-[#D6F32F]"
                      }`}>
                        <Icon className="w-4 h-4 text-[#151616]" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{action.title}</div>
                        <div className="text-xs opacity-70">{action.description}</div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activities
              </CardTitle>
              <CardDescription className="font-poppins">
                Your health journey timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => {
                  const Icon = activity.icon
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <div className="w-8 h-8 bg-white rounded-lg border-2 border-[#151616] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-[#151616]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-poppins font-medium text-[#151616] text-sm">
                          {activity.title}
                        </p>
                        <p className="text-xs font-poppins text-[#151616]/70 mb-1">
                          {activity.description}
                        </p>
                        <p className="text-xs font-poppins text-[#151616]/60">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
            <CardHeader>
              <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription className="font-poppins">
                Your scheduled consultations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-[#151616]" />
                      </div>
                      <div>
                        <p className="font-poppins font-medium text-[#151616] text-sm">
                          {appointment.doctor}
                        </p>
                        <p className="text-xs font-poppins text-[#151616]/70">
                          {appointment.specialty}
                        </p>
                        <Badge variant="neutral" className="text-xs mt-1">
                          {appointment.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-poppins font-medium text-[#151616]">
                        {appointment.date}
                      </p>
                      <p className="text-xs font-poppins text-[#151616]/60">
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-white hover:bg-[#FFFFF4] text-[#151616] border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium">
                Schedule New Appointment
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Health Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
          <CardHeader>
            <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Health Insights
            </CardTitle>
            <CardDescription className="font-poppins">
              Personalized recommendations based on your health data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-4 h-4 text-green-600" />
                  <h3 className="font-poppins font-bold text-green-800">Great Progress!</h3>
                </div>
                <p className="text-sm font-poppins text-green-700">
                  Your health metrics show consistent improvement over the past month.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <h3 className="font-poppins font-bold text-yellow-800">Reminder</h3>
                </div>
                <p className="text-sm font-poppins text-yellow-700">
                  Schedule your annual checkup - it's been 11 months since your last visit.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <h3 className="font-poppins font-bold text-blue-800">Stay Active</h3>
                </div>
                <p className="text-sm font-poppins text-blue-700">
                  Consider adding 15 minutes of daily exercise to boost your health score.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
