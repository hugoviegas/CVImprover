/**
 * PDF Export Service
 * 
 * Handles exporting resume data to PDF with two modes:
 * 1. Original Template - Use user's uploaded PDF as template
 * 2. System Template - Use application's built-in template
 */

import { ResumeData } from '../types/resume';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export type ExportMode = 'original' | 'system';

/**
 * Export resume to PDF
 * 
 * @param mode - Export mode ('original' or 'system')
 * @param resumeData - Resume data to export
 * @param originalPdfBytes - Original PDF bytes (if mode is 'original')
 * @returns PDF blob
 */
export async function exportResumePDF(
  mode: ExportMode,
  resumeData: ResumeData,
  originalPdfBytes?: Uint8Array
): Promise<Blob> {
  if (mode === 'original') {
    if (!originalPdfBytes) {
      console.warn('[PDF Export] Original PDF not available, falling back to system template');
      return exportWithSystemTemplate(resumeData);
    }

    try {
      // Try to export with original template
      const { exportWithOriginalTemplate } = await import('./exportOriginalTemplate');
      return await exportWithOriginalTemplate(originalPdfBytes, resumeData);
    } catch (error) {
      console.error('[PDF Export] Original template export failed:', error);
      // Fallback to system template
      return exportWithSystemTemplate(resumeData);
    }
  } else {
    return exportWithSystemTemplate(resumeData);
  }
}

/**
 * Export using system HTML template
 * 
 * Uses html2canvas + jsPDF to convert the preview to PDF
 */
export async function exportWithSystemTemplate(resumeData: ResumeData): Promise<Blob> {
  // Get the preview element
  const previewElement = document.querySelector('[data-resume-preview]') as HTMLElement;
  
  if (!previewElement) {
    throw new Error('Preview element not found');
  }

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(previewElement, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
    });

    // Create PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Return as blob
    return pdf.output('blob');
  } catch (error) {
    console.error('[PDF Export] System template export failed:', error);
    throw new Error('Failed to generate PDF from template');
  }
}

/**
 * Trigger download of PDF blob
 */
export function downloadPDF(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
