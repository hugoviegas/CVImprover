import React from 'react';
import { Edit3, Eye, Info } from 'lucide-react';
import { usePDFEditor } from './PDFEditorProvider';
import { clsx } from 'clsx';

export const EditorControls: React.FC = () => {
  const { isEditMode, setEditMode } = usePDFEditor();

  return (
    <div className="flex items-center justify-between gap-3 p-3 md:p-4 bg-white border-b border-gray-200">
      <button
        onClick={() => setEditMode(!isEditMode)}
        className={clsx(
          'px-3 md:px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm md:text-base',
          isEditMode
            ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        )}
      >
        {isEditMode ? (
          <>
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">Editing Mode</span>
            <span className="sm:hidden">Edit</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Enable Editing</span>
            <span className="sm:hidden">View</span>
          </>
        )}
      </button>

      {isEditMode && (
        <div className="text-xs md:text-sm text-gray-500 flex items-center gap-1.5">
          <Info className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
          <span className="hidden md:inline">Click on any text to edit. Select to format.</span>
          <span className="md:hidden">Click text to edit</span>
        </div>
      )}
    </div>
  );
};
