import React from 'react';
import { Upload, CheckCircle, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/Upload/FileUpload';
import { ResumeData } from '../types/resume';

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Optimize Your Resume for <span className="text-blue-600">Any Job</span>
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Upload your resume, paste the job description, and get AI-powered suggestions to land your dream job.
        </p>
      </div>

      <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <Upload className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">1. Upload Resume</h3>
          <p className="mt-2 text-base text-gray-500">
            Drag and drop your existing PDF or DOCX resume to get started.
          </p>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <Briefcase className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">2. Analyze Job</h3>
          <p className="mt-2 text-base text-gray-500">
            Paste the job description to identify key requirements and keywords.
          </p>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">3. Optimize & Export</h3>
          <p className="mt-2 text-base text-gray-500">
            Apply suggestions and export a perfectly tailored PDF resume.
          </p>
        </div>
      </div>
      
      {/* Upload Section */}
      <div className="mt-12">
        <FileUpload onUpload={(_data: ResumeData) => {
          navigate('/editor');
        }} />
      </div>
    </div>
  );
};

export default Home;
