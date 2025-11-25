/**
 * Enhanced PDF Text Extraction
 * 
 * Extracts text from PDF files while preserving structure:
 * - Multi-page support
 * - Line breaks and paragraph boundaries
 * - Section headings
 * - Bullet points and list items
 * 
 * This produces rich rawText suitable for Gemini parsing.
 */

import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extract text from PDF with structure preservation
 */
export const parsePDF = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const pages: string[] = [];

    // Extract ALL pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Build page text with structure preservation
      let pageText = '';
      let lastY = -1;
      const lineHeight = 12; // Approximate line height threshold
      
      for (const item of textContent.items) {
        const textItem = item as any;
        
        // Detect new line based on Y position change
        if (lastY !== -1 && Math.abs(textItem.transform[5] - lastY) > lineHeight) {
          pageText += '\n';
        }
        
        // Add the text
        pageText += textItem.str;
        
        // Add space if item doesn't end with whitespace
        if (textItem.str && !textItem.str.match(/[\s\n]$/)) {
          pageText += ' ';
        }
        
        lastY = textItem.transform[5];
      }
      
      pages.push(pageText.trim());
    }

    // Join all pages with clear separation
    const fullText = pages.join('\n\n=== PAGE BREAK ===\n\n');
    
    // Clean text while preserving structure
    return cleanTextPreserveStructure(fullText);
    
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure the PDF is not corrupted or password-protected.');
  }
};

/**
 * Clean text while preserving structure
 * - Removes only garbage characters
 * - Keeps section headings, bullets, line breaks
 */
function cleanTextPreserveStructure(text: string): string {
  return text
    // Remove only control characters (except newlines and tabs)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    // Remove unicode replacement characters and other specials
    .replace(/[\uFFFD\uFFF0-\uFFFF]/g, '')
    // Normalize multiple spaces to single space (but keep newlines)
    .replace(/ {2,}/g, ' ')
    // Normalize excessive newlines (max 3)
    .replace(/\n{4,}/g, '\n\n\n')
    // Trim and return
    .trim();
}
