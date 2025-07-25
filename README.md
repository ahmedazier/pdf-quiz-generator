# 📚 PDF Quiz Generator

> **Transform your content into engaging quizzes using AI**

A modern web application that generates interactive quizzes from text content using OpenAI's GPT-4. Perfect for educators, trainers, and anyone who wants to create engaging assessments quickly.

![PDF Quiz Generator](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai)

## ✨ Features

- **🎯 AI-Powered Quiz Generation**: Uses OpenAI's GPT-4 to create intelligent questions
- **📝 Text Content Input**: Simple text input for adding your content
- **🎨 Modern UI**: Beautiful interface built with shadcn/ui and Tailwind CSS
- **📊 Multiple Question Types**: Multiple choice, True/False, and Short answer questions
- **⚙️ Customizable Options**: Adjust difficulty, question count, and types
- **🔗 Shareable Quizzes**: Generate unique links to share quizzes
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🚀 Fast & Reliable**: Built with Next.js 15 and optimized for performance
- **📊 Quiz Results**: View scores and answers after completing quizzes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **AI Integration**: OpenAI GPT-4
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom design system
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ahmedazier/pdf-quiz-generator.git
   cd pdf-quiz-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pdf_quiz_generator"
   OPENAI_API_KEY="your_openai_api_key_here"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Creating a Quiz

1. **Navigate to the Create page**
   - Go to `/create` in your browser

2. **Add your content**
   - Use the **Text Input** tab
   - Copy and paste content from your PDFs or documents
   - Add your text content in the text area

3. **Configure quiz options**
   - **Number of Questions**: 1-50 questions
   - **Difficulty**: Easy, Medium, or Hard
   - **Question Types**: Multiple Choice, True/False, Short Answer
   - **Custom Instructions**: Add specific requirements

4. **Generate your quiz**
   - Click "Generate Quiz" and wait for AI processing
   - Review and edit questions if needed
   - Save and share your quiz

### Sharing Quizzes

- Each quiz gets a unique shareable URL
- Anyone with the link can take the quiz
- Results are collected and displayed after completion

## 🏗️ Project Structure

```
pdf-quiz-generator/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── generate-quiz/ # Quiz generation endpoint
│   │   ├── quiz/          # Quiz management endpoints
│   │   └── share/         # Public quiz sharing
│   ├── create/            # Quiz creation page
│   ├── quiz/              # Quiz taking interface
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── quiz/             # Quiz-related components
│   └── upload/           # File upload components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
├── prisma/               # Database schema
└── public/               # Static assets
```

## 🔧 API Endpoints

- `POST /api/generate-quiz` - Generate quiz questions from content
- `GET /api/quiz/[id]` - Get quiz by ID
- `POST /api/quiz/[id]/submit` - Submit quiz responses
- `GET /api/share/[shareId]` - Get public quiz data

## 🎨 Customization

### Styling
The app uses Tailwind CSS with a custom design system. You can customize colors, fonts, and components in:
- `tailwind.config.js` - Tailwind configuration
- `components/ui/` - shadcn/ui components
- `app/globals.css` - Global styles

### AI Configuration
Modify the AI behavior in:
- `lib/openai.ts` - OpenAI integration
- `app/api/generate-quiz/route.ts` - Quiz generation logic

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Add environment variables
   - Deploy automatically

### Other Platforms

The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ahmed Azier** - [@ahmedazier](https://github.com/ahmedazier)

- 🌐 Website: [ahmedazier.com](https://www.ahmedazier.com/)
- 💼 LinkedIn: [in/ahmedazier](https://linkedin.com/in/ahmedazier)
- 🏢 Company: [MaffeiTech](https://maffeitech.com/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [OpenAI](https://openai.com/) for powerful AI capabilities
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

If you have any questions or need help:

- 🐛 **Bug Reports**: [Create an issue](https://github.com/ahmedazier/pdf-quiz-generator/issues)
- 💡 **Feature Requests**: [Submit a feature request](https://github.com/ahmedazier/pdf-quiz-generator/issues)
- 📧 **Email**: [Contact Ahmed](mailto:contact@ahmedazier.com)

---

⭐ **Star this repository if you found it helpful!**
