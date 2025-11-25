import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { usePDFEditor } from './PDFEditorProvider';
import { FontPicker } from './FontPicker';
import { ColorPicker } from './ColorPicker';
import { useTextSelection } from '../../../hooks/useTextSelection';
import { useIsMobile } from '../../../hooks/useMediaQuery';
import { clsx } from 'clsx';

const FONT_SIZES = [
  { value: '1', label: '12px' },
  { value: '2', label: '14px' },
  { value: '3', label: '16px' },
  { value: '4', label: '18px' },
  { value: '5', label: '20px' },
  { value: '6', label: '24px' },
  { value: '7', label: '32px' }
];

export const FormattingToolbar: React.FC = () => {
  const { isEditMode, formatText, currentFormat } = usePDFEditor();
  const { hasSelection, position } = useTextSelection();
  const isMobile = useIsMobile();

  if (!isEditMode || !hasSelection) {
    return null;
  }

  const toolbarStyle: React.CSSProperties = isMobile
    ? {} // Mobile: fixed bottom via CSS classes
    : {
        position: 'fixed',
        top: `${Math.max(10, position.top)}px`,
        left: `${Math.max(10, Math.min(position.left, window.innerWidth - 420))}px`
      };

  return (
    <div
      className={clsx(
        'formatting-toolbar',
        isMobile && 'formatting-toolbar-mobile'
      )}
      style={toolbarStyle}
    >
      {/* Font Family */}
      <FontPicker
        value={currentFormat.fontFamily}
        onChange={(font) => formatText('fontName', font)}
      />

      {/* Font Size */}
      <select
        value={FONT_SIZES.find(s => s.label === currentFormat.fontSize)?.value || '3'}
        onChange={(e) => formatText('fontSize', e.target.value)}
        className="text-sm border border-gray-300 rounded px-2 py-1.5 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors w-20"
        title="Font Size"
      >
        {FONT_SIZES.map(size => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>

      <div className="toolbar-divider" />

      {/* Bold, Italic, Underline */}
      <button
        onClick={() => formatText('bold')}
        className={clsx(currentFormat.bold && 'active')}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => formatText('italic')}
        className={clsx(currentFormat.italic && 'active')}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => formatText('underline')}
        className={clsx(currentFormat.underline && 'active')}
        title="Underline (Ctrl+U)"
        type="button"
      >
        <Underline className="w-4 h-4" />
      </button>

      <div className="toolbar-divider" />

      {/* Color Picker */}
      <ColorPicker
        value={currentFormat.color}
        onChange={(color) => formatText('foreColor', color)}
        label="Text Color"
      />

      <div className="toolbar-divider hidden md:block" />

      {/* Alignment - Hidden on small mobile */}
      <div className="hidden sm:flex items-center gap-1">
        <button
          onClick={() => formatText('justifyLeft')}
          className={clsx(currentFormat.align === 'left' && 'active')}
          title="Align Left"
          type="button"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => formatText('justifyCenter')}
          className={clsx(currentFormat.align === 'center' && 'active')}
          title="Align Center"
          type="button"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => formatText('justifyRight')}
          className={clsx(currentFormat.align === 'right' && 'active')}
          title="Align Right"
          type="button"
        >
          <AlignRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
