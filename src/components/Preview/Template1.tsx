import React from 'react';
import { ResumeData } from '../../types/resume';

interface TemplateProps {
  data: ResumeData;
}

const Template1: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, languages } = data;

  // Flatten skills for display
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  return (
    <div className="bg-white p-8 shadow-lg max-w-[210mm] min-h-[297mm] mx-auto text-gray-800" id="resume-preview">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-gray-900">{personalInfo.fullName}</h1>
        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
              LinkedIn
            </a>
          )}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Portfolio
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary.rawText && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Professional Summary</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">{summary.rawText}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Experience</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate || (exp.current ? 'Present' : '')}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {exp.company} {exp.city && `| ${exp.city}`}
                </div>
                
                {exp.descriptionRaw && (
                  <p className="text-sm mt-1 whitespace-pre-line mb-2">{exp.descriptionRaw}</p>
                )}

                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
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
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{project.title}</h3>
                  <span className="text-sm text-gray-600">
                    {project.startDate} - {project.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-700 mb-1">
                  {project.role} {project.clientOrCompany && `| ${project.clientOrCompany}`}
                </div>
                
                {project.descriptionRaw && (
                  <p className="text-sm mt-1 whitespace-pre-line mb-2">{project.descriptionRaw}</p>
                )}

                {project.technologies && project.technologies.length > 0 && (
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Tech: </span>
                    {project.technologies.join(', ')}
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
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Education</h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <span className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate || (edu.current ? 'Present' : '')}
                  </span>
                </div>
                <div className="text-sm">
                  {edu.degree} {edu.course && `in ${edu.course}`}
                </div>
                {edu.highlights && edu.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 text-sm text-gray-700">
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

      {/* Skills */}
      {allSkills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, index) => (
              <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-2">Languages</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="font-semibold">{lang.language}</span>
                <span className="text-gray-600 ml-1">({lang.level})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Template1;
