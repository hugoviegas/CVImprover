/**
 * Resume Data Validation Utilities
 * 
 * Validates Gemini output and ensures schema compliance.
 */

import { ResumeData, initialResumeData } from '../types/resume';

/**
 * Validates that the parsed resume JSON has all required keys
 */
export function validateResumeJson(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check top-level keys
  const requiredKeys = [
    'metadata',
    'personalInfo',
    'summary',
    'experience',
    'education',
    'skills',
    'languages',
    'projects',
    'certifications',
    'customSections',
    'unmappedBlocks',
  ];
  
  for (const key of requiredKeys) {
    if (!(key in data)) {
      errors.push(`Missing required key: ${key}`);
    }
  }
  
  // Check metadata structure
  if (data.metadata) {
    if (!data.metadata.sourceFormat) errors.push('Missing metadata.sourceFormat');
    if (!data.metadata.fileName) errors.push('Missing metadata.fileName');
    if (!data.metadata.languageGuess) errors.push('Missing metadata.languageGuess');
  }
  
  // Check personalInfo structure
  if (data.personalInfo) {
    const required = ['fullName', 'email', 'phone', 'location', 'otherContacts'];
    for (const field of required) {
      if (!(field in data.personalInfo)) {
        errors.push(`Missing personalInfo.${field}`);
      }
    }
  }
  
  // Check summary structure
  if (data.summary && !('rawText' in data.summary)) {
    errors.push('Missing summary.rawText');
  }
  
  // Check skills structure
  if (data.skills) {
    if (!Array.isArray(data.skills.rawBlocks)) {
      errors.push('skills.rawBlocks must be an array');
    }
    if (!data.skills.categorized) {
      errors.push('Missing skills.categorized');
    }
  }
  
  // Check arrays
  const arrayFields = [
    'experience',
    'education',
    'languages',
    'projects',
    'certifications',
    'customSections',
    'unmappedBlocks',
  ];
  
  for (const field of arrayFields) {
    if (data[field] && !Array.isArray(data[field])) {
      errors.push(`${field} must be an array`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Ensures schema compliance by filling in missing keys with defaults
 */
export function ensureSchemaCompliance(data: Partial<ResumeData>): ResumeData {
  const compliant: ResumeData = JSON.parse(JSON.stringify(initialResumeData));
  
  // Deep merge the data
  if (data.metadata) {
    compliant.metadata = { ...compliant.metadata, ...data.metadata };
  }
  
  if (data.personalInfo) {
    compliant.personalInfo = { ...compliant.personalInfo, ...data.personalInfo };
  }
  
  if (data.summary) {
    compliant.summary = { ...compliant.summary, ...data.summary };
  }
  
  if (data.experience) {
    compliant.experience = data.experience;
  }
  
  if (data.education) {
    compliant.education = data.education;
  }
  
  if (data.skills) {
    compliant.skills = {
      rawBlocks: data.skills.rawBlocks || [],
      categorized: {
        infrastructureAndSystems: data.skills.categorized?.infrastructureAndSystems || [],
        networkAndSecurity: data.skills.categorized?.networkAndSecurity || [],
        programmingAndScripting: data.skills.categorized?.programmingAndScripting || [],
        other: data.skills.categorized?.other || [],
      },
    };
  }
  
  if (data.languages) {
    compliant.languages = data.languages;
  }
  
  if (data.projects) {
    compliant.projects = data.projects;
  }
  
  if (data.certifications) {
    compliant.certifications = data.certifications;
  }
  
  if (data.customSections) {
    compliant.customSections = data.customSections;
  }
  
  if (data.unmappedBlocks) {
    compliant.unmappedBlocks = data.unmappedBlocks;
  }
  
  return compliant;
}

/**
 * Sanitizes resume data by removing invalid or malformed entries
 */
export function sanitizeResumeData(data: any): ResumeData {
  // Ensure all arrays are actually arrays
  const sanitized = { ...data };
  
  if (!Array.isArray(sanitized.experience)) sanitized.experience = [];
  if (!Array.isArray(sanitized.education)) sanitized.education = [];
  if (!Array.isArray(sanitized.languages)) sanitized.languages = [];
  if (!Array.isArray(sanitized.projects)) sanitized.projects = [];
  if (!Array.isArray(sanitized.certifications)) sanitized.certifications = [];
  if (!Array.isArray(sanitized.customSections)) sanitized.customSections = [];
  if (!Array.isArray(sanitized.unmappedBlocks)) sanitized.unmappedBlocks = [];
  
  // Ensure skills structure
  if (!sanitized.skills || typeof sanitized.skills !== 'object') {
    sanitized.skills = initialResumeData.skills;
  }
  
  // Ensure summary structure
  if (!sanitized.summary || typeof sanitized.summary !== 'object') {
    sanitized.summary = { rawText: '' };
  }
  
  // Ensure IDs for all array items
  sanitized.experience = sanitized.experience.map((exp: any, index: number) => ({
    ...exp,
    id: exp.id || `exp-${index}-${Date.now()}`,
  }));
  
  sanitized.education = sanitized.education.map((edu: any, index: number) => ({
    ...edu,
    id: edu.id || `edu-${index}-${Date.now()}`,
  }));
  
  sanitized.languages = sanitized.languages.map((lang: any, index: number) => ({
    ...lang,
    id: lang.id || `lang-${index}-${Date.now()}`,
  }));
  
  sanitized.projects = sanitized.projects.map((proj: any, index: number) => ({
    ...proj,
    id: proj.id || `proj-${index}-${Date.now()}`,
  }));
  
  sanitized.certifications = sanitized.certifications.map((cert: any, index: number) => ({
    ...cert,
    id: cert.id || `cert-${index}-${Date.now()}`,
  }));
  
  sanitized.customSections = sanitized.customSections.map((section: any, index: number) => ({
    ...section,
    id: section.id || `custom-${index}-${Date.now()}`,
  }));
  
  sanitized.unmappedBlocks = sanitized.unmappedBlocks.map((block: any, index: number) => ({
    ...block,
    id: block.id || `unmapped-${index}-${Date.now()}`,
  }));
  
  return ensureSchemaCompliance(sanitized);
}
