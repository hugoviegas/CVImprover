import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Clock, Briefcase, Sparkles, Upload } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { getAllResumes, deleteResume, SavedResumeMeta } from '../services/resumeRepository';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { loadResume, createNewResume } = useResume();
  const [resumes, setResumes] = useState<SavedResumeMeta[]>([]);
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = () => {
    const list = getAllResumes();
    setResumes(list);
  };

  const handleOpenResume = (id: string) => {
    if (loadResume(id)) {
      navigate('/editor');
    }
  };

  const handleNewResume = () => {
    createNewResume();
    navigate('/editor');
  };

  const handleImportResume = () => {
    createNewResume();
    navigate('/editor?tab=import');
  };

  const handleDeleteResume = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this resume?')) {
      deleteResume(id);
      loadResumes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">My Resumes</h1>
            <p className="text-sm md:text-base text-gray-600">Create, manage, and optimize your professional CVs</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Resume
            </button>

            {showCreateMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10">
                <button
                  onClick={() => {
                    setShowCreateMenu(false);
                    handleNewResume();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors flex items-center group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Create from Scratch</div>
                    <div className="text-xs text-gray-500">Start with a blank template</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowCreateMenu(false);
                    handleImportResume();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors flex items-center group border-t border-gray-100"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                    <Upload className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center">
                      Import with AI <Sparkles className="w-3 h-3 ml-1 text-purple-500" />
                    </div>
                    <div className="text-xs text-gray-500">Upload PDF/DOCX & enhance</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12 text-center border border-gray-200">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <FileText className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">No resumes yet</h3>
            <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8 max-w-md mx-auto">
              Get started by creating a new resume from scratch or importing an existing one with AI enhancement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button
                onClick={handleNewResume}
                className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm md:text-base"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create from Scratch
              </button>
              <button
                onClick={handleImportResume}
                className="inline-flex items-center justify-center px-5 md:px-6 py-2.5 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium text-sm md:text-base"
              >
                <Upload className="w-5 h-5 mr-2" />
                Import with AI
                <Sparkles className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => handleOpenResume(resume.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    {resume.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={(e) => handleDeleteResume(e, resume.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">
                  {resume.name}
                </h3>
                {resume.jobTitleTarget && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Briefcase className="w-4 h-4 mr-1.5 text-blue-500" />
                    <span className="truncate">{resume.jobTitleTarget}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400">
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(resume.lastUpdated).toLocaleDateString()}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 truncate max-w-[120px]">
                    {resume.fileName || 'Manual'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Click outside handler */}
      {showCreateMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowCreateMenu(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
