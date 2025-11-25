import { ResumeData, Experience, Education, Project, Language } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink } from 'lucide-react';
import { EditableText } from '../../Editor/PDFEditor/EditableText';
import { useResume } from '../../../context/ResumeContext';

export const ModernHeader = ({ personalInfo, firstJobTitle }: { personalInfo: ResumeData['personalInfo']; firstJobTitle?: string }) => {
  const { updatePersonalInfo } = useResume();

  return (
    <div className="space-y-4">
      <EditableText
        tag="h1"
        className="text-2xl font-bold uppercase tracking-wider leading-tight"
        content={personalInfo.fullName}
        onContentChange={(val: string) => updatePersonalInfo({ fullName: val })}
        placeholder="Your Name"
      />
      <p className="text-blue-300 font-medium text-lg">{firstJobTitle || 'Professional Title'}</p>
      
      <div className="space-y-3 text-sm text-gray-300">
        {personalInfo.email && (
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
            <EditableText
              tag="span"
              className="break-all"
              content={personalInfo.email}
              onContentChange={(val: string) => updatePersonalInfo({ email: val })}
            />
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
            <EditableText
              tag="span"
              content={personalInfo.phone}
              onContentChange={(val: string) => updatePersonalInfo({ phone: val })}
            />
          </div>
        )}
        {personalInfo.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-3 text-blue-400 shrink-0" />
            <EditableText
              tag="span"
              content={personalInfo.location}
              onContentChange={(val: string) => updatePersonalInfo({ location: val })}
            />
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
    </div>
  );
};

export const ModernSummary = ({ summary }: { summary: ResumeData['summary'] }) => {
  const { updateSummary } = useResume();

  if (!summary.rawText) return null;
  return (
    <div className="mb-6">
      <h3 className="text-blue-600 font-bold uppercase tracking-widest text-xs border-b-2 border-blue-600 pb-2 mb-4">
        Professional Summary
      </h3>
      <EditableText
        tag="p"
        className="text-justify leading-relaxed whitespace-pre-line"
        content={summary.rawText}
        onContentChange={(val: string) => updateSummary({ rawText: val })}
      />
    </div>
  );
};

export const ModernSkills = ({ skills }: { skills: ResumeData['skills'] }) => {
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  if (allSkills.length === 0) return null;

  return (
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
  );
};

export const ModernSectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-blue-600 font-bold uppercase tracking-widest text-xs border-b-2 border-blue-600 pb-2 mb-4 mt-2">
    {title}
  </h3>
);

export const ModernExperienceItem = ({ exp }: { exp: Experience }) => {
  const { updateExperience } = useResume();

  return (
    <div className="mb-5 break-inside-avoid">
      <div className="flex justify-between items-start mb-1">
        <EditableText
          tag="h4"
          className="font-bold text-gray-900 text-base"
          content={exp.position}
          onContentChange={(val: string) => updateExperience(exp.id, { position: val })}
        />
        <div className="flex gap-1 text-xs text-gray-500 italic whitespace-nowrap ml-2">
          <EditableText
            tag="span"
            content={exp.startDate}
            onContentChange={(val: string) => updateExperience(exp.id, { startDate: val })}
          />
          <span>–</span>
          <EditableText
            tag="span"
            content={exp.endDate || (exp.current ? 'Present' : '')}
            onContentChange={(val: string) => updateExperience(exp.id, { endDate: val })}
          />
        </div>
      </div>
      <div className="flex items-center gap-1 text-blue-600 font-semibold text-sm mb-2">
        <EditableText
          tag="span"
          content={exp.company}
          onContentChange={(val: string) => updateExperience(exp.id, { company: val })}
        />
        <span>•</span>
        <EditableText
          tag="span"
          content={exp.city}
          onContentChange={(val: string) => updateExperience(exp.id, { city: val })}
        />
        {exp.city && exp.country && <span>, </span>}
        <EditableText
          tag="span"
          content={exp.country}
          onContentChange={(val: string) => updateExperience(exp.id, { country: val })}
        />
      </div>
      
      {exp.descriptionRaw && (
        <EditableText
          tag="p"
          className="text-gray-700 text-sm mb-2 whitespace-pre-line"
          content={exp.descriptionRaw}
          onContentChange={(val: string) => updateExperience(exp.id, { descriptionRaw: val })}
        />
      )}

      {exp.highlights && exp.highlights.length > 0 && (
        <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700">
          {exp.highlights.map((highlight, idx) => (
            <li key={idx}>
              <EditableText
                tag="span"
                content={highlight}
                onContentChange={(val: string) => {
                  const newHighlights = [...exp.highlights];
                  newHighlights[idx] = val;
                  updateExperience(exp.id, { highlights: newHighlights });
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ModernEducationItem = ({ edu }: { edu: Education }) => {
  const { updateEducation } = useResume();

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex justify-between items-start">
        <div className="flex gap-1 font-bold text-gray-900">
          <EditableText
            tag="span"
            content={edu.degree}
            onContentChange={(val: string) => updateEducation(edu.id, { degree: val })}
          />
          {edu.course && (
            <>
              <span>in</span>
              <EditableText
                tag="span"
                content={edu.course}
                onContentChange={(val: string) => updateEducation(edu.id, { course: val })}
              />
            </>
          )}
        </div>
        <div className="flex gap-1 text-xs text-gray-500 italic whitespace-nowrap ml-2">
          <EditableText
            tag="span"
            content={edu.startDate}
            onContentChange={(val: string) => updateEducation(edu.id, { startDate: val })}
          />
          <span>–</span>
          <EditableText
            tag="span"
            content={edu.endDate || 'Present'}
            onContentChange={(val: string) => updateEducation(edu.id, { endDate: val })}
          />
        </div>
      </div>
      <div className="text-blue-600 font-semibold text-sm">
        <EditableText
          tag="span"
          content={edu.institution}
          onContentChange={(val: string) => updateEducation(edu.id, { institution: val })}
        />
      </div>
      <div className="flex gap-1 text-sm">
        <EditableText
          tag="span"
          content={edu.city}
          onContentChange={(val: string) => updateEducation(edu.id, { city: val })}
        />
        {edu.city && edu.country && <span>, </span>}
        <EditableText
          tag="span"
          content={edu.country}
          onContentChange={(val: string) => updateEducation(edu.id, { country: val })}
        />
      </div>
      {edu.finalGrade && (
        <div className="text-sm mt-1 flex gap-1">
          <span>Grade: </span>
          <EditableText
            tag="span"
            content={edu.finalGrade}
            onContentChange={(val: string) => updateEducation(edu.id, { finalGrade: val })}
          />
        </div>
      )}
      {edu.highlights && edu.highlights.length > 0 && (
        <ul className="list-disc list-outside ml-5 mt-2 text-sm">
          {edu.highlights.map((highlight, idx) => (
            <li key={idx}>
              <EditableText
                tag="span"
                content={highlight}
                onContentChange={(val: string) => {
                  const newHighlights = [...edu.highlights];
                  newHighlights[idx] = val;
                  updateEducation(edu.id, { highlights: newHighlights });
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const ModernProjectItem = ({ project }: { project: Project }) => {
  const { updateProject } = useResume();

  return (
    <div className="mb-5 break-inside-avoid">
      <div className="flex justify-between items-start mb-1">
        <EditableText
          tag="h4"
          className="font-bold text-gray-900 text-base"
          content={project.title}
          onContentChange={(val: string) => updateProject(project.id, { title: val })}
        />
        <div className="flex gap-1 text-xs text-gray-500 italic whitespace-nowrap ml-2">
          <EditableText
            tag="span"
            content={project.startDate}
            onContentChange={(val: string) => updateProject(project.id, { startDate: val })}
          />
          <span>–</span>
          <EditableText
            tag="span"
            content={project.endDate || 'Present'}
            onContentChange={(val: string) => updateProject(project.id, { endDate: val })}
          />
        </div>
      </div>
      <div className="flex gap-1 text-blue-600 font-semibold text-sm">
        <EditableText
          tag="span"
          content={project.role}
          onContentChange={(val: string) => updateProject(project.id, { role: val })}
        />
        {project.clientOrCompany && (
          <>
            <span> | </span>
            <EditableText
              tag="span"
              content={project.clientOrCompany}
              onContentChange={(val: string) => updateProject(project.id, { clientOrCompany: val })}
            />
          </>
        )}
      </div>
      
      {project.descriptionRaw && (
        <EditableText
          tag="p"
          className="text-gray-700 text-sm mt-2 whitespace-pre-line"
          content={project.descriptionRaw}
          onContentChange={(val: string) => updateProject(project.id, { descriptionRaw: val })}
        />
      )}

      {project.technologies && project.technologies.length > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          <span className="font-semibold">Technologies:</span> {project.technologies.join(', ')}
        </p>
      )}
      {project.links && project.links.length > 0 && (
        <div className="flex gap-2 mt-2">
          {project.links.map((link, idx) => (
            <a
              key={idx}
              href={link.startsWith('http') ? link : `https://${link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs inline-flex items-center"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {link.replace(/^https?:\/\//, '')}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export const ModernLanguages = ({ languages }: { languages: Language[] }) => {
  const { updateLanguage } = useResume();

  if (languages.length === 0) return null;
  return (
    <div className="space-y-4">
      <h3 className="text-blue-400 font-bold uppercase tracking-widest text-xs border-b border-gray-700 pb-2">
        Languages
      </h3>
      <div className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.id} className="flex flex-col">
            <EditableText
              tag="span"
              className="font-bold text-gray-200"
              content={lang.language}
              onContentChange={(val: string) => updateLanguage(lang.id, { language: val })}
            />
            <EditableText
              tag="span"
              className="text-xs text-gray-400"
              content={lang.level}
              onContentChange={(val: string) => updateLanguage(lang.id, { level: val })}
            />
            {lang.details && (
              <EditableText
                tag="span"
                className="text-[10px] text-gray-500"
                content={lang.details}
                onContentChange={(val: string) => updateLanguage(lang.id, { details: val })}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
