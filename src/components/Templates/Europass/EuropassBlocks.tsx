import { ResumeData, Experience, Education, Project, Language } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, ExternalLink } from 'lucide-react';
import { EditableText } from '../../Editor/PDFEditor/EditableText';
import { useResume } from '../../../context/ResumeContext';

export const EuropassHeader = ({ personalInfo, firstJobTitle }: { personalInfo: ResumeData['personalInfo']; firstJobTitle?: string }) => {
  const { updatePersonalInfo } = useResume();

  return (
    <div className="border-b-2 border-blue-900 pb-6 mb-6">
      <EditableText
        tag="h1"
        className="text-3xl font-bold text-blue-900 uppercase tracking-wider mb-2"
        content={personalInfo.fullName}
        onContentChange={(val: string) => updatePersonalInfo({ fullName: val })}
        placeholder="Your Name"
      />
      <p className="text-lg text-gray-600 mb-4">{firstJobTitle || 'Professional Title'}</p>
              
      <div className="grid grid-cols-1 gap-2 text-gray-600">
        {personalInfo.location && (
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
            <EditableText
              tag="span"
              content={personalInfo.location}
              onContentChange={(val: string) => updatePersonalInfo({ location: val })}
            />
          </div>
        )}
        {personalInfo.email && (
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
            <EditableText
              tag="span"
              content={personalInfo.email}
              onContentChange={(val: string) => updatePersonalInfo({ email: val })}
            />
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
            <EditableText
              tag="span"
              content={personalInfo.phone}
              onContentChange={(val: string) => updatePersonalInfo({ phone: val })}
            />
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center">
            <Linkedin className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
            <span className="break-all">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center">
            <Globe className="w-4 h-4 mr-2 text-blue-900 shrink-0" />
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export const EuropassSummary = ({ summary }: { summary: ResumeData['summary'] }) => {
  const { updateSummary } = useResume();

  if (!summary.rawText) return null;
  return (
    <div className="mb-6">
      <h2 className="text-blue-900 font-bold uppercase tracking-wider text-sm border-l-4 border-blue-900 pl-3 mb-3">
        Professional Summary
      </h2>
      <EditableText
        tag="p"
        className="text-justify leading-relaxed pl-3 whitespace-pre-line"
        content={summary.rawText}
        onContentChange={(val: string) => updateSummary({ rawText: val })}
      />
    </div>
  );
};

export const EuropassSkills = ({ skills }: { skills: ResumeData['skills'] }) => {
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  if (allSkills.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-blue-900 font-bold uppercase tracking-wider text-sm border-l-4 border-blue-900 pl-3 mb-3">
        Skills
      </h2>
      <div className="pl-3">
        <p className="text-gray-700">{allSkills.join(' • ')}</p>
      </div>
    </div>
  );
};

export const EuropassSectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-blue-900 font-bold uppercase tracking-wider text-sm border-l-4 border-blue-900 pl-3 mb-4 mt-2">
    {title}
  </h2>
);

export const EuropassExperienceItem = ({ exp }: { exp: Experience }) => {
  const { updateExperience } = useResume();

  return (
    <div className="mb-5 pl-3 break-inside-avoid">
      <div className="flex justify-between items-start mb-1">
        <EditableText
          tag="h3"
          className="font-bold text-blue-900 text-base"
          content={exp.position}
          onContentChange={(val: string) => updateExperience(exp.id, { position: val })}
        />
        <div className="flex gap-1 text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
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
      <EditableText
        tag="p"
        className="text-gray-800 font-semibold text-sm mb-1"
        content={exp.company}
        onContentChange={(val: string) => updateExperience(exp.id, { company: val })}
      />
      <div className="flex gap-1 text-gray-600 text-xs mb-2">
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

export const EuropassEducationItem = ({ edu }: { edu: Education }) => {
  const { updateEducation } = useResume();

  return (
    <div className="mb-4 pl-3 break-inside-avoid">
      <div className="flex justify-between items-start">
        <div className="flex gap-1 font-bold text-blue-900">
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
        <div className="flex gap-1 text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
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
      <EditableText
        tag="p"
        className="text-gray-800 font-semibold text-sm"
        content={edu.institution}
        onContentChange={(val: string) => updateEducation(edu.id, { institution: val })}
      />
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

export const EuropassProjectItem = ({ project }: { project: Project }) => {
  const { updateProject } = useResume();

  return (
    <div className="mb-5 pl-3 break-inside-avoid">
      <div className="flex justify-between items-start mb-1">
        <EditableText
          tag="h4"
          className="font-bold text-blue-900 text-base"
          content={project.title}
          onContentChange={(val: string) => updateProject(project.id, { title: val })}
        />
        <div className="flex gap-1 text-xs text-gray-500 font-semibold whitespace-nowrap ml-2">
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
      <div className="flex gap-1 text-gray-800 font-semibold text-sm">
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
              className="text-blue-900 hover:underline text-xs inline-flex items-center"
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

export const EuropassLanguages = ({ languages }: { languages: Language[] }) => {
  const { updateLanguage } = useResume();

  if (languages.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="text-blue-900 font-bold uppercase tracking-wider text-sm border-l-4 border-blue-900 pl-3 mb-3">
        Languages
      </h2>
      <div className="pl-3 space-y-2">
        {languages.map((lang) => (
          <div key={lang.id}>
            <EditableText
              tag="span"
              className="font-bold text-gray-900"
              content={lang.language}
              onContentChange={(val: string) => updateLanguage(lang.id, { language: val })}
            />
            <span className="text-gray-600 ml-2">– </span>
            <EditableText
              tag="span"
              className="text-gray-600"
              content={lang.level}
              onContentChange={(val: string) => updateLanguage(lang.id, { level: val })}
            />
            {lang.details && (
              <EditableText
                tag="span"
                className="text-xs text-gray-500 block ml-2"
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
