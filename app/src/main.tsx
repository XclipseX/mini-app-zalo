import "zmp-ui/zaui.css";
import "./theme.css";
import React from "react";
import { createRoot } from "react-dom/client";
import MyApp from "./app";

createRoot(document.getElementById("app")!).render(<MyApp />);
