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

function Navigation({ activeTab, setActiveTab, isLight, setIsLight }) {
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
      pulseActive(container.current?.querySelector(`#nav-${activeTab}`));
    },
    { scope: container, dependencies: [activeTab] },
  );

  return (
    <nav className="nav-bar" ref={container}>
      {/* Pill stretches to fill all available space */}
      <div className="nav-pill">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            id={`nav-${tab.id}`}
            className={`nav-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
          >
            <tab.Icon
              size={20}
              strokeWidth={activeTab === tab.id ? 2.5 : 1.8}
            />
          </button>
        ))}
      </div>

      {/* Only the theme toggle remains on the right */}
      <ThemeSwitch isLight={isLight} setIsLight={setIsLight} />
    </nav>
  );
}

export default memo(Navigation);
