"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Stethoscope, Users, ArrowLeft } from "lucide-react"

export default function Login() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession()
            if (session) {
                // Check if user has completed their info
                try {
                    const response = await fetch('/api/user/info')
                    const data = await response.json()
                    if (data.hasCompletedInfo) {
                        router.push('/dashboard')
                    } else {
                        router.push('/faiz/info')
                    }
                } catch (error) {
                    console.error('Error checking user info:', error)
                    router.push('/faiz/info')
                }
            }
        }
        checkSession()
    }, [router])

    const handleGoogleSignIn = async () => {
        setLoading(true)
        try {
            await signIn('google', {
                callbackUrl: '/dashboard',
            })
        } catch (error) {
            console.error('Login error:', error)
            setLoading(false)
        }
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


            {/* Back to Home */}
            <div className="absolute top-6 left-6 z-50">
                <Button
                    onClick={() => {
                        console.log('Button clicked!');
                        window.location.href = '/';
                    }}
                    type="button"
                    className="bg-white text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] active:translate-y-2 active:shadow-[1px_1px_0px_0px_#151616] transition-all duration-200 font-poppins font-medium hover:bg-[#FFFFF4] cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>
            </div>

            {/* Main Content */}
            <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Card className="w-full border-2 border-[#151616] shadow-[8px_8px_0px_0px_#151616] bg-white">
                        <CardHeader className="space-y-4 text-center pb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className="mx-auto w-16 h-16 bg-[#D6F32F] rounded-xl border-2 border-[#151616] flex items-center justify-center"
                            >
                                <Brain className="w-8 h-8 text-[#151616]" />
                            </motion.div>
                            <div>
                                <CardTitle className="text-3xl font-instrument-serif font-bold text-[#151616] mb-2">
                                    Welcome to CuraLink
                                </CardTitle>
                                <CardDescription className="text-[#151616]/70 font-poppins text-lg">
                                    Join the future of AI-powered medical diagnosis
                                </CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {/* Features Preview */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                                    <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border border-[#151616] flex items-center justify-center">
                                        <Brain className="w-4 h-4 text-[#151616]" />
                                    </div>
                                    <span className="text-sm font-poppins text-[#151616]">AI Agent Team for Smart Diagnosis</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                                    <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border border-[#151616] flex items-center justify-center">
                                        <Stethoscope className="w-4 h-4 text-[#151616]" />
                                    </div>
                                    <span className="text-sm font-poppins text-[#151616]">Evidence-Based Medical Insights</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                                    <div className="w-8 h-8 bg-[#D6F32F] rounded-lg border border-[#151616] flex items-center justify-center">
                                        <Users className="w-4 h-4 text-[#151616]" />
                                    </div>
                                    <span className="text-sm font-poppins text-[#151616]">Collaborative Healthcare Platform</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="w-full bg-[#D6F32F] hover:bg-[#D6F32F]/90 text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] transition-all duration-200 font-poppins font-bold text-lg py-6"
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-5 h-5 border-2 border-[#151616]/30 border-t-[#151616] rounded-full animate-spin"></div>
                                        <span>Connecting...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <span>Continue with Google</span>
                                    </div>
                                )}
                            </Button>

                            <p className="text-center text-sm text-[#151616]/60 font-poppins">
                                By continuing, you agree to our{" "}
                                <a href="#" className="text-[#151616] hover:text-[#D6F32F] font-medium">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-[#151616] hover:text-[#D6F32F] font-medium">
                                    Privacy Policy
                                </a>
                            </p>
                        </CardContent>
                    </Card>

                </motion.div>
            </div>
        </div>
    )
}
