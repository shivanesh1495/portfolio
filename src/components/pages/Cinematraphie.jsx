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
  const bgRef = useRef();
  const instaSectionRef = useRef();
  const isExitingRef = useRef(false);

  /* ── Entry animation timeline ── */
  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Hide everything initially
      gsap.set(titleRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(bgRef.current, { opacity: 0, scale: 1.05 }); // Pre-scale for "zoom out" settle
      gsap.set(restRef.current, { opacity: 0, y: 15, scale: 0.95 }); // Slimmer slide, subtle scale
      gsap.set(backRef.current, { opacity: 0, x: -10 });
      gsap.set(instaSectionRef.current, { opacity: 0, y: 50 });

      // ── STEP 2 (0.9s → 2.4s): Title sweep reveal ──
      tl.to(
        titleRef.current,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "expo.out", // Much smoother deceleration
        },
        0.9,
      );

      // ── STEP 3 (2.5s → 3.0s): Gradient background settle ──
      tl.to(
        bgRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8, // Slightly longer for smoothness
          ease: "power3.out",
        },
        2.5,
      );

      // ── STEP 4 (from 2.8s): Everything else materializes ──
      tl.to(
        restRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "expo.out",
        },
        2.8,
      );

      tl.to(
        backRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "expo.out",
        },
        2.9, // Offset slightly for staggered layer feel
      );

      tl.to(
        instaSectionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "expo.out",
        },
        3.2,
      );
    },
    { scope: pageRef },
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

    gsap.killTweensOf(pageRef.current);

    gsap.to(pageRef.current, {
      opacity: 0,
      scale: 0.98,
      duration: 0.45,
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => onBack(),
    });
  };

  return (
    <div className="cin-page" ref={pageRef}>
      {/* ── Background layers (grouped for fade-in) ── */}
      <div className="cin-bg-wrapper" ref={bgRef}>
        <div className="cin-bg-inner">
          <div className="cin-bg" />
          <div className="cin-bg-glow" />
          <div className="cin-bg-sweep" />
          <div className="cin-noise" />
          <div className="cin-vignette" />
        </div>
      </div>

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

      {/* ── Scrollable Content Wrapper ── */}
      <div className="cin-scroll-container">
        {/* ── Centered content (Hero Section) ── */}
        <div className="cin-content">
          <img
            className="cin-title"
            ref={titleRef}
            src="/Cinematraphie.svg"
            alt="Cinematraphie"
            draggable="false"
          />
          <div className="cin-rest" ref={restRef}>
            <p className="cin-tagline">for fine crafted cinematics</p>
            <div className="cin-buttons">
              <button className="cin-btn">Connect with me</button>
              <button className="cin-btn">Check my work</button>
            </div>
          </div>
        </div>

        {/* ── Instagram Preview Section ── */}
        <div className="cin-insta-section" ref={instaSectionRef}>
          <div className="cin-insta-content">
            <img
              src="/cine.png"
              alt="Instagram Preview"
              className="cin-insta-img"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
