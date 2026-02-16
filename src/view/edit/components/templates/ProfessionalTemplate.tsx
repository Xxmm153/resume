import React from "react";
import { type Resume, type ResumeSection } from "../../../../store/resumeStore";
import { Mail, MapPin, Phone, Globe, Briefcase } from "lucide-react";

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
    <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-900">
      <div className="flex-1">
        <h1
          style={{
            fontSize: `${config.layout.titleFontSize * 1.2}px`,
            lineHeight: 1.1,
            color: config.themeColor,
          }}
          className="font-black uppercase tracking-tighter mb-1"
        >
          {data.name}
        </h1>
        <p className="text-xl font-bold text-gray-800 tracking-wide uppercase mb-4">
          {data.title}
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-gray-600">
          {data.email && (
            <div className="flex items-center gap-1.5">
              <Mail size={14} className="stroke-[2.5]" />
              <span>{data.email}</span>
            </div>
          )}
          {data.phone && (
            <div className="flex items-center gap-1.5">
              <Phone size={14} className="stroke-[2.5]" />
              <span>{data.phone}</span>
            </div>
          )}
          {data.location && (
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="stroke-[2.5]" />
              <span>{data.location}</span>
            </div>
          )}
          {data.website && (
            <div className="flex items-center gap-1.5">
              <Globe size={14} className="stroke-[2.5]" />
              <a
                href={data.website}
                target="_blank"
                rel="noreferrer"
                className="hover:text-black transition-colors"
              >
                {data.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>
      </div>
      {data.avatar && (
        <img
          src={data.avatar}
          alt={data.name}
          className="w-32 h-32 object-cover border-4 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        />
      )}
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
      <div className="flex items-center gap-3 mb-3 bg-gray-100 p-2 border-l-4 border-gray-900">
        <h3
          style={{
            fontSize: `${config.layout.sectionTitleFontSize}px`,
            color: config.themeColor,
          }}
          className="font-bold uppercase tracking-wide"
        >
          {section.title}
        </h3>
      </div>
      <div
        className="prose max-w-none text-gray-800 font-medium"
        style={{
          fontSize: `${config.layout.baseFontSize}px`,
          lineHeight: config.layout.lineHeight,
        }}
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
};

const ProfessionalTemplate: React.FC<TemplateProps> = ({
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

export default ProfessionalTemplate;
