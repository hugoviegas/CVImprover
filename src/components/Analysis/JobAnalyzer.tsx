import React, { useState } from 'react';
import { Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const JobAnalyzer: React.FC = () => {
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [_keywords, setKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeJob = () => {
    setIsAnalyzing(true);
    // Basic keyword extraction logic
    const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const words = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.includes(word));

    const uniqueWords = Array.from(new Set(words));
    const topKeywords = uniqueWords.slice(0, 15);
    setKeywords(topKeywords);

    // Calculate score
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const foundKeywords = topKeywords.filter(keyword => resumeText.includes(keyword));
    const missing = topKeywords.filter(keyword => !resumeText.includes(keyword));
    
    setMissingKeywords(missing);
    setScore(Math.round((foundKeywords.length / topKeywords.length) * 100));
    
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
        <Search className="h-6 w-6 mr-2 text-blue-600" />
        Job Analysis
      </h2>

      <div className="mb-4">
        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          id="jobDescription"
          rows={6}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
      </div>

      <button
        onClick={analyzeJob}
        disabled={!jobDescription || isAnalyzing}
        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Job'}
      </button>

      {score !== null && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Match Score</h3>
            <div className={`text-4xl font-bold ${score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score}%
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Missing Keywords
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
                >
                  {keyword}
                </span>
              ))}
              {missingKeywords.length === 0 && (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" /> All key requirements met!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAnalyzer;
