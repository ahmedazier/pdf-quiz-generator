import { NextRequest, NextResponse } from 'next/server';
import { parsePDF, validatePDFFile } from '@/lib/pdf-parser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate the file
    const validation = validatePDFFile(file);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

        try {
      console.log('File received:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      
      // Parse the PDF file
      const text = await parsePDF(file);

      if (!text || text.trim().length === 0) {
        return NextResponse.json(
          { error: 'No text content found in PDF' },
          { status: 400 }
        );
      }

      console.log('PDF parsed successfully, text length:', text.length);
      return NextResponse.json({ content: text.trim() });
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      return NextResponse.json(
        { error: `Failed to parse PDF file: ${parseError instanceof Error ? parseError.message : 'Unknown error'}` },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in PDF upload:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF file' },
      { status: 500 }
    );
  }
} 