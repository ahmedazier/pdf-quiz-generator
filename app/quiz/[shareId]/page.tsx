"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  Target,
  BookOpen,
  Home,
  RotateCcw,
} from "lucide-react"
import { toast } from "sonner"

interface QuizQuestion {
  id: string
  type: "multiple_choice" | "true_false" | "short_answer"
  question: string
  options?: string[]
  order: number
}

interface QuizData {
  id: string
  shareId: string
  title: string
  description?: string
  questions: QuizQuestion[]
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const shareId = params.shareId as string

  const [quiz, setQuiz] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [startTime] = useState(Date.now())
  const [results, setResults] = useState<{
    response: { id: string; quizId: string; answers: Record<string, string>; score: number; createdAt: string }
    score: number
    correctAnswers: number
    totalQuestions: number
  } | null>(null)

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/share/${shareId}`)
      if (!response.ok) {
        throw new Error("Quiz not found")
      }
      const data = await response.json()
      setQuiz(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }, [shareId])

  useEffect(() => {
    fetchQuiz()
  }, [fetchQuiz])

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (!quiz) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit quiz")
      }

      const result = await response.json()
      setResults(result)
      setSubmitted(true)
      toast.success("Quiz submitted successfully!")
    } catch {
      toast.error("Failed to submit quiz")
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-blue-600 dark:text-blue-400"
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90)
      return { label: "Excellent", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" }
    if (score >= 70) return { label: "Good", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" }
    if (score >= 50)
      return { label: "Fair", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" }
    return { label: "Needs Improvement", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 flex items-center justify-center">
        <Card className="w-full max-w-md border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-stone-100 dark:bg-stone-800">
                <Loader2 className="h-8 w-8 animate-spin text-stone-600 dark:text-stone-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-1">Loading Quiz</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400">Please wait while we prepare your quiz...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800 flex items-center justify-center">
        <Card className="w-full max-w-md border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Quiz Not Found</h3>
                <Alert variant="destructive" className="mb-4">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error || "The quiz you're looking for doesn't exist or has been removed."}
                  </AlertDescription>
                </Alert>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted && results) {
    const timeTaken = Math.round((Date.now() - startTime) / 1000 / 60)
    const scoreBadge = getScoreBadge(results.score)

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
        {/* Header */}
        <div className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Quiz Completed!</h1>
                <p className="text-sm text-stone-600 dark:text-stone-400">{quiz.title}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Results Summary */}
            <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl mb-2">Congratulations!</CardTitle>
                <p className="text-stone-600 dark:text-stone-400">You've successfully completed the quiz</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className={`text-6xl font-bold mb-2 ${getScoreColor(results.score)}`}>
                    {Math.round(results.score)}%
                  </div>
                  <Badge className={scoreBadge.color}>{scoreBadge.label}</Badge>
                </div>

                <Separator />

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <Target className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-stone-800 dark:text-stone-200">
                      {results.correctAnswers}/{results.totalQuestions}
                    </div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">Correct Answers</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <Clock className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-stone-800 dark:text-stone-200">{timeTaken}m</div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">Time Taken</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50">
                    <BookOpen className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-stone-800 dark:text-stone-200">{quiz.questions.length}</div>
                    <div className="text-sm text-stone-600 dark:text-stone-400">Total Questions</div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go Home
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 bg-transparent"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Take Again
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Answer Review */}
            <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Your Answers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quiz.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-4 border border-stone-200 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-950"
                  >
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary" className="mt-1">
                        {index + 1}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium mb-2">{question.question.replace(/<[^>]*>/g, "")}</p>
                        <div className="text-sm">
                          <span className="text-stone-600 dark:text-stone-400">Your answer: </span>
                          <span className="font-medium">{answers[question.id] || "Not answered"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100
  const isLastQuestion = currentQuestion === quiz.questions.length - 1
  const hasAnswer = answers[currentQ.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
      {/* Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 text-white">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{quiz.title}</h1>
                {quiz.description && <p className="text-sm text-stone-600 dark:text-stone-400">{quiz.description}</p>}
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Section */}
          <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-stone-600 dark:text-stone-400" />
                    <span className="text-sm font-medium">Progress</span>
                  </div>
                  <span className="text-sm text-stone-600 dark:text-stone-400">{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>Question {currentQuestion + 1}</span>
                  <span>{quiz.questions.length} Total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="w-fit">
                  Question {currentQuestion + 1}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    currentQ.type === "multiple_choice"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      : currentQ.type === "true_false"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                  }
                >
                  {currentQ.type === "multiple_choice"
                    ? "Multiple Choice"
                    : currentQ.type === "true_false"
                      ? "True/False"
                      : "Short Answer"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Text */}
              <div className="prose prose-stone dark:prose-invert max-w-none">
                <div
                  className="text-lg font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentQ.question }}
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQ.type === "multiple_choice" && currentQ.options && (
                  <RadioGroup
                    value={answers[currentQ.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    className="space-y-3"
                  >
                    {currentQ.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer"
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                          <span className="inline-flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-sm font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {currentQ.type === "true_false" && (
                  <RadioGroup
                    value={answers[currentQ.id] || ""}
                    onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="flex-1 cursor-pointer font-medium">
                        <span className="inline-flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-semibold text-green-700 dark:text-green-400">
                            T
                          </span>
                          True
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="flex-1 cursor-pointer font-medium">
                        <span className="inline-flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-sm font-semibold text-red-700 dark:text-red-400">
                            F
                          </span>
                          False
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                {currentQ.type === "short_answer" && (
                  <div className="space-y-2">
                    <Label htmlFor="short-answer" className="text-sm font-medium">
                      Your Answer
                    </Label>
                    <Textarea
                      id="short-answer"
                      value={answers[currentQ.id] || ""}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      placeholder="Type your answer here..."
                      rows={4}
                      className="bg-white dark:bg-stone-950 resize-none"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 bg-transparent"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {!hasAnswer && (
                <Badge variant="outline" className="text-xs">
                  Please select an answer
                </Badge>
              )}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting || !hasAnswer}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Submit Quiz
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!hasAnswer}
                className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
