import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Briefcase, ChevronDown, ChevronUp, Save } from 'lucide-react';

export const JobDescriptionInput: React.FC = () => {
  const { resumeData, updateMetadata } = useResume();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localValue, setLocalValue] = useState(resumeData.metadata.targetJobDescription || '');

  const handleSave = () => {
    updateMetadata({ targetJobDescription: localValue });
    setIsExpanded(false);
  };

  const charCount = localValue.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Target Job Description</h3>
            <p className="text-sm text-gray-500">
              {resumeData.metadata.targetJobDescription 
                ? 'Click to edit' 
                : 'Add job description for AI optimization'}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100">
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste the job description you're targeting
              </label>
              <textarea
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder="E.g., We are looking for a Senior Software Engineer with experience in..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {charCount} characters
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLocalValue(resumeData.metadata.targetJobDescription || '');
                      setIsExpanded(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
