import { NextRequest, NextResponse } from 'next/server';
import { saveResponse, prisma } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Answers are required' },
        { status: 400 }
      );
    }

    // Get the quiz to calculate score
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer) {
        if (question.type === 'multiple_choice') {
          if (userAnswer === question.correct) {
            correctAnswers++;
          }
        } else if (question.type === 'true_false') {
          if (userAnswer.toLowerCase() === question.correct.toLowerCase()) {
            correctAnswers++;
          }
        } else if (question.type === 'short_answer') {
          // For short answer, do a simple case-insensitive comparison
          if (userAnswer.toLowerCase().trim() === question.correct.toLowerCase().trim()) {
            correctAnswers++;
          }
        }
      }
    });

    const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Save the response
    const response = await saveResponse({
      quizId: id,
      answers,
      score
    });

    return NextResponse.json({
      response,
      score,
      correctAnswers,
      totalQuestions
    });
  } catch (error) {
    console.error('Error submitting quiz response:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
} 