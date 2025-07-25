'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { FileUpload } from '@/components/upload/FileUpload';
import { ContentInput } from '@/components/upload/ContentInput';
import { GeneratedQuestion } from '@/types/quiz';

interface QuizGeneratorProps {
  onQuizGenerated: (quiz: { title: string; description?: string; questions: GeneratedQuestion[] }) => void;
}

export function QuizGenerator({ onQuizGenerated }: QuizGeneratorProps) {
  const [activeTab, setActiveTab] = useState('text');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // Generation options
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [questionTypes, setQuestionTypes] = useState<('multiple_choice' | 'true_false' | 'short_answer')[]>([
    'multiple_choice'
  ]);
  const [customInstructions, setCustomInstructions] = useState('');

  const handleFileSelect = async (file: File) => {
    setError(null);
    setSelectedFile(file);
    setContent(''); // Clear text content when file is selected
  };



  const handleGenerateQuiz = async () => {
    if (!selectedFile && !content.trim()) {
      setError('Please provide a PDF file or text content first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(10);

    try {
      let quizContent = content.trim();
      
      // If we have a file but no content, we need to parse the file first
      if (selectedFile && !quizContent) {
        setProgress(20);
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const parseResponse = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });
        
        if (!parseResponse.ok) {
          throw new Error('Failed to parse PDF file');
        }
        
        const parseData = await parseResponse.json();
        quizContent = parseData.content;
        setProgress(40);
      }

      const options = {
        count: questionCount,
        difficulty,
        types: questionTypes,
        customInstructions: customInstructions.trim() || undefined,
      };

      setProgress(60);
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: quizContent,
          options,
        }),
      });

      setProgress(80);

      if (!response.ok) {
        let errorMessage = 'Failed to generate quiz';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          try {
            const text = await response.text();
            if (text.includes('<!DOCTYPE')) {
              errorMessage = 'Server error occurred';
            } else {
              errorMessage = text || errorMessage;
            }
          } catch {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setProgress(100);

      // Generate a default title
      const title = `Quiz - ${new Date().toLocaleDateString()}`;
      
      onQuizGenerated({
        title,
        description: customInstructions.trim() || undefined,
        questions: data.questions,
      });

      setTimeout(() => setProgress(0), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      setProgress(0);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuestionTypeChange = (type: 'multiple_choice' | 'true_false' | 'short_answer', checked: boolean) => {
    if (checked) {
      setQuestionTypes([...questionTypes, type]);
    } else {
      setQuestionTypes(questionTypes.filter(t => t !== type));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Input */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pdf">Upload PDF</TabsTrigger>
              <TabsTrigger value="text">Text Input</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pdf" className="space-y-4">
              <FileUpload onFileSelect={handleFileSelect} onError={setError} isProcessing={isGenerating} />
            </TabsContent>
            
            <TabsContent value="text">
              <ContentInput content={content} onContentChange={setContent} />
            </TabsContent>
          </Tabs>

          {/* Generation Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Generation Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="questionCount">Number of Questions</Label>
                <div className="space-y-2">
                  <Slider
                    value={[questionCount]}
                    onValueChange={(value: number[]) => setQuestionCount(value[0])}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <span className="text-sm text-muted-foreground">{questionCount} questions</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiple_choice"
                    checked={questionTypes.includes('multiple_choice')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('multiple_choice', checked as boolean)}
                  />
                  <Label htmlFor="multiple_choice">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="true_false"
                    checked={questionTypes.includes('true_false')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('true_false', checked as boolean)}
                  />
                  <Label htmlFor="true_false">True/False</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="short_answer"
                    checked={questionTypes.includes('short_answer')}
                    onCheckedChange={(checked) => handleQuestionTypeChange('short_answer', checked as boolean)}
                  />
                  <Label htmlFor="short_answer">Short Answer</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customInstructions">Custom Instructions (Optional)</Label>
              <Textarea
                id="customInstructions"
                placeholder="Add specific instructions for question generation..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating quiz questions...</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || (!selectedFile && !content.trim()) || questionTypes.length === 0}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 