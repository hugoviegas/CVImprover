/**
 * Optimized AI Prompts for Resume Enhancement
 * Based on analysis of successful resumes and ATS best practices
 */

import { actionVerbs } from './atsKeywords';

// Perfect resume examples for context
const PERFECT_RESUME_EXAMPLES = {
  summaries: {
    tech_senior: `Senior Software Engineer with 8+ years of experience building scalable web applications and cloud infrastructure. Specialized in React, Node.js, and AWS with a proven track record of reducing system latency by 60% and leading teams of 5+ engineers. Passionate about mentoring junior developers and implementing best practices for code quality and performance.`,
    
    tech_mid: `Full-stack developer with 4 years of experience creating responsive web applications using React and Python. Delivered 15+ projects on time, improving user engagement by 45% through performance optimization. Strong collaborator with experience in Agile environments and cross-functional teams.`,
    
    marketing_senior: `Data-driven Digital Marketing Manager with 6+ years driving growth through SEO, SEM, and content strategies. Increased organic traffic by 200% and reduced CAC by 35% across multiple campaigns. Expert in Google Analytics, HubSpot, and marketing automation with a track record of exceeding ROI targets.`,
    
    sales_senior: `Results-oriented Enterprise Sales Executive with 7+ years consistently exceeding quota by 130%+. Generated $5M+ in new business revenue through strategic account management and solution selling. Proven ability to close complex deals with C-level executives at Fortune 500 companies.`
  },

  experienceBullets: {
    tech: [
      "Spearheaded migration from monolithic architecture to microservices, reducing deployment time by 75% and improving system reliability to 99.9% uptime",
      "Architected and implemented real-time analytics platform processing 10M+ events daily, enabling data-driven decision making for 500+ internal users",
      "Led team of 5 engineers in delivering React-based dashboard that increased user engagement by 45% and reduced customer support tickets by 30%",
      "Optimized database queries and implemented Redis caching, decreasing API response time from 2s to 200ms (90% improvement)",
      "Established CI/CD pipeline using GitHub Actions and Docker, reducing release cycle from 2 weeks to 2 days"
    ],
    marketing: [
      "Developed and executed SEO strategy that increased organic traffic by 200% (50K to 150K monthly visitors) within 6 months",
      "Managed $500K annual paid advertising budget across Google Ads and Facebook, achieving 4.5x ROI and reducing CAC by 35%",
      "Created content marketing program that generated 1,000+ qualified leads monthly and increased conversion rate by 28%",
      "Implemented marketing automation workflows in HubSpot, nurturing 10,000+ leads and improving email open rates from 18% to 35%"
    ],
    sales: [
      "Exceeded annual quota by 145%, generating $3.2M in new ARR through strategic enterprise account acquisition",
      "Closed 15 deals averaging $200K+ contract value by building relationships with C-level executives at Fortune 500 companies",
      "Reduced sales cycle from 9 months to 6 months by implementing consultative selling approach and product demos",
      "Mentored 3 junior sales representatives who collectively achieved 120% of quota in their first year"
    ]
  }
};

// Strict rules for AI optimization
const OPTIMIZATION_RULES = `
CRITICAL RULES - MUST FOLLOW:
1. PRESERVE TRUTH: Never invent companies, dates, technologies, or achievements
2. NO FABRICATION: Only enhance what already exists, don't create new experiences
3. QUANTIFY EXISTING: Add metrics only if context supports it (e.g., "led team" → "led team of X")
4. ATS KEYWORDS: Use relevant keywords from job description naturally
5. ACTION VERBS: Start bullets with impactful verbs (Achieved, Led, Optimized, etc.)
6. SPECIFICITY: Replace vague terms with specific ones (e.g., "worked on" → "developed")
7. RESULTS-FOCUSED: Emphasize outcomes and impact, not just responsibilities
8. CONSISTENCY: Maintain consistent tense and formatting
`;

/**
 * Optimize Professional Summary
 */
export function getOptimizeSummaryPrompt(
  currentSummary: string,
  jobDescription: string,
  userContext?: { yearsExperience?: number; mainSkills?: string[] }
): string {
  return `You are an expert resume writer specializing in ATS-optimized content.

${OPTIMIZATION_RULES}

PERFECT SUMMARY EXAMPLES (for reference only):
${Object.values(PERFECT_RESUME_EXAMPLES.summaries).join('\n\n')}

TARGET JOB DESCRIPTION:
${jobDescription}

CURRENT USER SUMMARY:
${currentSummary}

TASK:
Rewrite the professional summary to:
1. Align with the target job requirements
2. Follow the style and structure of perfect examples
3. Use relevant keywords from job description
4. Quantify experience and achievements (only if already present)
5. Keep it concise (3-4 sentences max)
6. Maintain 100% truthfulness - don't invent experience

OUTPUT FORMAT:
Return ONLY valid JSON without markdown code blocks:
{
  "suggestions": {
    "originalText": "...",
    "suggestedText": "...",
    "changes": ["explanation of key changes made"],
    "keywordsAdded": ["keyword1", "keyword2"],
    "reasoning": "brief explanation of optimization strategy"
  }
}`;
}

/**
 * Optimize Experience Bullet Points
 */
export function getOptimizeExperiencePrompt(
  currentExperience: {
    position: string;
    company: string;
    descriptionRaw?: string;
    highlights: string[];
    startDate: string;
    endDate?: string;
  },
  jobDescription: string
): string {
  const currentContent = `
Position: ${currentExperience.position}
Company: ${currentExperience.company}
Period: ${currentExperience.startDate} - ${currentExperience.endDate || 'Present'}
Description: ${currentExperience.descriptionRaw || 'N/A'}
Current Highlights:
${currentExperience.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}
`;

  return `You are an expert resume optimizer focused on ATS compatibility and impact.

${OPTIMIZATION_RULES}

PERFECT EXPERIENCE BULLET EXAMPLES:
${PERFECT_RESUME_EXAMPLES.experienceBullets.tech.join('\n')}
${PERFECT_RESUME_EXAMPLES.experienceBullets.marketing.slice(0, 2).join('\n')}

POWERFUL ACTION VERBS TO USE:
Leadership: ${actionVerbs.leadership.slice(0, 8).join(', ')}
Achievement: ${actionVerbs.achievement.slice(0, 8).join(', ')}
Technical: ${actionVerbs.technical.slice(0, 8).join(', ')}
Improvement: ${actionVerbs.improvement.slice(0, 8).join(', ')}

TARGET JOB DESCRIPTION:
${jobDescription}

CURRENT EXPERIENCE:
${currentContent}

TASK:
Optimize the experience bullets to:
1. Start with powerful action verbs
2. Quantify achievements (only if context exists - e.g., "reduced loading time" could become "reduced loading time by 40%")
3. Use keywords from job description naturally
4. Show impact and results, not just tasks
5. Keep truthful - enhance, don't invent
6. Aim for 3-5 strong bullets

CRITICAL: If current content lacks quantifiable metrics, suggest reasonable ranges based on role level (entry: smaller impact, senior: larger impact), but ALWAYS mark them as "suggested - verify accuracy"

OUTPUT FORMAT:
Return ONLY valid JSON without markdown:
{
  "suggestions": {
    "originalDescription": "...",
    "suggestedDescription": "...",
    "originalHighlights": ["..."],
    "suggestedHighlights": [
      "Optimized bullet 1 with metrics and impact",
      "Optimized bullet 2 with action verb and results"
    ],
    "verifyMetrics": ["highlight 1: verify 40% improvement", "highlight 2: verify team size"],
    "keywordsUsed": ["keyword1", "keyword2"],
    "reasoning": "explanation of optimization approach"
  }
}`;
}

/**
 * Optimize Education Section
 */
export function getOptimizeEducationPrompt(
  currentEducation: {
    degree: string;
    course?: string;
    institution: string;
    descriptionRaw?: string;
    highlights: string[];
  },
  jobDescription: string
): string {
  return `You are a resume optimization expert specializing in education sections.

${OPTIMIZATION_RULES}

TARGET JOB DESCRIPTION:
${jobDescription}

CURRENT EDUCATION:
Degree: ${currentEducation.degree}${currentEducation.course ? ` in ${currentEducation.course}` : ''}
Institution: ${currentEducation.institution}
Description: ${currentEducation.descriptionRaw || 'N/A'}
Highlights: ${currentEducation.highlights.join(', ') || 'None'}

TASK:
Enhance the education section by:
1. Highlighting relevant coursework that matches job requirements
2. Adding relevant academic projects or achievements
3. Including relevant technologies or skills learned
4. Keeping it concise and relevant to target role
5. Being truthful - don't invent courses or achievements

OUTPUT FORMAT:
Return ONLY valid JSON without markdown:
{
  "suggestions": {
    "suggestedDescription": "Brief description of relevant coursework and focus areas",
    "suggestedHighlights": [
      "Relevant course or project 1",
      "Relevant achievement 2"
    ],
    "keywordsUsed": ["keyword1", "keyword2"],
    "reasoning": "why these elements were emphasized"
  }
}`;
}

/**
 * Optimize Project Description
 */
export function getOptimizeProjectPrompt(
  currentProject: {
    title: string;
    role: string;
    descriptionRaw?: string;
    highlights: string[];
    technologies?: string[];
  },
  jobDescription: string
): string {
  return `You are a technical resume expert optimizing project descriptions.

${OPTIMIZATION_RULES}

TARGET JOB DESCRIPTION:
${jobDescription}

CURRENT PROJECT:
Title: ${currentProject.title}
Role: ${currentProject.role}
Technologies: ${currentProject.technologies?.join(', ') || 'N/A'}
Description: ${currentProject.descriptionRaw || 'N/A'}
Highlights: ${currentProject.highlights.join(', ') || 'None'}

TASK:
Optimize project details to:
1. Emphasize technologies and skills relevant to job description
2. Highlight measurable outcomes (users, performance, scale)
3. Show your specific contributions and impact
4. Use technical keywords from job posting
5. Stay truthful about project scope and your role

OUTPUT FORMAT:
Return ONLY valid JSON without markdown:
{
  "suggestions": {
    "suggestedDescription": "Concise project overview focusing on relevant aspects",
    "suggestedHighlights": [
      "Your key contribution with impact",
      "Technical achievement or challenge solved"
    ],
    "technologiesToEmphasize": ["tech1", "tech2"],
    "reasoning": "optimization strategy for this project"
  }
}`;
}

/**
 * Refine imported resume text (cleanup phase)
 */
export function getRefineImportPrompt(): string {
  return `You are a resume text cleanup specialist.

TASK: Clean and standardize imported resume text while preserving ALL information.

RULES:
1. Fix formatting issues (extra spaces, line breaks, bullet points)
2. Standardize date formats (MM/YYYY)
3. Fix capitalization errors
4. Remove artifacts from PDF extraction (headers, page numbers)
5. Preserve ALL content - don't remove or summarize

DO NOT:
- Change any facts, dates, or information
- Summarize or condense content
- Add new information
- Change the order of sections

OUTPUT: Return the cleaned resume data in the exact same JSON structure provided, with text cleaned but content preserved.`;
}
