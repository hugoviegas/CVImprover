import { ResumeData } from '../types/resume';

export const extractData = (sections: Record<string, string>): Partial<ResumeData> => {
  const data: Partial<ResumeData> = {
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
      rawText: sections.summary || '',
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
  };

  // Extract Personal Info
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const phoneRegex = /((?:\+?\d{1,3}[-.\ s]?)?\(?\d{3}\)?[-.\ s]?\d{3}[-.\ s]?\d{4})/;
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Search personal info in the first section (usually personalInfo)
  const personalInfoText = sections.personalInfo || '';
  
  const emailMatch = personalInfoText.match(emailRegex);
  if (emailMatch) data.personalInfo!.email = emailMatch[0];

  const phoneMatch = personalInfoText.match(phoneRegex);
  if (phoneMatch) data.personalInfo!.phone = phoneMatch[0];

  const urlMatch = personalInfoText.match(urlRegex);
  if (urlMatch) {
      // Simple heuristic: if it contains linkedin, put in linkedin, else website
      const linkedinUrl = urlMatch.find(u => u.includes('linkedin'));
      if (linkedinUrl) data.personalInfo!.linkedin = linkedinUrl;
      
      const otherUrl = urlMatch.find(u => !u.includes('linkedin'));
      if (otherUrl) data.personalInfo!.website = otherUrl;
  }

  // Heuristic for name: First line of personal info
  const lines = personalInfoText.split('\n').filter(l => l.trim());
  if (lines.length > 0) {
    data.personalInfo!.fullName = lines[0].trim();
  }

  // Extract Experience
  if (sections.experience) {
    const expBlocks = sections.experience.split(/\n\n+/);
    data.experience = expBlocks.map(block => ({
      id: crypto.randomUUID(),
      company: 'Unknown Company',
      position: 'Unknown Position',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      descriptionRaw: block.trim(),
      highlights: [],
    }));
  }

  // Extract Education
  if (sections.education) {
    const eduBlocks = sections.education.split(/\n\n+/);
    data.education = eduBlocks.map(block => ({
      id: crypto.randomUUID(),
      institution: block.split('\n')[0] || 'Unknown School',
      degree: 'Unknown Degree',
      course: '',
      city: '',
      country: '',
      startDate: '',
      endDate: '',
      current: false,
      finalGrade: '',
      levelEQF: '',
      descriptionRaw: '',
      highlights: [],
    }));
  }

  // Extract Skills
  if (sections.skills) {
    const skillList = sections.skills.split(/[,•\n]/).map(s => s.trim()).filter(s => s.length > 0);
    data.skills!.rawBlocks = [sections.skills];
    data.skills!.categorized.other = skillList;
  }

  return data;
};
