/**
 * Client-Side Resume Data Persistence
 * 
 * Manages localStorage caching of resume data to:
 * - Prevent data loss on page reload
 * - Avoid unnecessary Gemini API calls
 * - Preserve user's work session
 * 
 * Storage Schema Version: 1
 */

import { ResumeData } from '../types/resume';

const STORAGE_KEY = 'resumeBuilder:v1:state';
const STORAGE_VERSION = 1;

/**
 * Complete persisted state structure
 */
export interface PersistedState {
  version: number;
  timestamp: number;
  imported: {
    fileName: string;
    fileFormat: 'pdf' | 'docx' | 'txt';
    fileHash: string;
    fileSize: number;
  } | null;
  resume: ResumeData;
  ui: {
    exportMode: 'original' | 'system';
    templateId: string | null;
  };
}

/**
 * Load persisted state from localStorage
 * 
 * @returns Saved state or null if not found/invalid
 */
export function loadState(): PersistedState | null {
  try {
    // Check if localStorage is available
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return null;
    }

    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) {
      return null;
    }

    const state = JSON.parse(json) as PersistedState;

    // Version check
    if (state.version !== STORAGE_VERSION) {
      console.warn(`Storage version mismatch. Expected ${STORAGE_VERSION}, got ${state.version}`);
      clearState();
      return null;
    }

    console.log('Loaded state from localStorage:', {
      fileName: state.imported?.fileName,
      timestamp: new Date(state.timestamp).toISOString()
    });

    return state;
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
    return null;
  }
}

/**
 * Save state to localStorage
 * 
 * @param state - Complete state to persist
 */
export function saveState(state: PersistedState): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('localStorage not available');
      return;
    }

    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);

    console.log('Saved state to localStorage:', {
      fileName: state.imported?.fileName,
      size: `${(json.length / 1024).toFixed(2)} KB`
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded. Consider clearing old data.');
    } else {
      console.error('Failed to save state to localStorage:', error);
    }
  }
}

/**
 * Clear all persisted state
 */
export function clearState(): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    console.log('Cleared state from localStorage');
  } catch (error) {
    console.error('Failed to clear state:', error);
  }
}

/**
 * Generate SHA-256 hash of file content
 * Used to detect if the same file is uploaded again
 * 
 * @param file - File to hash
 * @returns Hex string hash
 */
export async function generateFileHash(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Failed to generate file hash:', error);
    // Fallback: use file name + size + lastModified as pseudo-hash
    return `${file.name}-${file.size}-${file.lastModified}`;
  }
}

/**
 * Check if cached data is still valid
 * 
 * @param cached - Cached state
 * @param maxAge - Maximum age in milliseconds (default: 7 days)
 * @returns true if cache is valid
 */
export function isCacheValid(cached: PersistedState, maxAge: number = 7 * 24 * 60 * 60 * 1000): boolean {
  const age = Date.now() - cached.timestamp;
  return age < maxAge;
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { used: number; available: boolean } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { used: 0, available: false };
    }

    const json = localStorage.getItem(STORAGE_KEY);
    const used = json ? json.length : 0;

    return {
      used,
      available: true
    };
  } catch {
    return { used: 0, available: false };
  }
}
