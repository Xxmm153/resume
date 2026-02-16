import React from "react";
import { type Resume } from "../../../store/resumeStore";
import ModernTemplate from "./templates/ModernTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import LeftRightTemplate from "./templates/LeftRightTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";

interface RightPreviewProps {
  resume: Resume;
  selectedSectionId: string | null;
  onSelectSection: (id: string) => void;
}

const RightPreview: React.FC<RightPreviewProps> = ({
  resume,
  selectedSectionId,
  onSelectSection,
}) => {
  const template = resume.config.template || "modern";

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return (
          <ClassicTemplate
            resume={resume}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
          />
        );
      case "leftRight":
        return (
          <LeftRightTemplate
            resume={resume}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
          />
        );
      case "minimalist":
        return (
          <MinimalistTemplate
            resume={resume}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
          />
        );
      case "professional":
        return (
          <ProfessionalTemplate
            resume={resume}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
          />
        );
      case "modern":
      default:
        return (
          <ModernTemplate
            resume={resume}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
          />
        );
    }
  };

  return (
    <div className="flex-1 bg-muted/30 overflow-y-auto flex justify-center items-start py-8 relative">
      {renderTemplate()}
    </div>
  );
};

export default RightPreview;
