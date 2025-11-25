import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StructuredEditor } from './StructuredEditor';
import { RawEditor } from './RawEditor';
import ResumePreview from '../Preview/ResumePreview';
import { FileUpload } from '../Upload/FileUpload';
import { Layout, Code, Eye, Upload, Save, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import { useResume } from '../../context/ResumeContext';
import { ResumeData } from '../../types/resume';
import { MobileTabNav, MobileTab } from './MobileTabNav';
import { useIsDesktop } from '../../hooks/useMediaQuery';
import { TemplateAndThemeSelector } from '../Templates/TemplateAndThemeSelector';

type EditorMode = 'import' | 'structured' | 'raw' | 'templates';

export const ResumeEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveToRepository } = useResume();
  const isDesktop = useIsDesktop();
  
  const initialTab = searchParams.get('tab') === 'import' ? 'import' : 'structured';
  const [mode, setMode] = useState<EditorMode>(initialTab);
  const [mobileTab, setMobileTab] = useState<MobileTab>('edit');

  const handleImportComplete = (data: ResumeData) => {
    console.log('[ResumeEditor] Import complete, switching to structured editor');
    setMode('structured');
  };

  const handleSave = () => {
    const id = saveToRepository();
    console.log('[ResumeEditor] Resume saved with ID:', id);
    alert('Resume saved successfully!');
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-50">
      {/* Mobile Tab Navigation - Only visible on mobile */}
      {!isDesktop && (
        <MobileTabNav activeTab={mobileTab} onTabChange={setMobileTab} />
      )}

      {/* Left Column/Panel: Editor */}
      <div className={clsx(
        'flex flex-col border-gray-200 bg-white overflow-hidden',
        // Mobile: Full width, hide when preview tab active
        !isDesktop && mobileTab === 'preview' && 'hidden',
        !isDesktop && mobileTab === 'edit' && 'flex-1',
        // Desktop: Fixed 50% width, always visible
        isDesktop && 'w-1/2 border-r'
      )}>
        {/* Toolbar */}
        <div className="border-b border-gray-200 px-3 md:px-4 py-3 flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex space-x-1 md:space-x-2 overflow-x-auto">
            <button
              onClick={() => setMode('import')}
              className={clsx(
                'inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                mode === 'import'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Upload className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={() => setMode('structured')}
              className={clsx(
                'inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                mode === 'structured'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Layout className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Structured</span>
            </button>
            <button
              onClick={() => setMode('raw')}
              className={clsx(
                'inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                mode === 'raw'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Code className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Raw</span>
            </button>
            <button
              onClick={() => setMode('templates')}
              className={clsx(
                'inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap',
                mode === 'templates'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Palette className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Templates</span>
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-green-600 text-white rounded-md text-xs md:text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
            >
              <Save className="h-4 w-4 md:mr-2" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="hidden md:inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Editor Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            {mode === 'import' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-purple-600" />
                    Import Your Resume
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4">
                    Upload your existing resume in PDF, DOCX, or TXT format. Choose Enhanced AI Import for automatic text refinement.
                  </p>
                </div>
                <FileUpload onUpload={handleImportComplete} />
                <div className="text-center text-xs md:text-sm text-gray-500 mt-8">
                  After importing, switch to <strong>Structured</strong> or <strong>Raw Data</strong> tabs to edit your resume.
                </div>
              </div>
            )}
            {mode === 'structured' && <StructuredEditor />}
            {mode === 'raw' && <RawEditor />}
            {mode === 'templates' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-blue-600" />
                    Template & Theme Settings
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose your resume template and customize colors for a professional look.
                  </p>
                </div>
                <TemplateAndThemeSelector />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column/Panel: Preview */}
      <div className={clsx(
        'flex flex-col bg-gray-100 overflow-hidden',
        // Mobile: Full width, hide when edit tab active
        !isDesktop && mobileTab === 'edit' && 'hidden',
        !isDesktop && mobileTab === 'preview' && 'flex-1',
        // Desktop: Fixed 50% width, always visible
        isDesktop && 'w-1/2'
      )}>
        {/* Header - Only show on desktop */}
        {isDesktop && (
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-white flex-shrink-0">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-gray-500" />
              Live Preview
            </h2>
          </div>
        )}

        {/* Preview Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8 flex justify-center">
            <div className="w-full max-w-[210mm] scale-75 md:scale-90 lg:scale-100 origin-top">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;
