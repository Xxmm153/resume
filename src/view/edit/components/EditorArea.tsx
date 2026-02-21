import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import { useTranslation } from "react-i18next";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Sparkles,
  Undo,
  Redo,
  Image as ImageIcon,
  Palette,
  X,
  Loader2,
} from "lucide-react";
import { type Resume, useResumeStore } from "../../../store/resumeStore";
import AIPolishModal from "./AIPolishModal"; // Import Modal

interface EditorAreaProps {
  resume: Resume;
  selectedSectionId: string | null;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const { aiConfig } = useResumeStore();

  if (!editor) {
    return null;
  }

  const handleOpenPolish = () => {
    // Get selected text or full text if selection is empty
    const { from, to, empty } = editor.state.selection;
    let textToPolish = "";

    if (empty) {
      textToPolish = editor.getText();
    } else {
      textToPolish = editor.state.doc.textBetween(from, to, " ");
    }

    if (!textToPolish || textToPolish.trim().length === 0) return;

    setOriginalText(textToPolish);
    setIsModalOpen(true);
  };

  const handleApplyPolish = (newText: string) => {
    const { empty } = editor.state.selection;

    if (empty) {
      // If no selection, replace everything (or insert at cursor?)
      // Usually "Polish" on empty selection implies "Polish Document/Section"
      editor.commands.setContent(newText);
    } else {
      // Replace selection
      editor.commands.insertContent(newText);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <AIPolishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        originalText={originalText}
        onApply={handleApplyPolish}
      />
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/20">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("bold") ? "bg-muted text-primary" : ""
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("italic") ? "bg-muted text-primary" : ""
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("underline") ? "bg-muted text-primary" : ""
          }`}
          title="Underline"
        >
          <UnderlineIcon size={16} />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive({ textAlign: "left" }) ?
              "bg-muted text-primary"
            : ""
          }`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive({ textAlign: "center" }) ?
              "bg-muted text-primary"
            : ""
          }`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive({ textAlign: "right" }) ?
              "bg-muted text-primary"
            : ""
          }`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="flex items-center gap-1">
          <div className="relative flex items-center justify-center w-8 h-8 rounded hover:bg-muted transition-colors overflow-hidden">
            <Palette size={16} className="absolute pointer-events-none" />
            <input
              type="color"
              onInput={(event: any) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              value={editor.getAttributes("textStyle").color || "#000000"}
              className="opacity-0 w-full h-full cursor-pointer"
              title="Text Color"
            />
          </div>
          <button
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="p-2 rounded hover:bg-muted transition-colors"
            title="Reset Color"
          >
            <X size={16} />
          </button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("bulletList") ? "bg-muted text-primary" : ""
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("orderedList") ? "bg-muted text-primary" : ""
          }`}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("heading", { level: 1 }) ?
              "bg-muted text-primary"
            : ""
          }`}
          title="H1"
        >
          <span className="font-bold text-xs">H1</span>
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`p-2 rounded hover:bg-muted transition-colors ${
            editor.isActive("heading", { level: 2 }) ?
              "bg-muted text-primary"
            : ""
          }`}
          title="H2"
        >
          <span className="font-bold text-xs">H2</span>
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-2 rounded hover:bg-muted transition-colors disabled:opacity-50"
          title="Redo"
        >
          <Redo size={16} />
        </button>

        <div className="flex-1" />

        <button
          onClick={handleOpenPolish}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors"
        >
          <Sparkles size={14} />
          {t("editor.actions.aiPolish")}
        </button>
      </div>
    </>
  );
};

const RichTextEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none p-4 focus:outline-none min-h-[300px]",
      },
    },
  });

  // Update content when selection changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Avoid re-rendering on every keystroke if we were passing state directly,
      // but here content prop changes only when switching sections.
      // Actually, be careful with circular updates.
      // We'll rely on key prop in parent to reset editor for new sections.
    }
  }, [content, editor]);

  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card flex flex-col">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-background dark:text-white dark:prose-invert">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none dark:text-white dark:prose-invert [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:my-1 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5"
        />
      </div>
    </div>
  );
};

const BasicInfoForm = ({
  data,
  onChange,
}: {
  data: any;
  onChange: (data: any) => void;
}) => {
  const { t } = useTranslation();

  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t("editor.fields.avatar")}
        </label>
        <div className="flex items-center gap-4">
          {data.avatar && (
            <img
              src={data.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
          )}
          <label className="cursor-pointer bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary/20 transition-colors text-sm font-medium flex items-center gap-2">
            <ImageIcon size={16} />
            {data.avatar ?
              t("editor.actions.changeAvatar", "更换头像")
            : t("editor.actions.uploadAvatar", "上传头像")}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
          {data.avatar && (
            <button
              onClick={() => handleChange("avatar", "")}
              className="text-muted-foreground hover:text-destructive text-sm"
            >
              {t("editor.actions.removeAvatar", "移除")}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("editor.fields.name")}
          </label>
          <input
            type="text"
            value={data.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("editor.fields.title")}
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("editor.fields.email")}
          </label>
          <input
            type="email"
            value={data.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t("editor.fields.phone")}
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t("editor.fields.location")}
        </label>
        <input
          type="text"
          value={data.location || ""}
          onChange={(e) => handleChange("location", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t("editor.fields.website")}
        </label>
        <input
          type="url"
          value={data.website || ""}
          onChange={(e) => handleChange("website", e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md focus:ring-1 focus:ring-primary outline-none"
        />
      </div>
    </div>
  );
};

const EditorArea: React.FC<EditorAreaProps> = ({
  resume,
  selectedSectionId,
}) => {
  const { t } = useTranslation();
  const { updateResumeSection } = useResumeStore();
  const selectedSection = resume.sections.find(
    (s) => s.id === selectedSectionId,
  );

  if (!selectedSection) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center animate-fade-in">
        <div>
          <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
          <p>{t("editor.placeholder.selectSection")}</p>
        </div>
      </div>
    );
  }

  const handleContentChange = (newContent: any) => {
    updateResumeSection(resume.id, selectedSection.id, newContent);
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {selectedSection.type === "basic" && (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
          {selectedSection.title}
        </h2>
      </div>

      <div
        className="flex-1 overflow-y-auto p-6 animate-slide-in"
        key={selectedSection.id}
      >
        {selectedSection.type === "basic" ?
          <BasicInfoForm
            data={selectedSection.content}
            onChange={handleContentChange}
          />
        : <RichTextEditor
            // Force re-mount when switching sections to reset editor state properly
            key={selectedSection.id}
            content={selectedSection.content}
            onChange={handleContentChange}
          />
        }
      </div>
    </div>
  );
};

export default EditorArea;
