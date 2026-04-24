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
import HeroSignatureIntro from "./components/ui/HeroSignatureIntro";

const AboutSection = lazy(() => import("./components/pages/AboutSection"));
const Projects = lazy(() => import("./components/pages/Projects"));
const Experience = lazy(() => import("./components/pages/Experience"));
const Education = lazy(() => import("./components/pages/Education"));
const StackSection = lazy(() => import("./components/pages/StackSection"));
const ContactSection = lazy(() => import("./components/pages/ContactSection"));
const Cinematraphie = lazy(() => import("./components/pages/Cinematraphie"));
const HERO_INTRO_SETTLE_MS = 460;
const SCROLL_REVEAL_PROPS = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
};

function SectionFallback() {
  return (
    <div className="scene-state scene-state--skeleton" aria-hidden="true">
      <p>Loading section...</p>
    </div>
  );
}

function App() {
  const [showCinematraphie, setShowCinematraphie] = useState(false);
  const [showHeroIntroOverlay, setShowHeroIntroOverlay] = useState(true);
  const [showHeroIntroBlur, setShowHeroIntroBlur] = useState(true);
  const heroSignatureRef = useRef(null);
  const heroIntroTimeoutRef = useRef(null);

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
    // Disable browser scroll restoration
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Immediate scroll to top on mount
    window.scrollTo(0, 0);

    // Secondary reinforcement for browsers that might restore later
    const handleLoad = () => {
      window.scrollTo(0, 0);
      document.body.classList.add("is-hydrated");
    };

    window.addEventListener("load", handleLoad);

    // If load event already fired
    if (document.readyState === "complete") {
      handleLoad();
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

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

  return (
    <>
      <div
        className={`app-shell${showCinematraphie ? " app-shell--blurred" : ""}${showHeroIntroBlur ? " app-shell--intro-blurred" : ""}`}
      >
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
              onCinematraphie={handleOpenCinematraphie}
            />
          </section>

          <Suspense fallback={<SectionFallback />}>
            <motion.section
              className="page-section"
              id="about"
              {...SCROLL_REVEAL_PROPS}
            >
              <AboutSection />
            </motion.section>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <motion.section
              className="page-section"
              id="education"
              {...SCROLL_REVEAL_PROPS}
            >
              <Education />
            </motion.section>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <motion.section
              className="page-section"
              id="projects"
              {...SCROLL_REVEAL_PROPS}
            >
              <Projects />
            </motion.section>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <motion.section
              className="page-section"
              id="experience"
              {...SCROLL_REVEAL_PROPS}
            >
              <Experience />
            </motion.section>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <motion.section
              className="page-section"
              id="stack"
              {...SCROLL_REVEAL_PROPS}
            >
              <StackSection />
            </motion.section>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <motion.section
              className="page-section"
              id="contact"
              {...SCROLL_REVEAL_PROPS}
            >
              <ContactSection />
            </motion.section>
          </Suspense>
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
