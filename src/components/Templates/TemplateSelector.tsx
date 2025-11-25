import React from 'react';
import { LayoutTemplate } from 'lucide-react';
import { clsx } from 'clsx';

export type TemplateType = 'modern' | 'europass' | 'minimal' | 'ats';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ currentTemplate, onSelect }) => {
  const templates: { id: TemplateType; name: string; description: string }[] = [
    { id: 'ats', name: 'ATS Friendly', description: 'Optimized for parsing' },
    { id: 'modern', name: 'Modern', description: 'Clean and professional' },
    { id: 'europass', name: 'Europass-like', description: 'Standard European format' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' },
  ];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <LayoutTemplate className="w-4 h-4 mr-2" />
        Choose Template
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={clsx(
              'flex flex-col items-center p-3 border rounded-lg transition-all',
              currentTemplate === template.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className="w-full aspect-[210/297] bg-white border border-gray-100 mb-2 rounded shadow-sm overflow-hidden relative">
              {/* Mini preview placeholder */}
              <div className="absolute inset-0 bg-gray-50 opacity-50" />
              <div className="absolute top-2 left-2 right-2 h-2 bg-gray-200 rounded" />
              <div className="absolute top-6 left-2 w-1/3 h-2 bg-gray-200 rounded" />
              <div className="absolute top-10 left-2 right-2 bottom-2 bg-gray-100 rounded" />
            </div>
            <span className="text-xs font-medium text-gray-900">{template.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
