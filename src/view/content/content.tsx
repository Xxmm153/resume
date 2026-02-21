import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useResumeStore, createNewResume } from "../../store/resumeStore";
import { gsap } from "gsap";
import ScrollReveal from "../../components/ScrollReveal";
import {
  FileText,
  LayoutTemplate,
  Bot,
  Settings,
  Plus,
  Upload,
  Pencil,
  Trash2,
  AlertCircle,
  PanelLeft,
  Languages,
  Home,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

const Content = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { resumes, addResume, deleteResume, updateResume } = useResumeStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const handleLanguageSwitch = () => {
    const newLang = i18n.language === "zh" ? "en" : "zh";
    i18n.changeLanguage(newLang);
  };

  const handleStartEdit = (e: React.MouseEvent, resume: any) => {
    e.stopPropagation();
    setEditingId(resume.id);
    setEditValue(resume.title);
  };

  const handleSaveEdit = (e: React.FormEvent | React.FocusEvent) => {
    e.stopPropagation();
    if (editingId && editValue.trim()) {
      updateResume(editingId, { title: editValue.trim() });
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit(e);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const handleAddResume = () => {
    const id = Math.random().toString(16).slice(2, 8);
    const date = new Date().toLocaleDateString();
    const newResume = createNewResume(
      id,
      `${t("content.dashboard.newResume")} ${id}`,
      date,
    );
    addResume(newResume);
    setLastCreatedId(id);
  };

  const handleDeleteResume = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      t("content.dashboard.confirmDelete", "确认删除该简历吗？"),
    );
    if (!confirmed) return;
    const card = document.querySelector(`[data-resume-id="${id}"]`);
    if (!card) {
      deleteResume(id);
      return;
    }
    gsap.killTweensOf(card);
    gsap.to(card, {
      y: 140,
      opacity: 0,
      scale: 0.92,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => deleteResume(id),
    });
  };

  const handleEditResume = (id: string) => {
    navigate(`/edit/${id}`);
  };

  useEffect(() => {
    if (!lastCreatedId) return;
    const card = document.querySelector(`[data-resume-id="${lastCreatedId}"]`);
    if (!card) return;
    gsap.fromTo(
      card,
      { y: 140, opacity: 0, scale: 0.92 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: "power3.out",
        onComplete: () => setLastCreatedId(null),
      },
    );
  }, [lastCreatedId, resumes.length]);

  return (
    <div className="flex w-full h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-[70px]"
        } flex-shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap`}
      >
        {/* Logo */}
        <div
          className={`h-16 flex items-center border-b border-sidebar-border/50 transition-all ${isSidebarOpen ? "px-6 gap-3" : "justify-center px-2"}`}
        >
          {/* Placeholder Logo Icon */}
          <div
            style={{ borderRadius: 5 }}
            className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-bold text-lg flex-shrink-0"
          >
            M
          </div>
          <span
            className={`text-xl font-bold text-sidebar-foreground transition-all duration-300 ${!isSidebarOpen && "opacity-0 w-0 overflow-hidden"}`}
          >
            {t("content.sidebar.logo")}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <div
            onClick={() => navigate("/content")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors ${
              location.pathname === "/content" ?
                "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            } ${!isSidebarOpen && "justify-center px-2"}`}
            title={!isSidebarOpen ? t("content.sidebar.myResume") : ""}
          >
            <FileText size={20} className="flex-shrink-0" />
            <span
              className={`font-medium transition-all duration-300 ${!isSidebarOpen && "opacity-0 w-0 overflow-hidden"}`}
            >
              {t("content.sidebar.myResume")}
            </span>
          </div>
          <div
            onClick={() => navigate("/content/templates")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors ${
              location.pathname === "/content/templates" ?
                "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            } ${!isSidebarOpen && "justify-center px-2"}`}
            title={!isSidebarOpen ? t("content.sidebar.templates") : ""}
          >
            <LayoutTemplate size={20} className="flex-shrink-0" />
            <span
              className={`font-medium transition-all duration-300 ${!isSidebarOpen && "opacity-0 w-0 overflow-hidden"}`}
            >
              {t("content.sidebar.templates")}
            </span>
          </div>
          <div
            onClick={() => navigate("/content/ai-providers")}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors ${
              location.pathname === "/content/ai-providers" ?
                "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            } ${!isSidebarOpen && "justify-center px-2"}`}
            title={!isSidebarOpen ? t("content.sidebar.aiProviders") : ""}
          >
            <Bot size={20} className="flex-shrink-0" />
            <span
              className={`font-medium transition-all duration-300 ${!isSidebarOpen && "opacity-0 w-0 overflow-hidden"}`}
            >
              {t("content.sidebar.aiProviders")}
            </span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        {/* Header / Toggle Area */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-border/50 bg-background">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors cursor-pointer text-muted-foreground"
            title={
              isSidebarOpen ?
                t("content.sidebar.collapse")
              : t("content.sidebar.expand")
            }
          >
            <PanelLeft size={20} />
          </button>
          <div className="flex items-center gap-2 pr-2">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors cursor-pointer text-muted-foreground"
              title={t("nav.backHome", "Back to Home")}
            >
              <Home size={20} />
            </button>
            <button
              onClick={handleLanguageSwitch}
              className="p-2 hover:bg-primary/10 hover:text-primary rounded-xl transition-colors cursor-pointer text-muted-foreground"
              title={t("editor.actions.switchLang", "Switch Language")}
            >
              <Languages size={20} />
            </button>
            <ThemeToggle
              showLabel={false}
              className="bg-transparent border-0 shadow-none p-2 hover:bg-primary/10 hover:text-primary rounded-xl text-muted-foreground"
            />
          </div>
        </div>

        {/* Dashboard Area or Outlet */}
        {location.pathname === "/content" ?
          <div className="flex-1 overflow-auto p-8">
            {/* Warning Banner */}
            <ScrollReveal direction="down" distance={20} delay={0.1}>
              <div className="bg-primary-hover border border-primary/20 rounded-2xl p-4 mb-8 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <AlertCircle size={18} />
                    <span>{t("content.warning.title")}</span>
                  </div>
                  <p className="text-primary text-sm font-medium pl-[26px]">
                    {t("content.warning.text")}
                  </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border/50 text-primary  text-sm font-medium rounded-xl hover:bg-destructive/5 transition-colors cursor-pointer shadow-sm">
                  <Settings size={16} />
                  {t("content.warning.action")}
                </button>
              </div>
            </ScrollReveal>

            {/* Header */}
            <ScrollReveal direction="up" distance={30} delay={0.2}>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-foreground">
                  {t("content.dashboard.title")}
                </h1>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary transition-colors text-sm font-medium cursor-pointer">
                    <Upload size={16} />
                    {t("content.dashboard.importJson")}
                  </button>
                  <button
                    onClick={handleAddResume}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all text-sm font-medium cursor-pointer shadow-sm"
                  >
                    <Plus size={16} />
                    {t("content.dashboard.newResume")}
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Create New Card */}
              <ScrollReveal direction="up" distance={40} delay={0.3}>
                <div
                  onClick={handleAddResume}
                  className="aspect-[4/3] rounded-2xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all flex flex-col items-center justify-center gap-4 group bg-card/50"
                >
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                    <Plus size={24} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {t("content.dashboard.createNew")}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("content.dashboard.createNewDesc")}
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Existing Resume Cards */}
              {resumes.map((resume, index) => (
                <ScrollReveal
                  key={resume.id}
                  direction="up"
                  distance={40}
                  delay={0.3 + (index + 1) * 0.1}
                >
                  <div
                    data-resume-id={resume.id}
                    className="aspect-[4/3] rounded-2xl border border-border bg-card hover:shadow-lg transition-all flex flex-col overflow-hidden group"
                  >
                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30 relative overflow-hidden">
                      {/* File Icon */}
                      <div className="w-16 h-20 border-2 border-muted-foreground/20 bg-background rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:-translate-y-1 transition-transform duration-300">
                        <FileText
                          size={32}
                          className="text-muted-foreground/60"
                        />
                      </div>

                      {editingId === resume.id ?
                        <input
                          autoFocus
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          onClick={(e) => e.stopPropagation()}
                          className="font-bold text-lg text-foreground text-center bg-background border border-primary rounded px-2 py-0.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      : <div className="flex items-center gap-2 max-w-full px-2">
                          <h3
                            className="font-bold text-lg text-foreground truncate cursor-text hover:text-primary transition-colors"
                            onClick={(e) => handleStartEdit(e, resume)}
                            title={t(
                              "content.dashboard.clickToRename",
                              "Click to rename",
                            )}
                          >
                            {resume.title}
                          </h3>
                          <button
                            onClick={(e) => handleStartEdit(e, resume)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-primary transition-all"
                          >
                            <Pencil size={12} />
                          </button>
                        </div>
                      }
                      <p className="text-sm text-muted-foreground mt-1">
                        {t("content.dashboard.created")} {resume.date}
                      </p>
                    </div>
                    <div className="h-12 border-t border-border flex items-center justify-between  bg-card ">
                      <button
                        onClick={() => handleEditResume(resume.id)}
                        className="h-full w-1/2 flex items-center justify-center gap-2  text-sm font-medium text-foreground  hover:bg-secondary/80 transition-colors cursor-pointer"
                      >
                        <Pencil size={14} />
                        {t("content.dashboard.edit")}
                      </button>
                      <button
                        onClick={(e) => handleDeleteResume(e, resume.id)}
                        className=" h-full  w-1/2 flex items-center justify-center gap-2 text-sm font-medium text-destructive border-l-1 border-[#292929]  hover:bg-destructive/20 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        {t("content.dashboard.delete")}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        : <Outlet />}
      </div>
    </div>
  );
};

export default Content;
