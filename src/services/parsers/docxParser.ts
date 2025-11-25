/**
 * Enhanced DOCX Text Extraction
 * 
 * Extracts text from DOCX files while preserving:
 * - Paragraph boundaries
 * - List items and bullet points
 * - Section headings
 * - Logical document structure
 * 
 * Uses mammoth for reliable extraction.
 */

import mammoth from 'mammoth';

/**
 * Extract text from DOCX with structure preservation
 */
export const parseDOCX = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use mammoth with options to preserve structure
    const result = await mammoth.extractRawText({ 
      arrayBuffer,
    });
    
    // Mammoth already preserves line breaks and paragraphs
    // Just clean up excessive whitespace
    return cleanTextPreserveStructure(result.value);
    
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Please ensure the file is not corrupted or password-protected.');
  }
};

/**
 * Clean text while preserving structure
 */
function cleanTextPreserveStructure(text: string): string {
  return text
    // Normalize line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive blank lines (max 3)
    .replace(/\n{4,}/g, '\n\n\n')
    // Normalize spaces within lines
    .replace(/[ \t]{2,}/g, ' ')
    // Trim and return
    .trim();
}
