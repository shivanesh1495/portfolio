import React, { memo } from "react";
import { useInView } from "../../hooks/useInView";

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const STACK_LABELS = [
  "C++",
  "Python",
  "Java",
  "C",
  "Dart",
  "Haskell",
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Remix",
  "Three.js",
  "MongoDB",
  "MySQL",
  "Flutter",
  "Git",
  "Linux",
  "Arduino",
  "Visual Studio Code",
  "Eclipse",
  "Postman",
  "Figma",
  "shopify",
  "Android Studio",
  "Firebase",
  "MATLAB",
];

const ICON_PATHS = {
  "C++": "cplusplus/cplusplus-original.svg",
  Python: "python/python-original.svg",
  Java: "java/java-original.svg",
  C: "c/c-original.svg",
  Dart: "dart/dart-original.svg",
  Haskell: "haskell/haskell-original.svg",
  HTML5: "html5/html5-original.svg",
  CSS3: "css3/css3-original.svg",
  JavaScript: "javascript/javascript-original.svg",
  TypeScript: "typescript/typescript-original.svg",
  React: "react/react-original.svg",
  "Next.js": "nextjs/nextjs-original.svg",
  "Node.js": "nodejs/nodejs-original.svg",
  HTML: "html5/html5-original.svg",
  HTML5: "html5/html5-original.svg",
  CSS: "css3/css3-original.svg",
  Tailwind: "tailwindcss/tailwindcss-original.svg",
  "Tailwind CSS": "tailwindcss/tailwindcss-original.svg",
  Vite: "vitejs/vitejs-original.svg",
  GSAP: "https://cdn.simpleicons.org/greensock/88CE02",
  Framer: "framer/framer-original.svg",
  "Framer Motion": "framer/framer-original.svg",
  Remix: "remix/remix-original.svg",
  "Three.js": "threejs/threejs-original.svg",
  MongoDB: "mongodb/mongodb-original.svg",
  MySQL: "mysql/mysql-original.svg",
  Flutter: "flutter/flutter-original.svg",
  Git: "git/git-original.svg",
  Linux: "linux/linux-original.svg",
  Arduino: "arduino/arduino-original.svg",
  "Visual Studio Code": "vscode/vscode-original.svg",
  Eclipse: "eclipse/eclipse-original.svg",
  Postman: "postman/postman-original.svg",
  Figma: "figma/figma-original.svg",
  shopify: "/shopify_glyph.svg",
  "Android Studio": "androidstudio/androidstudio-original.svg",
  Firebase: "firebase/firebase-original.svg",
  MATLAB: "matlab/matlab-original.svg",
};

function resolveIconSrc(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http") || path.startsWith("/")) {
    return path;
  }

  return `${DEVICON_BASE}/${path}`;
}

const STACK_ITEMS = STACK_LABELS.map((label) => ({
  label,
  title: label,
  src: resolveIconSrc(ICON_PATHS[label]),
}));

function TechTicker() {
  const { targetRef, isInView } = useInView();

  return (
    <div
      className={`stack-marquee${isInView ? " is-active" : ""}`}
      ref={targetRef}
      aria-label="Primary technology stack"
    >
      <div
        className="stack-marquee__lane stack-marquee__lane--forward"
        role="list"
      >
        <div className="stack-marquee__track">
          {[...STACK_ITEMS, ...STACK_ITEMS].map((item, index) => (
            <span
              key={`${item.label}-${index}`}
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
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span className="stack-grid__label">{item.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div
        className="stack-marquee__lane stack-marquee__lane--reverse"
        role="list"
      >
        <div className="stack-marquee__track">
          {[...STACK_ITEMS, ...STACK_ITEMS].map((item, index) => (
            <span
              key={`${item.label}-reverse-${index}`}
              className="stack-grid__item stack-grid__item--alt"
              title={item.title || item.label}
              role="listitem"
            >
              <img
                className="stack-grid__icon"
                src={item.src}
                alt={item.title || item.label}
                draggable="false"
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span className="stack-grid__label">{item.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(TechTicker);
