'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Loader2, Save, Share2, ArrowLeft } from 'lucide-react';
import { QuizGenerator } from '@/components/quiz/QuizGenerator';
import { QuestionEditor } from '@/components/quiz/QuestionEditor';
import { ShareDialog } from '@/components/quiz/ShareDialog';
import { GeneratedQuestion, Quiz } from '@/types/quiz';
import { toast } from 'sonner';

export default function CreatePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<'generate' | 'edit' | 'save'>('generate');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedQuiz, setSavedQuiz] = useState<Quiz | null>(null);

  const handleQuizGenerated = (quiz: { title: string; description?: string; questions: GeneratedQuestion[] }) => {
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description || '');
    setQuestions(quiz.questions);
    setCurrentStep('edit');
  };

  const handleSaveQuiz = async () => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: quizTitle,
          description: quizDescription,
          questions,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save quiz');
      }

      const savedQuizData = await response.json();
      setSavedQuiz(savedQuizData);
      setCurrentStep('save');
      toast.success('Quiz saved successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save quiz');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackToGenerate = () => {
    setCurrentStep('generate');
    setQuestions([]);
    setQuizTitle('');
    setQuizDescription('');
    setSavedQuiz(null);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Create Quiz</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'generate' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`h-1 w-16 ${
              currentStep !== 'generate' ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'edit' ? 'bg-blue-600 text-white' : 
              currentStep === 'save' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`h-1 w-16 ${
              currentStep === 'save' ? 'bg-green-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'save' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {currentStep === 'generate' && (
            <QuizGenerator onQuizGenerated={handleQuizGenerated} />
          )}

          {currentStep === 'edit' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input
                      id="title"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      placeholder="Enter quiz title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={quizDescription}
                      onChange={(e) => setQuizDescription(e.target.value)}
                      placeholder="Enter quiz description"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <QuestionEditor
                questions={questions}
                onQuestionsChange={setQuestions}
              />

              <div className="flex gap-4">
                <Button
                  onClick={handleBackToGenerate}
                  variant="outline"
                >
                  Back to Generate
                </Button>
                <Button
                  onClick={handleSaveQuiz}
                  disabled={isSaving || !quizTitle.trim() || questions.length === 0}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Quiz
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 'save' && savedQuiz && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-green-600" />
                    Quiz Saved Successfully!
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Quiz Title</Label>
                    <p className="font-medium">{savedQuiz.title}</p>
                  </div>
                  {savedQuiz.description && (
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <p className="text-muted-foreground">{savedQuiz.description}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Questions</Label>
                    <p className="text-muted-foreground">{savedQuiz.questions.length} questions</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Share ID</Label>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{savedQuiz.shareId}</p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <ShareDialog
                      shareId={savedQuiz.shareId}
                      quizTitle={savedQuiz.title}
                    >
                      <Button className="flex-1">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share Quiz
                      </Button>
                    </ShareDialog>
                    <Button
                      onClick={handleBackToGenerate}
                      variant="outline"
                    >
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
  );
} 