import "zmp-ui/zaui.css";
// Font thay thế (miễn phí, có tiếng Việt): Be Vietnam Pro ~ SVN-Gilroy, Baloo 2 ExtraBold ~ SVN-Arlen-Chunky
import "@fontsource/be-vietnam-pro/latin-400.css";
import "@fontsource/be-vietnam-pro/vietnamese-400.css";
import "@fontsource/be-vietnam-pro/latin-600.css";
import "@fontsource/be-vietnam-pro/vietnamese-600.css";
import "@fontsource/be-vietnam-pro/latin-700.css";
import "@fontsource/be-vietnam-pro/vietnamese-700.css";
import "@fontsource/baloo-2/latin-800.css";
import "@fontsource/baloo-2/vietnamese-800.css";
import "./theme.css";
import "./lucian/lucian.css";
import React from "react";
import { createRoot } from "react-dom/client";
import "./components/product-art"; // chốt gốc app trước khi router chạy
import MyApp from "./app";

if (import.meta.env.VITE_WEB_DEMO === "true") document.documentElement.classList.add("webdemo");
createRoot(document.getElementById("app")!).render(<MyApp />);
