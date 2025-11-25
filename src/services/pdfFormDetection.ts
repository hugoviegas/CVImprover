/**
 * PDF Form Detection Service
 * 
 * Detects if a PDF has fillable form fields (AcroForm)
 * and provides information about the fields.
 */

import { PDFDocument } from 'pdf-lib';

export interface PdfFormInfo {
  hasFormFields: boolean;
  fieldCount: number;
  fieldNames: string[];
  isFormFillable: boolean;
}

/**
 * Analyze PDF to detect form fields
 * 
 * @param pdfBytes - PDF file as Uint8Array
 * @returns Form information
 */
export async function detectPdfFormFields(pdfBytes: Uint8Array): Promise<PdfFormInfo> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    const fieldNames = fields.map(field => field.getName());

    return {
      hasFormFields: fields.length > 0,
      fieldCount: fields.length,
      fieldNames,
      isFormFillable: fields.length > 0,
    };
  } catch (error) {
    console.error('[PDF Form Detection] Failed:', error);
    return {
      hasFormFields: false,
      fieldCount: 0,
      fieldNames: [],
      isFormFillable: false,
    };
  }
}

/**
 * Quick check if PDF is form-fillable
 */
export async function isFormFillablePdf(pdfBytes: Uint8Array): Promise<boolean> {
  const info = await detectPdfFormFields(pdfBytes);
  return info.isFormFillable;
}
