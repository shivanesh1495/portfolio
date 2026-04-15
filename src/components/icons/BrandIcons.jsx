import React from "react";

export const FramerSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M4 4h20v10H14L4 4Z" fill="white" />
    <path d="M4 14h10l10 10H4V14Z" fill="white" opacity="0.6" />
    <path d="M14 14v10" stroke="white" strokeWidth="2" opacity="0.3" />
  </svg>
);

export const FigmaSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="4" y="4" width="9" height="9" rx="4.5" fill="#F24E1E" />
    <rect x="15" y="4" width="9" height="9" rx="4.5" fill="#FF7262" />
    <rect x="4" y="15" width="9" height="9" rx="4.5" fill="#A259FF" />
    <rect x="4" y="9" width="9" height="10" fill="#1ABCFE" />
    <circle cx="19.5" cy="19.5" r="4.5" fill="#0ACF83" />
  </svg>
);

export const LemonSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <circle cx="14" cy="14" r="10" fill="#FFD600" />
    <path d="M10 11 Q14 6 18 11 Q21 16 14 20 Q7 16 10 11Z" fill="#FF8C00" />
  </svg>
);

export const ChatGPTSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M14 3C8.5 3 4 7 4 12.5c0 2.8 1.2 5.3 3.2 7L7 22l4.5-1.5c.8.2 1.6.3 2.5.3C19.5 20.8 24 17 24 12 24 6.5 19.5 3 14 3Z"
      stroke="white"
      strokeWidth="1.5"
      fill="none"
    />
    <line
      x1="9"
      y1="12"
      x2="19"
      y2="12"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="9"
      y1="15.5"
      x2="15"
      y2="15.5"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const NotionSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect x="3" y="3" width="22" height="22" rx="5" fill="white" />
    <path
      d="M8 8h12M8 13h12M8 18h8"
      stroke="#111"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

export const NextSVG = () => (
  <svg width="52" height="24" viewBox="0 0 52 24" fill="none">
    <text
      x="0"
      y="18"
      fontFamily="Outfit, sans-serif"
      fontWeight="700"
      fontSize="14"
      fill="white"
    >
      NEXT.
    </text>
  </svg>
);

export const CertificateSVG = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect
      x="4"
      y="4"
      width="20"
      height="20"
      rx="4"
      fill="rgba(255, 255, 255, 0.08)"
      stroke="white"
      strokeOpacity="0.55"
    />
    <path
      d="M8 9h12M8 13h12M8 17h7"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <circle cx="20" cy="19" r="3" fill="#4d8ce8" />
    <path
      d="M20 17.4l.7 1.4 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2.7-1.4Z"
      fill="white"
    />
  </svg>
);

export const GitHubIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export const LinkedinIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.204-.012 3.584-.07 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.849.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 100-8 4 4 0 000 8zm4.965-10.322a1.44 1.44 0 110-2.881 1.44 1.44 0 010 2.881z" />
  </svg>
);

export const YoutubeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
  </svg>
);
