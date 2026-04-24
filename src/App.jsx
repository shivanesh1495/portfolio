import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import Home from "./components/pages/Home";
import AboutSection from "./components/pages/AboutSection";
import Projects from "./components/pages/Projects";
import Experience from "./components/pages/Experience";
import Certifications from "./components/pages/Certifications";
import Writings from "./components/pages/Writings";
import StackSection from "./components/pages/StackSection";
import ContactSection from "./components/pages/ContactSection";
import HeroSignatureIntro from "./components/ui/HeroSignatureIntro";

const Cinematraphie = lazy(() => import("./components/pages/Cinematraphie"));
const HERO_INTRO_SETTLE_MS = 460;

function App() {
  const [showCinematraphie, setShowCinematraphie] = useState(false);
  const [showHeroIntroOverlay, setShowHeroIntroOverlay] = useState(true);
  const [showHeroIntroBlur, setShowHeroIntroBlur] = useState(true);
  const heroSignatureRef = useRef(null);
  const heroIntroTimeoutRef = useRef(null);

  const scrollRevealProps = {
    initial: { opacity: 0, y: 34 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.24 },
    transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
  };

  const handleOpenCinematraphie = useCallback(() => {
    setShowCinematraphie(true);
  }, []);

  const handleCloseCinematraphie = useCallback(() => {
    setShowCinematraphie(false);
  }, []);

  const handleHeroIntroRevealComplete = useCallback(() => {
    setShowHeroIntroBlur(false);

    if (heroIntroTimeoutRef.current) {
      window.clearTimeout(heroIntroTimeoutRef.current);
    }

    heroIntroTimeoutRef.current = window.setTimeout(() => {
      setShowHeroIntroOverlay(false);
      heroIntroTimeoutRef.current = null;
    }, HERO_INTRO_SETTLE_MS);
  }, []);

  const shouldLockScroll =
    showCinematraphie || showHeroIntroOverlay || showHeroIntroBlur;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = root.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior;
    const previousBodyTouchAction = body.style.touchAction;

    if (shouldLockScroll) {
      root.style.overflow = "hidden";
      body.style.overflow = "hidden";
      body.style.overscrollBehavior = "none";
      body.style.touchAction = "none";
    } else {
      root.style.overflow = "";
      body.style.overflow = "";
      body.style.overscrollBehavior = "";
      body.style.touchAction = "";
    }

    return () => {
      root.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      body.style.touchAction = previousBodyTouchAction;
    };
  }, [shouldLockScroll]);

  useEffect(() => {
    return () => {
      if (heroIntroTimeoutRef.current) {
        window.clearTimeout(heroIntroTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const applyPosition = (x, y) => {
      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
      document.documentElement.style.setProperty("--cursor-light-opacity", "1");
    };

    const handlePointerMove = (event) => {
      if (frame) {
        return;
      }

      const { clientX, clientY } = event;

      frame = window.requestAnimationFrame(() => {
        applyPosition(clientX, clientY);
        frame = 0;
      });
    };

    const handlePointerLeave = () => {
      document.documentElement.style.setProperty("--cursor-light-opacity", "0");
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerleave", handlePointerLeave, {
      passive: true,
    });

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <>
      <div
        className={`app-shell${showCinematraphie ? " app-shell--blurred" : ""}${showHeroIntroBlur ? " app-shell--intro-blurred" : ""}`}
      >
        <div className="app-cursor-light" aria-hidden="true" />

        <div className="app-ambient" aria-hidden="true">
          <div className="app-ambient__spot app-ambient__spot--north" />
          <div className="app-ambient__spot app-ambient__spot--east" />
          <div className="app-ambient__spot app-ambient__spot--south" />
          <div className="app-ambient__grid" />
          <div className="app-ambient__noise" />
        </div>

        <main className="portfolio-main">
          <section className="page-section page-section--hero" id="home">
            <Home
              introActive={showHeroIntroOverlay || showHeroIntroBlur}
              signatureRef={heroSignatureRef}
            />
          </section>

          <motion.section
            className="page-section"
            id="about"
            {...scrollRevealProps}
          >
            <AboutSection />
          </motion.section>

          <motion.section
            className="page-section"
            id="projects"
            {...scrollRevealProps}
          >
            <Projects />
          </motion.section>

          <motion.section
            className="page-section"
            id="experience"
            {...scrollRevealProps}
          >
            <Experience />
          </motion.section>

          <motion.section
            className="page-section"
            id="certifications"
            {...scrollRevealProps}
          >
            <Certifications />
          </motion.section>

          <motion.section
            className="page-section"
            id="writings"
            {...scrollRevealProps}
          >
            <Writings />
          </motion.section>

          <motion.section
            className="page-section"
            id="stack"
            {...scrollRevealProps}
          >
            <StackSection />
          </motion.section>

          <motion.section
            className="page-section"
            id="contact"
            {...scrollRevealProps}
          >
            <ContactSection onCinematraphie={handleOpenCinematraphie} />
          </motion.section>
        </main>
      </div>

      {showCinematraphie ? (
        <Suspense fallback={null}>
          <Cinematraphie onBack={handleCloseCinematraphie} />
        </Suspense>
      ) : null}

      {showHeroIntroOverlay ? (
        <HeroSignatureIntro
          onRevealComplete={handleHeroIntroRevealComplete}
          targetRef={heroSignatureRef}
        />
      ) : null}
    </>
  );
}

export default App;
