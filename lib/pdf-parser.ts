// Client-side PDF parsing using browser APIs
export async function parsePDF(file: File): Promise<string> {
  try {
    // Handle text files
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text();
      return text;
    }
    
    // Handle PDF files using client-side parsing
    if (file.type === 'application/pdf') {
      // Convert file to text (works for text-based PDFs)
      try {
        const text = await file.text();
        if (text && text.length > 0) {
          // Clean up the text and extract only readable content
          const cleanedText = text
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '') // Remove control characters
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          // Extract all readable content, not just parenthetical content
          const allContent = cleanedText
            .split(/\s+/)
            .filter(word => {
              // Filter out PDF technical terms but keep actual content
              const technicalTerms = [
                'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref',
                'FlateDecode', 'LZWDecode', 'ASCIIHexDecode', 'RunLengthDecode',
                'Font', 'Page', 'Catalog', 'Metadata', 'Producer', 'Creator'
              ];
              
              const lowerWord = word.toLowerCase();
              return !technicalTerms.some(term => lowerWord.includes(term)) &&
                     word.length > 2 &&
                     /[A-Za-z]/.test(word);
            })
            .join(' ');
          
          if (allContent && allContent.length > 200) {
            return allContent;
          }
          
          // If filtering was too aggressive, try with less filtering
          const lessFilteredContent = cleanedText
            .split(/\s+/)
            .filter(word => {
              const lowerWord = word.toLowerCase();
              const strictTechnicalTerms = ['obj', 'endobj', 'stream', 'endstream'];
              return !strictTechnicalTerms.some(term => lowerWord.includes(term)) &&
                     word.length > 1;
            })
            .join(' ');
          
          if (lessFilteredContent && lessFilteredContent.length > 200) {
            return lessFilteredContent;
          }
        }
      } catch {
        // If text extraction fails, continue to next method
      }
      
      // If text extraction didn't work, try a different approach
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Look for readable text in the PDF bytes
      let extractedText = '';
      
      // Convert bytes to string and look for readable text
      const byteString = String.fromCharCode.apply(null, Array.from(uint8Array));
      
      // Extract text patterns (letters, numbers, spaces, punctuation)
      const textMatches = byteString.match(/[A-Za-z0-9\s.,!?;:()\-_]+/g);
      
      if (textMatches) {
        extractedText = textMatches
          .filter(match => {
            // Less aggressive filtering for fallback
            const lowerMatch = match.toLowerCase();
            const strictTechnicalTerms = ['obj', 'endobj', 'stream', 'endstream'];
            return !strictTechnicalTerms.some(term => lowerMatch.includes(term)) &&
                   match.length > 5 &&
                   /[A-Za-z]/.test(match);
          })
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }
      
      if (extractedText && extractedText.length > 200) {
        return extractedText;
      }
      
      throw new Error('Could not extract readable text from PDF. Please try copying and pasting the text content instead.');
    }
    
    // Try to read as text for other file types
    try {
      const text = await file.text();
      if (text && text.length > 0) {
        return text;
      }
    } catch {
      // Ignore text reading errors
    }
    
    throw new Error('Unsupported file type. Please use a PDF or text file.');
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function validatePDFFile(file: File): { isValid: boolean; error?: string } {
  // Check file type
  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'File must be a PDF' };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }

  return { isValid: true };
}

 