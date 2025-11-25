import { ResumeData, Experience, Education, Project, Language } from '../../../types/resume';
import { EditableText } from '../../Editor/PDFEditor/EditableText';
import { useResume } from '../../../context/ResumeContext';

export const ATSHeader = ({ personalInfo }: { personalInfo: ResumeData['personalInfo'] }) => {
  const { updatePersonalInfo } = useResume();

  return (
    <header className="border-b-2 border-gray-900 pb-4 mb-6 text-center">
      <EditableText
        tag="h1"
        className="text-3xl font-bold uppercase tracking-wide mb-2"
        content={personalInfo.fullName}
        onContentChange={(val: string) => updatePersonalInfo({ fullName: val })}
        placeholder="YOUR NAME"
      />
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        <EditableText
          tag="span"
          content={personalInfo.location}
          onContentChange={(val: string) => updatePersonalInfo({ location: val })}
          placeholder="Location"
        />
        {personalInfo.phone && (
          <>
            <span className="text-gray-400">•</span>
            <EditableText
              tag="span"
              content={personalInfo.phone}
              onContentChange={(val: string) => updatePersonalInfo({ phone: val })}
            />
          </>
        )}
        {personalInfo.email && (
          <>
            <span className="text-gray-400">•</span>
            <EditableText
              tag="span"
              content={personalInfo.email}
              onContentChange={(val: string) => updatePersonalInfo({ email: val })}
            />
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
  );
};

export const ATSSectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-lg font-bold uppercase border-b border-gray-300 mb-4 mt-2">{title}</h2>
);

export const ATSSummary = ({ summary }: { summary: ResumeData['summary'] }) => {
  const { updateSummary } = useResume();
  
  if (!summary.rawText) return null;
  
  return (
    <div className="mb-6">
      <ATSSectionTitle title="Professional Summary" />
      <EditableText
        tag="p"
        className="text-justify whitespace-pre-line"
        content={summary.rawText}
        onContentChange={(val: string) => updateSummary({ rawText: val })}
      />
    </div>
  );
};

export const ATSSkills = ({ skills }: { skills: ResumeData['skills'] }) => {
  const allSkills = [
    ...(skills.categorized?.infrastructureAndSystems || []),
    ...(skills.categorized?.networkAndSecurity || []),
    ...(skills.categorized?.programmingAndScripting || []),
    ...(skills.categorized?.other || [])
  ];

  if (allSkills.length === 0) return null;

  return (
    <div className="mb-6">
      <ATSSectionTitle title="Technical Skills" />
      <div className="text-justify">
        <span className="font-semibold">Core Competencies: </span>
        {allSkills.join(' • ')}
      </div>
    </div>
  );
};

export const ATSExperienceItem = ({ exp }: { exp: Experience }) => {
  const { updateExperience } = useResume();

  return (
    <div className="mb-5 break-inside-avoid">
      <div className="flex justify-between items-baseline mb-1">
        <EditableText
          tag="h3"
          className="font-bold text-lg"
          content={exp.position}
          onContentChange={(val: string) => updateExperience(exp.id, { position: val })}
        />
        <div className="flex gap-1 text-sm font-medium whitespace-nowrap">
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
      <div className="flex justify-between items-center mb-2 italic">
        <EditableText
          tag="span"
          content={exp.company}
          onContentChange={(val: string) => updateExperience(exp.id, { company: val })}
        />
        <div className="flex gap-1 text-sm">
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
      </div>
      
      {exp.descriptionRaw && (
        <EditableText
          tag="p"
          className="mb-2 whitespace-pre-line"
          content={exp.descriptionRaw}
          onContentChange={(val: string) => updateExperience(exp.id, { descriptionRaw: val })}
        />
      )}

      {exp.highlights && exp.highlights.length > 0 && (
        <ul className="list-disc list-outside ml-5 space-y-1">
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

export const ATSProjectItem = ({ project }: { project: Project }) => {
  const { updateProject } = useResume();

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex justify-between items-baseline mb-1">
        <EditableText
          tag="h3"
          className="font-bold"
          content={project.title}
          onContentChange={(val: string) => updateProject(project.id, { title: val })}
        />
        <div className="flex gap-1 text-sm font-medium whitespace-nowrap">
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
      <div className="mb-2 italic text-sm">
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
          className="mb-2 whitespace-pre-line"
          content={project.descriptionRaw}
          onContentChange={(val: string) => updateProject(project.id, { descriptionRaw: val })}
        />
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
  );
};

export const ATSEducationItem = ({ edu }: { edu: Education }) => {
  const { updateEducation } = useResume();

  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex justify-between items-baseline">
        <EditableText
          tag="h3"
          className="font-bold"
          content={edu.institution}
          onContentChange={(val: string) => updateEducation(edu.id, { institution: val })}
        />
        <div className="flex gap-1 text-sm font-medium whitespace-nowrap">
          <EditableText
            tag="span"
            content={edu.startDate}
            onContentChange={(val: string) => updateEducation(edu.id, { startDate: val })}
          />
          <span>–</span>
          <EditableText
            tag="span"
            content={edu.endDate || (edu.current ? 'Present' : '')}
            onContentChange={(val: string) => updateEducation(edu.id, { endDate: val })}
          />
        </div>
      </div>
      <div className="flex justify-between items-center italic">
        <div className="flex gap-1">
          <EditableText
            tag="span"
            content={edu.degree}
            onContentChange={(val: string) => updateEducation(edu.id, { degree: val })}
          />
          {edu.course && (
            <>
              <span> in </span>
              <EditableText
                tag="span"
                content={edu.course}
                onContentChange={(val: string) => updateEducation(edu.id, { course: val })}
              />
            </>
          )}
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

export const ATSLanguages = ({ languages }: { languages: Language[] }) => {
  const { updateLanguage } = useResume();

  if (languages.length === 0) return null;
  return (
    <div className="mb-6 break-inside-avoid">
      <ATSSectionTitle title="Languages" />
      <div className="grid grid-cols-2 gap-4">
        {languages.map((lang) => (
          <div key={lang.id} className="flex justify-between border-b border-gray-100 pb-1">
            <EditableText
              tag="span"
              className="font-semibold"
              content={lang.language}
              onContentChange={(val: string) => updateLanguage(lang.id, { language: val })}
            />
            <EditableText
              tag="span"
              className="italic text-gray-700"
              content={lang.level}
              onContentChange={(val: string) => updateLanguage(lang.id, { level: val })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
