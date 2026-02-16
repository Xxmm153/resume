import type { ResumeConfig } from "../store/resumeStore";

export interface TemplateInfo {
  id: ResumeConfig["template"];
  name: string;
  description: string;
  thumbnail: string; // Color code or image path
  features: string[];
}

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with standard layout",
    thumbnail: "bg-slate-100",
    features: ["standardLayout", "professional", "cleanDesign"],
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered header with elegant typography",
    thumbnail: "bg-stone-100",
    features: ["centeredHeader", "serifTypography", "traditional"],
  },
  {
    id: "leftRight",
    name: "Sidebar",
    description: "Two-column layout with a colored sidebar",
    thumbnail: "bg-blue-50",
    features: ["twoColumns", "sidebar", "creative"],
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Simple and elegant with plenty of white space",
    thumbnail: "bg-gray-50",
    features: ["clean", "minimal", "whitespace"],
  },
  {
    id: "professional",
    name: "Professional",
    description: "Bold and impactful for senior roles",
    thumbnail: "bg-zinc-100",
    features: ["bold", "impactful", "senior"],
  },
];
