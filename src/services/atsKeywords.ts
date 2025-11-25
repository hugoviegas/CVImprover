/**
 * ATS Keywords Database by Industry
 * Used for intelligent keyword suggestions and gap analysis
 */

export interface KeywordCategory {
  hard: string[];
  soft: string[];
  tools: string[];
  certifications?: string[];
}

export const atsKeywords = {
  // Technology & Software
  tech: {
    frontend: {
      hard: [
        'React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3',
        'Next.js', 'Nuxt.js', 'Redux', 'GraphQL', 'REST API', 'Responsive Design',
        'Web Performance', 'Accessibility (WCAG)', 'Progressive Web Apps (PWA)'
      ],
      soft: [
        'Problem Solving', 'Collaboration', 'Communication', 'Attention to Detail',
        'User-Centric Design', 'Agile Development', 'Code Review'
      ],
      tools: [
        'Git', 'GitHub', 'VS Code', 'Webpack', 'Vite', 'Jest', 'Cypress',
        'Figma', 'Chrome DevTools', 'npm', 'yarn', 'Docker'
      ]
    },
    backend: {
      hard: [
        'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', '.NET',
        'SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Microservices',
        'RESTful APIs', 'GraphQL', 'API Design', 'Database Design', 'Security'
      ],
      soft: [
        'System Design', 'Scalability Thinking', 'Performance Optimization',
        'Problem Solving', 'Team Leadership', 'Mentoring', 'Documentation'
      ],
      tools: [
        'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'CI/CD',
        'Git', 'Postman', 'Datadog', 'New Relic', 'Terraform'
      ]
    },
    devops: {
      hard: [
        'Kubernetes', 'Docker', 'CI/CD', 'Infrastructure as Code', 'Cloud Computing',
        'AWS', 'Azure', 'GCP', 'Linux', 'Bash', 'Python', 'Terraform', 'Ansible',
        'Monitoring', 'Logging', 'Security', 'Networking'
      ],
      soft: [
        'Automation Mindset', 'Problem Solving', 'Collaboration', 'Communication',
        'Incident Response', 'Process Improvement', 'Documentation'
      ],
      tools: [
        'Jenkins', 'GitLab CI', 'GitHub Actions', 'Prometheus', 'Grafana',
        'ELK Stack', 'Datadog', 'Splunk', 'Helm', 'ArgoCD'
      ],
      certifications: [
        'AWS Certified Solutions Architect', 'Kubernetes CKA', 'Azure DevOps Engineer',
        'Google Cloud Professional', 'Terraform Associate', 'Linux Foundation'
      ]
    },
    datascience: {
      hard: [
        'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'NLP',
        'Computer Vision', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas',
        'NumPy', 'Data Visualization', 'Statistical Analysis', 'A/B Testing'
      ],
      soft: [
        'Analytical Thinking', 'Communication', 'Business Acumen', 'Curiosity',
        'Collaboration', 'Storytelling with Data', 'Problem Solving'
      ],
      tools: [
        'Jupyter', 'Tableau', 'Power BI', 'Git', 'Docker', 'AWS Sagemaker',
        'Apache Spark', 'Airflow', 'MLflow', 'Databricks'
      ],
      certifications: [
        'AWS Machine Learning Specialty', 'Google Data Engineer', 'Microsoft Data Scientist',
        'TensorFlow Developer', 'Databricks Certified'
      ]
    }
  },

  // Marketing
  marketing: {
    digital: {
      hard: [
        'SEO', 'SEM', 'Google Analytics', 'Google Ads', 'Facebook Ads',
        'Content Marketing', 'Email Marketing', 'Social Media Marketing',
        'Marketing Automation', 'A/B Testing', 'Conversion Optimization',
        'Google Tag Manager', 'Data Analysis', 'ROI Tracking'
      ],
      soft: [
        'Strategic Thinking', 'Creativity', 'Communication', 'Data-Driven Decision Making',
        'Project Management', 'Collaboration', 'Adaptability'
      ],
      tools: [
        'HubSpot', 'Marketo', 'Salesforce', 'Mailchimp', 'SEMrush', 'Ahrefs',
        'Hootsuite', 'Buffer', 'Canva', 'Adobe Creative Suite', 'WordPress'
      ]
    },
    content: {
      hard: [
        'Content Strategy', 'Copywriting', 'SEO Writing', 'Storytelling',
        'Content Management', 'Editorial Planning', 'Brand Voice',
        'Social Media Content', 'Email Copywriting', 'Content Marketing'
      ],
      soft: [
        'Creativity', 'Attention to Detail', 'Communication', 'Time Management',
        'Collaboration', 'Adaptability', 'Audience Understanding'
      ],
      tools: [
        'WordPress', 'Medium', 'Grammarly', 'Hemingway', 'Google Docs',
        'Notion', 'Airtable', 'Canva', 'Adobe Creative Suite', 'CMS platforms'
      ]
    }
  },

  // Sales
  sales: {
    b2b: {
      hard: [
        'B2B Sales', 'Enterprise Sales', 'SaaS Sales', 'Pipeline Management',
        'CRM Management', 'Lead Generation', 'Prospecting', 'Negotiation',
        'Account Management', 'Sales Forecasting', 'Contract Negotiation'
      ],
      soft: [
        'Relationship Building', 'Communication', 'Persuasion', 'Resilience',
        'Active Listening', 'Problem Solving', 'Time Management', 'Goal-Oriented'
      ],
      tools: [
        'Salesforce', 'HubSpot CRM', 'LinkedIn Sales Navigator', 'Outreach',
        'Salesloft', 'Gong', 'Zoom', 'Calendly', 'DocuSign'
      ]
    }
  },

  // Finance
  finance: {
    analysis: {
      hard: [
        'Financial Analysis', 'Financial Modeling', 'Excel', 'SQL', 'Python',
        'Data Analysis', 'Valuation', 'Financial Reporting', 'Budgeting',
        'Forecasting', 'Risk Analysis', 'Investment Analysis'
      ],
      soft: [
        'Analytical Thinking', 'Attention to Detail', 'Communication',
        'Problem Solving', 'Time Management', 'Business Acumen'
      ],
      tools: [
        'Excel', 'Bloomberg Terminal', 'Tableau', 'Power BI', 'SAP',
        'QuickBooks', 'SQL', 'Python', 'R'
      ],
      certifications: [
        'CFA', 'CPA', 'FRM', 'CFP', 'Series 7', 'Series 63'
      ]
    }
  }
};

// Action verbs categorized by impact
export const actionVerbs = {
  leadership: [
    'Spearheaded', 'Led', 'Directed', 'Orchestrated', 'Pioneered', 'Championed',
    'Drove', 'Established', 'Initiated', 'Launched', 'Mentored', 'Guided'
  ],
  achievement: [
    'Achieved', 'Delivered', 'Exceeded', 'Surpassed', 'Accomplished', 'Attained',
    'Secured', 'Generated', 'Increased', 'Boosted', 'Maximized', 'Optimized'
  ],
  technical: [
    'Architected', 'Engineered', 'Developed', 'Designed', 'Built', 'Implemented',
    'Deployed', 'Automated', 'Integrated', 'Migrated', 'Scaled', 'Refactored'
  ],
  improvement: [
    'Improved', 'Enhanced', 'Optimized', 'Streamlined', 'Reduced', 'Eliminated',
    'Transformed', 'Revamped', 'Modernized', 'Upgraded', 'Simplified', 'Consolidated'
  ],
  collaboration: [
    'Collaborated', 'Partnered', 'Coordinated', 'Facilitated', 'Aligned',
    'Engaged', 'Consulted', 'Advised', 'Supported', 'Contributed'
  ],
  analysis: [
    'Analyzed', 'Evaluated', 'Assessed', 'Investigated', 'Researched',
    'Identified', 'Diagnosed', 'Forecasted', 'Projected', 'Measured'
  ]
};

// Quantification helpers
export const quantificationPatterns = {
  percentages: ['%', 'percent', 'percentage increase', 'percentage decrease'],
  time: ['hours', 'days', 'weeks', 'months', 'years', 'faster', 'sooner'],
  money: ['$', 'revenue', 'savings', 'cost reduction', 'ROI'],
  scale: ['users', 'customers', 'transactions', 'requests', 'events per day'],
  team: ['team of X', 'managed X people', 'led X engineers', 'mentored X']
};

/**
 * Get relevant keywords for a specific role/industry
 */
export function getKeywordsForRole(role: string): KeywordCategory | null {
  const roleLower = role.toLowerCase();
  
  // Tech roles
  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('ui')) {
    return atsKeywords.tech.frontend;
  }
  if (roleLower.includes('backend') || roleLower.includes('api') || roleLower.includes('server')) {
    return atsKeywords.tech.backend;
  }
  if (roleLower.includes('devops') || roleLower.includes('sre') || roleLower.includes('infrastructure')) {
    return atsKeywords.tech.devops;
  }
  if (roleLower.includes('data scientist') || roleLower.includes('ml') || roleLower.includes('machine learning')) {
    return atsKeywords.tech.datascience;
  }
  
  // Marketing roles
  if (roleLower.includes('marketing') || roleLower.includes('seo') || roleLower.includes('sem')) {
    return atsKeywords.marketing.digital;
  }
  if (roleLower.includes('content') || roleLower.includes('copywriter')) {
    return atsKeywords.marketing.content;
  }
  
  // Sales roles
  if (roleLower.includes('sales') || roleLower.includes('account executive')) {
    return atsKeywords.sales.b2b;
  }
  
  // Finance roles
  if (roleLower.includes('financial analyst') || roleLower.includes('finance')) {
    return atsKeywords.finance.analysis;
  }
  
  return null;
}
