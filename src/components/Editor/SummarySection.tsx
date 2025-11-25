import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import { Sparkles } from 'lucide-react';
import { AISuggestionModal } from './AISuggestionModal';
import { optimizeSummary, SectionSuggestionResult } from '../../services/gemini';

const SummarySection: React.FC = () => {
  const { resumeData, updateSummary, updateMetadata } = useResume();
  const { rawText } = resumeData.summary;

  // AI Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suggestionData, setSuggestionData] = useState<SectionSuggestionResult['suggestions'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleUpdateSummary = (text: string) => {
    updateSummary({ rawText: text });
  };

  const handleOptimize = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    setError(undefined);
    setSuggestionData(null);

    try {
      let jd = resumeData.metadata.targetJobDescription;
      if (!jd) {
        const input = window.prompt("Please enter the Target Job Description to optimize for:");
        if (!input) {
          setIsModalOpen(false);
          setIsLoading(false);
          return;
        }
        jd = input;
        updateMetadata({ targetJobDescription: jd });
      }

      const result = await optimizeSummary(rawText, jd);
      console.log('[SummarySection] API Result:', result);
      console.log('[SummarySection] Suggestions:', result.suggestions);
      setSuggestionData(result.suggestions);
    } catch (err) {
      console.error('[SummarySection] Error:', err);
      setError("Failed to generate suggestions. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (data: { description: string }) => {
    updateSummary({ rawText: data.description });
  };

  const characterCount = rawText.length;
  const recommendedMax = 500;

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Professional Summary</h3>
        <div className="flex items-center gap-3">
          <span className={`text-sm ${characterCount > recommendedMax ? 'text-orange-600' : 'text-gray-500'}`}>
            {characterCount} / {recommendedMax} characters
          </span>
          <button
            onClick={handleOptimize}
            className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-full hover:bg-purple-700 transition-colors shadow-sm"
            title="Optimize with AI"
          >
            <Sparkles className="w-3 h-3 mr-1.5" />
            Optimize
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
        <textarea
          rows={6}
          value={rawText}
          onChange={(e) => handleUpdateSummary(e.target.value)}
          placeholder="Write a compelling professional summary that highlights your key skills, experience, and career objectives..."
          className="w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-3 border focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="mt-2 text-xs text-gray-500">
          💡 Tip: Keep it concise (3-5 sentences) and tailored to your target role. Use the Optimize button to get AI suggestions based on your target job.
        </p>
      </div>

      <AISuggestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sectionTitle="Professional Summary"
        originalData={{
          description: rawText,
          highlights: []
        }}
        suggestionData={suggestionData 
          ? {
              descriptionRaw: suggestionData.suggestedText || suggestionData.suggestedDescription || '',
              highlights: (suggestionData.suggestedHighlights || []).map(h => ({
                suggested: h
              }))
            }
          : null
        }
        onApply={handleApplySuggestion}
        isLoading={isLoading}
        error={error}
      />
    </section>
  );
};

export default SummarySection;
