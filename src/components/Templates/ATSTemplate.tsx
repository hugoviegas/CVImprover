import React from 'react';
import { ResumeData } from '../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ATSTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, languages } = data;

  // Flatten skills for display
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  return (
    <div className="bg-white min-h-[297mm] w-[210mm] p-12 shadow-lg text-base font-serif text-gray-900 leading-relaxed">
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">
          {personalInfo.fullName || 'YOUR NAME'}
        </h1>
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && (
            <>
              <span className="text-gray-400">•</span>
              <span>{personalInfo.phone}</span>
            </>
          )}
          {personalInfo.email && (
            <>
              <span className="text-gray-400">•</span>
              <span>{personalInfo.email}</span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span className="text-gray-400">•</span>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                LinkedIn
              </a>
            </>
          )}
          {personalInfo.website && (
            <>
              <span className="text-gray-400">•</span>
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Portfolio
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary.rawText && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Professional Summary</h2>
          <p className="text-justify whitespace-pre-line">
            {summary.rawText}
          </p>
        </section>
      )}

      {/* Skills */}
      {allSkills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Technical Skills</h2>
          <div className="text-justify">
            <span className="font-semibold">Core Competencies: </span>
            {allSkills.join(' • ')}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Professional Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg">{exp.position}</h3>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2 italic">
                  <span>{exp.company}</span>
                  <span className="text-sm">{exp.city}{exp.city && exp.country ? ', ' : ''}{exp.country}</span>
                </div>
                
                {exp.descriptionRaw && (
                  <p className="mb-2 whitespace-pre-line">{exp.descriptionRaw}</p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 space-y-1">
                    {exp.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Key Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold">{project.title}</h3>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {project.startDate} – {project.endDate || 'Present'}
                  </span>
                </div>
                <div className="mb-2 italic text-sm">
                  {project.role} {project.clientOrCompany && `| ${project.clientOrCompany}`}
                </div>
                
                {project.descriptionRaw && (
                  <p className="mb-2 whitespace-pre-line">{project.descriptionRaw}</p>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-2 text-sm">
                    <span className="font-semibold">Technologies: </span>
                    {project.technologies.join(', ')}
                  </div>
                )}
                
                {project.links && project.links.length > 0 && (
                  <div className="text-sm">
                    {project.links.map((link, idx) => (
                      <a key={idx} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline mr-4">
                        {link.replace(/^https?:\/\//, '')}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold">{edu.institution}</h3>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </span>
                </div>
                <div className="flex justify-between items-center italic">
                  <span>{edu.degree} {edu.course && `in ${edu.course}`}</span>
                  <span className="text-sm">{edu.city}{edu.city && edu.country ? ', ' : ''}{edu.country}</span>
                </div>
                {edu.finalGrade && (
                  <div className="text-sm mt-1">Grade: {edu.finalGrade}</div>
                )}
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-5 mt-2 text-sm">
                    {edu.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-3">Languages</h2>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between border-b border-gray-100 pb-1">
                <span className="font-semibold">{lang.language}</span>
                <span className="italic text-gray-700">{lang.level}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
