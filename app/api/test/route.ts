import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    message: "API is working correctly",
    timestamp: new Date().toISOString(),
    razorpayConfigured: !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  })
}
