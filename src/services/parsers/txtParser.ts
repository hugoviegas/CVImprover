/**
 * TXT Text Extraction
 * 
 * Reads plain text files with:
 * - UTF-8 encoding
 * - Original structure preservation
 * - Minimal normalization
 */

/**
 * Extract text from TXT file
 */
export const parseTXT = async (file: File): Promise<string> => {
  try {
    // Read as UTF-8 text
    const text = await file.text();
    
    // Minimal cleaning - preserve original structure
    return text
      .replace(/\r\n/g, '\n') // Normalize line endings
      .replace(/\r/g, '\n')
      .trim();
      
  } catch (error) {
    console.error('Error parsing TXT:', error);
    throw new Error('Failed to parse TXT file. Please ensure the file is valid UTF-8 text.');
  }
};
