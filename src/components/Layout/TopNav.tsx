import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, Briefcase, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface TopNavProps {
  showJobDescription?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ showJobDescription = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeData } = useResume();
  const isMobile = useIsMobile();
  
  const [isJobDescExpanded, setIsJobDescExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const jobDescription = resumeData.metadata.targetJobDescription;
  const hasJobDescription = jobDescription && jobDescription.length > 0;
  const isEditorPage = location.pathname.includes('/edit');

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors hidden sm:inline">
                CV Improver
              </span>
              <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors sm:hidden">
                CV
              </span>
            </button>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>My Resumes</span>
              </button>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Job Description Badge - Desktop */}
            {showJobDescription && hasJobDescription && !isMobile && (
              <button
                onClick={() => setIsJobDescExpanded(!isJobDescExpanded)}
                className="flex items-center space-x-2 px-3 md:px-4 py-1.5 md:py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs md:text-sm font-medium"
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden lg:inline">Target Job</span>
                {isJobDescExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expandable Job Description - Desktop */}
        {showJobDescription && hasJobDescription && isJobDescExpanded && !isMobile && (
          <div className="pb-4 pt-2">
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h4 className="text-sm font-semibold text-purple-900 mb-2">Target Position</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {jobDescription}
              </p>
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isMobile && isMobileMenuOpen && (
          <div className="py-3 space-y-2 border-t border-gray-200">
            <button
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>My Resumes</span>
            </button>

            {/* Job Description in Mobile Menu */}
            {showJobDescription && hasJobDescription && (
              <div className="px-3 py-2">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-4 h-4 text-purple-700" />
                    <h4 className="text-xs font-semibold text-purple-900">Target Job</h4>
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">
                    {jobDescription}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
