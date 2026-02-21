import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResumeStore, type AIConfig } from "../../store/resumeStore";
import { Bot, Check, AlertCircle, TriangleAlert } from "lucide-react";
import { createPortal } from "react-dom";
import ScrollReveal from "../../components/ScrollReveal";

const WarningModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className="relative bg-background w-full max-w-md rounded-2xl shadow-2xl border border-border p-6 m-4 animate-in zoom-in-95 duration-200 z-[10000]">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-2">
            <TriangleAlert size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground">服务受限提醒</h3>
          <p className="text-muted-foreground leading-relaxed">
            由于资金有限，当前切换任何模型实际上都将使用{" "}
            <span className="text-primary font-semibold">豆包 (Doubao)</span>{" "}
            模型。
            <br />
            且该服务随时可能因余额不足而停用。
          </p>
          <button
            onClick={onClose}
            className="w-full mt-4 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            我知道了
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

const AIConfigPage = () => {
  const { t } = useTranslation();
  const { aiConfig, updateAIConfig } = useResumeStore();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setShowWarning(true);
  }, []);

  const providers: {
    id: AIConfig["provider"];
    name: string;
    desc: string;
  }[] = [
    {
      id: "doubao",
      name: "Doubao (Volcengine)",
      desc: t(
        "ai.settings.providers.doubao.desc",
        "By ByteDance, optimized for Chinese context.",
      ),
    },
    {
      id: "openai",
      name: "OpenAI (GPT-4)",
      desc: t(
        "ai.settings.providers.openai.desc",
        "The world's leading AI model.",
      ),
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      desc: t(
        "ai.settings.providers.deepseek.desc",
        "Advanced open-source model with strong coding capabilities.",
      ),
    },
    {
      id: "moonshot",
      name: "Moonshot (Kimi)",
      desc: t(
        "ai.settings.providers.moonshot.desc",
        "Excellent at long context handling.",
      ),
    },
  ];

  const handleProviderSelect = (id: AIConfig["provider"]) => {
    updateAIConfig({ provider: id });
    // Also show warning when switching
    setShowWarning(true);
  };

  return (
    <div className="flex-1 overflow-auto p-8 animate-fade-in">
      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
      />

      <div className="max-w-4xl mx-auto">
        <ScrollReveal direction="down" distance={30} delay={0.1}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t("ai.settings.title", "AI Service Settings")}
            </h1>
            <p className="text-muted-foreground">
              {t(
                "ai.settings.subtitle",
                "Choose the AI provider that powers your resume polishing features.",
              )}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" distance={40} delay={0.2}>
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bot className="text-primary" size={20} />
                {t("ai.settings.provider", "AI Provider")}
              </h2>
            </div>

            <div className="p-6 grid gap-4 md:grid-cols-2">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    aiConfig.provider === provider.id ?
                      "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{provider.name}</h3>
                    {aiConfig.provider === provider.id && (
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {provider.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 bg-muted/30 border-t border-border">
              <div className="flex gap-3">
                <AlertCircle
                  className="text-amber-500 flex-shrink-0"
                  size={20}
                />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">
                    {t("ai.settings.note", "Note:")}
                  </p>
                  <p>
                    {t(
                      "ai.settings.noteDetail",
                      "Currently only Doubao is fully configured in the backend demo.",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AIConfigPage;
