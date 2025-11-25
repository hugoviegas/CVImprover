export interface Section {
  title: string;
  content: string;
}

export const detectSections = (text: string): Record<string, string> => {
  const sections: Record<string, string> = {
    personalInfo: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    projects: '',
    languages: '',
    other: '',
  };

  // Common section headers regex patterns
  const patterns = {
    experience: /(?:experience|employment|work history|professional experience|work experience)/i,
    education: /(?:education|academic background|qualifications|academic history)/i,
    skills: /(?:skills|competencies|technologies|technical skills|core competencies)/i,
    projects: /(?:projects|portfolio|personal projects)/i,
    languages: /(?:languages|linguistic skills)/i,
    summary: /(?:summary|profile|professional summary|about me|objective)/i,
  };

  const lines = text.split('\n');
  let currentSection = 'personalInfo';
  let buffer = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if line is a section header
    // Heuristic: Short line, often uppercase or title case, matches pattern
    const isHeader = (line.length < 50) && Object.entries(patterns).some(([key, pattern]) => {
      if (pattern.test(line)) {
        // Save previous section
        if (currentSection) {
          sections[currentSection] += buffer.trim() + '\n';
        }
        currentSection = key;
        buffer = '';
        return true;
      }
      return false;
    });

    if (!isHeader) {
      buffer += line + '\n';
    }
  }

  // Save last section
  if (currentSection) {
    sections[currentSection] += buffer.trim() + '\n';
  }

  return sections;
};
