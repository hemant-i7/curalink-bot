"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Camera, Upload, Send, Apple, TrendingUp, ShoppingCart, Utensils, Target, Heart, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NutritionAnalysis {
    foodItems: {
        name: string
        quantity: string
        calories: number
        nutrients: {
            protein: string
            carbs: string
            fat: string
            fiber: string
            sugar: string
            sodium: string
        }
    }[]
    totalCalories: number
    nutritionalBreakdown: {
        protein: { amount: string, percentage: number }
        carbs: { amount: string, percentage: number }
        fat: { amount: string, percentage: number }
        fiber: string
        vitamins: string[]
        minerals: string[]
    }
    healthScore: number
    mealType: "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Mixed"
    healthAssessment: {
        pros: string[]
        cons: string[]
        improvements: string[]
    }
    personalizedRecommendations: {
        forWeightLoss: string[]
        forMuscleGain: string[]
        forDiabetes: string[]
        forHeartHealth: string[]
        general: string[]
    }
    alternativeOptions: {
        healthier: string[]
        lowerCalorie: string[]
        higherProtein: string[]
    }
    groceryList: {
        category: string
        items: string[]
    }[]
    mealPlanSuggestions: {
        breakfast: string[]
        lunch: string[]
        dinner: string[]
        snacks: string[]
    }
    nutritionalDeficiencies: string[]
    confidence: number
}

export default function NutritionAIPage() {
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [userInfo, setUserInfo] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            if (file.type.startsWith('image/')) {
                setImage(file)
                const reader = new FileReader()
                reader.onload = (e) => {
                    setImagePreview(e.target?.result as string)
                }
                reader.readAsDataURL(file)
                setError(null)
            } else {
                setError("Please upload a valid image file")
            }
        }
    }

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64String = (reader.result as string).split(',')[1]
                resolve(base64String)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    const analyzeNutrition = async () => {
        if (!image) {
            setError("Please upload a food image")
            return
        }

        setIsAnalyzing(true)
        setError(null)

        try {
            const base64Image = await convertImageToBase64(image)

            const response = await fetch('/api/analyze-nutrition', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image,
                    userInfo: userInfo.trim()
                })
            })

            if (!response.ok) {
                throw new Error('Failed to analyze nutrition')
            }

            const result = await response.json()
            setAnalysis(result)
        } catch (error) {
            console.error('Error analyzing nutrition:', error)
            setError('Failed to analyze nutrition. Please try again.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const getHealthScoreColor = (score: number) => {
        if (score >= 80) return "bg-green-500 text-white"
        if (score >= 60) return "bg-yellow-500 text-[#151616]"
        return "bg-red-500 text-white"
    }

    const getHealthScoreLabel = (score: number) => {
        if (score >= 80) return "Excellent"
        if (score >= 60) return "Good"
        if (score >= 40) return "Fair"
        return "Needs Improvement"
    }

    return (
        <div className="min-h-screen bg-[#FFFFF4] p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-instrument-serif font-bold text-[#151616] mb-4">
                        AI Nutrition & Diet Advisor
                    </h1>
                    <p className="text-xl text-[#151616]/70 font-poppins max-w-3xl mx-auto">
                        Analyze any food photo to get detailed nutritional information, personalized recommendations, and meal planning suggestions
                    </p>
                </motion.div>

                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                        <CardHeader>
                            <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                <Camera className="w-5 h-5" />
                                Upload Food Photo
                            </CardTitle>
                            <CardDescription className="font-poppins">
                                Take a photo of your meal, snack, or any food item for comprehensive nutritional analysis
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Image Upload */}
                            <div className="border-2 border-dashed border-[#151616] rounded-xl p-8 text-center">
                                {imagePreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={imagePreview}
                                            alt="Food preview"
                                            className="max-h-64 mx-auto rounded-xl border-2 border-[#151616]"
                                        />
                                        <Button
                                            onClick={() => {
                                                setImage(null)
                                                setImagePreview(null)
                                            }}
                                            variant="outline"
                                            className="border-2 border-[#151616] hover:bg-[#151616] hover:text-white"
                                        >
                                            Remove Image
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <Upload className="w-16 h-16 mx-auto text-[#151616]/50" />
                                        <div>
                                            <p className="text-lg font-poppins font-medium text-[#151616] mb-2">
                                                Upload Food Photo
                                            </p>
                                            <p className="text-sm font-poppins text-[#151616]/70 mb-4">
                                                PNG, JPG up to 10MB
                                            </p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="food-upload"
                                            />
                                            <label htmlFor="food-upload">
                                                <Button
                                                    asChild
                                                    className="bg-[#D6F32F] text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] font-poppins font-bold"
                                                >
                                                    <span className="cursor-pointer">
                                                        Choose Food Photo
                                                    </span>
                                                </Button>
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Information */}
                            <div className="space-y-2">
                                <label className="text-sm font-poppins font-medium text-[#151616]">
                                    Personal Information (Optional)
                                </label>
                                <Textarea
                                    placeholder="Enter your age, weight, height, activity level, dietary preferences, health goals (weight loss, muscle gain, etc.), medical conditions..."
                                    value={userInfo}
                                    onChange={(e) => setUserInfo(e.target.value)}
                                    className="border-2 border-[#151616] rounded-xl font-poppins"
                                    rows={3}
                                />
                            </div>

                            {/* Error Display */}
                            {error && (
                                <Alert className="border-2 border-red-500 bg-red-50">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription className="font-poppins">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Analyze Button */}
                            <Button
                                onClick={analyzeNutrition}
                                disabled={!image || isAnalyzing}
                                className="w-full bg-[#D6F32F] text-[#151616] border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#151616] disabled:opacity-50 disabled:cursor-not-allowed font-poppins font-bold text-lg py-6"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-[#151616] border-t-transparent rounded-full mr-2"
                                        />
                                        Analyzing Nutrition...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Analyze Nutrition
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Analysis Results */}
                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        {/* Health Score & Summary */}
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Nutrition Analysis - {analysis.mealType}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Badge className={`font-poppins ${getHealthScoreColor(analysis.healthScore)}`}>
                                        {getHealthScoreLabel(analysis.healthScore)} ({analysis.healthScore}/100)
                                    </Badge>
                                    <Badge className="bg-[#D6F32F] text-[#151616] font-poppins">
                                        {analysis.totalCalories} Calories
                                    </Badge>
                                    <Badge className="bg-[#151616] text-white font-poppins">
                                        {analysis.confidence}% Confidence
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                        <h5 className="font-poppins font-bold text-green-800 mb-2">Protein</h5>
                                        <p className="text-lg font-poppins font-bold text-green-800">
                                            {analysis.nutritionalBreakdown.protein.amount}
                                        </p>
                                        <p className="text-sm font-poppins text-green-600">
                                            {analysis.nutritionalBreakdown.protein.percentage}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                        <h5 className="font-poppins font-bold text-yellow-800 mb-2">Carbs</h5>
                                        <p className="text-lg font-poppins font-bold text-yellow-800">
                                            {analysis.nutritionalBreakdown.carbs.amount}
                                        </p>
                                        <p className="text-sm font-poppins text-yellow-600">
                                            {analysis.nutritionalBreakdown.carbs.percentage}%
                                        </p>
                                    </div>
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                                        <h5 className="font-poppins font-bold text-orange-800 mb-2">Fat</h5>
                                        <p className="text-lg font-poppins font-bold text-orange-800">
                                            {analysis.nutritionalBreakdown.fat.amount}
                                        </p>
                                        <p className="text-sm font-poppins text-orange-600">
                                            {analysis.nutritionalBreakdown.fat.percentage}%
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Food Items Breakdown */}
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                    <Utensils className="w-5 h-5" />
                                    Food Items Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analysis.foodItems.map((item, idx) => (
                                        <div key={idx} className="p-4 bg-[#FFFFF4] rounded-xl border border-[#151616]/20">
                                            <div className="flex justify-between items-start mb-3">
                                                <h5 className="font-poppins font-semibold text-[#151616]">
                                                    {item.name}
                                                </h5>
                                                <div className="text-right">
                                                    <p className="font-poppins font-bold text-[#151616]">{item.calories} cal</p>
                                                    <p className="text-sm font-poppins text-[#151616]/70">{item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                                                <div>
                                                    <p className="font-poppins font-medium text-[#151616]/60">Protein</p>
                                                    <p className="font-poppins text-[#151616]">{item.nutrients.protein}</p>
                                                </div>
                                                <div>
                                                    <p className="font-poppins font-medium text-[#151616]/60">Carbs</p>
                                                    <p className="font-poppins text-[#151616]">{item.nutrients.carbs}</p>
                                                </div>
                                                <div>
                                                    <p className="font-poppins font-medium text-[#151616]/60">Fat</p>
                                                    <p className="font-poppins text-[#151616]">{item.nutrients.fat}</p>
                                                </div>
                                                <div>
                                                    <p className="font-poppins font-medium text-[#151616]/60">Fiber</p>
                                                    <p className="font-poppins text-[#151616]">{item.nutrients.fiber}</p>
                                                </div>
                                                <div>
                                                    <p className="font-poppins font-medium text-[#151616]/60">Sugar</p>
                                                    <p className="font-poppins text-[#151616]">{item.nutrients.sugar}</p>
                                                </div>
                                                <div>
                                                    <p className="font-poppins font-medium text-[#151616]/60">Sodium</p>
                                                    <p className="font-poppins text-[#151616]">{item.nutrients.sodium}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Health Assessment */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Pros */}
                            <Card className="border-2 border-green-500 shadow-[4px_4px_0px_0px_green-500] bg-green-50">
                                <CardHeader>
                                    <CardTitle className="font-poppins font-bold text-green-700 flex items-center gap-2">
                                        <Heart className="w-5 h-5" />
                                        Health Benefits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {analysis.healthAssessment.pros.map((pro, idx) => (
                                            <div key={idx} className="p-2 bg-green-100 rounded border border-green-200">
                                                <p className="font-poppins text-green-800 text-sm">✅ {pro}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cons */}
                            <Card className="border-2 border-red-500 shadow-[4px_4px_0px_0px_red-500] bg-red-50">
                                <CardHeader>
                                    <CardTitle className="font-poppins font-bold text-red-700 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Areas of Concern
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {analysis.healthAssessment.cons.map((con, idx) => (
                                            <div key={idx} className="p-2 bg-red-100 rounded border border-red-200">
                                                <p className="font-poppins text-red-800 text-sm">⚠️ {con}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Improvements */}
                            <Card className="border-2 border-blue-500 shadow-[4px_4px_0px_0px_blue-500] bg-blue-50">
                                <CardHeader>
                                    <CardTitle className="font-poppins font-bold text-blue-700 flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5" />
                                        Improvements
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {analysis.healthAssessment.improvements.map((improvement, idx) => (
                                            <div key={idx} className="p-2 bg-blue-100 rounded border border-blue-200">
                                                <p className="font-poppins text-blue-800 text-sm">💡 {improvement}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Personalized Recommendations */}
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Personalized Recommendations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Weight Loss */}
                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">For Weight Loss:</h5>
                                        <div className="space-y-2">
                                            {analysis.personalizedRecommendations.forWeightLoss.map((rec, idx) => (
                                                <div key={idx} className="p-2 bg-purple-50 rounded border border-purple-200">
                                                    <p className="font-poppins text-purple-800 text-sm">🎯 {rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Muscle Gain */}
                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">For Muscle Gain:</h5>
                                        <div className="space-y-2">
                                            {analysis.personalizedRecommendations.forMuscleGain.map((rec, idx) => (
                                                <div key={idx} className="p-2 bg-orange-50 rounded border border-orange-200">
                                                    <p className="font-poppins text-orange-800 text-sm">💪 {rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Diabetes */}
                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">For Diabetes Management:</h5>
                                        <div className="space-y-2">
                                            {analysis.personalizedRecommendations.forDiabetes.map((rec, idx) => (
                                                <div key={idx} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                                                    <p className="font-poppins text-yellow-800 text-sm">🩺 {rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Heart Health */}
                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">For Heart Health:</h5>
                                        <div className="space-y-2">
                                            {analysis.personalizedRecommendations.forHeartHealth.map((rec, idx) => (
                                                <div key={idx} className="p-2 bg-red-50 rounded border border-red-200">
                                                    <p className="font-poppins text-red-800 text-sm">❤️ {rec}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Alternative Options */}
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                    <Apple className="w-5 h-5" />
                                    Healthier Alternatives
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Healthier Options:</h5>
                                        <div className="space-y-2">
                                            {analysis.alternativeOptions.healthier.map((alt, idx) => (
                                                <div key={idx} className="p-2 bg-green-50 rounded border border-green-200">
                                                    <p className="font-poppins text-green-800 text-sm">🌱 {alt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Lower Calorie:</h5>
                                        <div className="space-y-2">
                                            {analysis.alternativeOptions.lowerCalorie.map((alt, idx) => (
                                                <div key={idx} className="p-2 bg-blue-50 rounded border border-blue-200">
                                                    <p className="font-poppins text-blue-800 text-sm">⚡ {alt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Higher Protein:</h5>
                                        <div className="space-y-2">
                                            {analysis.alternativeOptions.higherProtein.map((alt, idx) => (
                                                <div key={idx} className="p-2 bg-orange-50 rounded border border-orange-200">
                                                    <p className="font-poppins text-orange-800 text-sm">💪 {alt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Grocery List */}
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Smart Grocery List
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {analysis.groceryList.map((category, idx) => (
                                        <div key={idx}>
                                            <h5 className="font-poppins font-semibold text-[#151616] mb-2 flex items-center gap-2">
                                                <Badge className="bg-[#D6F32F] text-[#151616] font-poppins">
                                                    {category.category}
                                                </Badge>
                                            </h5>
                                            <div className="space-y-1">
                                                {category.items.map((item, itemIdx) => (
                                                    <div key={itemIdx} className="p-2 bg-[#FFFFF4] rounded border border-[#151616]/20">
                                                        <p className="font-poppins text-[#151616] text-sm">🛒 {item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Meal Plan Suggestions */}
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                    <Utensils className="w-5 h-5" />
                                    Daily Meal Plan Suggestions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Breakfast:</h5>
                                        <div className="space-y-2">
                                            {analysis.mealPlanSuggestions.breakfast.map((meal, idx) => (
                                                <div key={idx} className="p-2 bg-yellow-50 rounded border border-yellow-200">
                                                    <p className="font-poppins text-yellow-800 text-sm">🌅 {meal}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Lunch:</h5>
                                        <div className="space-y-2">
                                            {analysis.mealPlanSuggestions.lunch.map((meal, idx) => (
                                                <div key={idx} className="p-2 bg-green-50 rounded border border-green-200">
                                                    <p className="font-poppins text-green-800 text-sm">☀️ {meal}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Dinner:</h5>
                                        <div className="space-y-2">
                                            {analysis.mealPlanSuggestions.dinner.map((meal, idx) => (
                                                <div key={idx} className="p-2 bg-blue-50 rounded border border-blue-200">
                                                    <p className="font-poppins text-blue-800 text-sm">🌙 {meal}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-poppins font-semibold text-[#151616] mb-2">Snacks:</h5>
                                        <div className="space-y-2">
                                            {analysis.mealPlanSuggestions.snacks.map((snack, idx) => (
                                                <div key={idx} className="p-2 bg-purple-50 rounded border border-purple-200">
                                                    <p className="font-poppins text-purple-800 text-sm">🍎 {snack}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Nutritional Deficiencies */}
                        {analysis.nutritionalDeficiencies.length > 0 && (
                            <Card className="border-2 border-orange-500 shadow-[4px_4px_0px_0px_orange-500] bg-orange-50">
                                <CardHeader>
                                    <CardTitle className="font-poppins font-bold text-orange-700 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        Potential Nutritional Gaps
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {analysis.nutritionalDeficiencies.map((deficiency, idx) => (
                                            <div key={idx} className="p-3 bg-orange-100 rounded border border-orange-200">
                                                <p className="font-poppins text-orange-800">⚠️ {deficiency}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Disclaimer */}
                        <Alert className="border-2 border-blue-500 bg-blue-50">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="font-poppins">
                                <strong>Nutrition Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional nutritional advice. Always consult with a registered dietitian or healthcare provider for personalized nutrition guidance, especially if you have specific health conditions or dietary requirements.
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
