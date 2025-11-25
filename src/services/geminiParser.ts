/**
 * Gemini-Powered Resume Parser
 * 
 * Uses Google Gemini 2.5 Flash to intelligently parse resume text
 * into structured JSON data.
 * 
 * CONFIGURATION:
 * - Set VITE_GEMINI_API_KEY in .env file
 * - Model: gemini-2.5-flash-lite (fast, cost-effective)
 * - Response type: TEXT only (JSON output)
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { ResumeData } from '../types/resume';
import { validateResumeJson, sanitizeResumeData } from '../utils/resumeValidator';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL_NAME = import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite';
const PARSING_TIMEOUT = parseInt(import.meta.env.VITE_PARSING_TIMEOUT_MS || '30000');
const MAX_RETRIES = parseInt(import.meta.env.VITE_PARSING_MAX_RETRIES || '3');

const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generate the strict JSON-only prompt for Gemini
 */
function generateParsingPrompt(input: {
  fileFormat: string;
  fileName: string;
  languageHint: string;
  rawText: string;
}): string {
  return `You are a DETERMINISTIC RESUME PARSING ENGINE. Your sole purpose is to parse resume text into structured JSON.

INPUT METADATA:
- File Format: ${input.fileFormat}
- File Name: ${input.fileName}
- Language: ${input.languageHint}

RAW RESUME TEXT:
"""
${input.rawText}
"""

YOUR TASK:
Parse the above resume and output ONLY valid JSON matching this EXACT schema with EXACT field names.

CRITICAL RULES:
1. Output ONLY JSON. No markdown, no code fences, no explanations, no preamble.
2. First character must be '{', last character must be '}'.
3. Do NOT hallucinate data. If a field is missing, use empty string "" or empty array [].
4. Place unrecognized content in "unmappedBlocks" with a clear reason.
5. Extract dates exactly as found (e.g., "01/2020", "2020-2023", "Jan 2020").
6. Ensure all objects have unique "id" fields (generate UUIDs).

⚠️ CRITICAL FIELD NAMES - USE EXACTLY AS SHOWN:

EXPERIENCE STRUCTURE (MANDATORY FIELD NAMES):
{
  "experience": [{
    "id": "unique-uuid",
    "position": "IT Support Specialist | System Administrator",  ⚠️ USE "position" NOT "jobTitle"
    "company": "Company Name",
    "city": "Dublin",                                            ⚠️ USE "city" NOT "location"
    "country": "Ireland",                                        ⚠️ SEPARATE from city
    "startDate": "22/09/2024",
    "endDate": "",                                               ⚠️ Empty string if current=true
    "current": true,                                             ⚠️ BOOLEAN - true if still working
    "descriptionRaw": "Full description...",                     ⚠️ USE "descriptionRaw" NOT "description"
    "highlights": ["Bullet point 1", "Bullet point 2"]          ⚠️ Extract each bullet as array item
  }]
}

EDUCATION STRUCTURE (MANDATORY FIELD NAMES):
{
  "education": [{
    "id": "unique-uuid",
    "degree": "Bachelor of Science (Honours)",                   
    "course": "Software Engineering",                            ⚠️ REQUIRED - specific course/major
    "institution": "CCT College",
    "city": "Dublin",                                            ⚠️ USE "city" NOT "location"
    "country": "Ireland",                                        ⚠️ SEPARATE from city
    "startDate": "16/09/2024",
    "endDate": "",                                               ⚠️ Empty if current=true
    "current": true,                                             ⚠️ BOOLEAN - true if still studying
    "finalGrade": "First Class",                                 ⚠️ USE "finalGrade" NOT "grade"
    "levelEQF": "EQF level 8",                                   ⚠️ USE "levelEQF" NOT "eqfLevel"
    "descriptionRaw": "Main subjects: ...",                      ⚠️ Extract subjects/topics
    "highlights": []
  }]
}

PROJECTS STRUCTURE (MANDATORY FIELD NAMES):
{
  "projects": [{
    "id": "unique-uuid",
    "title": "Full-Stack Web Application",                       ⚠️ USE "title" NOT "name"
    "role": "Full-Stack Web Developer",                         ⚠️ REQUIRED - developer role
    "clientOrCompany": "D'Arcy McGee's Pub",                    ⚠️ REQUIRED - who was it for
    "startDate": "01/07/2025",
    "endDate": "12/09/2025",
    "descriptionRaw": "Full project description...",
    "technologies": ["React.js", "Node.js", "SQL"],             ⚠️ ARRAY of technologies used
    "links": ["www.example.com"]                                ⚠️ USE "links" (array) NOT "url" (string)
  }]
}

LANGUAGES STRUCTURE (MANDATORY FIELD NAMES):
{
  "languages": [{
    "id": "unique-uuid",
    "language": "English",
    "level": "C1 - Advanced",
    "details": "Listening: C1, Reading: C1, Writing: C1, Speaking: C1"  ⚠️ String NOT object
  }]
}

PERSONAL INFO STRUCTURE:
{
  "personalInfo": {
    "fullName": "Hugo Viegas",
    "email": "email@example.com",
    "phone": "+353 123456789",
    "location": "Dublin, Ireland",                               ⚠️ Combined city, country
    "nationality": "Brazilian",
    "workPermit": "Irish",
    "dateOfBirth": "10/01/2000",
    "website": "https://example.com",
    "linkedin": "linkedin.com/in/username",
    "otherContacts": []
  }
}

SUMMARY STRUCTURE (SEPARATE FROM personalInfo):
{
  "summary": {
    "rawText": "Full professional summary text here..."         ⚠️ NOT inside personalInfo
  }
}

SKILLS STRUCTURE:
{
  "skills": {
    "rawBlocks": ["RAW SKILL BLOCK TEXT 1", "RAW SKILL BLOCK TEXT 2"],
    "categorized": {
      "infrastructureAndSystems": ["Windows Server", "Active Directory"],
      "networkAndSecurity": ["TCP/IP", "Network troubleshooting"],
      "programmingAndScripting": ["JavaScript", "Python", "SQL"],
      "other": []
    }
  }
}

CERTIFICATIONS STRUCTURE:
{
  "certifications": [{
    "id": "unique-uuid",
    "name": "Certification Name",
    "issuer": "Issuing Organization",
    "date": "2024",
    "descriptionRaw": "Description if any"
  }]
}

COMPLETE JSON STRUCTURE:
{
  "metadata": {
    "sourceFormat": "${input.fileFormat}",
    "fileName": "${input.fileName}",
    "languageGuess": "${input.languageHint}"
  },
  "personalInfo": { ... },
  "summary": { "rawText": "..." },
  "experience": [ ... ],
  "education": [ ... ],
  "skills": { ... },
  "languages": [ ... ],
  "projects": [ ... ],
  "certifications": [ ... ],
  "customSections": [],
  "unmappedBlocks": []
}

OUTPUT FORMAT:
Return ONLY the JSON object with the EXACT field names shown above. No additional text.`;
}

/**
 * Parse resume text using Gemini 2.5 Flash
 */
export async function parseResumeWithGemini(input: {
  fileFormat: 'pdf' | 'docx' | 'txt';
  fileName: string;
  languageHint?: 'pt' | 'en' | 'mixed' | 'unknown';
  rawText: string;
}): Promise<ResumeData> {
  if (!API_KEY) {
    console.error('Missing Gemini API key');
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in .env file.');
  }

  const prompt = generateParsingPrompt({
    fileFormat: input.fileFormat,
    fileName: input.fileName,
    languageHint: input.languageHint || 'unknown',
    rawText: input.rawText,
  });

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[Gemini Parser] Attempt ${attempt}/${MAX_RETRIES}...`);
      
      const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
      });

      // Set timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Parsing timeout')), PARSING_TIMEOUT);
      });

      // Make the API call
      const resultPromise = model.generateContent(prompt);
      const result = await Promise.race([resultPromise, timeoutPromise]);

      const response = await result.response;
      const textResponse = response.text();

      console.log('[Gemini Parser] Raw response length:', textResponse.length);

      // Extract JSON from response
      let jsonText = textResponse.trim();
      
      // Remove markdown code fences if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }

      // Ensure it starts with { and ends with }
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error('Response does not contain valid JSON');
      }
      
      jsonText = jsonText.substring(firstBrace, lastBrace + 1);

      // Parse JSON
      const parsedData = JSON.parse(jsonText);

      // Validate structure
      const validation = validateResumeJson(parsedData);
      if (!validation.valid) {
        console.warn('[Gemini Parser] Validation warnings:', validation.errors);
      }

      // Sanitize and ensure compliance
      const sanitizedData = sanitizeResumeData(parsedData);

      // Update metadata
      sanitizedData.metadata.sourceFormat = input.fileFormat;
      sanitizedData.metadata.fileName = input.fileName;
      if (input.languageHint) {
        sanitizedData.metadata.languageGuess = input.languageHint;
      }

      console.log('[Gemini Parser] Successfully parsed resume');
      return sanitizedData;

    } catch (error) {
      lastError = error as Error;
      console.error(`[Gemini Parser] Attempt ${attempt} failed:`, error);
      
      // Don't retry on JSON parse errors - the response is bad
      if (error instanceof SyntaxError) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < MAX_RETRIES) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`[Gemini Parser] Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  console.error('[Gemini Parser] All parsing attempts failed');
  throw new Error(
    `Failed to parse resume: ${lastError?.message || 'Unknown error'}. Please try again or contact support.`
  );
}

/**
 * Legacy function for AI suggestions (keep for backwards compatibility)
 */
export const generateResumeSuggestion = async (
  currentText: string,
  jobDescription: string,
  sectionType: 'summary' | 'experience' | 'education'
): Promise<string> => {
  if (!API_KEY) {
    return 'Please provide a Gemini API Key in .env to use AI features.';
  }

  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
      You are an expert resume consultant.
      I need you to rewrite the following ${sectionType} section of a resume to better match the provided job description.
      
      Job Description:
      ${jobDescription}
      
      Current ${sectionType}:
      ${currentText}
      
      Please provide a polished, professional, and ATS-friendly version of the ${sectionType}.
      Return ONLY the rewritten text, no explanations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating suggestion:', error);
    return 'Failed to generate suggestion. Please try again.';
  }
};
