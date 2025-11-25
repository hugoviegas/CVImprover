/**
 * Master Document Parser
 * 
 * Routes file parsing to the appropriate parser based on file type.
 * Supports PDF, DOCX, and TXT formats.
 * 
 * Returns an ImportedResume object containing:
 * - fileFormat: The detected format
 * - fileName: Original file name
 * - rawText: Extracted text with structure preserved
 */

import { parsePDF } from './pdfParser';
import { parseDOCX } from './docxParser';
import { parseTXT } from './txtParser';

/**
 * Result of document import with metadata
 */
export interface ImportedResume {
  fileFormat: 'pdf' | 'docx' | 'txt';
  fileName: string;
  rawText: string;
}

/**
 * Main entry point for document parsing
 * 
 * @param file - The uploaded file to parse
 * @returns ImportedResume object with extracted text and metadata
 * @throws Error if unsupported format or parsing fails
 */
export const parseDocument = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await parsePDF(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return await parseDOCX(file);
  } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return await parseTXT(file);
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  }
};

/**
 * Import a resume file with full metadata
 * 
 * This function extracts text and packages it with metadata
 * for downstream processing by the Gemini parser.
 */
export const importResume = async (file: File): Promise<ImportedResume> => {
  // Determine file format
  const fileName = file.name.toLowerCase();
  let fileFormat: 'pdf' | 'docx' | 'txt';
  
  if (fileName.endsWith('.pdf')) {
    fileFormat = 'pdf';
  } else if (fileName.endsWith('.docx')) {
    fileFormat = 'docx';
  } else if (fileName.endsWith('.txt')) {
    fileFormat = 'txt';
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  }

  // Extract text
  const rawText = await parseDocument(file);

  // Return structured result
  return {
    fileFormat,
    fileName: file.name,
    rawText
  };
};
