'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ShareDialogProps {
  shareId: string;
  quizTitle: string;
  children: React.ReactNode;
}

export function ShareDialog({ shareId, quizTitle, children }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/quiz/${shareId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const openQuiz = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Quiz
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Quiz Title</Label>
            <p className="text-sm font-medium">{quizTitle}</p>
          </div>

          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Share Options</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Public Access</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Password Protection</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={openQuiz} className="flex-1">
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Quiz
            </Button>
            <Button onClick={copyToClipboard} variant="outline">
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            Anyone with this link can take your quiz. The quiz will be available as long as you don&apos;t delete it.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 