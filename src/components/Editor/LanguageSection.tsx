import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { Language } from '../../types/resume';
import { Plus, Trash2 } from 'lucide-react';

const LanguageSection: React.FC = () => {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResume();

  const handleAddLanguage = () => {
    const newLanguage: Language = {
      id: crypto.randomUUID(),
      language: '',
      level: 'Intermediate',
      details: '',
    };
    addLanguage(newLanguage);
  };

  const handleRemoveLanguage = (id: string) => {
    removeLanguage(id);
  };

  const handleUpdateLanguage = (id: string, field: keyof Language, value: any) => {
    updateLanguage(id, { [field]: value });
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Languages</h3>
        <button
          onClick={handleAddLanguage}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Language
        </button>
      </div>

      {resumeData.languages.map((lang) => (
        <div key={lang.id} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
          <button
            onClick={() => handleRemoveLanguage(lang.id)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Language</label>
              <input
                type="text"
                value={lang.language}
                onChange={(e) => handleUpdateLanguage(lang.id, 'language', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="e.g. English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                value={lang.level}
                onChange={(e) => handleUpdateLanguage(lang.id, 'level', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
              >
                <option value="Beginner">Beginner (A1/A2)</option>
                <option value="Intermediate">Intermediate (B1/B2)</option>
                <option value="Advanced">Advanced (C1)</option>
                <option value="Fluent">Fluent (C2)</option>
                <option value="Native">Native</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Details (Optional)</label>
              <input
                type="text"
                value={lang.details}
                onChange={(e) => handleUpdateLanguage(lang.id, 'details', e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                placeholder="e.g. Reading: C2, Speaking: C1"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default LanguageSection;
