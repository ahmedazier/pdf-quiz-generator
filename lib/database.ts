import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function generateShareId(): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Check if shareId already exists
  const existing = await prisma.quiz.findUnique({
    where: { shareId: result }
  });
  
  if (existing) {
    return generateShareId();
  }
  
  return result;
}

export async function createQuiz(data: {
  title: string;
  description?: string;
  questions: Array<{
    type: string;
    question: string;
    options: string[];
    correct: string;
    order: number;
  }>;
}) {
  const shareId = await generateShareId();
  
  return await prisma.quiz.create({
    data: {
      title: data.title,
      description: data.description,
      shareId,
      questions: {
        create: data.questions.map(q => ({
          type: q.type,
          question: q.question,
          options: q.options,
          correct: q.correct,
          order: q.order,
        }))
      }
    },
    include: {
      questions: true
    }
  });
}

export async function getQuizByShareId(shareId: string) {
  return await prisma.quiz.findUnique({
    where: { shareId },
    include: {
      questions: {
        orderBy: { order: 'asc' }
      }
    }
  });
}

export async function saveResponse(data: {
  quizId: string;
  answers: Record<string, string | string[]>;
  score?: number;
}) {
  return await prisma.response.create({
    data: {
      quizId: data.quizId,
      answers: data.answers,
      score: data.score
    }
  });
} 