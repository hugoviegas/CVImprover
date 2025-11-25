import { ResumeData, initialResumeData, Experience, Education, Project } from '../types/resume';

// --- Constants & Patterns ---

const SECTION_PATTERNS: Record<string, RegExp> = {
  experience: /^(?:work\s+experience|employment\s+history|professional\s+experience|experiência\s+profissional|experiência|career\s+history|work\s+history)/i,
  education: /^(?:education|academic\s+background|qualifications|academic\s+history|formação\s+académica|educação|formação|academic\s+qualifications)/i,
  skills: /^(?:skills|competencies|technologies|technical\s+skills|core\s+competencies|competências|habilidades|tech\s+stack)/i,
  projects: /^(?:projects|portfolio|personal\s+projects|projetos)/i,
  languages: /^(?:languages|linguistic\s+skills|idiomas|línguas)/i,
  summary: /^(?:summary|profile|professional\s+summary|about\s+me|objective|resumo\s+profissional|sobre\s+mim|perfil)/i,
  certifications: /^(?:certifications|certificates|courses|certificados|cursos)/i,
  personal: /^(?:personal\s+details|contact\s+info|contactos|dados\s+pessoais)/i,
};

const DATE_PATTERN = /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)[a-z]*\.?\s+\d{4}|\d{2}\/\d{4}|\d{4}|present|current|atualmente|hoje)/gi;
const EMAIL_PATTERN = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/;
const PHONE_PATTERN = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
const LINK_PATTERN = /(https?:\/\/[^\s]+|www\.[^\s]+|linkedin\.com\/in\/[^\s]+|github\.com\/[^\s]+)/gi;

// --- Helper Functions ---

const cleanText = (text: string): string[] => {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0); // Remove empty lines
};

const identifySection = (line: string): string | null => {
  if (line.length > 60) return null; // Headers are usually short
  for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(line)) return key;
  }
  return null;
};

const extractDateRange = (text: string): { start: string, end: string } | null => {
  const matches = Array.from(text.matchAll(DATE_PATTERN));
  if (matches.length >= 2) {
    return { start: matches[0][0], end: matches[1][0] };
  } else if (matches.length === 1) {
    return { start: matches[0][0], end: '' };
  }
  return null;
};

// --- Main Parsing Logic ---

export const parseResume = (rawText: string, fileName: string): ResumeData => {
  const lines = cleanText(rawText);
  const data: ResumeData = JSON.parse(JSON.stringify(initialResumeData)); // Deep copy
  
  data.metadata.fileName = fileName;
  data.metadata.sourceFormat = fileName.endsWith('.pdf') ? 'pdf' : fileName.endsWith('.docx') ? 'docx' : 'txt';

  let currentSection = 'personalInfo';
  let buffer: string[] = [];

  // 1. Segmentation & Classification
  const sections: Record<string, string[]> = {
    personalInfo: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
    customSections: [], // Not fully implemented in this pass
    unmappedBlocks: [],
  };

  for (const line of lines) {
    const sectionType = identifySection(line);
    if (sectionType) {
      // Flush buffer to previous section
      if (currentSection && buffer.length > 0) {
        sections[currentSection].push(...buffer);
      }
      currentSection = sectionType === 'personal' ? 'personalInfo' : sectionType;
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  // Flush last buffer
  if (currentSection && buffer.length > 0) {
    sections[currentSection].push(...buffer);
  }

  // 2. Field Extraction

  // --- Personal Info ---
  const personalLines = sections.personalInfo;
  const fullPersonalText = personalLines.join('\n');
  
  const emailMatch = fullPersonalText.match(EMAIL_PATTERN);
  if (emailMatch) data.personalInfo.email = emailMatch[0];

  const phoneMatch = fullPersonalText.match(PHONE_PATTERN);
  if (phoneMatch) data.personalInfo.phone = phoneMatch[0];

  const links = fullPersonalText.match(LINK_PATTERN);
  if (links) {
    links.forEach(link => {
      if (link.includes('linkedin')) data.personalInfo.linkedin = link;
      else if (!data.personalInfo.website) data.personalInfo.website = link;
      else data.personalInfo.otherContacts.push(link);
    });
  }

  // Heuristic: Name is often the first line of the document or first line of personal info
  if (personalLines.length > 0) {
    // Filter out contact info lines to find the name
    const potentialName = personalLines.find(l => !l.match(EMAIL_PATTERN) && !l.match(PHONE_PATTERN) && l.length < 40);
    if (potentialName) data.personalInfo.fullName = potentialName;
  }

  // Location heuristic: look for City, Country pattern or just assume a line that isn't name/contact
  // This is weak without NLP, but we can try to find a line with a comma that isn't a sentence
  const locationLine = personalLines.find(l => l.includes(',') && l.length < 50 && l !== data.personalInfo.fullName && !l.match(EMAIL_PATTERN));
  if (locationLine) data.personalInfo.location = locationLine;

  // --- Summary ---
  data.summary = {
    rawText: sections.summary.join('\n')
  };

  // --- Experience ---
  // Strategy: Look for date ranges to identify start of new blocks
  let currentExp: Partial<Experience> | null = null;
  
  sections.experience.forEach(line => {
    const dateRange = extractDateRange(line);
    // If line has a date range, it's likely a header line for a job
    if (dateRange) {
      if (currentExp) {
        data.experience.push(currentExp as Experience);
      }
      currentExp = {
        id: crypto.randomUUID(),
        company: '',
        position: '', // We'll try to extract this
        startDate: dateRange.start,
        endDate: dateRange.end,
        current: dateRange.end.toLowerCase().includes('present') || dateRange.end.toLowerCase().includes('current') || dateRange.end.toLowerCase().includes('atualmente'),
        descriptionRaw: '',
        highlights: [],
        city: '',
        country: ''
      };

      // Try to extract Company and Position from the same line or adjacent
      // Heuristic: "Position at Company" or "Company - Position"
      const parts = line.replace(DATE_PATTERN, '').split(/[-–|at]|(?<=\w)\s{2,}(?=\w)/).map(s => s.trim()).filter(s => s);
      if (parts.length >= 2) {
        currentExp.position = parts[0];
        currentExp.company = parts[1];
      } else if (parts.length === 1) {
        currentExp.position = parts[0]; // Assume first part is position
      }
    } else if (currentExp) {
      // If it's a bullet point
      if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
        currentExp.highlights = currentExp.highlights || [];
        currentExp.highlights.push(line.replace(/^[•\-*]\s*/, ''));
      } else {
        // Append to description if not a bullet
        currentExp.descriptionRaw = (currentExp.descriptionRaw ? currentExp.descriptionRaw + '\n' : '') + line;
        
        // Fallback for Company/Position if not found in header line
        if (!currentExp.company && line.length < 50 && !line.includes('.')) {
             // If we have a position but no company, this line might be the company
             currentExp.company = line;
        }
      }
    }
  });
  if (currentExp) data.experience.push(currentExp as Experience);

  // --- Education ---
  let currentEdu: Partial<Education> | null = null;
  sections.education.forEach(line => {
    const dateRange = extractDateRange(line);
    if (dateRange) {
      if (currentEdu) data.education.push(currentEdu as Education);
      currentEdu = {
        id: crypto.randomUUID(),
        institution: '',
        degree: '',
        course: '',
        startDate: dateRange.start,
        endDate: dateRange.end,
        current: false,
        city: '',
        country: '',
        finalGrade: '',
        levelEQF: '',
        descriptionRaw: '',
        highlights: []
      };
       // Similar heuristic for School/Degree
       const parts = line.replace(DATE_PATTERN, '').split(/[-–,]|(?<=\w)\s{2,}(?=\w)/).map(s => s.trim()).filter(s => s);
       if (parts.length >= 2) {
         currentEdu.degree = parts[0];
         currentEdu.institution = parts[1];
       } else if (parts.length === 1) {
         currentEdu.degree = parts[0];
       }
    } else if (currentEdu) {
        if (!currentEdu.institution && line.length < 60) {
            currentEdu.institution = line;
        } else {
             // Maybe it's the degree if we didn't find it yet
             if (!currentEdu.degree) currentEdu.degree = line;
        }
    }
  });
  if (currentEdu) data.education.push(currentEdu as Education);

  // --- Skills ---
  // Split by commas or bullets
  const skillText = sections.skills.join('\n');
  const skillItems = skillText.split(/[,•\n]/).map(s => s.trim()).filter(s => s.length > 1);
  data.skills = {
    rawBlocks: [skillText],
    categorized: {
      infrastructureAndSystems: [],
      networkAndSecurity: [],
      programmingAndScripting: [],
      other: skillItems
    }
  };

  // --- Languages ---
  sections.languages.forEach(line => {
      // Look for language patterns: "English: Fluent", "Portuguese (Native)"
      const parts = line.split(/[:\-(]/);
      if (parts.length > 0) {
          const langName = parts[0].trim();
          let level = 'Intermediate';
          if (parts.length > 1) {
              const levelPart = parts[1].replace(')', '').trim().toLowerCase();
              if (levelPart.includes('native') || levelPart.includes('nativo')) level = 'Native';
              else if (levelPart.includes('fluent') || levelPart.includes('fluente')) level = 'Fluent';
              else if (levelPart.includes('advanced') || levelPart.includes('avançado')) level = 'Advanced';
              else if (levelPart.includes('basic') || levelPart.includes('básico')) level = 'Beginner';
          }
          if (langName) {
            data.languages.push({
                id: crypto.randomUUID(),
                language: langName,
                level: level,
                details: ''
            });
          }
      }
  });

  // --- Projects ---
  let currentProj: Partial<Project> | null = null;
  sections.projects.forEach(line => {
      // Heuristic: Short line might be title
      if (line.length < 50 && !line.includes('http')) {
          if (currentProj) data.projects.push(currentProj as Project);
          currentProj = {
              id: crypto.randomUUID(),
              title: line,
              role: '',
              clientOrCompany: '',
              startDate: '',
              endDate: '',
              descriptionRaw: '',
              highlights: [],
              technologies: [],
              links: []
          };
      } else if (currentProj) {
          currentProj.descriptionRaw = (currentProj.descriptionRaw ? currentProj.descriptionRaw + '\n' : '') + line;
      }
  });
  if (currentProj) data.projects.push(currentProj as Project);

  return data;
};
