'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, Sparkles, CheckCircle2, Edit3 } from 'lucide-react';
import { GeneratedQuestion } from '@/types/quiz';

interface QuestionEditorProps {
  questions: GeneratedQuestion[];
  onQuestionsChange: (questions: GeneratedQuestion[]) => void;
}

export function QuestionEditor({ questions, onQuestionsChange }: QuestionEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedAnswers, setEditedAnswers] = useState<Set<number>>(new Set());

  const updateQuestion = (index: number, updates: Partial<GeneratedQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onQuestionsChange(newQuestions);
    
    // Mark this answer as edited if the correct answer was changed
    if (updates.correct !== undefined) {
      setEditedAnswers(prev => new Set([...prev, index]));
    }
  };

  const addQuestion = () => {
    const newQuestion: GeneratedQuestion = {
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correct: '',
    };
    onQuestionsChange([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    onQuestionsChange(newQuestions);
    // Remove from edited answers set
    setEditedAnswers(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    if (newQuestions[questionIndex].options) {
      newQuestions[questionIndex].options![optionIndex] = value;
      onQuestionsChange(newQuestions);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Questions</h2>
        <Button onClick={addQuestion} size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      {/* AI Answer Info */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>AI-Generated Answers:</strong> The AI has automatically selected the correct answers for each question. 
          You can review and edit them as needed. Questions with edited answers are marked with a badge.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            index={index}
            onUpdate={(updates) => updateQuestion(index, updates)}
            onRemove={() => removeQuestion(index)}
            onOptionUpdate={(optionIndex, value) => updateOption(index, optionIndex, value)}
            isEditing={editingIndex === index}
            onEdit={() => setEditingIndex(index)}
            onSave={() => setEditingIndex(null)}
            isAnswerEdited={editedAnswers.has(index)}
          />
        ))}
      </div>
    </div>
  );
}

interface QuestionCardProps {
  question: GeneratedQuestion;
  index: number;
  onUpdate: (updates: Partial<GeneratedQuestion>) => void;
  onRemove: () => void;
  onOptionUpdate: (optionIndex: number, value: string) => void;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isAnswerEdited: boolean;
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onRemove,
  onOptionUpdate,
  isEditing,
  onEdit,
  onSave,
  isAnswerEdited,
}: QuestionCardProps) {

  return (
    <Card className="border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            {isAnswerEdited && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                <Edit3 className="mr-1 h-3 w-3" />
                Edited
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <Button onClick={onSave} size="sm">
                Save
              </Button>
            ) : (
              <Button onClick={onEdit} variant="outline" size="sm">
                Edit
              </Button>
            )}
            <Button onClick={onRemove} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question Type */}
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select
            value={question.type}
            onValueChange={(value: 'multiple_choice' | 'true_false' | 'short_answer') =>
              onUpdate({ type: value })
            }
          >
            <SelectTrigger className="bg-white dark:bg-stone-950">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem value="true_false">True/False</SelectItem>
              <SelectItem value="short_answer">Short Answer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Question Text */}
        <div className="space-y-2">
          <Label>Question</Label>
          {isEditing ? (
            <Textarea
              value={question.question}
              onChange={(e) => onUpdate({ question: e.target.value })}
              placeholder="Enter your question here..."
              className="min-h-[100px] bg-white dark:bg-stone-950"
            />
          ) : (
            <div className="border rounded-lg p-4 min-h-[100px] bg-muted/50">
              <p className="whitespace-pre-wrap">{question.question}</p>
            </div>
          )}
        </div>

        {/* Options for Multiple Choice */}
        {question.type === 'multiple_choice' && (
          <div className="space-y-2">
            <Label>Options</Label>
            <div className="space-y-2">
              {question.options?.map((option, optionIndex) => (
                <div key={optionIndex} className="flex gap-2">
                  <span className="font-mono text-sm w-6">{String.fromCharCode(65 + optionIndex)}.</span>
                  <Input
                    value={option}
                    onChange={(e) => onOptionUpdate(optionIndex, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                    className="bg-white dark:bg-stone-950"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correct Answer */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Correct Answer</Label>
            {!isAnswerEdited && (
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                <CheckCircle2 className="mr-1 h-3 w-3" />
                AI Selected
              </Badge>
            )}
          </div>
          {question.type === 'multiple_choice' ? (
            <Select
              value={question.correct || ""}
              onValueChange={(value) => onUpdate({ correct: value })}
            >
              <SelectTrigger className="bg-white dark:bg-stone-950">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option, index) => (
                  <SelectItem key={index} value={option || `option-${index}`}>
                    {String.fromCharCode(65 + index)}. {option || `Option ${String.fromCharCode(65 + index)}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : question.type === 'true_false' ? (
            <Select
              value={question.correct || ""}
              onValueChange={(value) => onUpdate({ correct: value })}
            >
              <SelectTrigger className="bg-white dark:bg-stone-950">
                <SelectValue placeholder="Select correct answer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Textarea
              value={question.correct}
              onChange={(e) => onUpdate({ correct: e.target.value })}
              placeholder="Enter the correct answer"
              rows={2}
              className="bg-white dark:bg-stone-950"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 