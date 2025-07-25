"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Sparkles, AlertCircle, FileText, Type, Settings, Zap } from "lucide-react"
import { FileUpload } from "@/components/upload/FileUpload"
import { ContentInput } from "@/components/upload/ContentInput"
import type { GeneratedQuestion } from "@/types/quiz"

interface QuizGeneratorProps {
  onQuizGenerated: (quiz: { title: string; description?: string; questions: GeneratedQuestion[] }) => void
}

export function QuizGenerator({ onQuizGenerated }: QuizGeneratorProps) {
  const [activeTab, setActiveTab] = useState("text")
  const [content, setContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Generation options
  const [questionCount, setQuestionCount] = useState(5)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionTypes, setQuestionTypes] = useState<("multiple_choice" | "true_false" | "short_answer")[]>([
    "multiple_choice",
  ])
  const [customInstructions, setCustomInstructions] = useState("")

  const handleFileSelect = async (file: File) => {
    setError(null)
    setSelectedFile(file)
    setContent("") // Clear text content when file is selected
  }

  const handleGenerateQuiz = async () => {
    if (!selectedFile && !content.trim()) {
      setError("Please provide a PDF file or text content first")
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress(10)

    try {
      let quizContent = content.trim()

      // If we have a file but no content, we need to parse the file first
      if (selectedFile && !quizContent) {
        setProgress(20)
        const formData = new FormData()
        formData.append("file", selectedFile)

        const parseResponse = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        })

        if (!parseResponse.ok) {
          throw new Error("Failed to parse PDF file")
        }

        const parseData = await parseResponse.json()
        quizContent = parseData.content
        setProgress(40)
      }

      const options = {
        count: questionCount,
        difficulty,
        types: questionTypes,
        customInstructions: customInstructions.trim() || undefined,
      }

      setProgress(60)
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: quizContent,
          options,
        }),
      })

      setProgress(80)

      if (!response.ok) {
        let errorMessage = "Failed to generate quiz"
        try {
          const error = await response.json()
          errorMessage = error.error || errorMessage
        } catch {
          try {
            const text = await response.text()
            if (text.includes("<!DOCTYPE")) {
              errorMessage = "Server error occurred"
            } else {
              errorMessage = text || errorMessage
            }
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`
          }
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setProgress(100)

      // Generate a default title
      const title = `Quiz - ${new Date().toLocaleDateString()}`

      onQuizGenerated({
        title,
        description: customInstructions.trim() || undefined,
        questions: data.questions,
      })

      setTimeout(() => setProgress(0), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate quiz")
      setProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleQuestionTypeChange = (type: "multiple_choice" | "true_false" | "short_answer", checked: boolean) => {
    if (checked) {
      setQuestionTypes([...questionTypes, type])
    } else {
      setQuestionTypes(questionTypes.filter((t) => t !== type))
    }
  }

  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <div className="space-y-8">
      <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-stone-600 dark:text-stone-400" />
            Content Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Input */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-stone-100 dark:bg-stone-800">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Text Input
              </TabsTrigger>
              <TabsTrigger value="pdf" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PDF Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4 mt-6">
              <ContentInput content={content} onContentChange={setContent} />
            </TabsContent>

            <TabsContent value="pdf" className="mt-6">
              <FileUpload onFileSelect={handleFileSelect} onError={setError} isProcessing={isGenerating} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-stone-600 dark:text-stone-400" />
            Generation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question Count */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="questionCount" className="text-base font-medium">
                  Number of Questions
                </Label>
                <Badge variant="secondary" className="text-sm">
                  {questionCount} questions
                </Badge>
              </div>
              <Slider
                value={[questionCount]}
                onValueChange={(value: number[]) => setQuestionCount(value[0])}
                max={50}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-4">
              <Label htmlFor="difficulty" className="text-base font-medium">
                Difficulty Level
              </Label>
              <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}>
                <SelectTrigger className="bg-white dark:bg-stone-950">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Easy
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Hard
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Badge className={difficultyColors[difficulty]}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Question Types */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Question Types</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950">
                <Checkbox
                  id="multiple_choice"
                  checked={questionTypes.includes("multiple_choice")}
                  onCheckedChange={(checked) => handleQuestionTypeChange("multiple_choice", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="multiple_choice" className="font-medium">
                    Multiple Choice
                  </Label>
                  <p className="text-xs text-stone-500 dark:text-stone-400">A, B, C, D options</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950">
                <Checkbox
                  id="true_false"
                  checked={questionTypes.includes("true_false")}
                  onCheckedChange={(checked) => handleQuestionTypeChange("true_false", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="true_false" className="font-medium">
                    True/False
                  </Label>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Binary choice</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-950">
                <Checkbox
                  id="short_answer"
                  checked={questionTypes.includes("short_answer")}
                  onCheckedChange={(checked) => handleQuestionTypeChange("short_answer", checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="short_answer" className="font-medium">
                    Short Answer
                  </Label>
                  <p className="text-xs text-stone-500 dark:text-stone-400">Text response</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Custom Instructions */}
          <div className="space-y-4">
            <Label htmlFor="customInstructions" className="text-base font-medium">
              Custom Instructions (Optional)
            </Label>
            <Textarea
              id="customInstructions"
              placeholder="Add specific instructions for question generation (e.g., 'Focus on key concepts', 'Include practical examples', etc.)"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={3}
              className="bg-white dark:bg-stone-950"
            />
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-stone-600 dark:text-stone-400" />
                <span className="text-sm font-medium">Generating quiz questions...</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-stone-500 dark:text-stone-400 text-center">
                {progress < 40
                  ? "Processing content..."
                  : progress < 80
                    ? "Generating questions..."
                    : "Finalizing quiz..."}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive" className="border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || (!selectedFile && !content.trim()) || questionTypes.length === 0}
            className="w-full bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Quiz...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                Generate Quiz Questions
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
