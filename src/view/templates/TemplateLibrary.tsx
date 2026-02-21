import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TEMPLATES } from "../../config/templates";
import {
  useResumeStore,
  createNewResume,
  type ResumeConfig,
} from "../../store/resumeStore";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "../../components/ScrollReveal";

const TemplateLibrary = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addResume } = useResumeStore();

  const handleUseTemplate = (templateId: string) => {
    // Generate a random ID
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const id = array[0].toString(16).slice(0, 6);

    const date = new Date().toLocaleDateString();
    const newResume = createNewResume(
      id,
      `${t("content.dashboard.newResume")} ${id}`,
      date,
    );

    // Apply selected template
    newResume.config.template = templateId as ResumeConfig["template"];
    // Apply current language
    newResume.config.language = i18n.language as "zh" | "en";

    addResume(newResume);
    navigate(`/edit/${id}`);
  };

  return (
    <div className="flex-1 overflow-auto bg-background text-foreground flex flex-col h-full w-full">
      {/* Main Content */}
      <main className="flex-1 w-full px-6 py-8">
        <ScrollReveal direction="down" distance={30} delay={0.1}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t("editor.templates.title", "Choose Template")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                "editor.templates.subtitle",
                "Select a layout for your resume",
              )}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {TEMPLATES.map((template, index) => (
            <ScrollReveal
              key={template.id}
              direction="up"
              distance={40}
              delay={0.2 + index * 0.1}
            >
              <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Preview Area */}
                <div
                  className={`aspect-[210/297] w-full ${template.thumbnail} relative flex items-center justify-center p-8`}
                >
                  {/* Visual Representation */}
                  <div className="w-full h-full bg-white shadow-sm flex flex-col overflow-hidden text-[6px] select-none pointer-events-none">
                    {template.id === "leftRight" ?
                      <div className="flex h-full">
                        <div className="w-[32%] h-full bg-slate-800 p-2 space-y-2">
                          <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2"></div>
                          <div className="w-full h-1 bg-white/20 rounded"></div>
                          <div className="w-2/3 h-1 bg-white/20 rounded mx-auto"></div>
                          <div className="mt-4 space-y-1">
                            <div className="w-full h-0.5 bg-white/10 rounded"></div>
                            <div className="w-full h-0.5 bg-white/10 rounded"></div>
                            <div className="w-3/4 h-0.5 bg-white/10 rounded"></div>
                          </div>
                        </div>
                        <div className="flex-1 p-2 space-y-2">
                          <div className="w-1/3 h-2 bg-slate-200 rounded mb-4"></div>
                          <div className="space-y-1">
                            <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                            <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                            <div className="w-5/6 h-0.5 bg-slate-100 rounded"></div>
                          </div>
                          <div className="space-y-1 pt-2">
                            <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                            <div className="w-4/5 h-0.5 bg-slate-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                    : template.id === "classic" ?
                      <div className="h-full flex flex-col p-4">
                        <div className="flex flex-col items-center border-b border-slate-200 pb-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 mb-1"></div>
                          <div className="w-20 h-2 bg-slate-800 rounded mb-1"></div>
                          <div className="w-16 h-1 bg-slate-400 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                          <div className="w-3/4 h-0.5 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    : <div className="h-full flex flex-col p-4">
                        <div className="mb-4">
                          <div className="w-24 h-3 bg-slate-800 rounded mb-1"></div>
                          <div className="w-32 h-1.5 bg-slate-400 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                          <div className="w-full h-0.5 bg-slate-100 rounded"></div>
                          <div className="w-5/6 h-0.5 bg-slate-100 rounded"></div>
                        </div>
                      </div>
                    }
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <Button
                      onClick={() => handleUseTemplate(template.id)}
                      className="gap-2 font-semibold shadow-lg scale-90 group-hover:scale-100 transition-transform"
                      size="lg"
                    >
                      <Plus size={18} />
                      {t("editor.templates.use", "Use Template")}
                    </Button>
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">
                      {t(
                        `editor.templates.names.${template.id}`,
                        template.name,
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t(
                      `editor.templates.descriptions.${template.id}`,
                      template.description,
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md font-medium"
                      >
                        {t(`editor.templates.features.${feature}`, feature)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TemplateLibrary;
