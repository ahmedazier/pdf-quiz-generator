'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
}

export function ContentInput({ content, onContentChange }: ContentInputProps) {
  const [height, setHeight] = useState(300);
  const [width, setWidth] = useState(100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📝</span>
          Content Input
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Size Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (px)</Label>
            <div className="space-y-2">
              <Slider
                value={[height]}
                onValueChange={(value: number[]) => setHeight(value[0])}
                max={800}
                min={200}
                step={50}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">{height}px</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Width (%)</Label>
            <div className="space-y-2">
              <Slider
                value={[width]}
                onValueChange={(value: number[]) => setWidth(value[0])}
                max={100}
                min={50}
                step={10}
                className="w-full"
              />
              <span className="text-sm text-muted-foreground">{width}%</span>
            </div>
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <Label htmlFor="content">Your Content</Label>
          <Textarea
            id="content"
            placeholder="Paste your content here or type directly. You can copy text from PDFs, documents, or any other source."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            style={{
              height: `${height}px`,
              width: `${width}%`,
              minWidth: '100%',
              resize: 'both'
            }}
            className="min-h-[200px] resize-both"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Tips:</strong>
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 ml-4">
            <li>• Copy text from your PDF and paste it here</li>
            <li>• Use the sliders above to adjust the textarea size</li>
            <li>• You can also drag the corner to resize manually</li>
            <li>• Include key concepts and important information</li>
            <li>• The more content you add, the better the quiz questions will be</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 