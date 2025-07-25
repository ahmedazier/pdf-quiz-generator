import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, Share2, BarChart3, Upload, Edit, Zap, Users, Clock, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-800">
      {/* Navigation */}
      <nav className="border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-stone-700 to-stone-900 dark:from-stone-300 dark:to-stone-100 bg-clip-text text-transparent">
                QuizCraft AI
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/create">
                <Button variant="outline" size="sm">
                  Create Quiz
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-4">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Quiz Generation
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Transform Content into
              <span className="block bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800 dark:from-stone-400 dark:via-stone-300 dark:to-stone-200 bg-clip-text text-transparent">
                Interactive Quizzes
              </span>
            </h1>
            <p className="text-xl text-stone-600 dark:text-stone-400 max-w-3xl mx-auto leading-relaxed">
              Upload PDFs or paste text content and let our AI create engaging, customizable quizzes in seconds. Perfect
              for educators, trainers, and content creators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 bg-transparent"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                View Dashboard
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-800 dark:text-stone-200">10K+</div>
              <div className="text-stone-600 dark:text-stone-400">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-800 dark:text-stone-200">50K+</div>
              <div className="text-stone-600 dark:text-stone-400">Questions Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-stone-800 dark:text-stone-200">5K+</div>
              <div className="text-stone-600 dark:text-stone-400">Happy Users</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <Card className="group hover:shadow-lg transition-all duration-200 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Smart Upload</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Upload PDFs or paste text content. Our AI intelligently extracts and processes information to create
                relevant quiz questions.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Edit className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Advanced Editor</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Fine-tune generated questions with our intuitive editor. Modify questions, answers, and difficulty
                levels to match your needs.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Instant Sharing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Generate shareable links instantly. Students can access quizzes directly from any device with real-time
                results and scoring.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 transition-colors">
                  <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">AI-Powered</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Advanced AI creates diverse question types including multiple choice, true/false, and short answer
                questions automatically.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-lg">Multiple Formats</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Support for various question types and difficulty levels. Customize your quiz format to match your
                teaching objectives.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/30 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50 transition-colors">
                  <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-lg">Analytics & Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                Track performance with detailed analytics. Monitor student progress, identify knowledge gaps, and
                improve learning outcomes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How it Works */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              Create professional quizzes in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Content</h3>
              <p className="text-stone-600 dark:text-stone-400">
                Upload your PDF or paste text content that you want to create a quiz from
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Generation</h3>
              <p className="text-stone-600 dark:text-stone-400">
                Our AI analyzes your content and generates relevant questions automatically
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-800 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share & Analyze</h3>
              <p className="text-stone-600 dark:text-stone-400">
                Share your quiz with students and track their performance in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose QuizCraft AI?</h2>
            <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              Trusted by educators and trainers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200 dark:border-stone-800">
              <Clock className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Save Time</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">Create quizzes in minutes, not hours</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200 dark:border-stone-800">
              <Users className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Engage Students</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">Interactive quizzes boost engagement</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200 dark:border-stone-800">
              <Shield className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">Your content is safe and secure</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200 dark:border-stone-800">
              <Zap className="h-8 w-8 text-stone-600 dark:text-stone-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">Real-time scoring and feedback</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-stone-100 to-stone-200 dark:from-stone-900 dark:to-stone-800 rounded-2xl p-12 border border-stone-200 dark:border-stone-700">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-8">
            Join thousands of educators who are already using QuizCraft AI to create engaging assessments for their
            students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button
                size="lg"
                className="bg-gradient-to-r from-stone-700 to-stone-800 hover:from-stone-800 hover:to-stone-900 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Create Your First Quiz
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-800 bg-transparent"
              >
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-950/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-stone-600 to-stone-800 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-semibold text-stone-800 dark:text-stone-200">QuizCraft AI</span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400">© 2024 QuizCraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
