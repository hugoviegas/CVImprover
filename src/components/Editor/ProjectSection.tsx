import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Project } from '../../types/resume';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { AISuggestionModal } from './AISuggestionModal';
import { suggestSectionUpdate, SectionSuggestionResult } from '../../services/gemini';

const ProjectSection: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject, updateMetadata } = useResume();

  // AI Modal State
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [suggestionData, setSuggestionData] = useState<SectionSuggestionResult['suggestions'] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleAddProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: '',
      role: '',
      clientOrCompany: '',
      startDate: '',
      endDate: '',
      descriptionRaw: '',
      highlights: [],
      technologies: [],
      links: [],
    };
    addProject(newProject);
  };

  const handleRemoveProject = (id: string) => {
    removeProject(id);
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: any) => {
    updateProject(id, { [field]: value });
  };

  const handleOptimize = async (proj: Project) => {
    setOptimizingId(proj.id);
    setIsModalOpen(true);
    setIsLoading(true);
    setError(undefined);
    setSuggestionData(null);

    try {
      let jd = resumeData.metadata.targetJobDescription;
      if (!jd) {
        jd = window.prompt("Please enter the Target Job Description to optimize for:");
        if (!jd) {
          setIsModalOpen(false);
          setIsLoading(false);
          return;
        }
        updateMetadata({ targetJobDescription: jd });
      }

      const result = await suggestSectionUpdate({
        sectionType: 'project',
        currentContent: proj,
        jobDescription: jd
      });

      setSuggestionData(result.suggestions);
    } catch (err) {
      console.error(err);
      setError("Failed to generate suggestions. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (data: { description: string; highlights: string[] }) => {
    if (optimizingId) {
      updateProject(optimizingId, {
        descriptionRaw: data.description,
        highlights: data.highlights
      });
    }
  };

  const currentProject = resumeData.projects.find(p => p.id === optimizingId);

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Projects</h3>
        <button
          onClick={handleAddProject}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Project
        </button>
      </div>

      {resumeData.projects.map((proj) => (
        <div key={proj.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative group">
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => handleOptimize(proj)}
              className="text-purple-600 hover:text-purple-800 p-1 rounded hover:bg-purple-50 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Optimize with AI"
            >
              <Sparkles className="h-4 w-4" /> Optimize
            </button>
            <button
              onClick={() => handleRemoveProject(proj.id)}
              className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mt-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                value={proj.title}
                onChange={(e) => handleUpdateProject(proj.id, 'title', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <input
                type="text"
                value={proj.role}
                onChange={(e) => handleUpdateProject(proj.id, 'role', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client / Company</label>
              <input
                type="text"
                value={proj.clientOrCompany}
                onChange={(e) => handleUpdateProject(proj.id, 'clientOrCompany', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={proj.startDate}
                onChange={(e) => handleUpdateProject(proj.id, 'startDate', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="text"
                placeholder="MM/YYYY"
                value={proj.endDate}
                onChange={(e) => handleUpdateProject(proj.id, 'endDate', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={proj.descriptionRaw || ''}
                onChange={(e) => handleUpdateProject(proj.id, 'descriptionRaw', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Highlights</label>
              <div className="space-y-2">
                {(proj.highlights || []).map((highlight, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => {
                        const newHighlights = [...(proj.highlights || [])];
                        newHighlights[index] = e.target.value;
                        handleUpdateProject(proj.id, 'highlights', newHighlights);
                      }}
                      className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                    />
                    <button
                      onClick={() => {
                        const newHighlights = proj.highlights.filter((_, i) => i !== index);
                        handleUpdateProject(proj.id, 'highlights', newHighlights);
                      }}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newHighlights = [...(proj.highlights || []), ''];
                    handleUpdateProject(proj.id, 'highlights', newHighlights);
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

      {currentProject && (
        <AISuggestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sectionTitle={`${currentProject.title}`}
          originalData={{
            description: currentProject.descriptionRaw,
            highlights: currentProject.highlights
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

export default ProjectSection;
