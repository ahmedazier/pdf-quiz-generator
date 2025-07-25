'use client';

import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { File, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export function FileUpload({ onFileSelect, onError }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Please upload a PDF file');
      } else if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 10MB');
      } else {
        setError('Invalid file. Please try again.');
      }
      onError('Invalid file');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileSelect(file);
    }
  }, [onFileSelect, onError]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  return (
    <div className="w-full">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center transition-colors border-muted-foreground/25 bg-muted/50"
          >
            <input {...getInputProps()} />
            
            <div className="flex flex-col items-center gap-4">
                               <div className="p-3 rounded-full bg-muted">
                   <File className="h-8 w-8 text-muted-foreground" />
                 </div>
              
                             <div className="space-y-2">
                 <h3 className="text-lg font-semibold">
                   Coming Soon
                 </h3>
                 <p className="text-sm text-muted-foreground">
                   PDF upload feature is coming soon! For now, please use the Text Input tab.
                 </p>
                 <p className="text-xs text-muted-foreground">
                   Copy and paste your content from PDFs into the text editor
                 </p>
               </div>
            </div>
          </div>

          {error && (
            <Alert className="mt-4 border-destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 