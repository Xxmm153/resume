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
    <div className="flex flex-col items-center justify-center mb-8 text-center">
      {data.avatar && (
        <img
          src={data.avatar}
          alt={data.name}
          className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-gray-100"
        />
      )}
      <h1
        style={{
          fontSize: `${config.layout.titleFontSize * 1.2}px`,
          lineHeight: 1.2,
          color: config.themeColor,
        }}
        className="font-serif font-bold mb-2 tracking-wide"
      >
        {data.name}
      </h1>
      <p className="text-xl font-medium text-gray-600 mb-4 tracking-wider uppercase">
        {data.title}
      </p>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
        {data.email && (
          <div className="flex items-center gap-1.5">
            <Mail size={14} />
            <span>{data.email}</span>
          </div>
        )}
        {data.phone && (
          <div className="flex items-center gap-1.5">
            <Phone size={14} />
            <span>{data.phone}</span>
          </div>
        )}
        {data.location && (
          <div className="flex items-center gap-1.5">
            <MapPin size={14} />
            <span>{data.location}</span>
          </div>
        )}
        {data.website && (
          <div className="flex items-center gap-1.5">
            <Globe size={14} />
            <a
              href={data.website}
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              {data.website.replace(/^https?:\/\//, "")}
            </a>
          </div>
        )}
      </div>
      <div className="w-24 h-1 bg-gray-200 mt-6 mx-auto rounded-full"></div>
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
      <div className="flex items-center gap-4 mb-4">
        <h3
          style={{
            fontSize: `${config.layout.sectionTitleFontSize}px`,
            color: config.themeColor,
          }}
          className="font-serif font-bold uppercase tracking-widest whitespace-nowrap"
        >
          {section.title}
        </h3>
        <div className="h-[1px] bg-gray-200 flex-1"></div>
      </div>
      <div
        className="prose max-w-none text-gray-700 font-serif"
        style={{
          fontSize: `${config.layout.baseFontSize}px`,
          lineHeight: config.layout.lineHeight,
        }}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
};

const ClassicTemplate: React.FC<TemplateProps> = ({
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
      {resume.sections.map((section, index) => (
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
          {section.type === "basic" ? (
            <BasicInfoView data={section.content} config={resume.config} />
          ) : (
            <SectionView section={section} config={resume.config} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ClassicTemplate;
