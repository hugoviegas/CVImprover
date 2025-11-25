import React from 'react';
import { ResumeData } from '../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, experience, education, skills, projects, languages } = data;

  // Flatten skills for display if needed, or display by category
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  return (
    <div className="bg-white min-h-[297mm] w-[210mm] shadow-lg text-sm font-sans text-gray-800 flex">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-900 text-white p-8 space-y-8">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold uppercase tracking-wider leading-tight">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <p className="text-blue-300 font-medium text-lg">{experience[0]?.position || 'Professional Title'}</p>
        </div>

        <div className="space-y-3 text-sm text-gray-300">
          {personalInfo.email && (
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
              <span className="break-all">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
              {personalInfo.location}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="break-all hover:text-blue-300">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center">
              <Linkedin className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
              <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </div>
          )}
        </div>

        {/* Skills Section */}
        {allSkills.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs border-b border-gray-700 pb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skill, index) => (
                <span key={index} className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages Section */}
        {languages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs border-b border-gray-700 pb-2">
              Languages
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex flex-col">
                  <span className="font-bold text-gray-200">{lang.language}</span>
                  <span className="text-xs text-gray-400">{lang.level}</span>
                  {lang.details && <span className="text-[10px] text-gray-500">{lang.details}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Sidebar (if preferred here) */}
        {education.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs border-b border-gray-700 pb-2">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-white">{edu.degree}</div>
                  <div className="text-gray-400 text-xs">{edu.institution}</div>
                  <div className="text-gray-500 text-xs italic">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 p-8 space-y-8">
        {/* Summary */}
        {summary.rawText && (
          <section>
            <h3 className="text-gray-900 font-bold uppercase tracking-widest text-xs border-b-2 border-gray-200 pb-2 mb-4">
              Profile
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {summary.rawText}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3 className="text-gray-900 font-bold uppercase tracking-widest text-xs border-b-2 border-gray-200 pb-2 mb-6">
              Experience
            </h3>
            <div className="space-y-8">
              {experience.map((exp) => (
                <div key={exp.id} className="relative border-l-2 border-gray-200 pl-6 pb-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-800 text-lg">{exp.position}</h4>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-4">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-blue-600 font-medium mb-3">{exp.company} {exp.city && `• ${exp.city}`}</div>
                  
                  {exp.descriptionRaw && (
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-3">
                      {exp.descriptionRaw}
                    </p>
                  )}
                  
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 text-sm text-gray-600 space-y-1">
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
            <h3 className="text-gray-900 font-bold uppercase tracking-widest text-xs border-b-2 border-gray-200 pb-2 mb-6">
              Projects
            </h3>
            <div className="space-y-6">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-gray-800">{project.title}</h4>
                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap ml-4">
                      {project.startDate} - {project.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-blue-600 text-sm font-medium mb-2">
                    {project.role} {project.clientOrCompany && `• ${project.clientOrCompany}`}
                  </div>
                  
                  {project.descriptionRaw && (
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line mb-2">
                      {project.descriptionRaw}
                    </p>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {project.links && project.links.length > 0 && (
                    <div className="flex gap-3">
                      {project.links.map((link, idx) => (
                        <a key={idx} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Link
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
  );
};
