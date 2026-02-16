//#region  react核心
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//#endregion
//#region 引入图片
import polishImg from "../../common/img/home/polish.svg";
import grammarImg from "../../common/img/home/grammar.svg";
import exporFormatsImg from "../../common/img/home/export-formats.svg";
import localImg from "../../common/img/home/local-storage.svg";
import homePreviewImg from "../../common/img/home/image.png";
//#endregion
//#region  hadcn-ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useThemeStore } from "../../store";
import { useTranslation } from "react-i18next";
//#endregion
const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0); //控制当前展示的功能
  const { theme } = useThemeStore(); //控制当前主题
  const themeClass: string[] = [
    "dark",
    "deeppink",
    "yellow",
    "blue",
    "orange",
    "red",
    "rose",
    "Purple",
    "green",
  ];
  const { t, i18n } = useTranslation();
  const router = useNavigate();

  //语言切换
  const langOptions = [
    { code: "en", label: "English" },
    { code: "zh", label: "中文" },
  ];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    themeClass.forEach((c) => document.documentElement.classList.remove(c));
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  const goContent = () => {
    router("/content");
  };
  const goTemplates = () => {
    router("/content/templates");
  };
  const goHome = () => {
    router("/");
  };
  return (
    <div className="w-full h-fit overflow-auto bg-background flex justify-center">
      <style>{`
        @keyframes grow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
      <div className="w-7/10">
        <div className="fixed top-0 left-0 bg-background/30 z-90 h-20 w-full flex justify-center backdrop-blur-xl text-foreground flex items-center justify-between">
          <div className="w-7/10 flex items-center justify-between">
            {/* Logo Section */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={goHome}
            >
              <div className="rounded-[5px] w-8 h-8  bg-primary  flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                X
              </div>
              <span className="text-xl font-bold tracking-tight">
                {t("app.name")}
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger>
                  {" "}
                  {/* Language Switcher */}
                  <button className="p-2 rounded-2xl hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="z-100 border-0 w-30  rounded-2xl  overflow-hidden"
                >
                  {langOptions.map((item) => (
                    <div
                      key={item.code}
                      onClick={() => handleLanguageChange(item.code)}
                      className={` rounded-2xl w-full h-10 flex items-center justify-center text-sm font-medium cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground ${i18n.language === item.code ? "bg-accent text-accent-foreground" : ""}`}
                    >
                      {item.label}
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
              <ThemeToggle
                showLabel={false}
                className="p-2 rounded-2xl bg-transparent hover:bg-accent transition-colors text-muted-foreground hover:text-foreground shadow-none"
              />
              {/* GitHub Button */}
              <a
                href="https://github.com/Xxmm153/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-card hover:bg-accent text-card-foreground border border-border transition-all text-sm font-medium group"
              >
                <svg
                  className="w-4 h-4 text-primary group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                </svg>
                <span>{t("nav.github")}</span>
              </a>
              {/* Start Button */}
              <button
                onClick={goContent}
                className="px-5 py-1.5 rounded-2xl bg-foreground text-background font-semibold hover:opacity-90 transition-opacity text-sm shadow-sm"
              >
                {t("nav.start")}
              </button>
            </div>
          </div>
        </div>
        <div className="h-20"></div>
        <div className="min-h-screen w-full flex flex-col items-center mt-15 pb-20 text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-1 rounded-2xl border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted">
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-2xl bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-2xl bg-primary"></span>
            </span>
            {t("hero.badge")}
          </div>

          {/* Headline */}
          <h1 className="mb-6 font-bold tracking-tight text-foreground text-7xl">
            {t("hero.titlePrefix")}
            <span className="font-serif italic text-primary px-2">
              {t("hero.titleHighlight")}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
            {t("hero.subtitle")}
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
            <button
              onClick={goContent}
              className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-foreground px-8 py-3.5 text-base font-semibold text-background transition-all hover:opacity-90 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] dark:hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              <span>{t("hero.startNow")}</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>

            <button
              onClick={goTemplates}
              className="flex items-center gap-2 rounded-2xl border border-border bg-background/50 px-8 py-3.5 text-base font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground backdrop-blur-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>{t("hero.browseTemplates")}</span>
            </button>
          </div>

          {/* App Preview / Placeholder for next step */}
          <div className="mt-20 w-full max-w-5xl px-4">
            <div className="relative rounded-2xl border border-border bg-background/50 p-3 shadow-2xl backdrop-blur-xl">
              <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden relative">
                <img
                  src={homePreviewImg}
                  alt={t("hero.titleHighlight")}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background/60 to-transparent"></div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-40 w-full max-w-6xl px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t("whyChoose.title")}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-foreground/50 to-transparent mx-auto mb-6"></div>
            <p className="text-muted-foreground text-lg mb-20">
              {t("whyChoose.subtitle")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Text Content */}
              <div className="text-left space-y-8 ">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium text-muted-foreground w-fit">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                    <path d="M8.5 8.5v.01" />
                    <path d="M16 16v.01" />
                    <path d="M12 12v.01" />
                    <path d="M12 17v.01" />
                    <path d="M12 7v.01" />
                  </svg>
                  {t("features.aiPowered")}
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  {t("features.title")}
                </h3>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("features.description")}
                </p>

                <div className="space-y-4">
                  {/* Feature 1: Polish */}
                  <div
                    onClick={() => setActiveFeature(0)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      activeFeature === 0 ?
                        "border-primary/50 bg-primary/10"
                      : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex flex-col gap-1 z-10">
                      <span
                        className={`font-semibold transition-colors ${activeFeature === 0 ? "text-primary" : "text-foreground"}`}
                      >
                        {t("features.polish.title")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t("features.polish.desc")}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-colors z-10 ${activeFeature === 0 ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {activeFeature === 0 && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-primary"
                        style={{ animation: "grow 5s linear forwards" }}
                      ></div>
                    )}
                  </div>

                  {/* Feature 2: Grammar */}
                  <div
                    onClick={() => setActiveFeature(1)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      activeFeature === 1 ?
                        "border-primary/50 bg-primary/10"
                      : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex flex-col gap-1 z-10">
                      <span
                        className={`font-semibold transition-colors ${activeFeature === 1 ? "text-primary" : "text-foreground"}`}
                      >
                        {t("features.grammar.title")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t("features.grammar.desc")}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-colors z-10 ${activeFeature === 1 ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {activeFeature === 1 && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-primary"
                        style={{ animation: "grow 5s linear forwards" }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Feature Card Visual */}
              <div className="relative">
                <div className="relative z-10 rounded-2xl border border-border bg-card p-8 aspect-[4/3] flex items-center justify-center shadow-2xl overflow-hidden">
                  {/* Background glow */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 blur-3xl rounded-full transition-colors duration-1000 ${
                      activeFeature === 0 ? "bg-primary/20" : "bg-primary/20"
                    }`}
                  ></div>

                  {/* Image Content */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-500">
                    <img
                      key={activeFeature}
                      src={activeFeature === 0 ? polishImg : grammarImg}
                      alt={
                        activeFeature === 0 ?
                          t("features.polish.alt")
                        : t("features.grammar.alt")
                      }
                      className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mt-50">
              {/* Right: Feature Card Visual */}
              <div className="relative">
                <div className="relative z-10 rounded-2xl border border-border bg-card p-8 aspect-[4/3] flex items-center justify-center shadow-2xl overflow-hidden">
                  {/* Background glow */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 blur-3xl rounded-full transition-colors duration-1000 ${
                      activeFeature === 0 ? "bg-primary/20" : "bg-primary/20"
                    }`}
                  ></div>

                  {/* Image Content */}
                  <div className="relative w-full h-full rounded-lg overflow-hidden transition-all duration-500">
                    <img
                      key={activeFeature}
                      src={activeFeature === 0 ? localImg : exporFormatsImg}
                      alt={
                        activeFeature === 0 ?
                          t("features.polish.alt")
                        : t("features.grammar.alt")
                      }
                      className="w-full h-full object-contain animate-in fade-in zoom-in-95 duration-500"
                    />
                  </div>
                </div>
              </div>
              {/* Left: Text Content */}
              <div className="text-left space-y-8 ">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-muted-foreground w-fit">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                    <path d="M8.5 8.5v.01" />
                    <path d="M16 16v.01" />
                    <path d="M12 12v.01" />
                    <path d="M12 17v.01" />
                    <path d="M12 7v.01" />
                  </svg>
                  {t("security.badge")}
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                  {t("security.title")}
                </h3>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {t("security.description")}
                </p>

                <div className="space-y-4">
                  <div
                    onClick={() => setActiveFeature(0)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      activeFeature === 0 ?
                        "border-primary bg-primary/10"
                      : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex flex-col gap-1 z-10">
                      <span
                        className={`font-semibold transition-colors ${activeFeature === 0 ? "text-primary" : "text-foreground"}`}
                      >
                        {t("security.local.title")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t("security.local.desc")}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-colors z-10 ${activeFeature === 0 ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {activeFeature === 0 && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-primary"
                        style={{ animation: "grow 5s linear forwards" }}
                      ></div>
                    )}
                  </div>

                  <div
                    onClick={() => setActiveFeature(1)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden ${
                      activeFeature === 1 ?
                        "border-primary/50 bg-primary/10"
                      : "border-border/50 bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex flex-col gap-1 z-10">
                      <span
                        className={`font-semibold transition-colors ${activeFeature === 1 ? "text-primary" : "text-foreground"}`}
                      >
                        {t("security.export.title")}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t("security.export.desc")}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 transition-colors z-10 ${activeFeature === 1 ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    {activeFeature === 1 && (
                      <div
                        className="absolute bottom-0 left-0 h-1 bg-primary"
                        style={{ animation: "grow 5s linear forwards" }}
                      ></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* FAQ Section */}
          <div className="mt-90 w-full max-w-5xl px-4 text-center pb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              {t("faq.title")}
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-foreground/50 to-transparent mx-auto mb-12"></div>

            <div className="space-y-4 text-left">
              {(
                t("faq.items", { returnObjects: true }) as Array<{
                  q: string;
                  a: string;
                }>
              ).map((item, index) => (
                <FAQItem key={index} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
          {/* CTA Section */}
          <div className="mt-40 mb-20 w-full max-w-5xl px-4 text-center">
            <div className="flex flex-col items-center justify-center p-12 rounded-3xl dark:bg-primary text-foreground relative overflow-hidden group">
              {/* Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full "></div>

              {/* Icon */}
              <div className="mb-6 p-4 rounded-2xl bg-white/10 border border-white/20 shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                <svg
                  className="w-8 h-8 text-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>

              {/* Headlines */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                {t("cta.title")}
              </h2>
              <p className="text-lg opacity-90 mb-10 max-w-2xl">
                {t("cta.desc")}
              </p>

              {/* Button */}
              <button
                onClick={goContent}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-background px-8 py-3.5 text-base font-bold text-foreground transition-all hover:bg-muted hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <span>{t("cta.button")}</span>
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-muted/50 overflow-hidden transition-all duration-300 hover:bg-muted">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-foreground text-lg">{question}</span>
        <svg
          className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7 7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-4 text-muted-foreground leading-relaxed border-t border-border pt-4 mt-2">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
