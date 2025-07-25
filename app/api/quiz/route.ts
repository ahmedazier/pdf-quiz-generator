import { NextRequest, NextResponse } from 'next/server';
import { createQuiz, prisma } from '@/lib/database';
import { GeneratedQuestion } from '@/types/quiz';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, questions } = body;

    if (!title || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Title and questions array are required' },
        { status: 400 }
      );
    }

    const formattedQuestions = questions.map((q: GeneratedQuestion, index: number) => ({
      type: q.type,
      question: q.question,
      options: q.options || [],
      correct: q.correct,
      order: index,
    }));

    const quiz = await createQuiz({
      title,
      description,
      questions: formattedQuestions,
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        responses: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, questions } = body;

    if (!id || !title || !questions) {
      return NextResponse.json(
        { error: 'ID, title, and questions are required' },
        { status: 400 }
      );
    }

    // Delete existing questions and create new ones
    await prisma.question.deleteMany({
      where: { quizId: id }
    });

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        description,
        questions: {
          create: questions.map((q: GeneratedQuestion, index: number) => ({
            type: q.type,
            question: q.question,
            options: q.options || [],
            correct: q.correct,
            order: index,
          }))
        }
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      );
    }

    await prisma.quiz.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  }
} 