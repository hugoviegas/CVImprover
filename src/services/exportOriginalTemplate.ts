/**
 * Enhanced Original PDF Template Export
 * 
 * Fills form-fillable PDFs (AcroForm) with resume data.
 * Supports multiple field naming conventions and comprehensive field mapping.
 */

import { PDFDocument, PDFForm, PDFField, PDFTextField, PDFCheckBox } from 'pdf-lib';
import { ResumeData } from '../types/resume';

/**
 * Export resume using original PDF template
 * 
 * @param originalPdfBytes - Original PDF file bytes
 * @param resumeData - Resume data to inject
 * @returns PDF blob
 */
export async function exportWithOriginalTemplate(
  originalPdfBytes: Uint8Array,
  resumeData: ResumeData
): Promise<Blob> {
  try {
    // Load the original PDF
    const pdfDoc = await PDFDocument.load(originalPdfBytes);
    
    // Check if PDF has form fields
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    if (fields.length > 0) {
      console.log(`[Original Template] Found ${fields.length} form fields`);
      
      // List all field names for debugging
      fields.forEach(field => {
        console.log(`[Original Template] Field: "${field.getName()}" (${field.constructor.name})`);
      });
      
      // Fill form fields
      return await fillFormFields(pdfDoc, resumeData, form);
    } else {
      console.log('[Original Template] No form fields found - PDF is not form-fillable');
      throw new Error('PDF has no form fields. Only form-fillable PDFs are supported in original template mode.');
    }
  } catch (error) {
    console.error('[Original Template] Export failed:', error);
    throw error; // Re-throw to trigger fallback
  }
}

/**
 * Fill PDF form fields with resume data
 * Supports multiple naming conventions (camelCase, snake_case, spaces, etc.)
 */
async function fillFormFields(
  pdfDoc: PDFDocument,
  resumeData: ResumeData,
  form: PDFForm
): Promise<Blob> {
  // Build comprehensive field mapping
  const fieldMappings = buildFieldMappings(resumeData);
  
  // Try to fill each field
  const fields = form.getFields();
  let filledCount = 0;
  
  for (const field of fields) {
    const fieldName = field.getName();
    const normalizedName = normalizeFieldName(fieldName);
    
    // Try to find a value for this field
    const value = fieldMappings[normalizedName];
    
    if (value !== undefined && value !== null && value !== '') {
      try {
        if (field instanceof PDFTextField) {
          field.setText(String(value));
          filledCount++;
          console.log(`[Original Template] ✓ Filled "${fieldName}" with "${String(value).substring(0, 50)}..."`);
        } else if (field instanceof PDFCheckBox) {
          if (value === true || value === 'true' || value === '1') {
            field.check();
            filledCount++;
            console.log(`[Original Template] ✓ Checked "${fieldName}"`);
          }
        }
      } catch (error) {
        console.warn(`[Original Template] ✗ Could not fill field "${fieldName}":`, error);
      }
    } else {
      console.log(`[Original Template] - No mapping found for "${fieldName}"`);
    }
  }

  console.log(`[Original Template] Filled ${filledCount} out of ${fields.length} fields`);

  // Flatten form to make fields non-editable (optional)
  // form.flatten();

  // Save and return
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

/**
 * Build comprehensive field mapping from resume data
 * Maps various field name conventions to resume values
 */
function buildFieldMappings(resumeData: ResumeData): Record<string, string> {
  const mappings: Record<string, string> = {};

  // Personal Info - multiple variations
  const personalMappings = {
    // Name variations
    'fullname': resumeData.personalInfo.fullName,
    'name': resumeData.personalInfo.fullName,
    'fullnamecandidate': resumeData.personalInfo.fullName,
    'candidatename': resumeData.personalInfo.fullName,
    'applicantname': resumeData.personalInfo.fullName,
    
    // Email variations
    'email': resumeData.personalInfo.email,
    'emailaddress': resumeData.personalInfo.email,
    'emailid': resumeData.personalInfo.email,
    'contactemail': resumeData.personalInfo.email,
    
    // Phone variations
    'phone': resumeData.personalInfo.phone,
    'phonenumber': resumeData.personalInfo.phone,
    'mobile': resumeData.personalInfo.phone,
    'contact': resumeData.personalInfo.phone,
    'telephone': resumeData.personalInfo.phone,
    
    // Location variations
    'address': resumeData.personalInfo.location,
    'location': resumeData.personalInfo.location,
    'city': resumeData.personalInfo.location,
    'residence': resumeData.personalInfo.location,
    
    // Website/LinkedIn
    'website': resumeData.personalInfo.website,
    'portfolio': resumeData.personalInfo.website,
    'linkedin': resumeData.personalInfo.linkedin,
    'linkedinurl': resumeData.personalInfo.linkedin,
    
    // Other personal
    'nationality': resumeData.personalInfo.nationality,
    'workpermit': resumeData.personalInfo.workPermit,
    'dateofbirth': resumeData.personalInfo.dateOfBirth,
    'dob': resumeData.personalInfo.dateOfBirth,
  };

  Object.assign(mappings, personalMappings);

  // Summary/Objective
  const summaryMappings = {
    'summary': resumeData.summary.rawText,
    'objective': resumeData.summary.rawText,
    'profile': resumeData.summary.rawText,
    'aboutme': resumeData.summary.rawText,
    'professionsummary': resumeData.summary.rawText,
    'careerobj ective': resumeData.summary.rawText,
  };

  Object.assign(mappings, summaryMappings);

  // Experience - first entry
  if (resumeData.experience.length > 0) {
    const firstExp = resumeData.experience[0];
    const experienceMappings = {
      'currentposition': firstExp.position,
      'jobtitle': firstExp.position,
      'position': firstExp.position,
      'role': firstExp.position,
      'currentcompany': firstExp.company,
      'company': firstExp.company,
      'employer': firstExp.company,
      'organization': firstExp.company,
      'workexperience': firstExp.descriptionRaw,
      'experiencedescription': firstExp.descriptionRaw,
      'responsibilities': firstExp.descriptionRaw,
    };
    Object.assign(mappings, experienceMappings);
  }

  // Education - first entry  
  if (resumeData.education.length > 0) {
    const firstEdu = resumeData.education[0];
    const educationMappings = {
      'degree': firstEdu.degree,
      'qualification': firstEdu.degree,
      'education': firstEdu.degree,
      'school': firstEdu.institution,
      'university': firstEdu.institution,
      'college': firstEdu.institution,
      'institution': firstEdu.institution,
      'major': firstEdu.course,
      'fieldofstudy': firstEdu.course,
      'graduationyear': firstEdu.endDate,
      'yearofgraduation': firstEdu.endDate,
    };
    Object.assign(mappings, educationMappings);
  }

  // Skills - concatenate
  if (resumeData.skills.categorized) {
    const allSkills = [
      ...resumeData.skills.categorized.infrastructureAndSystems,
      ...resumeData.skills.categorized.networkAndSecurity,
      ...resumeData.skills.categorized.programmingAndScripting,
      ...resumeData.skills.categorized.other,
    ];
    const skillsText = allSkills.join(', ');
    
    mappings['skills'] = skillsText;
    mappings['technicalskills'] = skillsText;
    mappings['competencies'] = skillsText;
    mappings['expertise'] = skillsText;
  }

  // Languages - concatenate
  if (resumeData.languages.length > 0) {
    const languagesText = resumeData.languages
      .map(lang => `${lang.language} (${lang.level})`)
      .join(', ');
    
    mappings['languages'] = languagesText;
    mappings['languageskills'] = languagesText;
  }

  return mappings;
}

/**
 * Normalize field name for matching
 * Converts to lowercase, removes spaces, underscores, hyphens
 */
function normalizeFieldName(fieldName: string): string {
  return fieldName
    .toLowerCase()
    .replace(/[\s_-]/g, '')
    .trim();
}
