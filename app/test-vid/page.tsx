"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Upload,
    Play,
    Brain,
    FileVideo,
    Youtube,
    Clock,
    Eye,
    Mic,
    Zap,
    CheckCircle,
    AlertCircle,
    Loader2
} from "lucide-react";

interface VideoAnalysis {
    transcription?: string;
    visualDescription?: string;
    summary?: string;
    keyMoments?: Array<{
        timestamp: string;
        description: string;
    }>;
    quiz?: {
        questions: Array<{
            question: string;
            options: string[];
            correct: number;
        }>;
        answerKey: string[];
    };
    processingTime?: string;
    confidence?: number;
}

export default function VideoAnalysisPage() {
    const [activeTab, setActiveTab] = useState("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 20 * 1024 * 1024) {
                setError("File size must be under 20MB for direct upload");
                return;
            }
            if (!file.type.startsWith('video/')) {
                setError("Please select a valid video file");
                return;
            }
            setSelectedFile(file);
            setError("");
        }
    };

    const analyzeVideo = async () => {
        if (!selectedFile && !youtubeUrl) {
            setError("Please select a video file or enter a YouTube URL");
            return;
        }

        setIsAnalyzing(true);
        setProgress(0);
        setError("");
        setAnalysis(null);

        try {
            const formData = new FormData();

            if (selectedFile) {
                formData.append('video', selectedFile);
                formData.append('type', 'file');
            } else {
                formData.append('youtubeUrl', youtubeUrl);
                formData.append('type', 'youtube');
            }

            if (customPrompt) {
                formData.append('prompt', customPrompt);
            }

            const progressInterval = setInterval(() => {
                setProgress(prev => Math.min(prev + 10, 90));
            }, 500);

            const response = await fetch('/api/analyze-video', {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setProgress(100);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Video analysis failed');
            }

            const result = await response.json();
            setAnalysis(result.analysis);

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during analysis');
        } finally {
            setIsAnalyzing(false);
            setProgress(0);
        }
    };

    const resetAnalysis = () => {
        setSelectedFile(null);
        setYoutubeUrl("");
        setCustomPrompt("");
        setAnalysis(null);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFF4] p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-instrument-serif font-bold text-[#151616] mb-3">
                            AI Video Analysis
                        </h1>
                        <p className="text-lg text-[#151616]/70 font-poppins max-w-2xl mx-auto">
                            Upload videos or analyze YouTube content using Google's Gemini AI for transcription, visual analysis, and intelligent insights
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <Badge className="bg-[#D6F32F] text-[#151616] border-[#151616]">
                                <Brain className="w-3 h-3 mr-1" />
                                Powered by Gemini 2.5
                            </Badge>
                            <Badge className="bg-white text-[#151616] border-[#151616]">
                                <Zap className="w-3 h-3 mr-1" />
                                Real-time Processing
                            </Badge>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-poppins text-[#151616]">
                                    <FileVideo className="w-5 h-5" />
                                    Video Input
                                </CardTitle>
                                <CardDescription className="font-poppins">
                                    Choose your video source and analysis preferences
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="upload" className="font-poppins">
                                            <Upload className="w-4 h-4 mr-2" />
                                            File Upload
                                        </TabsTrigger>
                                        <TabsTrigger value="youtube" className="font-poppins">
                                            <Youtube className="w-4 h-4 mr-2" />
                                            YouTube URL
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="upload" className="space-y-4">
                                        <div className="border-2 border-dashed border-[#151616]/30 rounded-lg p-6 text-center hover:border-[#151616]/50 transition-colors">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="video/*"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <label htmlFor="video-upload" className="cursor-pointer">
                                                <FileVideo className="w-12 h-12 mx-auto mb-3 text-[#151616]/50" />
                                                <p className="font-poppins font-medium text-[#151616] mb-1">
                                                    {selectedFile ? selectedFile.name : "Click to upload video"}
                                                </p>
                                                <p className="text-sm text-[#151616]/60 font-poppins">
                                                    MP4, MOV, AVI, WebM (max 20MB)
                                                </p>
                                            </label>
                                        </div>
                                        {selectedFile && (
                                            <div className="p-3 bg-[#D6F32F]/20 rounded-lg border border-[#151616]/20">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="font-poppins text-sm">
                                                        {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="youtube" className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-poppins font-medium text-[#151616]">
                                                YouTube URL
                                            </label>
                                            <Input
                                                placeholder="https://www.youtube.com/watch?v=..."
                                                value={youtubeUrl}
                                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                                className="border-2 border-[#151616]"
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-2">
                                    <label className="text-sm font-poppins font-medium text-[#151616]">
                                        Custom Analysis Prompt (Optional)
                                    </label>
                                    <Textarea
                                        placeholder="E.g., 'Focus on medical terminology and create a detailed summary with timestamps'"
                                        value={customPrompt}
                                        onChange={(e) => setCustomPrompt(e.target.value)}
                                        rows={3}
                                        className="border-2 border-[#151616]"
                                    />
                                </div>

                                {error && (
                                    <Alert className="border-red-500 bg-red-50">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription className="font-poppins">{error}</AlertDescription>
                                    </Alert>
                                )}

                                {isAnalyzing && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="font-poppins text-sm">Analyzing video with Gemini AI...</span>
                                        </div>
                                        <Progress value={progress} className="h-2" />
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        onClick={analyzeVideo}
                                        disabled={isAnalyzing || (!selectedFile && !youtubeUrl)}
                                        className="flex-1 bg-[#D6F32F] hover:bg-[#D6F32F]/80 text-[#151616] border-2 border-[#151616] font-poppins font-bold shadow-[2px_2px_0px_0px_#151616] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#151616] transition-all"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <Brain className="w-4 h-4 mr-2" />
                                                Analyze Video
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={resetAnalysis}
                                        className="border-2 border-[#151616] font-poppins font-medium bg-white hover:bg-gray-50"
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <Card className="border-2 border-[#151616] shadow-[4px_4px_0px_0px_#151616] h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-poppins text-[#151616]">
                                    <Eye className="w-5 h-5" />
                                    Analysis Results
                                </CardTitle>
                                <CardDescription className="font-poppins">
                                    AI-powered video insights and transcription
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AnimatePresence mode="wait">
                                    {!analysis && !isAnalyzing && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center py-12"
                                        >
                                            <Brain className="w-16 h-16 mx-auto mb-4 text-[#151616]/30" />
                                            <p className="font-poppins text-[#151616]/60">
                                                Upload a video or enter a YouTube URL to get started
                                            </p>
                                        </motion.div>
                                    )}

                                    {analysis && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            className="space-y-6"
                                        >
                                            {analysis.summary && (
                                                <div className="space-y-2">
                                                    <h3 className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                                        <Play className="w-4 h-4" />
                                                        Summary
                                                    </h3>
                                                    <div className="p-4 bg-[#D6F32F]/20 rounded-lg border border-[#151616]/20">
                                                        <p className="font-poppins text-sm text-[#151616]">{analysis.summary}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {analysis.transcription && (
                                                <div className="space-y-2">
                                                    <h3 className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                                        <Mic className="w-4 h-4" />
                                                        Transcription
                                                    </h3>
                                                    <div className="p-4 bg-white rounded-lg border border-[#151616]/20 max-h-40 overflow-y-auto">
                                                        <p className="font-poppins text-sm text-[#151616] whitespace-pre-wrap">
                                                            {analysis.transcription}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {analysis.visualDescription && (
                                                <div className="space-y-2">
                                                    <h3 className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                                        <Eye className="w-4 h-4" />
                                                        Visual Analysis
                                                    </h3>
                                                    <div className="p-4 bg-white rounded-lg border border-[#151616]/20">
                                                        <p className="font-poppins text-sm text-[#151616]">
                                                            {analysis.visualDescription}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {analysis.keyMoments && analysis.keyMoments.length > 0 && (
                                                <div className="space-y-2">
                                                    <h3 className="font-poppins font-bold text-[#151616] flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Key Moments
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {analysis.keyMoments.map((moment, index) => (
                                                            <div key={index} className="p-3 bg-white rounded-lg border border-[#151616]/20">
                                                                <div className="flex items-start gap-3">
                                                                    <Badge className="bg-[#151616] text-white">
                                                                        {moment.timestamp}
                                                                    </Badge>
                                                                    <p className="font-poppins text-sm text-[#151616] flex-1">
                                                                        {moment.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {analysis.processingTime && (
                                                <div className="text-center pt-4 border-t border-[#151616]/20">
                                                    <p className="font-poppins text-xs text-[#151616]/60">
                                                        Analysis completed in {analysis.processingTime}
                                                    </p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
