import React from "react";
import { type Resume, type ResumeSection } from "../../../store/resumeStore";
import { Mail, MapPin, Phone, Globe } from "lucide-react";

interface RightPreviewProps {
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
    <div className="flex items-start justify-between mb-6">
      <div className="flex-1">
        {/* Avatar placeholder if needed, layout allows left/right/top */}
        <h1
          style={{
            fontSize: `${config.layout.titleFontSize}px`,
            lineHeight: 1.2,
            color: config.themeColor,
          }}
          className="font-bold mb-2"
        >
          {data.name}
        </h1>
        <p className="text-lg font-medium text-gray-700 mb-4">{data.title}</p>

        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
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
                className="hover:underline"
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
          className="w-24 h-24 rounded-lg object-cover ml-6"
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
      <h3
        style={{
          fontSize: `${config.layout.sectionTitleFontSize}px`,
          color: config.themeColor,
          borderBottomColor: config.themeColor,
        }}
        className="font-bold border-b-2 pb-1.5 mb-3"
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

const RightPreview: React.FC<RightPreviewProps> = ({
  resume,
  selectedSectionId,
  onSelectSection,
}) => {
  return (
    <div className="flex-1 bg-muted/30 overflow-y-auto flex justify-center items-start py-8">
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
    </div>
  );
};

export default RightPreview;
