"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, Share2, ArrowLeft, Sparkles, CheckCircle2, Edit3 } from "lucide-react"
import { QuizGenerator } from "@/components/quiz/QuizGenerator"
import { QuestionEditor } from "@/components/quiz/QuestionEditor"
import { ShareDialog } from "@/components/quiz/ShareDialog"
import type { GeneratedQuestion, Quiz } from "@/types/quiz"
import { toast } from "sonner"

export default function CreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"generate" | "edit" | "save">("generate")
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([])
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [savedQuiz, setSavedQuiz] = useState<Quiz | null>(null)

  const handleQuizGenerated = (quiz: { title: string; description?: string; questions: GeneratedQuestion[] }) => {
    setQuizTitle(quiz.title)
    setQuizDescription(quiz.description || "")
    setQuestions(quiz.questions)
    setCurrentStep("edit")
  }

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title")
      return
    }

    if (questions.length === 0) {
      toast.error("Please add at least one question")
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: quizTitle,
          description: quizDescription,
          questions,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save quiz")
      }

      const savedQuizData = await response.json()
      setSavedQuiz(savedQuizData)
      setCurrentStep("save")
      toast.success("Quiz saved successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save quiz")
    } finally {
      setIsSaving(false)
    }
  }

  const handleBackToGenerate = () => {
    setCurrentStep("generate")
    setQuestions([])
    setQuizTitle("")
    setQuizDescription("")
    setSavedQuiz(null)
  }

  const stepConfig = {
    generate: { icon: Sparkles, label: "Generate", color: "bg-blue-600" },
    edit: { icon: Edit3, label: "Edit", color: "bg-orange-600" },
    save: { icon: CheckCircle2, label: "Complete", color: "bg-green-600" },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold">Create Quiz</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {Object.entries(stepConfig).map(([step, config], index) => {
              const isActive = currentStep === step
              const isCompleted =
                (step === "generate" && (currentStep === "edit" || currentStep === "save")) ||
                (step === "edit" && currentStep === "save")

              return (
                <div key={step} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                      isActive
                        ? config.color + " text-white shadow-lg"
                        : isCompleted
                          ? "bg-green-600 text-white"
                          : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400"
                    }`}
                  >
                    <config.icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        isActive ? "text-stone-900 dark:text-stone-100" : "text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      Step {index + 1}
                    </div>
                    <div
                      className={`text-xs ${
                        isActive ? "text-stone-700 dark:text-stone-300" : "text-stone-500 dark:text-stone-500"
                      }`}
                    >
                      {config.label}
                    </div>
                  </div>
                  {index < Object.keys(stepConfig).length - 1 && (
                    <div
                      className={`h-1 w-16 mx-4 rounded-full transition-all duration-200 ${
                        isCompleted ? "bg-green-600" : "bg-stone-200 dark:bg-stone-700"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          {currentStep === "generate" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Generate Your Quiz</h2>
                <p className="text-stone-600 dark:text-stone-400">Upload a PDF or paste your content to get started</p>
              </div>
              <QuizGenerator onQuizGenerated={handleQuizGenerated} />
            </div>
          )}

          {currentStep === "edit" && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Customize Your Quiz</h2>
                <p className="text-stone-600 dark:text-stone-400">
                  Review and edit the generated questions to match your needs. The AI has automatically selected correct answers for each question.
                </p>
              </div>

              <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit3 className="h-5 w-5" />
                    Quiz Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Quiz Title *</Label>
                      <Input
                        id="title"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="Enter a compelling quiz title"
                        className="bg-white dark:bg-stone-950"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Questions</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {questions.length} questions generated
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={quizDescription}
                      onChange={(e) => setQuizDescription(e.target.value)}
                      placeholder="Add a description to help students understand the quiz purpose"
                      rows={3}
                      className="bg-white dark:bg-stone-950"
                    />
                  </div>
                </CardContent>
              </Card>

              <QuestionEditor questions={questions} onQuestionsChange={setQuestions} />

              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <Button
                  onClick={handleBackToGenerate}
                  variant="outline"
                  className="border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 bg-transparent"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Generate
                </Button>
                <Button
                  onClick={handleSaveQuiz}
                  disabled={isSaving || !quizTitle.trim() || questions.length === 0}
                  className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Quiz...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save & Continue
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === "save" && savedQuiz && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quiz Created Successfully!</h2>
                <p className="text-stone-600 dark:text-stone-400">Your quiz is ready to share with students</p>
              </div>

              <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    Quiz Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-stone-600 dark:text-stone-400">Title</Label>
                        <p className="font-semibold text-lg">{savedQuiz.title}</p>
                      </div>
                      {savedQuiz.description && (
                        <div>
                          <Label className="text-sm font-medium text-stone-600 dark:text-stone-400">Description</Label>
                          <p className="text-stone-700 dark:text-stone-300">{savedQuiz.description}</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-stone-600 dark:text-stone-400">Questions</Label>
                        <p className="font-semibold text-lg">{savedQuiz.questions.length} questions</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-stone-600 dark:text-stone-400">Share ID</Label>
                        <div className="flex items-center gap-2">
                          <code className="bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded text-sm font-mono">
                            {savedQuiz.shareId}
                          </code>
                          <Badge variant="secondary" className="text-xs">
                            Ready
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row gap-4">
                    <ShareDialog shareId={savedQuiz.shareId} quizTitle={savedQuiz.title}>
                      <Button className="flex-1 bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Quiz
                      </Button>
                    </ShareDialog>
                    <Button
                      onClick={handleBackToGenerate}
                      variant="outline"
                      className="border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 bg-transparent"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Another Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
