import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SectionType =
  | "basic"
  | "summary"
  | "experience"
  | "project"
  | "education"
  | "skills"
  | "custom";

export interface ResumeConfig {
  themeColor: string;
  template: "modern" | "classic" | "leftRight" | "minimalist" | "professional";
  language: "zh" | "en";
  layout: {
    lineHeight: number;
    baseFontSize: number;
    titleFontSize: number;
    sectionTitleFontSize: number;
    pageMargin: number;
    sectionMargin: number;
    paragraphMargin: number;
  };
}

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  isVisible: boolean;
  content: any; // Flexible content structure based on type
}

export interface Resume {
  id: string;
  title: string;
  date: string;
  config: ResumeConfig;
  sections: ResumeSection[];
}

export interface AIConfig {
  provider: "doubao" | "openai" | "deepseek" | "moonshot";
  model?: string;
}

interface ResumeState {
  aiConfig: AIConfig;
  updateAIConfig: (config: Partial<AIConfig>) => void;
  resumes: Resume[];
  addResume: (resume: Resume) => void;
  deleteResume: (id: string) => void;
  updateResume: (id: string, updatedResume: Partial<Resume>) => void;
  getResumeById: (id: string) => Resume | undefined;

  // Specific actions for editing a resume
  updateResumeSection: (
    resumeId: string,
    sectionId: string,
    content: any,
  ) => void;
  updateResumeConfig: (resumeId: string, config: Partial<ResumeConfig>) => void;
  reorderResumeSections: (
    resumeId: string,
    newSections: ResumeSection[],
  ) => void;
  addResumeSection: (resumeId: string, section: ResumeSection) => void;
  removeResumeSection: (resumeId: string, sectionId: string) => void;
  updateSectionTitle: (
    resumeId: string,
    sectionId: string,
    title: string,
  ) => void;
}

const DEFAULT_CONFIG: ResumeConfig = {
  themeColor: "#000000",
  template: "modern",
  language: "zh",
  layout: {
    lineHeight: 1.5,
    baseFontSize: 14,
    titleFontSize: 24,
    sectionTitleFontSize: 18,
    pageMargin: 32,
    sectionMargin: 24,
    paragraphMargin: 12,
  },
};

const DEFAULT_SECTIONS: ResumeSection[] = [
  {
    id: "basic",
    type: "basic",
    title: "基本信息",
    isVisible: true,
    content: {
      name: "张三",
      title: "高级前端工程师",
      email: "zhangsan@example.com",
      phone: "13800138000",
      location: "北京市朝阳区",
      website: "https://zhangsan.dev",
      avatar: "",
    },
  },
  {
    id: "skills",
    type: "skills",
    title: "专业技能",
    isVisible: true,
    content: `
      <ul>
        <li>前端框架：熟悉 React、Vue.js，熟悉 Next.js、Nuxt.js 等 SSR 框架</li>
        <li>开发语言：TypeScript、JavaScript(ES6+)、HTML5、CSS3</li>
        <li>UI/样式：熟悉 TailwindCSS、Sass/Less、CSS Module、Styled-components</li>
        <li>状态管理：Redux、Vuex、Zustand、Jotai、React Query</li>
        <li>工程化工具：Webpack、Vite、Rollup、Babel、ESLint</li>
      </ul>
    `,
  },
  {
    id: "experience",
    type: "experience",
    title: "工作经历",
    isVisible: true,
    content: `
      <p><strong>抖音创作者中台 - 前端负责人</strong> (2022/06 - 2023/12)</p>
      <ul>
        <li>基于 React 开发的创作者数据分析和内容管理平台，服务百万级创作者群体</li>
        <li>包含数据分析、内容管理、收益管理等多个子系统</li>
        <li>使用 Redux 进行状态管理，实现复杂数据流的高效处理</li>
      </ul>
    `,
  },
  {
    id: "project",
    type: "project",
    title: "项目经历",
    isVisible: true,
    content: `
      <p><strong>微信小程序开发者工具 - 核心开发者</strong> (2020/03 - 2021/06)</p>
      <ul>
        <li>为开发者提供小程序开发、调试和发布的一站式解决方案</li>
        <li>基于 Electron 构建的跨平台桌面应用</li>
      </ul>
    `,
  },
  {
    id: "education",
    type: "education",
    title: "教育经历",
    isVisible: true,
    content: `
      <p><strong>北京大学 - 计算机科学与技术</strong> (2016/09 - 2020/06)</p>
      <p>本科 | 学士学位</p>
    `,
  },
];

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      aiConfig: {
        provider: "doubao",
        model: "ep-20250219195707-q588r",
      },
      updateAIConfig: (config) =>
        set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),
      resumes: [
        {
          id: "892c1f",
          title: "我的简历 892c1f",
          date: "2026/2/11",
          config: DEFAULT_CONFIG,
          sections: DEFAULT_SECTIONS,
        },
      ],
      addResume: (resume) =>
        set((state) => ({ resumes: [...state.resumes, resume] })),
      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((r) => r.id !== id),
        })),
      updateResume: (id, updatedResume) =>
        set((state) => ({
          resumes: state.resumes.map((r) =>
            r.id === id ? { ...r, ...updatedResume } : r,
          ),
        })),
      getResumeById: (id) => get().resumes.find((r) => r.id === id),

      updateResumeSection: (resumeId, sectionId, content) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId ? { ...s, content } : s,
              ),
            };
          }),
        })),

      updateResumeConfig: (resumeId, config) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              config: { ...r.config, ...config },
            };
          }),
        })),

      reorderResumeSections: (resumeId, newSections) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              sections: newSections,
            };
          }),
        })),

      addResumeSection: (resumeId, section) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              sections: [...r.sections, section],
            };
          }),
        })),

      removeResumeSection: (resumeId, sectionId) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              sections: r.sections.filter((s) => s.id !== sectionId),
            };
          }),
        })),

      updateSectionTitle: (resumeId, sectionId, title) =>
        set((state) => ({
          resumes: state.resumes.map((r) => {
            if (r.id !== resumeId) return r;
            return {
              ...r,
              sections: r.sections.map((s) =>
                s.id === sectionId ? { ...s, title } : s,
              ),
            };
          }),
        })),
    }),
    {
      name: "resume-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const createNewResume = (
  id: string,
  title: string,
  date: string,
): Resume => ({
  id,
  title,
  date,
  config: DEFAULT_CONFIG,
  sections: DEFAULT_SECTIONS,
});
