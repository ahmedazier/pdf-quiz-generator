import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/openai';
import { QuizGenerationOptions } from '@/types/quiz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, options } = body;

    if (!content || !options) {
      return NextResponse.json(
        { error: 'Content and options are required' },
        { status: 400 }
      );
    }

    if (typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content must be a non-empty string' },
        { status: 400 }
      );
    }

    const generationOptions: QuizGenerationOptions = {
      count: Math.min(Math.max(options.count || 5, 1), 50),
      difficulty: options.difficulty || 'medium',
      types: options.types || ['multiple_choice'],
      customInstructions: options.customInstructions,
    };

    const questions = await generateQuestions(content, generationOptions);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz questions' },
      { status: 500 }
    );
  }
} 