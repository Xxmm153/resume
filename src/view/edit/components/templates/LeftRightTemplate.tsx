import React from "react";
import { type Resume, type ResumeSection } from "../../../../store/resumeStore";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

interface TemplateProps {
  resume: Resume;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
}

const BasicInfoView = ({ data }: { data: any; config: Resume["config"] }) => {
  return (
    <div className="text-white">
      <div className="mb-8 text-center">
        {data.avatar && (
          <img
            src={data.avatar}
            alt={data.name}
            className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white/20"
          />
        )}
        <h1 className="text-2xl font-bold mb-2 tracking-wide">{data.name}</h1>
        <p className="text-sm opacity-90 uppercase tracking-widest mb-6">
          {data.title}
        </p>
      </div>

      <div className="space-y-4 text-sm opacity-90">
        {data.email && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Mail size={14} />
            </div>
            <span className="break-all">{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Phone size={14} />
            </div>
            <span>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <MapPin size={14} />
            </div>
            <span>{data.location}</span>
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Globe size={14} />
            </div>
            <a
              href={data.website}
              target="_blank"
              rel="noreferrer"
              className="hover:underline break-all"
            >
              {data.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const LeftSectionView = ({
  section,
}: {
  section: ResumeSection;
  config: Resume["config"];
}) => {
  if (!section.isVisible) return null;

  return (
    <div className="mt-8 text-white">
      <h3 className="text-lg font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">
        {section.title}
      </h3>
      <div
        className="prose prose-invert prose-sm max-w-none text-white/90"
        style={{
          fontSize: "13px",
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
};

const RightSectionView = ({
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
      <h3
        style={{
          fontSize: `${config.layout.sectionTitleFontSize}px`,
          color: config.themeColor,
          borderLeft: `4px solid ${config.themeColor}`,
        }}
        className="font-bold pl-3 mb-4 uppercase tracking-wide"
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
  );
};

const LeftRightTemplate: React.FC<TemplateProps> = ({
  resume,
  selectedSectionId,
  onSelectSection,
}) => {
  const leftTypes = ["basic", "skills", "summary", "languages"];
  const leftSections = resume.sections.filter((s) =>
    leftTypes.includes(s.type),
  );
  const rightSections = resume.sections.filter(
    (s) => !leftTypes.includes(s.type),
  );

  return (
    <div
      id="resume-preview-paper"
      className="bg-white shadow-2xl min-h-[297mm] w-[210mm] h-fit origin-top transition-all duration-300 animate-fade-in flex"
    >
      {/* Left Sidebar */}
      <div
        className="w-[32%] shrink-0 min-h-full p-8"
        style={{ backgroundColor: resume.config.themeColor }}
      >
        {leftSections
          .filter((section) => section.isVisible)
          .map((section) => (
            <div
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              data-selected={
                selectedSectionId === section.id ? "true" : "false"
              }
              className={`transition-all duration-200 rounded-sm cursor-pointer border-2 border-transparent relative group ${
                selectedSectionId === section.id ?
                  "border-white/50 bg-white/10 -m-2 p-2 shadow-sm z-10"
                : "hover:bg-white/10 hover:-m-2 hover:p-2 hover:z-10"
              }`}
            >
              {section.type === "basic" ?
                <BasicInfoView data={section.content} config={resume.config} />
              : <LeftSectionView section={section} config={resume.config} />}
            </div>
          ))}
      </div>

      {/* Right Content */}
      <div
        className="flex-1 p-8"
        style={{
          paddingTop: `${resume.config.layout.pageMargin}px`,
          paddingRight: `${resume.config.layout.pageMargin}px`,
          paddingBottom: `${resume.config.layout.pageMargin}px`,
        }}
      >
        {rightSections
          .filter((section) => section.isVisible)
          .map((section, index) => (
            <div
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              style={{ animationDelay: `${index * 50}ms` }}
              data-selected={
                selectedSectionId === section.id ? "true" : "false"
              }
              className={`transition-all duration-200 rounded-sm cursor-pointer border-2 border-transparent relative group animate-fade-in ${
                selectedSectionId === section.id ?
                  "border-primary/50 bg-primary/5 -m-2 p-2 shadow-sm z-10"
                : "hover:bg-gray-50/80 hover:-m-2 hover:p-2 hover:z-10"
              }`}
            >
              <RightSectionView section={section} config={resume.config} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftRightTemplate;
