import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Education } from '../../types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { AISuggestionModal } from './AISuggestionModal';
import { suggestSectionUpdate } from '../../services/gemini';
import { ItemActions } from './ItemActions';

const EducationSection: React.FC = () => {
  const { resumeData, addEducation, updateEducation, removeEducation, updateMetadata } = useResume();

  // AI Modal State
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [suggestionData, setSuggestionData] = useState<{
    descriptionRaw?: string;
    highlights?: { original?: string; suggested: string }[];
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAddEducation = () => {
    const newEducation: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      course: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      finalGrade: '',
      levelEQF: '',
      descriptionRaw: '',
      highlights: [],
    };
    addEducation(newEducation);
  };

  const handleRemoveEducation = (id: string) => {
    removeEducation(id);
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    updateEducation(id, { [field]: value });
  };

  const handleOptimize = async (edu: Education) => {
    setOptimizingId(edu.id);
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
        sectionType: 'education',
        currentContent: edu,
        jobDescription: jd
      });

      console.log('[EducationSection] API Result:', result);
      console.log('[EducationSection] Suggestions:', result.suggestions);

      // Transform to modal format
      const transformedSuggestions = {
        descriptionRaw: result.suggestions.suggestedDescription || '',
        highlights: (result.suggestions.suggestedHighlights || []).map((suggested, idx) => ({
          original: result.suggestions.originalHighlights?.[idx],
          suggested: suggested
        }))
      };

      console.log('[EducationSection] Transformed:', transformedSuggestions);
      setSuggestionData(transformedSuggestions);
    } catch (err) {
      console.error('[EducationSection] Error:', err);
      setError("Failed to generate suggestions. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (data: { description: string; highlights: string[] }) => {
    if (optimizingId) {
      updateEducation(optimizingId, {
        descriptionRaw: data.description,
        highlights: data.highlights
      });
    }
  };

  const currentEducation = resumeData.education.find(e => e.id === optimizingId);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Education</h3>
        <button
          onClick={handleAddEducation}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Education
        </button>
      </div>

      {resumeData.education.map((edu) => (
        <div key={edu.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative group">
          <div className="absolute top-2 right-2">
            <ItemActions
              onDelete={() => handleRemoveEducation(edu.id)}
              onOptimize={() => handleOptimize(edu)}
            />
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Course</label>
              <input
                type="text"
                value={edu.course || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'course', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                value={edu.city || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'city', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={edu.startDate}
                onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={edu.endDate}
                onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Final Grade</label>
              <input
                type="text"
                value={edu.finalGrade || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'finalGrade', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">EQF Level</label>
              <input
                type="text"
                value={edu.levelEQF || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'levelEQF', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={edu.descriptionRaw || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'descriptionRaw', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
              <div className="space-y-2">
                {(edu.highlights || []).map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...(edu.highlights || [])];
                        newHighlights[index] = e.target.value;
                        handleUpdateEducation(edu.id, 'highlights', newHighlights);
                      }}
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                    <button
                      onClick={() => {
                        const newHighlights = edu.highlights.filter((_, i) => i !== index);
                        handleUpdateEducation(edu.id, 'highlights', newHighlights);
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHighlights = [...(edu.highlights || []), ''];
                    handleUpdateEducation(edu.id, 'highlights', newHighlights);
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

      {currentEducation && (
        <AISuggestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sectionTitle={`${currentEducation.degree} at ${currentEducation.institution}`}
          originalData={{
            description: currentEducation.descriptionRaw,
            highlights: currentEducation.highlights
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

export default EducationSection;
