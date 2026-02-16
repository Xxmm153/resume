import React from "react";
import { LayoutTemplate, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTranslation } from "react-i18next";

import { type ResumeConfig } from "@/store/resumeStore";

interface TemplateSwitcherProps {
  currentTemplate: string;
  onSelectTemplate: (template: ResumeConfig["template"]) => void;
}

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with standard layout",
    color: "bg-slate-100",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered header with elegant typography",
    color: "bg-stone-100",
  },
  {
    id: "leftRight",
    name: "Sidebar",
    description: "Two-column layout with a colored sidebar",
    color: "bg-blue-50",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simple and elegant with plenty of white space",
    color: "bg-gray-50",
  },
  {
    id: "professional",
    name: "Professional",
    description: "Bold and impactful for senior roles",
    color: "bg-zinc-100",
  },
];

const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({
  currentTemplate,
  onSelectTemplate,
}) => {
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="fixed right-8 bottom-8 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          title={t("editor.templates.switch", "Switch Template")}
        >
          <LayoutTemplate size={24} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-4" sideOffset={16}>
        <div className="space-y-4">
          <h4 className="font-medium leading-none text-foreground">
            {t("editor.templates.title", "Choose Template")}
          </h4>
          <p className="text-sm text-muted-foreground">
            {t("editor.templates.subtitle", "Select a layout for your resume")}
          </p>
          <div className="grid gap-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() =>
                  onSelectTemplate(template.id as ResumeConfig["template"])
                }
                className={`
                  relative flex items-start gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all hover:bg-accent
                  ${
                    currentTemplate === template.id
                      ? "border-primary bg-accent"
                      : "border-transparent hover:border-border"
                  }
                `}
              >
                <div
                  className={`w-10 h-14 rounded border border-border shadow-sm shrink-0 ${template.color}`}
                >
                  {/* Mini visual representation */}
                  {template.id === "leftRight" ? (
                    <div className="flex h-full">
                      <div className="w-1/3 h-full bg-primary/20"></div>
                      <div className="w-2/3 h-full bg-background"></div>
                    </div>
                  ) : template.id === "classic" ? (
                    <div className="flex flex-col h-full items-center pt-2">
                      <div className="w-6 h-1 bg-foreground/20 mb-1"></div>
                      <div className="w-8 h-8 bg-background border border-border/20"></div>
                    </div>
                  ) : template.id === "minimalist" ? (
                    <div className="flex h-full p-1 gap-1">
                      <div className="w-1/3 h-full border-r border-border/20"></div>
                      <div className="w-2/3 space-y-1">
                        <div className="w-full h-1 bg-foreground/10"></div>
                        <div className="w-full h-1 bg-foreground/10"></div>
                      </div>
                    </div>
                  ) : template.id === "professional" ? (
                    <div className="p-1">
                      <div className="w-full h-2 bg-foreground/80 mb-1"></div>
                      <div className="w-full h-0.5 bg-foreground/20"></div>
                    </div>
                  ) : (
                    <div className="p-1 space-y-1">
                      <div className="w-6 h-1 bg-foreground/20"></div>
                      <div className="w-8 h-1 bg-foreground/10"></div>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {t(`editor.templates.names.${template.id}`, template.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      `editor.templates.descriptions.${template.id}`,
                      template.description,
                    )}
                  </p>
                </div>
                {currentTemplate === template.id && (
                  <div className="absolute top-3 right-3 text-primary">
                    <Check size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TemplateSwitcher;
