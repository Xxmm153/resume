import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import {
  LayoutTemplate,
  Palette,
  Type,
  GripVertical,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import {
  type Resume,
  type ResumeSection,
  useResumeStore,
} from "../../../store/resumeStore";

interface LeftSidebarProps {
  resume: Resume;
  onSelectSection: (id: string) => void;
  selectedSectionId: string | null;
}

const SortableItem = ({
  section,
  onToggleVisibility,
  onSelect,
  isSelected,
  onUpdateTitle,
  onRemove,
}: {
  section: ResumeSection;
  onToggleVisibility: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
  onUpdateTitle: (id: string, title: string) => void;
  onRemove: (id: string) => void;
}) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onUpdateTitle(section.id, editTitle);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(section.title);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t("editor.actions.confirmRemove", "确定要删除吗？"))) {
      onRemove(section.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 bg-card border rounded-xl mb-2 group transition-all duration-200 ${
        isSelected ?
          "border-primary bg-primary/5 shadow-sm scale-[1.01]"
        : "border-border hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
        >
          <GripVertical size={18} />
        </div>

        {isEditing ?
          <div
            className="flex items-center gap-1 flex-1"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 h-7 px-2 text-sm border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle(e as any);
                if (e.key === "Escape") handleCancelEdit(e as any);
              }}
            />
            <button
              onClick={handleSaveTitle}
              className="text-green-600 hover:bg-green-100 p-1 rounded"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancelEdit}
              className="text-red-600 hover:bg-red-100 p-1 rounded"
            >
              <X size={14} />
            </button>
          </div>
        : <span
            onClick={() => onSelect(section.id)}
            className="font-medium text-sm cursor-pointer flex-1 truncate select-none hover:text-primary transition-colors"
          >
            {section.title}
          </span>
        }
      </div>

      <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {!isEditing && (
          <>
            <button
              onClick={handleEditClick}
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted"
              title={t("editor.actions.rename", "重命名")}
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => onToggleVisibility(section.id)}
              className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted"
              title={
                section.isVisible ?
                  t("editor.actions.hide", "隐藏")
                : t("editor.actions.show", "显示")
              }
            >
              {section.isVisible ?
                <Eye size={14} />
              : <EyeOff size={14} />}
            </button>
            {section.type === "custom" && (
              <button
                onClick={handleRemoveClick}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                title={t("editor.actions.remove", "删除")}
              >
                <Trash2 size={14} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  resume,
  onSelectSection,
  selectedSectionId,
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"layout" | "theme" | "typography">(
    "layout",
  );
  const {
    reorderResumeSections,
    updateResumeConfig,
    addResumeSection,
    removeResumeSection,
    updateSectionTitle,
  } = useResumeStore();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = resume.sections.findIndex((s) => s.id === active.id);
      const newIndex = resume.sections.findIndex((s) => s.id === over?.id);

      const newSections = arrayMove(resume.sections, oldIndex, newIndex);
      reorderResumeSections(resume.id, newSections);
    }
  };

  const toggleVisibility = (sectionId: string) => {
    const section = resume.sections.find((s) => s.id === sectionId);
    if (section) {
      const newSections = resume.sections.map((s) =>
        s.id === sectionId ? { ...s, isVisible: !s.isVisible } : s,
      );
      reorderResumeSections(resume.id, newSections);
    }
  };

  const handleAddCustomSection = () => {
    const id = `custom-${Date.now()}`;
    const newSection: ResumeSection = {
      id,
      type: "custom",
      title: t("editor.sections.custom"),
      isVisible: true,
      content: "<p>在这里输入您的自定义内容...</p>",
    };
    addResumeSection(resume.id, newSection);
    onSelectSection(id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const themeColors = [
    "#000000",
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#ec4899",
    "#6366f1",
  ];

  return (
    <div className="w-[300px] border-r border-border bg-card flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "layout" ?
              "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutTemplate size={16} />
          {t("editor.sidebar.layout")}
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "theme" ?
              "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Palette size={16} />
          {t("editor.sidebar.theme")}
        </button>
        <button
          onClick={() => setActiveTab("typography")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === "typography" ?
              "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Type size={16} />
          {t("editor.sidebar.typography")}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === "layout" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">
                {t("editor.sidebar.moduleManage")}
              </h3>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={resume.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {resume.sections.map((section) => (
                    <SortableItem
                      key={section.id}
                      section={section}
                      onToggleVisibility={toggleVisibility}
                      onSelect={onSelectSection}
                      isSelected={selectedSectionId === section.id}
                      onUpdateTitle={(id, title) =>
                        updateSectionTitle(resume.id, id, title)
                      }
                      onRemove={(id) => removeResumeSection(resume.id, id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            <button
              onClick={handleAddCustomSection}
              className="w-full py-2 px-4 mt-4 border border-dashed border-border rounded-lg text-sm text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              {t("editor.actions.addSection")}
            </button>
          </div>
        )}

        {activeTab === "theme" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-4">Theme Color</h3>
              <div className="grid grid-cols-4 gap-3">
                {themeColors.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      updateResumeConfig(resume.id, { themeColor: color })
                    }
                    className={`w-full aspect-square rounded-xl transition-all ${
                      resume.config.themeColor === color ?
                        "ring-2 ring-primary ring-offset-2 scale-105"
                      : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs text-muted-foreground mb-2 block">
                  Custom Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={resume.config.themeColor}
                    onChange={(e) =>
                      updateResumeConfig(resume.id, {
                        themeColor: e.target.value,
                      })
                    }
                    className="h-10 w-10 rounded cursor-pointer border-0 p-0"
                  />
                  <input
                    type="text"
                    value={resume.config.themeColor}
                    onChange={(e) =>
                      updateResumeConfig(resume.id, {
                        themeColor: e.target.value,
                      })
                    }
                    className="flex-1 bg-muted rounded-md px-3 text-sm font-mono border border-transparent focus:border-primary outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "typography" && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Line Height</label>
                <span className="text-xs text-muted-foreground">
                  {resume.config.layout.lineHeight}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={resume.config.layout.lineHeight}
                onChange={(e) =>
                  updateResumeConfig(resume.id, {
                    layout: {
                      ...resume.config.layout,
                      lineHeight: parseFloat(e.target.value),
                    },
                  })
                }
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Page Margin</label>
                <span className="text-xs text-muted-foreground">
                  {resume.config.layout.pageMargin}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="64"
                step="4"
                value={resume.config.layout.pageMargin}
                onChange={(e) =>
                  updateResumeConfig(resume.id, {
                    layout: {
                      ...resume.config.layout,
                      pageMargin: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Paragraph Spacing</label>
                <span className="text-xs text-muted-foreground">
                  {resume.config.layout.paragraphMargin}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="32"
                step="2"
                value={resume.config.layout.paragraphMargin}
                onChange={(e) =>
                  updateResumeConfig(resume.id, {
                    layout: {
                      ...resume.config.layout,
                      paragraphMargin: parseInt(e.target.value),
                    },
                  })
                }
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeftSidebar;
