"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { User, Heart, MapPin, Briefcase, Shield, ArrowLeft } from "lucide-react"

const userInfoSchema = z.object({
  age: z.string().min(1, "Age is required"),
  gender: z.string().min(1, "Gender is required"),
  location: z.string().min(1, "Location is required"),
  height: z.string().optional(),
  weight: z.string().optional(),
  bloodGroup: z.string().optional(),
  occupation: z.string().optional(),
  medicalConditions: z.array(z.string()).default([]),
  medications: z.array(z.string()).default([]),
  allergies: z.array(z.string()).default([]),
  familyHistory: z.array(z.string()).default([]),
  surgeries: z.array(z.string()).default([]),
})

type UserInfoForm = z.infer<typeof userInfoSchema>

const medicalConditionsList = [
  "Diabetes",
  "Hypertension", 
  "Asthma",
  "Heart Disease",
  "Arthritis",
  "Cancer",
  "Depression",
  "Anxiety",
  "Allergies",
  "Kidney Disease",
  "Liver Disease",
  "Thyroid Disorder"
]

const familyHistoryConditions = [
  "Heart Disease",
  "Cancer",
  "Diabetes", 
  "Hypertension",
  "Stroke",
  "Kidney Disease",
  "Mental Health Issues",
  "Genetic Disorders",
  "Arthritis",
  "Osteoporosis"
]

export default function UserInfoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [medicationsList, setMedicationsList] = useState<string[]>([])
  const [allergiesList, setAllergiesList] = useState<string[]>([])
  const [surgeriesList, setSurgeriesList] = useState<string[]>([])

  const form = useForm<UserInfoForm>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      age: "",
      gender: "",
      location: "",
      height: "",
      weight: "",
      bloodGroup: "",
      occupation: "",
      medicalConditions: [],
      medications: [],
      allergies: [],
      familyHistory: [],
      surgeries: [],
    },
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
    
    // Check if user has already completed info
    const checkUserInfo = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/info')
          const data = await response.json()
          if (data.hasCompletedInfo) {
            router.push('/dashboard')
          }
        } catch (error) {
          console.error('Error checking user info:', error)
        }
      }
    }
    
    if (status === "authenticated") {
      checkUserInfo()
    }
  }, [status, session, router])

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

  const onSubmit = async (data: UserInfoForm) => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Failed to save user info')
      }
    } catch (error) {
      console.error('Error saving user info:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToList = (value: string, list: string[], setList: (list: string[]) => void, fieldName: keyof UserInfoForm) => {
    if (value.trim() && !list.includes(value.trim())) {
      const newList = [...list, value.trim()]
      setList(newList)
      form.setValue(fieldName, newList)
    }
  }

  const removeFromList = (index: number, list: string[], setList: (list: string[]) => void, fieldName: keyof UserInfoForm) => {
    const newList = list.filter((_, i) => i !== index)
    setList(newList)
    form.setValue(fieldName, newList)
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

      {/* Back to Login */}
      <div className="absolute top-6 left-6 z-50">
        <Button
          onClick={() => router.push('/login')}
          type="button"
          className="bg-white text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium hover:bg-[#FFFFF4]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
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
              <CardTitle className="text-3xl font-instrument-serif font-bold text-[#151616] mb-2">
                Complete Your Profile
              </CardTitle>
              <CardDescription className="text-[#151616]/70 font-poppins text-lg">
                Help us provide better medical insights by sharing your health information
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Personal Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border-2 border-[#151616] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#151616]" />
                      </div>
                      <h3 className="text-xl font-poppins font-bold text-[#151616]">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 25" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Group</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                                  <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Mumbai, India" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="occupation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Occupation</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 170" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 65" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Medical History Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border-2 border-[#151616] flex items-center justify-center">
                        <Heart className="w-4 h-4 text-[#151616]" />
                      </div>
                      <h3 className="text-xl font-poppins font-bold text-[#151616]">Medical History</h3>
                    </div>

                    {/* Medical Conditions */}
                    <FormField
                      control={form.control}
                      name="medicalConditions"
                      render={() => (
                        <FormItem>
                          <FormLabel>Do you have any of these medical conditions?</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {medicalConditionsList.map((condition) => (
                              <FormField
                                key={condition}
                                control={form.control}
                                name="medicalConditions"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={condition}
                                      className="flex flex-row items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(condition)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, condition])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== condition
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {condition}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Current Medications */}
                    <div className="space-y-3">
                      <Label>Current Medications</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter medication name"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              addToList(target.value, medicationsList, setMedicationsList, 'medications')
                              target.value = ''
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addToList(input.value, medicationsList, setMedicationsList, 'medications')
                            input.value = ''
                          }}
                          className="bg-[#D6F32F] text-[#151616] border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {medicationsList.map((med, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#FFFFF4] border-2 border-[#151616] rounded-xl text-sm flex items-center gap-2"
                          >
                            {med}
                            <button
                              type="button"
                              onClick={() => removeFromList(index, medicationsList, setMedicationsList, 'medications')}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="space-y-3">
                      <Label>Allergies</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter allergy"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              addToList(target.value, allergiesList, setAllergiesList, 'allergies')
                              target.value = ''
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addToList(input.value, allergiesList, setAllergiesList, 'allergies')
                            input.value = ''
                          }}
                          className="bg-[#D6F32F] text-[#151616] border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {allergiesList.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#FFFFF4] border-2 border-[#151616] rounded-xl text-sm flex items-center gap-2"
                          >
                            {allergy}
                            <button
                              type="button"
                              onClick={() => removeFromList(index, allergiesList, setAllergiesList, 'allergies')}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Family History */}
                    <FormField
                      control={form.control}
                      name="familyHistory"
                      render={() => (
                        <FormItem>
                          <FormLabel>Family History (Select conditions that run in your family)</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {familyHistoryConditions.map((condition) => (
                              <FormField
                                key={condition}
                                control={form.control}
                                name="familyHistory"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={condition}
                                      className="flex flex-row items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(condition)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, condition])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== condition
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal">
                                        {condition}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Past Surgeries */}
                    <div className="space-y-3">
                      <Label>Past Surgeries / Hospitalizations</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter surgery/hospitalization"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              const target = e.target as HTMLInputElement
                              addToList(target.value, surgeriesList, setSurgeriesList, 'surgeries')
                              target.value = ''
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addToList(input.value, surgeriesList, setSurgeriesList, 'surgeries')
                            input.value = ''
                          }}
                          className="bg-[#D6F32F] text-[#151616] border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616]"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {surgeriesList.map((surgery, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#FFFFF4] border-2 border-[#151616] rounded-xl text-sm flex items-center gap-2"
                          >
                            {surgery}
                            <button
                              type="button"
                              onClick={() => removeFromList(index, surgeriesList, setSurgeriesList, 'surgeries')}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 font-poppins font-bold text-lg py-6 px-12"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-[#151616]/30 border-t-[#151616] rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5" />
                          <span>Complete Profile & Continue</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}