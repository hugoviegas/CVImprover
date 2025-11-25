import React from 'react';
import { useResume } from '../../context/ResumeContext';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import LanguageSection from './LanguageSection';
import ProjectSection from './ProjectSection';
import SummarySection from './SummarySection';
import { JobDescriptionInput } from './JobDescriptionInput';
import JobAnalyzer from '../Analysis/JobAnalyzer';
import { User, MapPin, Mail, Phone, Globe, Linkedin } from 'lucide-react';

export const StructuredEditor: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResume();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Job Description Input - Prominent placement */}
      <JobDescriptionInput />

      {/* Personal Information */}
      <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 p-2 border"
                placeholder="John Doe"
              />
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 p-2 border"
                placeholder="john@example.com"
              />
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="relative">
              <input
                type="tel"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 p-2 border"
                placeholder="+1 (555) 000-0000"
              />
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="relative">
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 p-2 border"
                placeholder="New York, NY"
              />
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <div className="relative">
              <input
                type="url"
                value={resumeData.personalInfo.website}
                onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 p-2 border"
                placeholder="https://johndoe.com"
              />
              <Globe className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
            <div className="relative">
              <input
                type="url"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 p-2 border"
                placeholder="https://linkedin.com/in/johndoe"
              />
              <Linkedin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      <SummarySection />
      <ExperienceSection />
      <EducationSection />
      <LanguageSection />
      <ProjectSection />

      <div className="pt-8 border-t border-gray-200">
        <JobAnalyzer />
      </div>
    </div>
  );
};
