import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  X,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
  Copy,
  ArrowRight,
} from "lucide-react";
import { useResumeStore } from "../../../store/resumeStore";
import http from "../../../api/request";

interface AIPolishModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  onApply: (newText: string) => void;
}

const AIPolishModal: React.FC<AIPolishModalProps> = ({
  isOpen,
  onClose,
  originalText,
  onApply,
}) => {
  const { t } = useTranslation();
  const { aiConfig } = useResumeStore();
  const [polishedText, setPolishedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setPolishedText("");
      setIsStreaming(false);
      setError(null);
      startPolishing();
    } else {
      // Cancel any ongoing request when closing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [isOpen, originalText]);

  const startPolishing = async () => {
    if (!originalText) return;

    setIsStreaming(true);
    setError(null);
    setPolishedText("");

    abortControllerRef.current = new AbortController();

    try {
      const data = await http.post<{
        success: boolean;
        polishedText?: string;
        error?: string;
      }>(
        "/api/polish",
        {
          text: originalText,
          provider: aiConfig.provider,
        },
        {
          signal: abortControllerRef.current.signal,
        },
      );

      if (data.polishedText) {
        setPolishedText(data.polishedText);
      } else if (data.error) {
        throw new Error(data.error);
      }
    } catch (err: unknown) {
      const maybeCanceled = err as { code?: unknown; name?: unknown };
      if (
        maybeCanceled?.code === "ERR_CANCELED" ||
        maybeCanceled?.name === "CanceledError"
      ) {
        return;
      }

      console.error("AI Polish failed:", err);
      const message = err instanceof Error ? err.message : String(err);
      setError(message || t("editor.actions.polishFailed"));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleApply = () => {
    onApply(polishedText);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-background w-full max-w-4xl max-h-[85vh] rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden m-4 z-[10000] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/20">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            {t("editor.actions.aiPolish")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Original Text */}
          <div className="flex-1 p-6 flex flex-col min-h-[200px] bg-muted/10">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
              {t("editor.modal.original", "Original Content")}
            </h3>
            <div className="flex-1 p-4 rounded-lg border border-border bg-background/50 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap font-mono opacity-80">
              {originalText}
            </div>
          </div>

          {/* Arrow Indicator (Desktop) */}
          <div className="hidden md:flex items-center justify-center p-2 bg-muted/5">
            <ArrowRight className="text-muted-foreground/30" size={24} />
          </div>

          {/* Polished Text */}
          <div className="flex-1 p-6 flex flex-col min-h-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-2">
                {t("editor.modal.polished", "AI Suggestion")}
                {isStreaming && <Loader2 size={14} className="animate-spin" />}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(polishedText)}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                  title={t("editor.actions.copy", "Copy")}
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={startPolishing}
                  disabled={isStreaming}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  title={t("editor.actions.regenerate", "Regenerate")}
                >
                  <RefreshCw
                    size={14}
                    className={isStreaming ? "animate-spin" : ""}
                  />
                </button>
              </div>
            </div>

            <div className="relative flex-1">
              <textarea
                value={polishedText}
                onChange={(e) => setPolishedText(e.target.value)}
                className="w-full h-full p-4 rounded-lg border border-primary/20 bg-primary/5 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm leading-relaxed resize-none transition-all"
                placeholder={
                  isStreaming ? "" : (
                    t("editor.modal.waiting", "Waiting for AI response...")
                  )
                }
              />
              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border border-destructive/20">
                  <div className="text-destructive text-sm text-center px-4">
                    <p className="font-medium mb-1">
                      {t("editor.error.title", "Error")}
                    </p>
                    <p>{error}</p>
                    <button
                      onClick={startPolishing}
                      className="mt-3 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 rounded text-xs font-medium transition-colors"
                    >
                      {t("editor.actions.retry", "Retry")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            {t("editor.actions.cancel", "Cancel")}
          </button>
          <button
            onClick={handleApply}
            disabled={isStreaming || !polishedText}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check size={16} />
            {t("editor.actions.replace", "Replace Original")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AIPolishModal;
