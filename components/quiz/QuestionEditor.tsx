'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { GeneratedQuestion } from '@/types/quiz';

interface QuestionEditorProps {
  questions: GeneratedQuestion[];
  onQuestionsChange: (questions: GeneratedQuestion[]) => void;
}

export function QuestionEditor({ questions, onQuestionsChange }: QuestionEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const updateQuestion = (index: number, updates: Partial<GeneratedQuestion>) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    onQuestionsChange(newQuestions);
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
}: QuestionCardProps) {

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
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
            <SelectTrigger>
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
              className="min-h-[100px]"
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
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correct Answer */}
        <div className="space-y-2">
          <Label>Correct Answer</Label>
          {question.type === 'multiple_choice' ? (
            <Select
              value={question.correct || ""}
              onValueChange={(value) => onUpdate({ correct: value })}
            >
              <SelectTrigger>
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
              <SelectTrigger>
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
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
} 