import React from 'react';
import { Palette } from 'lucide-react';
import { clsx } from 'clsx';
import { useResume } from '../../context/ResumeContext';
import { TemplateSelector, TemplateType } from '../Templates/TemplateSelector';

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

const themes: Theme[] = [
  { id: 'blue', name: 'Blue', primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa' },
  { id: 'purple', name: 'Purple', primary: '#7c3aed', secondary: '#8b5cf6', accent: '#a78bfa' },
  { id: 'green', name: 'Green', primary: '#059669', secondary: '#10b981', accent: '#34d399' },
  { id: 'red', name: 'Red', primary: '#dc2626', secondary: '#ef4444', accent: '#f87171' },
  { id: 'orange', name: 'Orange', primary: '#ea580c', secondary: '#f97316', accent: '#fb923c' },
  { id: 'teal', name: 'Teal', primary: '#0d9488', secondary: '#14b8a6', accent: '#2dd4bf' },
];

export const TemplateAndThemeSelector: React.FC = () => {
  const { currentTemplate, setCurrentTemplate } = useResume();
  const [selectedTheme, setSelectedTheme] = React.useState<Theme>(themes[0]);

  const handleTemplateChange = (template: TemplateType) => {
    setCurrentTemplate(template);
  };

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary);
    document.documentElement.style.setProperty('--theme-accent', theme.accent);
  };

  // Determine if current template supports themes (has colors)
  const supportsThemes = currentTemplate === 'modern' || currentTemplate === 'europass';

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Resume Template
        </label>
        <TemplateSelector 
          currentTemplate={currentTemplate as TemplateType} 
          onSelect={handleTemplateChange}
        />
      </div>

      {/* Theme Selector - only for colored templates */}
      {supportsThemes && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Color Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme)}
                className={clsx(
                  'relative p-3 rounded-lg border-2 transition-all hover:scale-105',
                  selectedTheme.id === theme.id
                    ? 'border-blue-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex gap-1 mb-2">
                  <div 
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div 
                    className="w-full h-6 rounded"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-700 text-center">
                  {theme.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
