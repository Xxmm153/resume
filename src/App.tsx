import "./App.css";
import router from "./router";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useThemeStore } from "@/store/index";

function App() {
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
  useEffect(() => {
    themeClass.forEach((c) => document.documentElement.classList.remove(c));
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
