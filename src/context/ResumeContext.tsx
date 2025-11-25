import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ResumeData, 
  initialResumeData, 
  Experience, 
  Education, 
  Language, 
  Project,
  Certification,
  CustomSection,
  SkillsData
} from '../types/resume';
import { loadState, saveState, clearState, PersistedState } from '../utils/resumeStorage';
import { saveResume as saveToRepo, getResume as getFromRepo } from '../services/resumeRepository';
import { debounce } from '../utils/debounce';

export interface ImportedFileMetadata {
  fileName: string;
  fileFormat: 'pdf' | 'docx' | 'txt';
  fileHash: string;
  fileSize: number;
}

interface ResumeContextType {
  resumeData: ResumeData;
  importedFile: ImportedFileMetadata | null;
  exportMode: 'original' | 'system';
  currentResumeId: string | null;
  currentTemplate: string;
  setCurrentTemplate: (template: string) => void;
  
  // Metadata
  updateMetadata: (metadata: Partial<ResumeData['metadata']>) => void;
  
  // Personal Info
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  
  // Summary
  updateSummary: (summary: Partial<ResumeData['summary']>) => void;
  
  // Experience
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Education
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  updateSkills: (skills: Partial<SkillsData>) => void;
  
  // Languages
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  
  // Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Certifications
  addCertification: (certification: Certification) => void;
  updateCertification: (id: string, certification: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  
  // Custom Sections
  addCustomSection: (section: CustomSection) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  removeCustomSection: (id: string) => void;
  
  // Unmapped Blocks
  removeUnmappedBlock: (id: string) => void;
  
  // Persistence
  setImportedFile: (metadata: ImportedFileMetadata | null) => void;
  setExportMode: (mode: 'original' | 'system') => void;
  clearAllData: () => void;
  
  // Repository Actions
  loadResume: (id: string) => boolean;
  saveToRepository: () => string;
  createNewResume: () => void;
  
  // Global
  setResumeData: (data: ResumeData) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Template state
  const [currentTemplate, setCurrentTemplate] = useState<string>('ats');
  
  // Try to load from localStorage on init
  const [resumeData, setResumeDataState] = useState<ResumeData>(() => {
    const cached = loadState();
    if (cached) {
      console.log('[ResumeContext] Hydrating from cache');
      return cached.resume;
    }
    return initialResumeData;
  });

  // History State
  const [history, setHistory] = useState<{
    past: ResumeData[];
    future: ResumeData[];
  }>({
    past: [],
    future: []
  });

  // Wrapped setResumeData to track history
  const setResumeData = (
    update: ResumeData | ((prev: ResumeData) => ResumeData)
  ) => {
    setResumeDataState(current => {
      const next = typeof update === 'function' ? (update as Function)(current) : update;
      
      if (JSON.stringify(current) !== JSON.stringify(next)) {
        setHistory(prev => ({
          past: [...prev.past, current],
          future: []
        }));
      }
      
      return next;
    });
  };

  // Undo/Redo
  const undo = () => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      const newPast = [...prev.past];
      const previous = newPast.pop()!;
      
      setResumeDataState(previous);
      
      return {
        past: newPast,
        future: [resumeData, ...prev.future]
      };
    });
  };

  const redo = () => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      const newFuture = [...prev.future];
      const next = newFuture.shift()!;
      
      setResumeDataState(next);
      
      return {
        past: [...prev.past, resumeData],
        future: newFuture
      };
    });
  };

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const [importedFile, setImportedFile] = useState<ImportedFileMetadata | null>(() => {
    const cached = loadState();
    return cached?.imported || null;
  });

  const [exportMode, setExportMode] = useState<'original' | 'system'>(() => {
    const cached = loadState();
    return cached?.ui?.exportMode || 'system';
  });

  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // Metadata
  const updateMetadata = (metadata: Partial<ResumeData['metadata']>) => {
    setResumeData((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, ...metadata },
    }));
  };

  // Personal Info
  const updatePersonalInfo = (info: Partial<ResumeData['personalInfo']>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  // Summary
  const updateSummary = (summary: Partial<ResumeData['summary']>) => {
    setResumeData((prev) => ({
      ...prev,
      summary: { ...prev.summary, ...summary },
    }));
  };

  // Experience
  const addExperience = (experience: Experience) => {
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, experience],
    }));
  };

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  // Education
  const addEducation = (education: Education) => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Skills
  const updateSkills = (skills: Partial<SkillsData>) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        rawBlocks: skills.rawBlocks !== undefined ? skills.rawBlocks : prev.skills.rawBlocks,
        categorized: skills.categorized !== undefined ? skills.categorized : prev.skills.categorized,
      },
    }));
  };

  // Languages
  const addLanguage = (language: Language) => {
    setResumeData((prev) => ({
      ...prev,
      languages: [...prev.languages, language],
    }));
  };

  const updateLanguage = (id: string, language: Partial<Language>) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang) =>
        lang.id === id ? { ...lang, ...language } : lang
      ),
    }));
  };

  const removeLanguage = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((lang) => lang.id !== id),
    }));
  };

  // Projects
  const addProject = (project: Project) => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...project } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  // Certifications
  const addCertification = (certification: Certification) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, certification],
    }));
  };

  const updateCertification = (id: string, certification: Partial<Certification>) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((cert) =>
        cert.id === id ? { ...cert, ...certification } : cert
      ),
    }));
  };

  const removeCertification = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((cert) => cert.id !== id),
    }));
  };

  // Custom Sections
  const addCustomSection = (section: CustomSection) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: [...prev.customSections, section],
    }));
  };

  const updateCustomSection = (id: string, section: Partial<CustomSection>) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.map((sec) =>
        sec.id === id ? { ...sec, ...section } : sec
      ),
    }));
  };

  const removeCustomSection = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: prev.customSections.filter((sec) => sec.id !== id),
    }));
  };

  // Unmapped Blocks
  const removeUnmappedBlock = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      unmappedBlocks: prev.unmappedBlocks.filter((block) => block.id !== id),
    }));
  };

  // Auto-save to localStorage with debouncing
  useEffect(() => {
    const debouncedSave = debounce(() => {
      const state: PersistedState = {
        version: 1,
        timestamp: Date.now(),
        imported: importedFile,
        resume: resumeData,
        ui: {
          exportMode,
          templateId: null
        }
      };
      saveState(state);
    }, 1000);

    debouncedSave();
  }, [resumeData, importedFile, exportMode]);

  // Clear all data
  const clearAllData = () => {
    setResumeDataState(initialResumeData);
    setImportedFile(null);
    setExportMode('system');
    setCurrentResumeId(null);
    setHistory({ past: [], future: [] });
    clearState();
    console.log('[ResumeContext] All data cleared');
  };

  // Repository Actions
  const loadResume = (id: string): boolean => {
    const saved = getFromRepo(id);
    if (saved) {
      setResumeDataState(saved.resume);
      setImportedFile(saved.importedFile);
      setCurrentResumeId(id);
      setHistory({ past: [], future: [] });
      return true;
    }
    return false;
  };

  const saveToRepository = (): string => {
    const id = saveToRepo(resumeData, importedFile, currentResumeId || undefined);
    setCurrentResumeId(id);
    return id;
  };

  const createNewResume = () => {
    clearAllData();
    // clearAllData already resets state, so we just need to ensure ID is null
    setCurrentResumeId(null);
  };


  // Override internal setResumeData usage
  // Note: We need to update all internal helper functions to use setResumeDataWithHistory
  // But since they use setResumeData((prev) => ...), we can just assign setResumeDataWithHistory to a variable used by them?
  // No, consts are block scoped.
  // I will rename the original setResumeData to setResumeDataInternal and create a new setResumeData wrapper.
  // However, I can't easily rename all usages in this large file with replace_file_content without replacing the whole file.
  // Strategy: I will expose setResumeDataWithHistory as setResumeData in the context value, 
  // AND I will update the internal helper functions to use a new internal helper that handles history.

  // Actually, replacing all setResumeData calls is risky.
  // Better approach: 
  // Create a `saveToHistory` function that pushes current state to history.
  // Call it inside the helper functions? No, that's too many edits.
  
  // Best approach for now:
  // Rename the state setter `setResumeData` to `_setResumeData`.
  // Create `setResumeData` that calls `_setResumeData` and updates history.
  // But I can't rename the state setter easily without changing all lines.

  // Alternative:
  // Add a `useEffect` that tracks `resumeData` changes?
  // If I use useEffect, I get the *new* state. I need the *previous* state to push to history.
  // `useEffect` with a ref for previous state.
  
  /*
  const prevResumeDataRef = useRef(resumeData);
  useEffect(() => {
    if (prevResumeDataRef.current !== resumeData) {
       // This runs AFTER render.
       // We want to save prevResumeDataRef.current to history.
       // But we need to distinguish between Undo/Redo updates and User updates.
       // If Undo caused the change, we shouldn't push to past.
    }
    prevResumeDataRef.current = resumeData;
  }, [resumeData]);
  */

  // This is tricky with React state.
  // Let's stick to the plan of exposing undo/redo and maybe just wrapping the external `setResumeData`.
  // But the internal helpers (updatePersonalInfo, etc) use the state setter directly.
  
  // I will replace the `setResumeData` function definition in the `value` object with a wrapped version?
  // No, `updatePersonalInfo` uses the local `setResumeData`.
  
  // ... implementation details ...

  const value: ResumeContextType = {
    resumeData,
    importedFile,
    exportMode,
    currentResumeId,
    currentTemplate,
    setCurrentTemplate,
    updateMetadata,
    updatePersonalInfo,
    updateSummary,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    updateSkills,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addProject,
    updateProject,
    removeProject,
    addCertification,
    updateCertification,
    removeCertification,
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    removeUnmappedBlock,
    setImportedFile,
    setExportMode,
    clearAllData,
    loadResume,
    saveToRepository,
    createNewResume,
    setResumeData, // Use the wrapper for external calls
    undo,
    redo,
    canUndo,
    canRedo
  };

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
