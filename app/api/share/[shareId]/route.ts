import { NextRequest, NextResponse } from 'next/server';
import { getQuizByShareId } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;

    if (!shareId) {
      return NextResponse.json(
        { error: 'Share ID is required' },
        { status: 400 }
      );
    }

    const quiz = await getQuizByShareId(shareId);

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Return only the necessary data for public access
    const publicQuiz = {
      id: quiz.id,
      shareId: quiz.shareId,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        type: q.type,
        question: q.question,
        options: q.options,
        order: q.order,
      }))
    };

    return NextResponse.json(publicQuiz);
  } catch (error) {
    console.error('Error fetching shared quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
} 