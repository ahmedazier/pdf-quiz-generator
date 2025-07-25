import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Sparkles, FileText, Share2, BarChart3, Upload, Edit } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PDF Quiz Generator
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your PDF documents and text content into engaging quizzes using AI. 
            Create, edit, and share interactive assessments in minutes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Create Quiz
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">
                <BarChart3 className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-blue-600" />
                <CardTitle>Upload PDF</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Simply upload your PDF documents and our AI will extract the content 
                and generate relevant quiz questions automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Edit className="h-6 w-6 text-green-600" />
                <CardTitle>Rich Editor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use our rich text editor to paste content directly or edit generated 
                questions with formatting, images, and more.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Share2 className="h-6 w-6 text-purple-600" />
                <CardTitle>Easy Sharing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate unique shareable links for your quizzes. Students can take 
                quizzes directly from the link with instant results.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-orange-600" />
                <CardTitle>AI Powered</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI generates diverse question types including multiple choice, 
                true/false, and short answer questions.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                <CardTitle>Multiple Formats</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Support for various question types and difficulty levels. Customize 
                your quiz to match your teaching needs.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-teal-600" />
                <CardTitle>Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track student performance, view detailed analytics, and export results 
                to analyze learning outcomes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">Ready to Create Your First Quiz?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of educators who are already using our platform to create 
              engaging assessments for their students.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
