import React from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "zmp-ui";

const tabs = [
  { path: "/", label: "Home", icon: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
  { path: "/menu", label: "Menu", icon: <path d="M5 8h12v5a6 6 0 0 1-12 0zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M11 2v3M14 2v3" /> },
  { path: "/rewards", label: "Rewards", icon: <path d="M4 10h16v10H4zM2 7h20v3H2zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0" /> },
];

export default function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  if (!tabs.some((t) => t.path === pathname)) return null;
  return (
    <nav className="nav">
      {tabs.map((t) => (
        <button key={t.path} className={pathname === t.path ? "on" : ""} onClick={() => navigate(t.path, { animate: false })}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
