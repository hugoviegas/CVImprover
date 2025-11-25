import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export const EuropassTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, languages } = data;

  // Flatten skills for display
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  return (
    <div className="bg-white min-h-[297mm] w-[210mm] p-8 shadow-lg text-sm font-sans text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-6">
        <div className="w-2/3">
          <h1 className="text-3xl font-bold text-blue-900 uppercase tracking-wider mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{experience[0]?.position || 'Professional Title'}</p>
          
          <div className="grid grid-cols-1 gap-2 text-gray-600">
            {personalInfo.location && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center">
                <Linkedin className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
                <span className="break-all">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 break-all">
                  {personalInfo.website}
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Optional Photo Placeholder or Initials */}
        <div className="w-32 h-40 bg-gray-100 border border-gray-300 flex items-center justify-center text-blue-900 font-bold text-4xl rounded">
          {personalInfo.fullName ? personalInfo.fullName.charAt(0) : 'P'}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-4 space-y-6">
          {/* Skills */}
          {allSkills.length > 0 && (
            <section>
              <h3 className="text-blue-900 font-bold border-b border-gray-300 pb-1 mb-3 uppercase text-xs">
                Skills
              </h3>
              <ul className="space-y-2">
                {allSkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1.5 mr-2 shrink-0" />
                    <span className="font-medium text-sm">{skill}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h3 className="text-blue-900 font-bold border-b border-gray-300 pb-1 mb-3 uppercase text-xs">
                Languages
              </h3>
              <ul className="space-y-3">
                {languages.map((lang) => (
                  <li key={lang.id} className="flex flex-col">
                    <span className="font-bold text-gray-800">{lang.language}</span>
                    <span className="text-xs text-gray-600">{lang.level}</span>
                    {lang.details && <span className="text-[10px] text-gray-500 italic">{lang.details}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Education (Short) */}
          {education.length > 0 && (
            <section>
              <h3 className="text-blue-900 font-bold border-b border-gray-300 pb-1 mb-3 uppercase text-xs">
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-gray-800">{edu.degree}</div>
                    <div className="text-gray-600 text-xs">{edu.institution}</div>
                    <div className="text-xs text-gray-500">
                      {edu.startDate} - {edu.endDate || 'Present'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="col-span-8 space-y-6">
          {/* Summary */}
          {summary.rawText && (
            <section>
              <h3 className="text-blue-900 font-bold border-b border-gray-300 pb-1 mb-3 uppercase text-xs">
                Profile
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">
                {summary.rawText}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h3 className="text-blue-900 font-bold border-b border-gray-300 pb-1 mb-3 uppercase text-xs">
                Work Experience
              </h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-800 text-lg">{exp.position}</h4>
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-2">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="text-blue-700 font-medium mb-2">{exp.company} {exp.city && `| ${exp.city}`}</div>
                    
                    {exp.descriptionRaw && (
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-2">
                        {exp.descriptionRaw}
                      </p>
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
            <section>
              <h3 className="text-blue-900 font-bold border-b border-gray-300 pb-1 mb-3 uppercase text-xs">
                Projects
              </h3>
              <div className="space-y-5">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-gray-800">{project.title}</h4>
                      <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-2">
                        {project.startDate} - {project.endDate || 'Present'}
                      </span>
                    </div>
                    <div className="text-blue-700 text-sm font-medium mb-2">
                      {project.role} {project.clientOrCompany && `| ${project.clientOrCompany}`}
                    </div>
                    
                    {project.descriptionRaw && (
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line mb-2">
                        {project.descriptionRaw}
                      </p>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.technologies.map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.links && project.links.length > 0 && (
                      <div className="flex gap-3">
                        {project.links.map((link, idx) => (
                          <a key={idx} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Project Link
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
