import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { clsx } from 'clsx';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const PRESET_COLORS = [
  { color: '#000000', label: 'Black' },
  { color: '#374151', label: 'Gray' },
  { color: '#6B7280', label: 'Light Gray' },
  { color: '#1E40AF', label: 'Blue' },
  { color: '#0EA5E9', label: 'Sky' },
  { color: '#10B981', label: 'Green' },
  { color: '#F59E0B', label: 'Amber' },
  { color: '#EF4444', label: 'Red' },
  { color: '#8B5CF6', label: 'Purple' },
  { color: '#EC4899', label: 'Pink' },
  { color: '#FFFFFF', label: 'White' },
  { color: '#9CA3AF', label: 'Muted' }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, label = 'Color' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-8 h-8 md:w-9 md:h-9 rounded border-2 flex items-center justify-center transition-all hover:scale-105",
          isOpen ? "border-blue-500" : "border-gray-300"
        )}
        style={{ backgroundColor: value }}
        title={label}
        type="button"
      >
        <Palette 
          className="w-4 h-4" 
          style={{ 
            color: value === '#FFFFFF' || value === '#F3F4F6' ? '#000' : '#FFF',
            filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.3))'
          }} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 bg-white shadow-xl rounded-lg border border-gray-200 p-3 z-50 min-w-[200px]">
          <div className="text-xs font-medium text-gray-700 mb-2">Select Color</div>
          
          {/* Preset colors */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map(({ color, label: colorLabel }) => (
              <button
                key={color}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
                className={clsx(
                  "w-10 h-10 rounded border-2 hover:scale-110 transition-transform",
                  value === color ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"
                )}
                style={{ backgroundColor: color }}
                title={colorLabel}
                type="button"
              />
            ))}
          </div>

          {/* Custom color input */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Custom Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={value.toUpperCase()}
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (/^#[0-9A-F]{6}$/i.test(newColor)) {
                    onChange(newColor);
                  }
                }}
                className="w-20 h-10 px-2 text-xs font-mono border border-gray-200 rounded"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
