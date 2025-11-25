import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, AlertCircle, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { parseResumeWithGemini } from '../../services/geminiParser';
import { refineImportedResume } from '../../services/gemini';
import { preprocessResumeText } from '../../utils/textPreprocessor';
import { generateFileHash, loadState } from '../../utils/resumeStorage';
import { useResume } from '../../context/ResumeContext';
import { ResumeData } from '../../types/resume';

interface FileUploadProps {
  onUpload: (data: ResumeData) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'extracting' | 'parsing' | 'refining' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [parsingProgress, setParsingProgress] = useState<string>('');
  const [importMode, setImportMode] = useState<'standard' | 'enhanced'>('standard');
  const { setResumeData, setImportedFile } = useResume();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploadStatus('extracting');
      setErrorMessage('');
      setParsingProgress('Extracting text from file...');

      try {
        // Step 1: Generate file hash for cache checking
        setParsingProgress('Checking cache...');
        const fileHash = await generateFileHash(file);
        
        // Check if we already have this file parsed
        const cached = loadState();
        if (cached?.imported?.fileHash === fileHash && cached.resume) {
          console.log('[FileUpload] Using cached resume data for file:', file.name);
          setResumeData(cached.resume);
          setImportedFile(cached.imported);
          onUpload(cached.resume);
          
          setUploadStatus('success');
          setParsingProgress('Resume loaded from cache!');
          
          setTimeout(() => {
            setUploadStatus('idle');
            setParsingProgress('');
          }, 3000);
          
          return;
        }
        
        // Step 2: Extract raw text from file
        setUploadStatus('extracting');
        setParsingProgress('Extracting text from file...');
        
        const { parseResume: extractText } = await import('../../utils/fileParser');
        const rawText = await extractText(file);
        
        if (!rawText || rawText.trim().length === 0) {
          throw new Error('Could not extract text from the file. The file may be empty or corrupted.');
        }

        // Step 3: Preprocess the text
        setParsingProgress('Cleaning and analyzing text...');
        const { cleaned, languageHint } = preprocessResumeText(rawText);
        
        // Determine file format
        const fileFormat = file.name.endsWith('.pdf') ? 'pdf' :
                          file.name.endsWith('.docx') ? 'docx' : 'txt';

        // Step 4: Parse with Gemini
        setUploadStatus('parsing');
        setParsingProgress('Analyzing resume with AI... This may take 10-30 seconds.');
        
        let parsedData = await parseResumeWithGemini({
          fileFormat,
          fileName: file.name,
          languageHint,
          rawText: cleaned,
        });

        // Step 4.5: Enhanced Import (Optional)
        if (importMode === 'enhanced') {
          setUploadStatus('refining');
          setParsingProgress('Refining text with AI (Enhanced Mode)...');
          try {
            parsedData = await refineImportedResume(parsedData);
          } catch (refineError) {
            console.warn('Enhanced import failed, falling back to standard parsing:', refineError);
            // Fallback to standard data, don't fail completely
          }
        }
        
        // Step 5: Save imported file metadata
        const importedFileMetadata = {
          fileName: file.name,
          fileFormat: fileFormat as 'pdf' | 'docx' | 'txt',
          fileHash,
          fileSize: file.size
        };
        setImportedFile(importedFileMetadata);
        
        // Step 6: Update state and notify parent
        setResumeData(parsedData);
        onUpload(parsedData);
        
        setUploadStatus('success');
        setParsingProgress('Resume parsed successfully!');
        
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setParsingProgress('');
        }, 3000);
        
      } catch (error) {
        console.error('Upload error:', error);
        setUploadStatus('error');
        
        const errorMsg = error instanceof Error ? error.message : 'Failed to process file';
        setErrorMessage(errorMsg);
        setParsingProgress('');
        
        // Log detailed error for debugging
        if (import.meta.env.VITE_ENABLE_DEBUG_LOGGING === 'true') {
          console.error('Detailed error:', error);
        }
      }
    },
    [onUpload, setResumeData, importMode]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: uploadStatus !== 'idle' && uploadStatus !== 'error',
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false),
  });

  const isProcessing = uploadStatus === 'extracting' || uploadStatus === 'parsing' || uploadStatus === 'refining';

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Import Mode Selection */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
          Import Mode
        </h3>
        <div className="flex gap-4">
          <label className={clsx(
            "flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-all",
            importMode === 'standard' ? "border-blue-500 bg-blue-50 ring-1 ring-blue-200" : "border-gray-200 hover:bg-gray-50"
          )}>
            <input 
              type="radio" 
              name="importMode" 
              value="standard" 
              checked={importMode === 'standard'} 
              onChange={() => setImportMode('standard')}
              className="mr-3"
              disabled={isProcessing}
            />
            <div>
              <div className="font-medium text-sm text-gray-900">Standard Import</div>
              <div className="text-xs text-gray-500">Fast parsing & field detection</div>
            </div>
          </label>
          
          <label className={clsx(
            "flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-all",
            importMode === 'enhanced' ? "border-purple-500 bg-purple-50 ring-1 ring-purple-200" : "border-gray-200 hover:bg-gray-50"
          )}>
            <input 
              type="radio" 
              name="importMode" 
              value="enhanced" 
              checked={importMode === 'enhanced'} 
              onChange={() => setImportMode('enhanced')}
              className="mr-3"
              disabled={isProcessing}
            />
            <div>
              <div className="font-medium text-sm text-gray-900">Enhanced AI Import</div>
              <div className="text-xs text-gray-500">Fixes grammar & improves clarity</div>
            </div>
          </label>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out bg-white',
          !isProcessing && 'cursor-pointer',
          isDragActive && !isProcessing
            ? 'border-blue-500 bg-blue-50/50'
            : 'border-gray-300',
          !isDragActive && !isProcessing && 'hover:border-gray-400 hover:bg-gray-50/50',
          uploadStatus === 'error' && 'border-red-300 bg-red-50/50',
          uploadStatus === 'success' && 'border-green-300 bg-green-50/50',
          isProcessing && 'cursor-not-allowed opacity-90'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={clsx(
            'p-4 rounded-full transition-colors',
            isDragActive && !isProcessing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600',
            uploadStatus === 'success' && 'bg-green-100 text-green-600',
            uploadStatus === 'error' && 'bg-red-100 text-red-600',
            isProcessing && 'bg-blue-100 text-blue-600'
          )}>
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : uploadStatus === 'success' ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : uploadStatus === 'error' ? (
              <AlertCircle className="w-8 h-8" />
            ) : (
              <Upload className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {uploadStatus === 'extracting' ? 'Extracting Text...' :
               uploadStatus === 'parsing' ? 'Parsing with AI...' :
               uploadStatus === 'refining' ? 'Refining Text with AI...' :
               uploadStatus === 'success' ? 'Resume Uploaded!' :
               'Upload your resume'}
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              {uploadStatus === 'error' ? errorMessage : 
               isProcessing ? parsingProgress :
               'Drag & drop or click to browse. Supports PDF, DOCX, and TXT.'}
            </p>
          </div>

          {uploadStatus === 'idle' && (
            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> PDF</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> DOCX</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1"><FileType className="w-3 h-3" /> TXT</span>
            </div>
          )}
          
          {uploadStatus === 'error' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadStatus('idle');
                setErrorMessage('');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
