import { ResumeData } from '../types/resume';
import { ImportedFileMetadata } from '../context/ResumeContext';

export interface SavedResumeMeta {
  id: string;
  name: string;
  fileName: string;
  jobTitleTarget?: string;
  lastUpdated: string; // ISO timestamp
}

export interface SavedResume {
  meta: SavedResumeMeta;
  resume: ResumeData;
  importedFile: ImportedFileMetadata | null;
}

const STORAGE_KEY = 'cv_improver_resumes';

/**
 * Generate a unique ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Get all saved resumes metadata
 */
export function getAllResumes(): SavedResumeMeta[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const resumes: Record<string, SavedResume> = JSON.parse(data);
    return Object.values(resumes)
      .map(r => r.meta)
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
  } catch (error) {
    console.error('Error loading resumes:', error);
    return [];
  }
}

/**
 * Get a specific resume by ID
 */
export function getResume(id: string): SavedResume | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const resumes: Record<string, SavedResume> = JSON.parse(data);
    return resumes[id] || null;
  } catch (error) {
    console.error(`Error loading resume ${id}:`, error);
    return null;
  }
}

/**
 * Save a resume (create or update)
 */
export function saveResume(
  resume: ResumeData, 
  importedFile: ImportedFileMetadata | null,
  existingId?: string
): string {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const resumes: Record<string, SavedResume> = data ? JSON.parse(data) : {};
    
    const id = existingId || generateId();
    const now = new Date().toISOString();
    
    // Extract metadata
    const meta: SavedResumeMeta = {
      id,
      name: resume.personalInfo.fullName || 'Untitled Resume',
      fileName: importedFile?.fileName || 'Created manually',
      jobTitleTarget: resume.experience[0]?.position || 'General', // Heuristic
      lastUpdated: now,
    };
    
    // Check for storage quota
    try {
      resumes[id] = {
        meta,
        resume,
        importedFile
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        throw new Error('Storage full. Please delete some old resumes.');
      }
      throw e;
    }
    
    return id;
  } catch (error) {
    console.error('Error saving resume:', error);
    throw error;
  }
}

/**
 * Delete a resume by ID
 */
export function deleteResume(id: string): void {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return;
    
    const resumes: Record<string, SavedResume> = JSON.parse(data);
    if (resumes[id]) {
      delete resumes[id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
    }
  } catch (error) {
    console.error(`Error deleting resume ${id}:`, error);
  }
}
