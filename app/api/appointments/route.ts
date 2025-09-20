import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  doctorName: string
  specialization: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  consultationFee: number
  paymentId?: string
  createdAt: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "patient123",
    doctorId: "1",
    doctorName: "Dr. Sarah Chen",
    specialization: "Cardiologist",
    date: "2025-09-25",
    time: "10:00",
    status: "scheduled",
    consultationFee: 2500,
    paymentId: "pay_123456789",
    createdAt: "2025-09-20T10:00:00Z"
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // For now, return mock appointments without strict auth for testing
    // In production, you would enforce authentication
    const userEmail = session?.user?.email || "test@example.com"
    
    const userAppointments = mockAppointments.filter(
      apt => apt.patientId === userEmail
    )

    return NextResponse.json({ 
      appointments: userAppointments,
      success: true 
    })
  } catch (error) {
    console.error("Failed to fetch appointments:", error)
    return NextResponse.json(
      { error: "Failed to fetch appointments", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // For testing, use a default email if no session
    const userEmail = session?.user?.email || "test@example.com"

    const body = await request.json()
    const { doctorId, doctorName, specialization, date, time, consultationFee, paymentId } = body

    if (!doctorId || !doctorName || !date || !time || !consultationFee) {
      return NextResponse.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      )
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: userEmail,
      doctorId,
      doctorName,
      specialization,
      date,
      time,
      status: "scheduled",
      consultationFee,
      paymentId,
      createdAt: new Date().toISOString()
    }

    mockAppointments.push(newAppointment)
    console.log("New appointment created:", newAppointment)

    return NextResponse.json({ 
      appointment: newAppointment,
      success: true 
    })
  } catch (error) {
    console.error("Failed to create appointment:", error)
    return NextResponse.json(
      { error: "Failed to create appointment", success: false },
      { status: 500 }
    )
  }
}
