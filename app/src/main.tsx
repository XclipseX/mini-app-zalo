import "zmp-ui/zaui.css";
import "./theme.css";
import React from "react";
import { createRoot } from "react-dom/client";
import MyApp from "./app";

if (import.meta.env.VITE_WEB_DEMO === "true") document.documentElement.classList.add("webdemo");
createRoot(document.getElementById("app")!).render(<MyApp />);
