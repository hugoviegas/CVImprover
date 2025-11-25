/**
 * Export Section Component
 * 
 * Provides UI controls for exporting the resume to PDF
 * with options for original template or system template.
 */

import React, { useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { exportResumePDF, downloadPDF } from '../../services/pdfExportService';
import { clsx } from 'clsx';

export const ExportSection: React.FC = () => {
  const { resumeData, importedFile, exportMode, setExportMode, clearAllData } = useResume();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const hasOriginalPdf = importedFile?.fileFormat === 'pdf';

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      console.log('[Export] Starting PDF export in mode:', exportMode);
      
      // For now, we don't have original PDF bytes, so always use system template
      const pdfBlob = await exportResumePDF('system', resumeData);
      
      // Trigger download
      const fileName = `resume_${Date.now()}.pdf`;
      downloadPDF(pdfBlob, fileName);
      
      console.log('[Export] PDF downloaded successfully');
    } catch (error) {
      console.error('[Export] Export failed:', error);
      setExportError(error instanceof Error ? error.message : 'Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all resume data? This cannot be undone.')) {
      clearAllData();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-gray-500" />
          Export Resume
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Download your resume as a PDF file
        </p>
      </div>

      {/* Export Mode Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Export Template
        </label>
        
        <div className="space-y-2">
          {/* System Template Option */}
          <label className={clsx(
            'flex items-center p-3 rounded-md border-2 cursor-pointer transition-colors',
            exportMode === 'system'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          )}>
            <input
              type="radio"
              value="system"
              checked={exportMode === 'system'}
              onChange={() => setExportMode('system')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <span className="block text-sm font-medium text-gray-900">
                System Template
              </span>
              <span className="block text-xs text-gray-500">
                Use the application's built-in ATS-friendly template
              </span>
            </div>
          </label>

          {/* Original Template Option */}
          <label className={clsx(
            'flex items-center p-3 rounded-md border-2 transition-colors',
            !hasOriginalPdf && 'opacity-50 cursor-not-allowed',
            hasOriginalPdf && 'cursor-pointer',
            exportMode === 'original' && hasOriginalPdf
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200',
            hasOriginalPdf && exportMode !== 'original' && 'hover:border-gray-300'
          )}>
            <input
              type="radio"
              value="original"
              checked={exportMode === 'original'}
              onChange={() => setExportMode('original')}
              disabled={!hasOriginalPdf}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="ml-3 flex-1">
              <span className="block text-sm font-medium text-gray-900">
                Original PDF Template
                {!hasOriginalPdf && ' (Not Available)'}
              </span>
              <span className="block text-xs text-gray-500">
                {hasOriginalPdf 
                  ? `Use the layout from ${importedFile?.fileName || 'your uploaded PDF'}`
                  : 'Upload a PDF file to use this option'}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Export Error */}
      {exportError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-800">{exportError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={clsx(
            'flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white',
            isExporting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          )}
        >
          {isExporting ? (
            <>
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="-ml-1 mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </button>

        <button
          onClick={handleClearData}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Clear Data
        </button>
      </div>

      {/* File Info */}
      {importedFile && (
        <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
          <p>Imported: {importedFile.fileName}</p>
          <p>Format: {importedFile.fileFormat.toUpperCase()}</p>
          <p>Size: {(importedFile.fileSize / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
};

export default ExportSection;
