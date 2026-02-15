import { Palette } from "lucide-react";
import { useThemeStore } from "@/store/index";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const themes = [
  { name: "dark", color: "#000000" },
  { name: "deeppink", color: "#ff1493" },
  { name: "yellow", color: "#fbbf24" },
  { name: "blue", color: "#3b82f6" },
  { name: "orange", color: "#f97316" },
  { name: "red", color: "#ef4444" },
  { name: "rose", color: "#f43f5e" },
  { name: "Purple", color: "#a855f7" },
  { name: "green", color: "#22c55e" },
];

export function ThemeToggle({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, setTheme } = useThemeStore();
  const { t } = useTranslation();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 text-sm font-medium bg-background border border-border hover:bg-accent hover:text-accent-foreground text-foreground rounded-md transition-colors shadow-sm cursor-pointer",
            className,
          )}
          title={t("theme.toggle", "Toggle Theme")}
        >
          <Palette size={16} />
          {showLabel && (
            <span className="hidden sm:inline">
              {t("theme.label", "Theme")}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="end">
        <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
          {themes.map((t) => (
            <button
              key={t.name}
              onClick={() => setTheme(t.name)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium transition-all",
                theme === t.name ?
                  "bg-primary/10 text-primary"
                : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <div
                className="w-4 h-4 rounded-full border border-border/20 shadow-sm"
                style={{ backgroundColor: t.color }}
              />
              <span className="capitalize flex-1 text-left">{t.name}</span>
              {theme === t.name && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
