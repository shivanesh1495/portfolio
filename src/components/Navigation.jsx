import React, { memo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { pulseActive, revealIn } from "../utils/animations";
import { Home, Folder, Briefcase, BadgeCheck, Edit3 } from "lucide-react";
import ThemeSwitch from "./icons/ThemeSwitch";

const TABS = [
  { id: "home", Icon: Home, label: "Home" },
  { id: "projects", Icon: Folder, label: "Projects" },
  { id: "experience", Icon: Briefcase, label: "Experience" },
  { id: "certifications", Icon: BadgeCheck, label: "Certifications" },
  { id: "writings", Icon: Edit3, label: "Writings" },
];

function Navigation({ activeSection, isLight, onNavigate, setIsLight }) {
  const container = useRef(null);

  useGSAP(
    () => {
      revealIn(".nav-btn, .theme-switch", {
        y: 10,
        stagger: 0.05,
        duration: 0.45,
      });
    },
    { scope: container },
  );

  useGSAP(
    () => {
      pulseActive(
        container.current?.querySelector(
          `[data-nav-button="${activeSection}"]`,
        ),
      );
    },
    { scope: container, dependencies: [activeSection] },
  );

  return (
    <nav className="nav-bar" ref={container}>
      <div className="nav-pill">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`nav-btn${activeSection === tab.id ? " active" : ""}`}
            data-nav-button={tab.id}
            onClick={() => onNavigate?.(tab.id)}
            aria-current={activeSection === tab.id ? "page" : undefined}
            aria-label={tab.label}
          >
            <tab.Icon
              size={18}
              strokeWidth={activeSection === tab.id ? 2.5 : 1.8}
            />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <ThemeSwitch isLight={isLight} setIsLight={setIsLight} />
    </nav>
  );
}

export default memo(Navigation);
