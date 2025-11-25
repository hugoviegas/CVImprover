import React, { useState, useLayoutEffect, useRef, ReactNode } from 'react';
import { ResumeData } from '../../types/resume';
import { A4Page } from './A4Page';
import * as ATS from '../Templates/ATS/ATSBlocks';
import * as Modern from '../Templates/Modern/ModernBlocks';
import * as Europass from '../Templates/Europass/EuropassBlocks';
import * as Minimal from '../Templates/Minimal/MinimalBlocks';

interface PaginatedPreviewProps {
  data: ResumeData;
  templateId: string;
}

const A4_HEIGHT_MM = 297;
const PADDING_MM = 15;
const CONTENT_HEIGHT_MM = A4_HEIGHT_MM - (PADDING_MM * 2);
const MM_TO_PX = 3.7795275591;
const CONTENT_HEIGHT_PX = CONTENT_HEIGHT_MM * MM_TO_PX;

export const PaginatedPreview: React.FC<PaginatedPreviewProps> = ({ data, templateId }) => {
  const [pages, setPages] = useState<ReactNode[][]>([]);
  const hiddenRef = useRef<HTMLDivElement>(null);

  // Get template-specific blocks
  const getBlocks = () => {
    const blocks: { id: string; component: ReactNode }[] = [];
    const firstJobTitle = data.experience[0]?.position;

    // Choose blocks based on templateId
    let Header, Summary, Skills, SectionTitle, ExperienceItem, EducationItem, ProjectItem, Languages;

    switch (templateId) {
      case 'modern':
        ({ ModernHeader: Header, ModernSummary: Summary, ModernSkills: Skills, ModernSectionTitle: SectionTitle,
           ModernExperienceItem: ExperienceItem, ModernEducationItem: EducationItem, 
           ModernProjectItem: ProjectItem, ModernLanguages: Languages } = Modern);
        break;
      case 'europass':
        ({ EuropassHeader: Header, EuropassSummary: Summary, EuropassSkills: Skills, EuropassSectionTitle: SectionTitle,
           EuropassExperienceItem: ExperienceItem, EuropassEducationItem: EducationItem,
           EuropassProjectItem: ProjectItem, EuropassLanguages: Languages } = Europass);
        break;
      case 'minimal':
        ({ MinimalHeader: Header, MinimalSummary: Summary, MinimalSkills: Skills, MinimalSectionTitle: SectionTitle,
           MinimalExperienceItem: ExperienceItem, MinimalEducationItem: EducationItem,
           MinimalProjectItem: ProjectItem, MinimalLanguages: Languages } = Minimal);
        break;
      default: // 'ats'
        ({ ATSHeader: Header, ATSSummary: Summary, ATSSkills: Skills, ATSSectionTitle: SectionTitle,
           ATSExperienceItem: ExperienceItem, ATSEducationItem: EducationItem,
           ATSProjectItem: ProjectItem, ATSLanguages: Languages } = ATS);
    }

    // Build blocks
    blocks.push({ 
      id: 'header', 
      component: <Header personalInfo={data.personalInfo} firstJobTitle={firstJobTitle} /> 
    });

    if (data.summary.rawText) {
      blocks.push({ id: 'summary', component: <Summary summary={data.summary} /> });
    }

    blocks.push({ id: 'skills', component: <Skills skills={data.skills} /> });

    if (data.experience.length > 0) {
      blocks.push({ id: 'exp-title', component: <SectionTitle title="Professional Experience" /> });
      data.experience.forEach(exp => {
        blocks.push({ id: `exp-${exp.id}`, component: <ExperienceItem exp={exp} /> });
      });
    }

    if (data.projects.length > 0) {
      blocks.push({ id: 'proj-title', component: <SectionTitle title="Key Projects" /> });
      data.projects.forEach(proj => {
        blocks.push({ id: `proj-${proj.id}`, component: <ProjectItem project={proj} /> });
      });
    }

    if (data.education.length > 0) {
      blocks.push({ id: 'edu-title', component: <SectionTitle title="Education" /> });
      data.education.forEach(edu => {
        blocks.push({ id: `edu-${edu.id}`, component: <EducationItem edu={edu} /> });
      });
    }

    if (data.languages.length > 0) {
      blocks.push({ id: 'lang', component: <Languages languages={data.languages} /> });
    }

    return blocks;
  };

  const blocks = getBlocks();

  useLayoutEffect(() => {
    if (!hiddenRef.current) return;

    const container = hiddenRef.current;
    const children = Array.from(container.children) as HTMLElement[];
    
    if (children.length === 0) return;

    const newPages: ReactNode[][] = [];
    let currentPage: ReactNode[] = [];
    let currentHeight = 0;

    const MAX_HEIGHT = CONTENT_HEIGHT_PX - 5;

    children.forEach((child, index) => {
      const height = child.offsetHeight;
      const blockComponent = blocks[index].component;

      if (currentHeight + height > MAX_HEIGHT) {
        if (currentPage.length > 0) {
          newPages.push(currentPage);
        }
        currentPage = [blockComponent];
        currentHeight = height;
      } else {
        currentPage.push(blockComponent);
        currentHeight += height;
      }
    });

    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages);

  }, [data, templateId]);

  return (
    <div>
      {/* Hidden Measurement Container - FIXED */}
      <div 
        ref={hiddenRef} 
        style={{ 
          position: 'absolute',
          top: 0,
          left: '-9999px',
          visibility: 'hidden',
          opacity: 0,
          width: '210mm', 
          padding: '15mm',
          pointerEvents: 'none'
        }}
        className="bg-white text-base font-serif text-gray-900 leading-relaxed"
        aria-hidden="true"
      >
        {blocks.map(b => (
          <div key={b.id}>{b.component}</div>
        ))}
      </div>

      {/* Render Pages */}
      <div className="flex flex-col items-center gap-6">
        {pages.length === 0 ? (
          <A4Page>
             <div className="animate-pulse space-y-4">
               <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
               <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
               <div className="h-32 bg-gray-200 rounded w-full"></div>
             </div>
          </A4Page>
        ) : (
          pages.map((pageContent, i) => (
            <A4Page key={i} pageNumber={i + 1} totalPages={pages.length}>
              <div className="text-base font-serif text-gray-900 leading-relaxed h-full">
                {pageContent}
              </div>
            </A4Page>
          ))
        )}
      </div>
    </div>
  );
};
