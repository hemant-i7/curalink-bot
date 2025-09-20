"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, ArrowRight, ArrowLeft } from "lucide-react"

export default function UserInfoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    location: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFFF4]">
        <div className="w-8 h-8 border-4 border-[#151616]/30 border-t-[#151616] rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        window.location.href = '/patient/dashboard'
      } else {
        console.error('Failed to save user info')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error saving user info:', error)
      setLoading(false)
    }
  }

  const handleSkip = () => {
    // Skip profile completion and go to dashboard
    window.location.href = '/patient/dashboard'
  }

  return (
    <div className="min-h-screen bg-[#FFFFF4] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(#151616 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: "0.05",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-2 border-[#151616] shadow-[8px_8px_0px_0px_#151616] bg-white">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="mx-auto w-16 h-16 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center mb-4"
              >
                <User className="w-8 h-8 text-[#151616]" />
              </motion.div>
              <CardTitle className="text-2xl font-instrument-serif font-bold text-[#151616] mb-2">
                Quick Setup
              </CardTitle>
              <CardDescription className="text-[#151616]/70 font-poppins">
                Just a few details to get started (optional)
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    placeholder="e.g. 25"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Mumbai, India"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 font-poppins font-bold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#151616]/30 border-t-[#151616] rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Save & Continue
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                <Button
                  onClick={handleSkip}
                  className="w-full bg-white text-[#151616] border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616] transition-all duration-200 font-poppins"
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}