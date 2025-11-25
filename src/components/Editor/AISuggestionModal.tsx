import React, { useState, useEffect } from 'react';
import { X, Check, Sparkles, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  originalData: {
    description?: string;
    highlights?: string[];
  };
  suggestionData: {
    descriptionRaw?: string;
    highlights?: { original?: string; suggested: string }[];
    summaryLine?: string;
  } | null;
  onApply: (data: { description: string; highlights: string[] }) => void;
  isLoading: boolean;
  error?: string;
}

export const AISuggestionModal: React.FC<AISuggestionModalProps> = ({
  isOpen,
  onClose,
  sectionTitle,
  originalData,
  suggestionData,
  onApply,
  isLoading,
  error
}) => {
  const [selectedDescription, setSelectedDescription] = useState<'original' | 'suggested'>('suggested');
  const [selectedHighlights, setSelectedHighlights] = useState<Set<number>>(new Set());

  // Reset state when modal opens or data changes
  useEffect(() => {
    if (isOpen && suggestionData) {
      setSelectedDescription('suggested');
      // Select all suggested highlights by default
      if (suggestionData.highlights) {
        const allIndices = new Set<number>(suggestionData.highlights.map((_, i) => i));
        setSelectedHighlights(allIndices);
      }
    }
  }, [isOpen, suggestionData]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!suggestionData) return;

    const finalDescription = selectedDescription === 'suggested' 
      ? (suggestionData.descriptionRaw || originalData.description || '') 
      : (originalData.description || '');

    const finalHighlights: string[] = [];
    
    if (suggestionData.highlights) {
      suggestionData.highlights.forEach((h, index) => {
        if (selectedHighlights.has(index)) {
          finalHighlights.push(h.suggested);
        } else if (h.original) {
           finalHighlights.push(h.original);
        }
      });
    }

    onApply({
      description: finalDescription,
      highlights: finalHighlights
    });
    onClose();
  };

  const toggleHighlight = (index: number) => {
    const newSet = new Set(selectedHighlights);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedHighlights(newSet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Optimization</h2>
              <p className="text-sm text-gray-500">Optimizing {sectionTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              <p className="text-gray-600 font-medium">Generating suggestions...</p>
              <p className="text-sm text-gray-400">Analyzing job description and best practices</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <button onClick={onClose} className="text-gray-600 hover:underline">Close</button>
            </div>
          ) : suggestionData ? (
            <div className="space-y-8">
              {/* Description Comparison */}
              {(suggestionData.descriptionRaw || originalData.description) && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-gray-500" />
                    Description / Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div 
                      className={clsx(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        selectedDescription === 'original' ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-200"
                      )}
                      onClick={() => setSelectedDescription('original')}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Original</span>
                        {selectedDescription === 'original' && <Check className="w-4 h-4 text-blue-500" />}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{originalData.description || '(No description)'}</p>
                    </div>

                    {/* Suggested */}
                    <div 
                      className={clsx(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        selectedDescription === 'suggested' ? "border-purple-500 bg-purple-50" : "border-gray-100 hover:border-gray-200"
                      )}
                      onClick={() => setSelectedDescription('suggested')}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" /> Suggested
                        </span>
                        {selectedDescription === 'suggested' && <Check className="w-4 h-4 text-purple-500" />}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{suggestionData.descriptionRaw || suggestionData.summaryLine}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Highlights Comparison */}
              {suggestionData.highlights && suggestionData.highlights.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <List className="w-4 h-4 mr-2 text-gray-500" />
                    Bullet Points
                  </h3>
                  <div className="space-y-3">
                    {suggestionData.highlights.map((item, index) => (
                      <div 
                        key={index}
                        className={clsx(
                          "flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all group",
                          selectedHighlights.has(index) ? "border-purple-500 bg-purple-50" : "border-gray-100 hover:border-gray-200"
                        )}
                        onClick={() => toggleHighlight(index)}
                      >
                        <div className={clsx(
                          "w-5 h-5 rounded border flex items-center justify-center mt-0.5 mr-4 flex-shrink-0 transition-colors",
                          selectedHighlights.has(index) ? "bg-purple-500 border-purple-500" : "border-gray-300 bg-white"
                        )}>
                          {selectedHighlights.has(index) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Original Side */}
                          <div className="text-sm text-gray-500 relative pr-4 md:border-r md:border-gray-200">
                            {item.original ? (
                              <>
                                <span className="text-xs font-bold text-gray-400 block mb-1">ORIGINAL</span>
                                {item.original}
                              </>
                            ) : (
                              <span className="text-xs italic text-gray-400">New suggestion</span>
                            )}
                          </div>
                          
                          {/* Suggested Side */}
                          <div className="text-sm text-gray-900 font-medium">
                            <span className="text-xs font-bold text-purple-600 block mb-1 flex items-center">
                              <Sparkles className="w-3 h-3 mr-1" /> IMPROVED
                            </span>
                            {item.suggested}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {selectedHighlights.size} changes selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isLoading || !suggestionData}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Selected Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for icons to avoid import errors if not available
const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const List = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
