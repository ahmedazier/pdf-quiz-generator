'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  order: number;
}

interface QuizData {
  id: string;
  shareId: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const shareId = params.shareId as string;

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{
    response: { id: string; quizId: string; answers: Record<string, string>; score: number; createdAt: string };
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  } | null>(null);

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await fetch(`/api/share/${shareId}`);
      if (!response.ok) {
        throw new Error('Quiz not found');
      }
      const data = await response.json();
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/quiz/${quiz.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      setResults(result);
      setSubmitted(true);
      toast.success('Quiz submitted successfully!');
    } catch {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading quiz...</span>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {error || 'Quiz not found'}
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push('/')}
              className="mt-4 w-full"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">{quiz.title}</h3>
                <div className="text-4xl font-bold text-green-600">
                  {Math.round(results.score)}%
                </div>
                <p className="text-muted-foreground">
                  You got {results.correctAnswers} out of {results.totalQuestions} questions correct
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Your Answers:</h4>
                {quiz.questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <p className="font-medium mb-2">
                      Question {index + 1}: {question.question.replace(/<[^>]*>/g, '')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Your answer: {answers[question.id] || 'Not answered'}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Go Home
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Take Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-muted-foreground">{quiz.description}</p>
            )}
          </div>

          {/* Progress */}
          <div className="mb-8 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Question */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    Question {currentQuestion + 1}
                  </h2>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentQ.question }}
                  />
                </div>

                {/* Answer Options */}
                <div className="space-y-4">
                  {currentQ.type === 'multiple_choice' && currentQ.options && (
                    <RadioGroup
                      value={answers[currentQ.id] || ''}
                      onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    >
                      {currentQ.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                            {String.fromCharCode(65 + index)}. {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {currentQ.type === 'true_false' && (
                    <RadioGroup
                      value={answers[currentQ.id] || ''}
                      onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="true" />
                        <Label htmlFor="true">True</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="false" />
                        <Label htmlFor="false">False</Label>
                      </div>
                    </RadioGroup>
                  )}

                  {currentQ.type === 'short_answer' && (
                    <Textarea
                      value={answers[currentQ.id] || ''}
                      onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                      placeholder="Enter your answer..."
                      rows={3}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
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
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 