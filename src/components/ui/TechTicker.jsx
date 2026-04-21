import React, { memo } from "react";

const STACK_ITEMS = [
  {
    label: "PostgreSQL",
    title: "PostgreSQL",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  {
    label: "Go",
    title: "Go",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg",
  },
  {
    label: "HTML5",
    title: "HTML5",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    label: "CSS3",
    title: "CSS3",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    label: "JavaScript",
    title: "JavaScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    label: "TypeScript",
    title: "TypeScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    label: "Node.js",
    title: "Node.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    label: "Express",
    title: "Express",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },
];

function TechTicker() {
  return (
    <div className="stack-grid" role="list" aria-label="Primary technology stack">
      {STACK_ITEMS.map((item) => (
        <span
          key={item.label}
          className="stack-grid__item"
          title={item.title || item.label}
          role="listitem"
        >
          <img
            className="stack-grid__icon"
            src={item.src}
            alt={item.title || item.label}
            draggable="false"
            loading="lazy"
          />
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

export default memo(TechTicker);
