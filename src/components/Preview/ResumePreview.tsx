import React, { useRef, useState, useEffect } from 'react';
import { useResume } from '../../context/ResumeContext';
import { useReactToPrint } from 'react-to-print';
import { Download, Edit3, Eye } from 'lucide-react';
import { PaginatedPreview } from './PaginatedPreview';

import { PDFEditorProvider, usePDFEditor } from '../Editor/PDFEditor/PDFEditorProvider';
import { FormattingToolbar } from '../Editor/PDFEditor/FormattingToolbar';
import { clsx } from 'clsx';

const ResumePreviewContent: React.FC = () => {
  const { resumeData, undo, redo, canUndo, canRedo, currentTemplate } = useResume();
  const componentRef = useRef<HTMLDivElement>(null);
  const { isEditMode, setEditMode } = usePDFEditor();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resumeData.personalInfo.fullName || 'Resume'}`,
  });

  // Undo/Redo Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) redo();
        } else {
          if (canUndo) undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Formatting Toolbar - only visible in edit mode */}
      <FormattingToolbar />
      
      {/* Fixed Top Bar - Same style as Edit tab */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Edit Mode Toggle */}
          <button
            onClick={() => setEditMode(!isEditMode)}
            className={clsx(
              'inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isEditMode
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            {isEditMode ? (
              <>
                <Edit3 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Editing</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Preview</span>
              </>
            )}
          </button>

          {/* Info Message */}
          {isEditMode && (
            <span className="hidden md:inline text-xs text-gray-500">
              Click text to edit • Select to format
            </span>
          )}
        </div>

        {/* Download Button */}
        <button
          onClick={() => handlePrint()}
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
        >
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Download PDF</span>
        </button>
      </div>

      {/* Preview Area - Scrollable with optimized spacing */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 flex justify-center">
          {/* A4 Paper Container with better scaling */}
          <div
            ref={componentRef}
            data-resume-preview
            className="bg-white shadow-lg print:shadow-none transform-gpu"
            style={{
              width: '210mm',
              minHeight: '297mm',
              maxWidth: '100%',
            }}
          >
            <PaginatedPreview data={resumeData} templateId={currentTemplate} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumePreview: React.FC = () => {
  return (
    <PDFEditorProvider>
      <ResumePreviewContent />
    </PDFEditorProvider>
  );
};

export default ResumePreview;
