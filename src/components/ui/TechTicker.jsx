import React, { memo } from "react";

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
  React: "react/react-original.svg",
  "Next.js": "nextjs/nextjs-original.svg",
  "Node.js": "nodejs/nodejs-original.svg",
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
  shopify:
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
  "Android Studio": "androidstudio/androidstudio-original.svg",
  Firebase: "firebase/firebase-original.svg",
  MATLAB: "matlab/matlab-original.svg",
};

const STACK_ITEMS = STACK_LABELS.map((label) => ({
  label,
  title: label,
  src: ICON_PATHS[label]
    ? ICON_PATHS[label].startsWith("http")
      ? ICON_PATHS[label]
      : `${DEVICON_BASE}/${ICON_PATHS[label]}`
    : null,
}));

function TechTicker() {
  return (
    <div className="stack-marquee" aria-label="Primary technology stack">
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
