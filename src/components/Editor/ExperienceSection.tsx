import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Experience } from '../../types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { AISuggestionModal } from './AISuggestionModal';
import { suggestSectionUpdate } from '../../services/gemini';
import { ItemActions } from './ItemActions';

const ExperienceSection: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience, updateMetadata } = useResume();
  
  // AI Modal State
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [suggestionData, setSuggestionData] = useState<{
    descriptionRaw?: string;
    highlights?: { original?: string; suggested: string }[];
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      descriptionRaw: '',
      highlights: []
    };
    addExperience(newExperience);
  };

  const handleRemoveExperience = (id: string) => {
    removeExperience(id);
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: any) => {
    updateExperience(id, { [field]: value });
  };

  const handleOptimize = async (exp: Experience) => {
    setOptimizingId(exp.id);
    setIsModalOpen(true);
    setIsLoading(true);
    setError(undefined);
    setSuggestionData(null);

    try {
      let jd = resumeData.metadata.targetJobDescription;
      if (!jd) {
        const input = window.prompt("Please enter the Target Job Description to optimize for:");
        if (!input) {
          setIsModalOpen(false);
          setIsLoading(false);
          return;
        }
        jd = input;
        updateMetadata({ targetJobDescription: jd });
      }

      const result = await suggestSectionUpdate({
        sectionType: 'experience',
        currentContent: exp,
        jobDescription: jd
      });

      console.log('[ExperienceSection] API Result:', result);
      console.log('[ExperienceSection] Suggestions:', result.suggestions);

      // Transform to modal format
      const transformedSuggestions = {
        descriptionRaw: result.suggestions.suggestedDescription || '',
        highlights: (result.suggestions.suggestedHighlights || []).map((suggested, idx) => ({
          original: result.suggestions.originalHighlights?.[idx],
          suggested: suggested
        }))
      };

      console.log('[ExperienceSection] Transformed:', transformedSuggestions);
      setSuggestionData(transformedSuggestions);
    } catch (err) {
      console.error('[ExperienceSection] Error:', err);
      setError("Failed to generate suggestions. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (data: { description: string; highlights: string[] }) => {
    if (optimizingId) {
      updateExperience(optimizingId, {
        descriptionRaw: data.description,
        highlights: data.highlights
      });
    }
  };

  const currentExperience = resumeData.experience.find(e => e.id === optimizingId);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Experience</h3>
        <button
          onClick={handleAddExperience}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Experience
        </button>
      </div>

      {resumeData.experience.map((exp) => (
        <div key={exp.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative group">
          <div className="absolute top-2 right-2">
            <ItemActions
              onDelete={() => handleRemoveExperience(exp.id)}
              onOptimize={() => handleOptimize(exp)}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={exp.city || ''}
                onChange={(e) => handleUpdateExperience(exp.id, 'city', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={exp.country || ''}
                onChange={(e) => handleUpdateExperience(exp.id, 'country', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={exp.startDate}
                onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => {
                    handleUpdateExperience(exp.id, 'current', e.target.checked);
                    if (e.target.checked) {
                      handleUpdateExperience(exp.id, 'endDate', '');
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Currently working here</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="text"
                placeholder={exp.current ? "Current" : "MM/YYYY"}
                value={exp.endDate}
                onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={exp.descriptionRaw}
                onChange={(e) => handleUpdateExperience(exp.id, 'descriptionRaw', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
              <div className="space-y-2">
                {exp.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...exp.highlights];
                        newHighlights[index] = e.target.value;
                        handleUpdateExperience(exp.id, 'highlights', newHighlights);
                      }}
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                    <button
                      onClick={() => {
                        const newHighlights = exp.highlights.filter((_, i) => i !== index);
                        handleUpdateExperience(exp.id, 'highlights', newHighlights);
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHighlights = [...exp.highlights, ''];
                    handleUpdateExperience(exp.id, 'highlights', newHighlights);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Highlight
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* AI Suggestion Modal */}
      {currentExperience && (
        <AISuggestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sectionTitle={`${currentExperience.position} at ${currentExperience.company}`}
          originalData={{
            description: currentExperience.descriptionRaw,
            highlights: currentExperience.highlights
          }}
          suggestionData={suggestionData}
          onApply={handleApplySuggestion}
          isLoading={isLoading}
          error={error}
        />
      )}
    </section>
  );
};

export default ExperienceSection;
