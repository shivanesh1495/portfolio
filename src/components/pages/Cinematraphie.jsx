import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./Cinematraphie.css";

/**
 * Cinematraphie — Premium cinematic landing page overlay.
 *
 * Animation sequence (GSAP timeline):
 *   STEP 1: Portfolio blurs out (handled in App.jsx)
 *   STEP 2: Title SVG sweep reveal (clip-path left → right) — title only
 *   STEP 3: Everything else (tagline, buttons, back) appears with gradient fade
 *   Background glow drifts infinitely (CSS keyframes)
 */
export default function Cinematraphie({ onBack }) {
  const pageRef = useRef();
  const titleRef = useRef();
  const restRef = useRef();
  const backRef = useRef();
  const isExitingRef = useRef(false);

  /* ── Entry animation timeline ── */
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Hide everything initially
      gsap.set(titleRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(restRef.current, { opacity: 0, y: 30 });
      gsap.set(backRef.current, { opacity: 0, x: -10 });

      // ── STEP 2 (1s → 3s): Title sweep on top of blur ──
      tl.to(
        titleRef.current,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 2,
          ease: "power3.out",
        },
        1 // starts at 1s
      );

      // ── STEP 3 (from 3s): Everything else fades in ──
      tl.to(
        restRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        3 // starts at 3s
      );

      // Back button fades in at the same time
      tl.to(
        backRef.current,
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        3 // starts at 3s
      );
    },
    { scope: pageRef }
  );

  /* ── Escape key → back ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleBack();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Exit animation → onBack callback ── */
  const handleBack = () => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    gsap.to(pageRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => onBack(),
    });
  };

  return (
    <div className="cin-page" ref={pageRef}>
      {/* ── Background layers ── */}
      <div className="cin-bg" />
      <div className="cin-bg-glow" />
      <div className="cin-noise" />
      <div className="cin-vignette" />

      {/* ── Back button ── */}
      <button
        className="cin-back"
        ref={backRef}
        onClick={handleBack}
        aria-label="Back to portfolio"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* ── Centered content ── */}
      <div className="cin-content">
        <img
          className="cin-title"
          ref={titleRef}
          src="/Cinematraphie.svg"
          alt="Cinematraphie"
          draggable="false"
        />
        <div className="cin-rest" ref={restRef}>
          <p className="cin-tagline">
            for fine crafted cinematics
          </p>
          <div className="cin-buttons">
            <button className="cin-btn">
              Connect with me
            </button>
            <button className="cin-btn">
              Check my work
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
