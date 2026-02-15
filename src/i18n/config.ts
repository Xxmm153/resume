import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translation_en from "./en.json";
import translation_zh from "./zh.json";

// 获取浏览器首选语言
const getLanguageFn = () => {
  const nav = navigator as Navigator & { userLanguage?: string };
  return nav.language || nav.userLanguage || "zh";
};

const resources = {
  en: {
    translation: translation_en,
  },
  zh: {
    translation: translation_zh,
  },
};

// 进行初始化
i18n.use(initReactI18next).init({
  // 我们自己的语言文件
  resources,
  // 默认语言  zh/en  中文/英文
  lng:
    localStorage.getItem("language") ||
    (/cn/i.test(getLanguageFn()) && "zh") ||
    "zh",
  interpolation: {
    escapeValue: false, // 不会为了xss攻击，而把我们的内容强行转成字符串
  },
});

export default i18n;
