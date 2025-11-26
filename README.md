# CV Improver

[🇧🇷 Versão em Português](./README_PT.md)

An AI-powered resume builder and optimizer that helps you create professional, ATS-friendly resumes. Upload your existing resume in PDF, DOCX, or TXT format, and let the AI enhance and structure it for better job application results.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google&logoColor=white)

## ✨ Features

### 📄 Smart Resume Import
- **Multi-format Support**: Import resumes from PDF, DOCX, or TXT files
- **AI-Powered Parsing**: Uses Google Gemini to intelligently extract and structure resume data
- **Enhanced Import Mode**: Optional AI refinement for grammar correction and clarity improvements
- **Smart Caching**: Automatically caches parsed resumes to avoid redundant processing

### ✏️ Comprehensive Editor
- **Structured Editor**: Edit all resume sections with intuitive forms
  - Personal Information
  - Professional Summary
  - Work Experience with highlights
  - Education with grades and EQF levels
  - Technical Skills (categorized)
  - Languages with proficiency levels
  - Projects with technologies
  - Certifications
- **Raw JSON Editor**: Direct access to resume data for power users
- **Undo/Redo**: Full history support for all changes
- **Auto-save**: Changes are automatically persisted to local storage

### 🤖 AI-Powered Optimization
- **Summary Optimization**: Rewrite professional summaries to match job descriptions
- **Experience Enhancement**: Transform bullet points with action verbs and metrics
- **Education Highlighting**: Emphasize relevant coursework and achievements
- **Project Descriptions**: Optimize project details for target roles
- **Job Analysis**: Calculate keyword match scores against job descriptions

### 🎨 Multiple Templates
- **ATS Template**: Clean, professional layout optimized for Applicant Tracking Systems
- **Modern Template**: Contemporary design with visual elements
- **Europass Template**: EU-standard format with structured sections
- **Minimal Template**: Simple and elegant design

### 📱 Responsive Design
- Desktop: Side-by-side editor and live preview
- Mobile: Tab-based navigation between edit and preview modes
- Print-optimized: A4 page layout with proper margins

### 📤 Export Options
- **PDF Export**: Download your resume as a professional PDF
- **Live Preview**: Real-time preview as you edit
- **Template Selection**: Choose different templates before export

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API Key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hugoviegas/CVImprover.git
   cd CVImprover
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.sample .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your API key from: https://aistudio.google.com/app/apikey

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with hooks and context
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### AI & Parsing
- **Google Gemini AI** - Resume parsing and optimization
- **pdfjs-dist** - PDF text extraction
- **mammoth** - DOCX text extraction

### Export
- **jspdf** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **pdf-lib** - PDF manipulation

### UI Components
- **Lucide React** - Icon library
- **react-dropzone** - File upload with drag & drop
- **clsx & tailwind-merge** - Class name utilities

## 📁 Project Structure

```
src/
├── components/
│   ├── Analysis/       # Job analysis features
│   ├── Editor/         # Resume editing components
│   │   ├── ResumeEditor.tsx    # Main editor container
│   │   ├── StructuredEditor.tsx # Form-based editing
│   │   ├── RawEditor.tsx        # JSON editor
│   │   └── ...sections/         # Section editors
│   ├── Export/         # PDF export functionality
│   ├── Layout/         # App layout components
│   ├── Preview/        # Live resume preview
│   ├── Templates/      # Resume templates
│   │   ├── ATS/
│   │   ├── Europass/
│   │   ├── Minimal/
│   │   └── Modern/
│   └── Upload/         # File upload components
├── context/
│   └── ResumeContext.tsx  # Global state management
├── hooks/              # Custom React hooks
├── pages/
│   └── Dashboard.tsx   # Main dashboard
├── services/
│   ├── gemini.ts       # AI optimization functions
│   ├── geminiParser.ts # AI resume parsing
│   ├── aiPrompts.ts    # AI prompt templates
│   └── pdfExportService.ts
├── types/
│   └── resume.ts       # TypeScript interfaces
└── utils/
    ├── fileParser.ts   # File parsing utilities
    ├── resumeStorage.ts # Local storage management
    └── resumeValidator.ts
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Required |
| `VITE_GEMINI_MODEL` | Gemini model to use | `gemini-2.5-flash-lite` |
| `VITE_PARSING_TIMEOUT_MS` | Parsing timeout in ms | `30000` |
| `VITE_PARSING_MAX_RETRIES` | Max retry attempts | `3` |
| `VITE_ENABLE_DEBUG_LOGGING` | Enable debug logs | `false` |
| `VITE_ENABLE_AI_PARSING` | Enable AI features | `true` |

### Supported Gemini Models
- `gemini-2.5-flash-lite` (recommended - fast and cost-effective)
- `gemini-2.5-flash`
- `gemini-2.0-flash`

## 📝 Usage Guide

### Creating a New Resume

1. From the Dashboard, click **"Create Resume"**
2. Choose **"Create from Scratch"** or **"Import with AI"**
3. Fill in your information using the Structured Editor
4. Preview your resume in real-time on the right panel
5. Click **"Save"** to persist your changes

### Importing an Existing Resume

1. Click **"Import with AI"** from the Dashboard
2. Choose import mode:
   - **Standard Import**: Fast parsing and field detection
   - **Enhanced AI Import**: Includes grammar fixes and clarity improvements
3. Drag & drop or browse for your PDF/DOCX/TXT file
4. Wait for AI processing (10-30 seconds)
5. Review and edit the extracted data

### Optimizing for a Job

1. In the Structured Editor, paste your target job description
2. Click the **"AI Suggest"** button on any section
3. Review the AI suggestions with keyword highlights
4. Accept or modify the suggested changes
5. Use the Job Analyzer to check your keyword match score

### Exporting Your Resume

1. Select your preferred template from the Templates tab
2. Preview the final result
3. Click **"Download PDF"** to export

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Lucide](https://lucide.dev/) for beautiful icons
- [TailwindCSS](https://tailwindcss.com/) for styling utilities

---

Made with ❤️ by [Hugo Viegas](https://github.com/hugoviegas)
