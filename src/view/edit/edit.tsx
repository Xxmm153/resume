import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useResumeStore } from "../../store/resumeStore";
import {
  ArrowLeft,
  Download,
  Languages,
  Image as ImageIcon,
  Home,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import LeftSidebar from "./components/LeftSidebar";
import EditorArea from "./components/EditorArea";
import RightPreview from "./components/RightPreview";
import TemplateSwitcher from "./components/TemplateSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Using selector to subscribe to store updates for this specific resume
  const resume = useResumeStore((state) =>
    state.resumes.find((r) => r.id === id),
  );
  const { updateResumeConfig } = useResumeStore();
  const { t, i18n } = useTranslation();

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );

  const handleLanguageSwitch = () => {
    if (!resume) return;
    const newLang = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(newLang);
    updateResumeConfig(resume.id, { language: newLang as "zh" | "en" });
  };

  const handleTemplateChange = (
    template: "modern" | "classic" | "leftRight",
  ) => {
    if (!resume) return;
    updateResumeConfig(resume.id, { template });
  };

  const createOnClone = (element: HTMLElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const needsSanitize = (value: string) =>
      /color-mix\(|oklab\(|oklch\(/i.test(value);

    return (clonedDoc: Document) => {
      const normalizeColor = (value: string) => {
        if (!value || !ctx) return value;
        const trimmed = value.trim();
        if (
          trimmed === "none" ||
          trimmed === "inherit" ||
          trimmed === "initial" ||
          trimmed === "unset" ||
          trimmed === "currentcolor"
        ) {
          return trimmed;
        }
        if (!needsSanitize(trimmed)) return trimmed;
        try {
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = trimmed;
          ctx.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
          return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
        } catch {
          return trimmed;
        }
      };

      const clonedRoot = clonedDoc.getElementById("resume-preview-paper");
      if (!clonedRoot) return;

      const sourceNodes = [
        element,
        ...Array.from(element.querySelectorAll("*")),
      ];
      const clonedNodes = [
        clonedRoot,
        ...Array.from(clonedRoot.querySelectorAll("*")),
      ];

      const len = Math.min(sourceNodes.length, clonedNodes.length);
      for (let i = 0; i < len; i++) {
        const src = sourceNodes[i] as HTMLElement;
        const dst = clonedNodes[i] as HTMLElement;

        const style = window.getComputedStyle(src);
        dst.style.boxShadow = "none";
        dst.style.textShadow = "none";
        dst.style.filter = "none";
        (dst.style as any).backdropFilter = "none";
        dst.style.outline = "none";

        dst.style.color = normalizeColor(style.color);
        dst.style.backgroundColor = normalizeColor(style.backgroundColor);
        dst.style.borderTopColor = normalizeColor(style.borderTopColor);
        dst.style.borderRightColor = normalizeColor(style.borderRightColor);
        dst.style.borderBottomColor = normalizeColor(style.borderBottomColor);
        dst.style.borderLeftColor = normalizeColor(style.borderLeftColor);
        dst.style.outlineColor = normalizeColor(style.outlineColor);

        const extraColorProps: Array<[string, string]> = [
          ["caret-color", style.getPropertyValue("caret-color")],
          [
            "text-decoration-color",
            style.getPropertyValue("text-decoration-color"),
          ],
          ["column-rule-color", style.getPropertyValue("column-rule-color")],
          ["fill", style.getPropertyValue("fill")],
          ["stroke", style.getPropertyValue("stroke")],
          ["stop-color", style.getPropertyValue("stop-color")],
          ["-webkit-text-fill-color", (style as any).webkitTextFillColor],
          ["-webkit-text-stroke-color", (style as any).webkitTextStrokeColor],
        ];
        for (const [prop, value] of extraColorProps) {
          if (!value) continue;
          dst.style.setProperty(prop, normalizeColor(value));
        }

        const bgImage = style.getPropertyValue("background-image");
        if (bgImage && needsSanitize(bgImage)) {
          dst.style.backgroundImage = "none";
        }

        for (let j = 0; j < style.length; j++) {
          const prop = style.item(j);
          const value = style.getPropertyValue(prop);
          if (!value || !needsSanitize(value)) continue;

          const lowerProp = prop.toLowerCase();
          if (
            lowerProp.includes("box-shadow") ||
            lowerProp.includes("text-shadow") ||
            lowerProp === "filter" ||
            lowerProp === "backdrop-filter"
          ) {
            dst.style.setProperty(prop, "none");
            continue;
          }

          if (
            lowerProp === "background" ||
            lowerProp.startsWith("background-")
          ) {
            dst.style.setProperty("background-image", "none");
            dst.style.setProperty(
              "background-color",
              normalizeColor(style.backgroundColor),
            );
            continue;
          }

          if (
            lowerProp.includes("color") ||
            lowerProp === "fill" ||
            lowerProp === "stroke" ||
            lowerProp === "stop-color"
          ) {
            dst.style.setProperty(prop, normalizeColor(value));
            continue;
          }

          dst.style.setProperty(prop, "initial");
        }
      }

      (clonedRoot as HTMLElement).style.backgroundColor = "#ffffff";
    };
  };

  const createExportClone = (element: HTMLElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const needsSanitize = (value: string) =>
      /color-mix\(|oklab\(|oklch\(/i.test(value);

    const normalizeColor = (value: string) => {
      if (!value || !ctx) return value;
      const trimmed = value.trim();
      if (
        trimmed === "none" ||
        trimmed === "inherit" ||
        trimmed === "initial" ||
        trimmed === "unset" ||
        trimmed === "currentcolor"
      ) {
        return trimmed;
      }
      if (!needsSanitize(trimmed)) return trimmed;
      try {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = trimmed;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
      } catch {
        return trimmed;
      }
    };

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-100000px";
    container.style.top = "0";
    container.style.pointerEvents = "none";
    container.style.opacity = "0";
    container.style.zIndex = "-1";

    const clone = element.cloneNode(true) as HTMLElement;
    container.appendChild(clone);
    document.body.appendChild(container);

    const sourceNodes = [element, ...Array.from(element.querySelectorAll("*"))];
    const cloneNodes = [clone, ...Array.from(clone.querySelectorAll("*"))];
    const len = Math.min(sourceNodes.length, cloneNodes.length);

    for (let i = 0; i < len; i++) {
      const src = sourceNodes[i] as HTMLElement;
      const dst = cloneNodes[i] as HTMLElement;
      const computed = window.getComputedStyle(src);

      for (let j = 0; j < computed.length; j++) {
        const prop = computed.item(j);
        const value = computed.getPropertyValue(prop);
        if (!value) continue;

        if (needsSanitize(value)) {
          if (prop === "background" || prop.startsWith("background-")) {
            dst.style.setProperty("background-image", "none");
            dst.style.setProperty(
              "background-color",
              normalizeColor(computed.backgroundColor),
            );
            continue;
          }
          if (
            prop.includes("color") ||
            prop === "fill" ||
            prop === "stroke" ||
            prop === "stop-color"
          ) {
            dst.style.setProperty(prop, normalizeColor(value));
            continue;
          }
          dst.style.setProperty(prop, "initial");
          continue;
        }

        dst.style.setProperty(prop, value, computed.getPropertyPriority(prop));
      }

      dst.style.transition = "none";
      dst.style.animation = "none";

      if (dst.dataset.selected === "true") {
        dst.style.borderColor = "transparent";
        dst.style.borderWidth = "0px";
        dst.style.backgroundColor = "transparent";
        dst.style.boxShadow = "none";
        dst.style.margin = "0px";
        dst.style.padding = "0px";
      }
    }

    clone.style.backgroundColor = "#ffffff";

    return {
      element: clone,
      cleanup: () => {
        container.remove();
      },
    };
  };

  const handleExportPDF = async () => {
    try {
      const element = document.getElementById("resume-preview-paper");
      if (!element) return;
      const { element: exportElement, cleanup } = createExportClone(element);

      const safeTitle = (resume?.title || "resume").replace(
        /[\\/:*?"<>|]+/g,
        "_",
      );
      const mod = (await import("html2pdf.js")) as any;
      const html2pdf = mod?.default || mod;

      const opt = {
        margin: 0,
        filename: `${safeTitle}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          onclone: createOnClone(element),
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(exportElement).save();
      cleanup();
    } catch (error) {
      console.error("Export PDF failed:", error);
      alert(t("editor.actions.exportFailed", "导出PDF失败，请重试"));
    }
  };

  const handleExportImage = async () => {
    const element = document.getElementById("resume-preview-paper");
    if (!element) return;

    try {
      const { element: exportElement, cleanup } = createExportClone(element);
      const safeTitle = (resume?.title || "resume").replace(
        /[\\/:*?"<>|]+/g,
        "_",
      );
      const mod = (await import("html2pdf.js")) as any;
      const html2pdf = mod?.default || mod;

      const opt = {
        margin: 0,
        filename: `${safeTitle}.png`,
        image: { type: "png", quality: 1.0 },
        html2canvas: {
          scale: 4,
          useCORS: true,
          backgroundColor: "#ffffff",
          onclone: createOnClone(element),
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      const worker = html2pdf().set(opt).from(exportElement).toCanvas();
      const canvas = await worker.get("canvas");
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${safeTitle}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      cleanup();
    } catch (error) {
      console.error("Export Image failed:", error);
      alert(t("editor.actions.exportFailed", "导出图片失败，请重试"));
    }
  };

  useEffect(() => {
    if (!resume && id) {
      // If resume doesn't exist in store, redirect
      // We can add a small delay or check if store is hydrated if needed, but persist middleware usually handles it
      const timer = setTimeout(() => {
        const currentResume = useResumeStore
          .getState()
          .resumes.find((r) => r.id === id);
        if (!currentResume) {
          navigate("/content");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [id, resume, navigate]);

  // Set initial selected section
  useEffect(() => {
    if (resume && !selectedSectionId && resume.sections.length > 0) {
      setSelectedSectionId(resume.sections[0].id);
    }
  }, [resume, selectedSectionId]);

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors text-muted-foreground"
            title={t("nav.backHome", "Back to Home")}
          >
            <Home size={20} />
          </button>
          <button
            onClick={() => navigate("/content")}
            className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors text-muted-foreground"
            title={t("content.dashboard.back", "Back")}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{resume.title}</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {resume.id}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLanguageSwitch}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-background border border-border hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <Languages size={16} />
            <span className="hidden sm:inline">
              {i18n.language === "en" ? "CN" : "EN"}
            </span>
          </button>

          <ThemeToggle />

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-background border border-border hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <Download size={16} />
            {t("content.dashboard.exportPDF", "Export PDF")}
          </button>
          <button
            onClick={handleExportImage}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-background border border-border hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors shadow-sm cursor-pointer"
          >
            <ImageIcon size={16} />
            {t("content.dashboard.exportImage", "Export PNG")}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigation & Settings */}
        <LeftSidebar
          resume={resume}
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
        />

        {/* Middle - Editor */}
        <div className="flex-1 min-w-[400px] border-r border-border flex flex-col">
          <EditorArea resume={resume} selectedSectionId={selectedSectionId} />
        </div>

        {/* Right - Preview */}
        <RightPreview
          resume={resume}
          selectedSectionId={selectedSectionId}
          onSelectSection={setSelectedSectionId}
        />
      </div>

      <TemplateSwitcher
        currentTemplate={resume.config.template || "modern"}
        onSelectTemplate={handleTemplateChange}
      />
    </div>
  );
};

export default Edit;
