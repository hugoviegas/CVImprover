/**
 * Text Preprocessing Utilities for Resume Parsing
 * 
 * Cleans and normalizes raw text before sending to Gemini for parsing.
 */

/**
 * Normalizes line endings to \n
 */
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Removes garbage characters, icons, and special glyphs
 */
export function removeGarbageChars(text: string): string {
  // Remove zero-width characters
  let cleaned = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
  
  // Remove common PDF extraction artifacts
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
  
  // Remove excessive whitespace
  cleaned = cleaned.replace(/ {3,}/g, '  '); // max 2 spaces
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n'); // max 3 newlines
  
  return cleaned;
}

/**
 * Detects the primary language of the resume text
 */
export function detectLanguage(text: string): 'pt' | 'en' | 'mixed' | 'unknown' {
  const lowerText = text.toLowerCase();
  
  // Portuguese indicators
  const ptIndicators = [
    'experiência profissional',
    'formação académica',
    'formação',
    'educação',
    'competências',
    'habilidades',
    'idiomas',
    'línguas',
    'projetos',
    'certificados',
    'ção',
    'ões',
  ];
  
  // English indicators
  const enIndicators = [
    'work experience',
    'professional experience',
    'education',
    'academic background',
    'skills',
    'languages',
    'projects',
    'certifications',
    'responsibilities',
    'achievements',
  ];
  
  let ptScore = 0;
  let enScore = 0;
  
  for (const indicator of ptIndicators) {
    if (lowerText.includes(indicator)) ptScore++;
  }
  
  for (const indicator of enIndicators) {
    if (lowerText.includes(indicator)) enScore++;
  }
  
  if (ptScore === 0 && enScore === 0) return 'unknown';
  if (ptScore > 0 && enScore > 0) return 'mixed';
  if (ptScore > enScore) return 'pt';
  if (enScore > ptScore) return 'en';
  
  return 'unknown';
}

/**
 * Main preprocessing function
 * Combines all preprocessing steps
 */
export function preprocessResumeText(text: string): {
  cleaned: string;
  languageHint: 'pt' | 'en' | 'mixed' | 'unknown';
} {
  let cleaned = normalizeLineEndings(text);
  cleaned = removeGarbageChars(cleaned);
  const languageHint = detectLanguage(cleaned);
  
  return {
    cleaned: cleaned.trim(),
    languageHint,
  };
}
