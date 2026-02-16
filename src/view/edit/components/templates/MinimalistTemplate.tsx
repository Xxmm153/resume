import React from "react";
import { type Resume, type ResumeSection } from "../../../../store/resumeStore";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

interface TemplateProps {
  resume: Resume;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
}

const BasicInfoView = ({
  data,
  config,
}: {
  data: any;
  config: Resume["config"];
}) => {
  return (
    <div className="mb-8">
      <h1
        style={{
          fontSize: `${config.layout.titleFontSize * 1.5}px`,
          lineHeight: 1,
          color: config.themeColor,
        }}
        className="font-light tracking-tight mb-2"
      >
        {data.name}
      </h1>
      <p className="text-xl text-gray-500 font-light mb-4">{data.title}</p>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        {data.email && (
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs uppercase tracking-wider opacity-60">Email</span>
            <span>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs uppercase tracking-wider opacity-60">Phone</span>
            <span>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs uppercase tracking-wider opacity-60">Location</span>
            <span>{data.location}</span>
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-2">
            <span className="w-16 text-xs uppercase tracking-wider opacity-60">Website</span>
            <a
              href={data.website}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {data.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const SectionView = ({
  section,
  config,
}: {
  section: ResumeSection;
  config: Resume["config"];
}) => {
  if (!section.isVisible) return null;

  return (
    <div
      style={{
        marginBottom: `${config.layout.sectionMargin}px`,
      }}
    >
      <div className="grid grid-cols-[120px_1fr] gap-4">
        <h3
          style={{
            fontSize: `${config.layout.baseFontSize}px`,
            color: config.themeColor,
          }}
          className="font-medium uppercase tracking-wider text-right pt-1 opacity-80"
        >
          {section.title}
        </h3>
        <div
          className="prose max-w-none text-gray-700"
          style={{
            fontSize: `${config.layout.baseFontSize}px`,
            lineHeight: config.layout.lineHeight,
          }}
          dangerouslySetInnerHTML={{ __html: section.content }}
        />
      </div>
    </div>
  );
};

const MinimalistTemplate: React.FC<TemplateProps> = ({
  resume,
  selectedSectionId,
  onSelectSection,
}) => {
  return (
    <div
      id="resume-preview-paper"
      className="bg-white shadow-2xl min-h-[297mm] w-[210mm] h-fit origin-top transition-all duration-300 animate-fade-in"
      style={{
        padding: `${resume.config.layout.pageMargin}px`,
      }}
    >
      <div className="grid grid-cols-[200px_1fr] gap-8 h-full">
        {/* Sidebar Area for Basic Info */}
        <div className="border-r border-gray-100 pr-6">
          {resume.sections
            .filter((s) => s.type === "basic")
            .map((section, index) => (
              <div
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                data-selected={selectedSectionId === section.id ? "true" : "false"}
                className={`transition-all duration-200 rounded-sm cursor-pointer border-2 border-transparent relative group ${
                  selectedSectionId === section.id
                    ? "border-primary/50 bg-primary/5 -m-2 p-2 shadow-sm z-10"
                    : "hover:bg-gray-50/80 hover:-m-2 hover:p-2 hover:z-10"
                }`}
              >
                <BasicInfoView data={section.content} config={resume.config} />
              </div>
            ))}
        </div>

        {/* Main Content Area */}
        <div className="pt-2">
          {resume.sections
            .filter((s) => s.type !== "basic")
            .map((section, index) => (
              <div
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                style={{ animationDelay: `${index * 50}ms` }}
                data-selected={selectedSectionId === section.id ? "true" : "false"}
                className={`transition-all duration-200 rounded-sm cursor-pointer border-2 border-transparent relative group animate-fade-in ${
                  selectedSectionId === section.id
                    ? "border-primary/50 bg-primary/5 -m-2 p-2 shadow-sm z-10"
                    : "hover:bg-gray-50/80 hover:-m-2 hover:p-2 hover:z-10"
                }`}
              >
                <SectionView section={section} config={resume.config} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalistTemplate;
