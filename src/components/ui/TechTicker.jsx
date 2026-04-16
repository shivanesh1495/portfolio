import React, { memo } from "react";

const STACK_ITEMS = [
  {
    label: "C++",
    title: "C++",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    label: "Python",
    title: "Python",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    label: "Java",
    title: "Java",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    label: "C",
    title: "C",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  },
  {
    label: "Dart",
    title: "Dart",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  },
  {
    label: "Haskell",
    title: "Haskell",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
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
    label: "React",
    title: "React",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    label: "Next.js",
    title: "Next.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    label: "Node.js",
    title: "Node.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    label: "MongoDB",
    title: "MongoDB",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    label: "MySQL",
    title: "MySQL",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    label: "Flutter",
    title: "Flutter",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  },
  {
    label: "Git",
    title: "Git",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    label: "Linux",
    title: "Linux",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  {
    label: "Figma",
    title: "Figma",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    label: "Firebase",
    title: "Firebase",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
];

function TechTicker() {
  return (
    <div className="stack-ticker">
      <div className="stack-ticker-track">
        <div className="stack-ticker-group">
          {STACK_ITEMS.map((item, index) => (
            <span
              key={`stack-a-${index}`}
              className="stack-ticker-item"
              title={item.title || item.label}
            >
              <img
                className="stack-skill-icon"
                src={item.src}
                alt={item.title || item.label}
                draggable="false"
                loading="lazy"
              />
            </span>
          ))}
        </div>

        <div className="stack-ticker-group" aria-hidden="true">
          {STACK_ITEMS.map((item, index) => (
            <span
              key={`stack-b-${index}`}
              className="stack-ticker-item"
              title={item.title || item.label}
            >
              <img
                className="stack-skill-icon"
                src={item.src}
                alt=""
                draggable="false"
                loading="lazy"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(TechTicker);
