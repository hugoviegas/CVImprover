import React from 'react';
import { clsx } from 'clsx';

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
}

const FONTS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Inter', label: 'Inter' }
];

export const FontPicker: React.FC<FontPickerProps> = ({ value, onChange }) => {
  // Normalize font value (remove quotes)
  const normalizedValue = value.replace(/['"]/g, '').split(',')[0].trim();

  return (
    <select
      value={normalizedValue}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors cursor-pointer w-32 md:w-36"
      style={{ fontFamily: normalizedValue }}
    >
      {FONTS.map(font => (
        <option 
          key={font.value} 
          value={font.value} 
          style={{ fontFamily: font.value }}
        >
          {font.label}
        </option>
      ))}
    </select>
  );
};
