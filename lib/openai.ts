import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { QuizGenerationOptions, GeneratedQuestion } from '@/types/quiz';

export async function generateQuestions(
  content: string,
  options: QuizGenerationOptions
): Promise<GeneratedQuestion[]> {
  try {
    const prompt = `
Generate ${options.count} quiz questions from this content:

${content}

Requirements:
- Difficulty: ${options.difficulty}
- Question types: ${options.types.join(', ')}
${options.customInstructions ? `- Custom instructions: ${options.customInstructions}` : ''}

Return as a JSON array with this exact structure:
[
  {
    "type": "multiple_choice|true_false|short_answer",
    "question": "Question text",
    "options": ["A", "B", "C", "D"], // for multiple choice only
    "correct": "Correct answer"
  }
]

For multiple choice questions, provide 4 options labeled A, B, C, D.
For true/false questions, use "true" or "false" as the correct answer.
For short answer questions, provide a brief correct answer.
`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
      maxTokens: 2000,
    });

    if (!text) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    let questions: GeneratedQuestion[];
    try {
      questions = JSON.parse(text);
    } catch {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse OpenAI response as JSON');
      }
    }

    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error('Response is not an array');
    }

    // Validate each question
    const validatedQuestions: GeneratedQuestion[] = questions.map((q, index) => {
      if (!q.type || !q.question || !q.correct) {
        throw new Error(`Invalid question structure at index ${index}`);
      }

      if (q.type === 'multiple_choice' && (!Array.isArray(q.options) || q.options.length !== 4)) {
        throw new Error(`Multiple choice question at index ${index} must have exactly 4 options`);
      }

      return {
        type: q.type as 'multiple_choice' | 'true_false' | 'short_answer',
        question: q.question,
        options: q.options || [],
        correct: q.correct
      };
    });

    return validatedQuestions.slice(0, options.count);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
} 