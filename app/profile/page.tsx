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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { User, Heart, Shield, Edit3, Save, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [medicationsList, setMedicationsList] = useState<string[]>([])
  const [allergiesList, setAllergiesList] = useState<string[]>([])
  const [surgeriesList, setSurgeriesList] = useState<string[]>([])
  const [userInfo, setUserInfo] = useState<{
    personalInfo?: {
      age?: number;
      gender?: string;
      location?: string;
      height?: number;
      weight?: number;
      bloodGroup?: string;
      occupation?: string;
    };
    medicalHistory?: {
      conditions?: string[];
      medications?: string[];
      allergies?: string[];
      familyHistory?: string[];
      surgeries?: string[];
    };
  } | null>(null)

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
  }, [status, router])

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/info')
          const data = await response.json()
          
          if (data.personalInfo && data.medicalHistory) {
            setUserInfo(data)
            
            // Populate form with existing data
            form.reset({
              age: data.personalInfo.age?.toString() || "",
              gender: data.personalInfo.gender || "",
              location: data.personalInfo.location || "",
              height: data.personalInfo.height?.toString() || "",
              weight: data.personalInfo.weight?.toString() || "",
              bloodGroup: data.personalInfo.bloodGroup || "",
              occupation: data.personalInfo.occupation || "",
              medicalConditions: data.medicalHistory.conditions || [],
              medications: data.medicalHistory.medications || [],
              allergies: data.medicalHistory.allergies || [],
              familyHistory: data.medicalHistory.familyHistory || [],
              surgeries: data.medicalHistory.surgeries || [],
            })

            // Set lists for dynamic fields
            setMedicationsList(data.medicalHistory.medications || [])
            setAllergiesList(data.medicalHistory.allergies || [])
            setSurgeriesList(data.medicalHistory.surgeries || [])
          }
        } catch (error) {
          console.error('Error fetching user info:', error)
        }
      }
    }

    if (status === "authenticated") {
      fetchUserInfo()
    }
  }, [status, session, form])

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
        setIsEditing(false)
        // Refresh user info
        const updatedResponse = await fetch('/api/user/info')
        const updatedData = await updatedResponse.json()
        setUserInfo(updatedData)
      } else {
        console.error('Failed to update user info')
      }
    } catch (error) {
      console.error('Error updating user info:', error)
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
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-instrument-serif font-bold text-[#151616] mb-2">
            Profile Settings
          </h1>
          <p className="text-[#151616]/70 font-poppins">
            Manage your personal and medical information
          </p>
        </div>
        
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#D6F32F] text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEditing(false)}
              className="bg-white text-[#151616] border-2 border-[#151616] shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-[#151616]">
                <AvatarImage
                  src={session.user?.image || ""}
                  alt={session.user?.name || "User"}
                />
                <AvatarFallback className="bg-[#D6F32F] text-[#151616] font-bold text-xl">
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-instrument-serif font-bold text-[#151616] mb-1">
                  {session.user?.name}
                </h2>
                <p className="text-[#151616]/70 font-poppins text-sm mb-1">
                  {session.user?.email}
                </p>
                <div className="flex items-center gap-2">
                  <Shield className="w-3 h-3 text-[#D6F32F]" />
                  <span className="text-xs font-poppins text-[#151616]/80">
                    Medical Professional
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
          <CardHeader>
            <CardTitle className="font-instrument-serif font-bold text-[#151616] flex items-center gap-2">
              <User className="w-6 h-6" />
              Profile Information
            </CardTitle>
            <CardDescription className="font-poppins">
              {isEditing ? "Edit your personal and medical information" : "View your personal and medical information"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!userInfo ? (
              <div className="text-center py-8">
                <p className="text-[#151616]/70 font-poppins">Loading profile information...</p>
              </div>
            ) : isEditing ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Personal Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border-2 border-[#151616] flex items-center justify-center">
                        <User className="w-4 h-4 text-[#151616]" />
                      </div>
                      <h3 className="text-xl font-poppins font-bold text-[#151616]">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white/95 backdrop-blur-0">
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
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white/95 backdrop-blur-0">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="space-y-4">
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
                          <FormLabel>Medical Conditions</FormLabel>
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
                          <FormLabel>Family History</FormLabel>
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
                          <Save className="w-5 h-5" />
                          <span>Save Changes</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            ) : (
              /* View Mode */
              <div className="space-y-8">
                {/* Personal Information Display */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border-2 border-[#151616] flex items-center justify-center">
                      <User className="w-4 h-4 text-[#151616]" />
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-[#151616]">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70">Age</label>
                      <p className="text-lg font-poppins font-semibold text-[#151616]">
                        {userInfo.personalInfo?.age || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70">Gender</label>
                      <p className="text-lg font-poppins font-semibold text-[#151616] capitalize">
                        {userInfo.personalInfo?.gender || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70">Blood Group</label>
                      <p className="text-lg font-poppins font-semibold text-[#151616]">
                        {userInfo.personalInfo?.bloodGroup || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70">Location</label>
                      <p className="text-lg font-poppins font-semibold text-[#151616]">
                        {userInfo.personalInfo?.location || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70">Occupation</label>
                      <p className="text-lg font-poppins font-semibold text-[#151616]">
                        {userInfo.personalInfo?.occupation || "Not provided"}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70">Height & Weight</label>
                      <p className="text-lg font-poppins font-semibold text-[#151616]">
                        {userInfo.personalInfo?.height ? `${userInfo.personalInfo.height} cm` : "Not provided"} 
                        {userInfo.personalInfo?.height && userInfo.personalInfo?.weight && " / "}
                        {userInfo.personalInfo?.weight ? `${userInfo.personalInfo.weight} kg` : userInfo.personalInfo?.height ? "" : ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medical History Display */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border-2 border-[#151616] flex items-center justify-center">
                      <Heart className="w-4 h-4 text-[#151616]" />
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-[#151616]">Medical History</h3>
                  </div>

                  {/* Medical Conditions */}
                  {userInfo.medicalHistory?.conditions && userInfo.medicalHistory.conditions.length > 0 && (
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70 mb-3 block">Medical Conditions</label>
                      <div className="flex flex-wrap gap-2">
                        {userInfo.medicalHistory.conditions.map((condition: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border-2 border-[#151616] rounded-xl text-sm font-poppins text-[#151616]"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medications */}
                  {userInfo.medicalHistory?.medications && userInfo.medicalHistory.medications.length > 0 && (
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70 mb-3 block">Current Medications</label>
                      <div className="flex flex-wrap gap-2">
                        {userInfo.medicalHistory.medications.map((medication: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border-2 border-[#151616] rounded-xl text-sm font-poppins text-[#151616]"
                          >
                            {medication}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {userInfo.medicalHistory?.allergies && userInfo.medicalHistory.allergies.length > 0 && (
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70 mb-3 block">Allergies</label>
                      <div className="flex flex-wrap gap-2">
                        {userInfo.medicalHistory.allergies.map((allergy: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border-2 border-[#151616] rounded-xl text-sm font-poppins text-[#151616]"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Family History */}
                  {userInfo.medicalHistory?.familyHistory && userInfo.medicalHistory.familyHistory.length > 0 && (
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70 mb-3 block">Family History</label>
                      <div className="flex flex-wrap gap-2">
                        {userInfo.medicalHistory.familyHistory.map((condition: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border-2 border-[#151616] rounded-xl text-sm font-poppins text-[#151616]"
                          >
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Surgeries */}
                  {userInfo.medicalHistory?.surgeries && userInfo.medicalHistory.surgeries.length > 0 && (
                    <div className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                      <label className="text-sm font-poppins font-medium text-[#151616]/70 mb-3 block">Past Surgeries / Hospitalizations</label>
                      <div className="flex flex-wrap gap-2">
                        {userInfo.medicalHistory.surgeries.map((surgery: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white border-2 border-[#151616] rounded-xl text-sm font-poppins text-[#151616]"
                          >
                            {surgery}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state for medical history */}
                  {(!userInfo.medicalHistory?.conditions || userInfo.medicalHistory.conditions.length === 0) &&
                   (!userInfo.medicalHistory?.medications || userInfo.medicalHistory.medications.length === 0) &&
                   (!userInfo.medicalHistory?.allergies || userInfo.medicalHistory.allergies.length === 0) &&
                   (!userInfo.medicalHistory?.familyHistory || userInfo.medicalHistory.familyHistory.length === 0) &&
                   (!userInfo.medicalHistory?.surgeries || userInfo.medicalHistory.surgeries.length === 0) && (
                    <div className="text-center py-8 text-[#151616]/70">
                      <p className="font-poppins">No medical history information provided yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}