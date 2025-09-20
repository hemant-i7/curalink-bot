import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export interface PaymentHistory {
  id: string
  patientId: string
  appointmentId: string
  doctorName: string
  amount: number
  paymentId: string
  status: "success" | "failed" | "pending"
  createdAt: string
}

const mockPaymentHistory: PaymentHistory[] = [
  {
    id: "1",
    patientId: "patient123",
    appointmentId: "1",
    doctorName: "Dr. Sarah Chen",
    amount: 2500,
    paymentId: "pay_123456789",
    status: "success",
    createdAt: "2025-09-20T10:00:00Z"
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // For testing, use a default email if no session
    const userEmail = session?.user?.email || "test@example.com"

    const userPayments = mockPaymentHistory.filter(
      payment => payment.patientId === userEmail
    )

    return NextResponse.json({ 
      payments: userPayments,
      success: true 
    })
  } catch (error) {
    console.error("Failed to fetch payment history:", error)
    return NextResponse.json(
      { error: "Failed to fetch payment history", success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { appointmentId, doctorName, amount, paymentId, status } = body

    if (!appointmentId || !doctorName || !amount || !paymentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newPayment: PaymentHistory = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: session.user.email || "",
      appointmentId,
      doctorName,
      amount,
      paymentId,
      status: status || "success",
      createdAt: new Date().toISOString()
    }

    mockPaymentHistory.push(newPayment)

    return NextResponse.json({ payment: newPayment })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    )
  }
}
