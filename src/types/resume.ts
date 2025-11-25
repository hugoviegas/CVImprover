export interface Experience {
  id: string;
  position: string;
  company: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  descriptionRaw: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  course: string;
  institution: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  current: boolean;
  finalGrade: string;
  levelEQF: string;
  descriptionRaw: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
}

export interface SkillsData {
  rawBlocks: string[];
  categorized: {
    infrastructureAndSystems: string[];
    networkAndSecurity: string[];
    programmingAndScripting: string[];
    other: string[];
  };
}

export interface Language {
  id: string;
  language: string;
  level: string;
  details: string; // e.g., "Listening: C1, Reading: C1, Writing: C1"
}

export interface Project {
  id: string;
  title: string;
  role: string;
  clientOrCompany: string;
  startDate: string;
  endDate: string;
  descriptionRaw: string;
  technologies: string[];
  links: string[];
  highlights: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  descriptionRaw: string;
}

export interface CustomSection {
  id: string;
  title: string;
  rawText: string;
}

export interface UnmappedBlock {
  id: string;
  sourceText: string;
  reason: string;
}

export interface ResumeData {
  metadata: {
    sourceFormat: 'pdf' | 'docx' | 'txt' | 'manual';
    fileName: string;
    languageGuess: 'pt' | 'en' | 'mixed' | 'unknown';
    targetJobDescription?: string;
  };
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    nationality: string;
    workPermit: string;
    dateOfBirth: string;
    website: string;
    linkedin: string;
    otherContacts: string[];
  };
  summary: {
    rawText: string;
  };
  experience: Experience[];
  education: Education[];
  skills: SkillsData;
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  unmappedBlocks: UnmappedBlock[];
}

export const initialResumeData: ResumeData = {
  metadata: {
    sourceFormat: 'manual',
    fileName: '',
    languageGuess: 'unknown',
    targetJobDescription: '',
  },
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    nationality: '',
    workPermit: '',
    dateOfBirth: '',
    website: '',
    linkedin: '',
    otherContacts: [],
  },
  summary: {
    rawText: '',
  },
  experience: [],
  education: [],
  skills: {
    rawBlocks: [],
    categorized: {
      infrastructureAndSystems: [],
      networkAndSecurity: [],
      programmingAndScripting: [],
      other: [],
    },
  },
  languages: [],
  projects: [],
  certifications: [],
  customSections: [],
  unmappedBlocks: [],
};
