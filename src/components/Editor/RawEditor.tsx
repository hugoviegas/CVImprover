import React, { useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { AlertCircle, Save } from 'lucide-react';

export const RawEditor: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setJsonContent(JSON.stringify(resumeData, null, 2));
  }, [resumeData]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonContent(e.target.value);
    setError(null);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      setResumeData(parsed);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Raw JSON Editor</h3>
        <button
          onClick={handleSave}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Save className="h-4 w-4 mr-2" />
          Apply Changes
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center text-sm">
          <AlertCircle className="h-4 w-4 mr-2" />
          Invalid JSON: {error}
        </div>
      )}

      <textarea
        value={jsonContent}
        onChange={handleChange}
        className="flex-1 w-full font-mono text-sm p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        spellCheck={false}
      />
    </div>
  );
};
