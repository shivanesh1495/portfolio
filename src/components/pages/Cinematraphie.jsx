import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./Cinematraphie.css";

/**
 * Cinematraphie — Premium cinematic landing page overlay.
 */
export default function Cinematraphie({ onBack }) {
  const pageRef = useRef();
  const titleRef = useRef();
  const restRef = useRef();
  const backRef = useRef();
  const bgRef = useRef();
  const instaSectionRef = useRef();
  const review1Ref = useRef();
  const review2Ref = useRef();
  const review3Ref = useRef();
  const review4Ref = useRef();
  const review5Ref = useRef();
  const review6Ref = useRef();
  const isExitingRef = useRef(false);

  /* ── Entry animation timeline ── */
  useGSAP(
    () => {
      const tl = gsap.timeline();
      const reviewRefs = [
        review1Ref.current,
        review2Ref.current,
        review3Ref.current,
        review4Ref.current,
        review5Ref.current,
        review6Ref.current,
      ];

      // Hide everything initially
      gsap.set(pageRef.current, { opacity: 0 });
      gsap.set(
        [
          bgRef.current,
          restRef.current,
          instaSectionRef.current,
          ...reviewRefs,
        ],
        {
          filter: "blur(20px)",
        },
      );
      gsap.set(titleRef.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(bgRef.current, { opacity: 0, scale: 1.05 });
      gsap.set(restRef.current, { opacity: 0, y: 15, scale: 0.95 });
      gsap.set(backRef.current, { opacity: 0, x: -10 });
      gsap.set(instaSectionRef.current, { opacity: 0, y: 50 });
      gsap.set(reviewRefs, { opacity: 0, x: (i) => (i % 2 === 0 ? -50 : 50) });

      // ── STEP 1: Page fade & de-blur (0s → 1.8s) ──
      tl.to(
        pageRef.current,
        {
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
        },
        0,
      );

      tl.to(
        [
          bgRef.current,
          restRef.current,
          instaSectionRef.current,
          ...reviewRefs,
        ],
        {
          filter: "blur(0px)",
          duration: 2.2,
          ease: "power2.inOut",
        },
        0,
      );

      // ── STEP 2: Title sweep reveal (0.3s → 2s) ──
      tl.to(
        titleRef.current,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 2.4,
          ease: "expo.inOut",
        },
        0.4,
      );

      // ── STEP 3: Background layers materialize (starts at 1.8s) ──
      tl.to(
        bgRef.current,
        {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power3.inOut",
        },
        1.2,
      );

      // ── STEP 4: Content slide up (starts at 1.5s) ──
      tl.to(
        restRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.8,
          ease: "expo.out",
        },
        1.5,
      );

      tl.to(
        backRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
        },
        2.2,
      );

      // ── STEP 5: Instagram section & Reviews ──
      tl.to(
        instaSectionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 2.2,
          ease: "power4.out",
        },
        1.8,
      );

      tl.to(
        reviewRefs,
        {
          opacity: 1,
          x: 0,
          duration: 1.6,
          stagger: {
            amount: 0.8,
            ease: "power2.inOut",
          },
          ease: "expo.out",
        },
        2.2,
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
            <p className="cin-tagline aurora-text">for fine crafted cinematics</p>
            <div className="cin-buttons">
              <a
                href="https://www.instagram.com/cinematraphie/"
                target="_blank"
                rel="noopener noreferrer"
                className="cin-btn"
              >
                Connect with me
              </a>
            </div>
          </div>
        </div>

        {/* ── Instagram Preview Section ── */}
        <div className="cin-insta-section" ref={instaSectionRef}>
          <div className="cin-insta-content">
            {/* Review Card 1 - Floating Right */}
            <div className="cin-review-card card premium-card" ref={review1Ref}>
              <div className="textBox">
                <div className="textContent">
                  <div className="name-box">
                    <p className="h1">Athriya saravanan</p>
                    <span className="span">@whatmaangabro</span>
                  </div>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="review-body">
                  <p className="p">
                    He is incredibly dedicated to his work and always punctual.
                    Photography skills are truly excellent.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 2 - Floating Left */}
            <div className="cin-review-card card premium-card" ref={review2Ref}>
              <div className="textBox">
                <div className="textContent">
                  <div className="name-box">
                    <p className="h1">Gayathri</p>
                    <span className="span">@gayathri.sajeevan</span>
                  </div>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="review-body">
                  <p className="p">
                    Super comfortable to work with and easy to communicate
                    ideas. Creative editing always adds a nice touch ✨
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 3 - Floating Right Higher */}
            <div className="cin-review-card card premium-card" ref={review3Ref}>
              <div className="textBox">
                <div className="textContent">
                  <div className="name-box">
                    <p className="h1">Jagruthi A</p>
                    <span className="span">@jagruthi.io</span>
                  </div>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="review-body">
                  <p className="p">
                    great work done . For all the efforts you have put 🛐.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 4 - Floating Left Lower */}
            <div className="cin-review-card card premium-card" ref={review4Ref}>
              <div className="textBox">
                <div className="textContent">
                  <div className="name-box">
                    <p className="h1">Abhinaya</p>
                    <span className="span">@alsoabbhhi</span>
                  </div>
                  <div className="stars">
                    ⭐⭐⭐⭐<span className="star-half">⭐</span>
                  </div>
                </div>
                <div className="review-body">
                  <p className="p">
                    I had a great experience working with him on my dance
                    videos. Shooting and editing skills are really impressive.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 5 - Floating Right Lower */}
            <div className="cin-review-card card premium-card" ref={review5Ref}>
              <div className="textBox">
                <div className="textContent">
                  <div className="name-box">
                    <p className="h1">Merwin josh w</p>
                    <span className="span">@mj_merwin_josh_</span>
                  </div>
                  <div className="stars">
                    ⭐⭐⭐<span className="star-half">⭐</span>
                  </div>
                </div>
                <div className="review-body">
                  <p className="p">
                    great edits with new approach, needs improvement on colour
                    grading.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Card 6 - Floating Left Higher */}
            <div className="cin-review-card card premium-card" ref={review6Ref}>
              <div className="textBox">
                <div className="textContent">
                  <div className="name-box">
                    <p className="h1">Srinidhi</p>
                    <span className="span">@_srinidhisagar</span>
                  </div>
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                </div>
                <div className="review-body">
                  <p className="p">
                    Absolutely loved working with him! He captured the moments
                    perfectly.
                  </p>
                </div>
              </div>
            </div>

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
