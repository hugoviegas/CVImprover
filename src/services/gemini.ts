import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeData, Experience, Education, Project } from '../types/resume';
import { 
  getOptimizeSummaryPrompt,
  getOptimizeExperiencePrompt,
  getOptimizeEducationPrompt,
  getOptimizeProjectPrompt,
  getRefineImportPrompt
} from './aiPrompts';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';

const genAI = new GoogleGenerativeAI(API_KEY);

export interface SectionSuggestionResult {
  suggestions: {
    originalText?: string;
    suggestedText?: string;
    originalDescription?: string;
    suggestedDescription?: string;
    originalHighlights?: string[];
    suggestedHighlights?: string[];
    changes?: string[];
    keywordsAdded?: string[];
    keywordsUsed?: string[];
    verifyMetrics?: string[];
    reasoning?: string;
  };
}

/**
 * Clean JSON from markdown code blocks
 */
function cleanJson(text: string): string {
  let jsonText = text.trim();
  
  // Remove markdown code fences
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  
  // Find JSON object
  const firstBrace = jsonText.indexOf('{');
  const lastBrace = jsonText.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonText = jsonText.substring(firstBrace, lastBrace + 1);
  }
  
  return jsonText;
}

/**
 * Optimize Professional Summary
 */
export async function optimizeSummary(
  currentSummary: string,
  jobDescription: string
): Promise<SectionSuggestionResult> {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key. Please configure VITE_GEMINI_API_KEY in your .env file.");
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = getOptimizeSummaryPrompt(currentSummary, jobDescription);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJson(text);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error optimizing summary:', error);
    throw new Error('Failed to generate suggestions. Please try again.');
  }
}

/**
 * Suggest updates for experience section
 */
export async function suggestExperienceUpdate(
  experience: Experience,
  jobDescription: string
): Promise<SectionSuggestionResult> {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = getOptimizeExperiencePrompt(experience, jobDescription);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJson(text);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error optimizing experience:', error);
    throw new Error('Failed to generate suggestions. Please try again.');
  }
}

/**
 * Suggest updates for education section
 */
export async function suggestEducationUpdate(
  education: Education,
  jobDescription: string
): Promise<SectionSuggestionResult> {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = getOptimizeEducationPrompt(education, jobDescription);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJson(text);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error optimizing education:', error);
    throw new Error('Failed to generate suggestions. Please try again.');
  }
}

/**
 * Suggest updates for project section
 */
export async function suggestProjectUpdate(
  project: Project,
  jobDescription: string
): Promise<SectionSuggestionResult> {
  if (!API_KEY) {
    throw new Error("Missing Gemini API Key");
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = getOptimizeProjectPrompt(project, jobDescription);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJson(text);
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error optimizing project:', error);
    throw new Error('Failed to generate suggestions. Please try again.');
  }
}

/**
 * Legacy function - kept for backwards compatibility
 * Use specific functions above instead
 */
export async function suggestSectionUpdate(input: {
  sectionType: "experience" | "education" | "project" | "summary";
  currentContent: any;
  jobDescription: string;
}): Promise<SectionSuggestionResult> {
  switch (input.sectionType) {
    case 'summary':
      return optimizeSummary(
        typeof input.currentContent === 'string' ? input.currentContent : input.currentContent.rawText,
        input.jobDescription
      );
    case 'experience':
      return suggestExperienceUpdate(input.currentContent, input.jobDescription);
    case 'education':
      return suggestEducationUpdate(input.currentContent, input.jobDescription);
    case 'project':
      return suggestProjectUpdate(input.currentContent, input.jobDescription);
    default:
      throw new Error(`Unknown section type: ${input.sectionType}`);
  }
}

/**
 * Refine imported resume (cleanup phase)
 */
export async function refineImportedResume(data: ResumeData): Promise<ResumeData> {
  if (!API_KEY) {
    console.warn('No API key - skipping enhanced import');
    return data;
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const prompt = getRefineImportPrompt();

    const fullPrompt = `${prompt}\n\nRESUME DATA TO CLEAN:\n${JSON.stringify(data, null, 2)}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    const jsonText = cleanJson(text);
    const refined = JSON.parse(jsonText);

    return refined;
  } catch (error) {
    console.error('Error refining resume:', error);
    // Return original data if refinement fails
    return data;
  }
}
