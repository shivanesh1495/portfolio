import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Home from "./components/pages/Home";
import AboutSection from "./components/pages/AboutSection";
import Projects from "./components/pages/Projects";
import Experience from "./components/pages/Experience";
import Certifications from "./components/pages/Tools";
import Writings from "./components/pages/Writings";
import ContactSection from "./components/pages/ContactSection";

const Cinematraphie = lazy(() => import("./components/pages/Cinematraphie"));

const SECTION_CONFIG = [
  { id: "home", navId: "home", className: "scroll-section--hero" },
  { id: "about", navId: "home" },
  { id: "projects", navId: "projects" },
  { id: "experience", navId: "experience" },
  { id: "certifications", navId: "certifications" },
  { id: "writings", navId: "writings" },
  { id: "contact", navId: "writings", className: "scroll-section--contact" },
];

gsap.registerPlugin(useGSAP);

function ScrollSection({
  children,
  className = "",
  id,
  navId,
  isVisible,
  sectionRef,
}) {
  return (
    <section
      className={`scroll-section ${className}${isVisible ? " is-visible" : ""}`}
      data-nav-id={navId}
      data-section-id={id}
      id={id}
      ref={sectionRef}
    >
      <div className="scroll-section-shell">{children}</div>
    </section>
  );
}

function App() {
  const [isLightTheme] = useState(false);
  const [showCinematraphie, setShowCinematraphie] = useState(false);
  const [visibleSections, setVisibleSections] = useState({ home: true });

  const appRootRef = useRef(null);
  const themeFlashRef = useRef(null);
  const cursorGlowRef = useRef(null);
  const scrollRef = useRef(null);
  const progressBarRef = useRef(null);
  const sectionRefs = useRef({});
  const hasMountedThemeRef = useRef(false);

  const setSectionRef = useCallback(
    (id) => (node) => {
      if (node) {
        sectionRefs.current[id] = node;
      }
    },
    [],
  );

  const scrollToSection = useCallback((id) => {
    const target = sectionRefs.current[id];
    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, []);

  const handleNavigate = useCallback(
    (id) => {
      scrollToSection(id);
    },
    [scrollToSection],
  );

  const handleOpenCinematraphie = useCallback(() => {
    gsap.killTweensOf(appRootRef.current);
    setShowCinematraphie(true);
    gsap.to(appRootRef.current, {
      filter: "blur(22px)",
      scale: 0.972,
      opacity: 0.42,
      duration: 0.75,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, []);

  const handleCloseCinematraphie = useCallback(() => {
    gsap.killTweensOf(appRootRef.current);
    setShowCinematraphie(false);
    gsap.to(appRootRef.current, {
      filter: "blur(0px)",
      scale: 1,
      opacity: 1,
      duration: 0.42,
      ease: "power2.out",
      clearProps: "filter,transform,opacity",
      overwrite: "auto",
    });
  }, []);

  useGSAP(
    () => {
      gsap.fromTo(
        ".main-col",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    },
    { scope: appRootRef },
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isLightTheme ? "light" : "dark",
    );

    if (!hasMountedThemeRef.current) {
      hasMountedThemeRef.current = true;
      return undefined;
    }

    const root = appRootRef.current;
    const flash = themeFlashRef.current;

    if (!root || !flash) {
      return undefined;
    }

    const targets = Array.from(
      root.querySelectorAll(
        ".content-card, .scroll-section-shell, .stack-showcase, .contact-showcase",
      ),
    );

    gsap.killTweensOf([...targets, flash]);

    const frame = requestAnimationFrame(() => {
      gsap.set(flash, { opacity: 0, scale: 0.98 });

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline.to(
        flash,
        {
          opacity: 1,
          scale: 1.02,
          duration: 0.18,
        },
        0,
      );

      timeline.fromTo(
        targets,
        { y: 8, scale: 0.995 },
        {
          y: 0,
          scale: 1,
          duration: 0.34,
          stagger: 0.01,
          clearProps: "transform,opacity",
        },
        0,
      );

      timeline.to(
        flash,
        {
          opacity: 0,
          scale: 1.04,
          duration: 0.24,
          ease: "power2.out",
        },
        0.08,
      );
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [isLightTheme]);

  useEffect(() => {
    const root = scrollRef.current;
    const progressBar = progressBarRef.current;

    if (!root || !progressBar) {
      return undefined;
    }

    const updateProgress = () => {
      const maxScroll = root.scrollHeight - root.clientHeight;
      const progress = maxScroll > 0 ? root.scrollTop / maxScroll : 0;
      gsap.set(progressBar, { scaleX: progress });
      appRootRef.current?.style.setProperty(
        "--scroll-progress",
        progress.toFixed(4),
      );
    };

    updateProgress();
    root.addEventListener("scroll", updateProgress, { passive: true });

    return () => {
      root.removeEventListener("scroll", updateProgress);
    };
  }, []);

  useEffect(() => {
    const root = scrollRef.current;

    if (!root) {
      return undefined;
    }

    const observedEntries = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.dataset.sectionId;
          observedEntries.set(sectionId, entry);

          if (entry.isIntersecting) {
            setVisibleSections((current) => {
              if (current[sectionId]) {
                return current;
              }

              return {
                ...current,
                [sectionId]: true,
              };
            });
          }
        });

        const activeEntries = Array.from(observedEntries.values()).filter(
          (entry) => entry.isIntersecting,
        );

        if (activeEntries.length > 0) {
          activeEntries.sort((entryA, entryB) => {
            if (entryB.intersectionRatio !== entryA.intersectionRatio) {
              return entryB.intersectionRatio - entryA.intersectionRatio;
            }

            return (
              Math.abs(entryA.boundingClientRect.top) -
              Math.abs(entryB.boundingClientRect.top)
            );
          });

          const nextActive =
            activeEntries[0].target.dataset.navId ||
            activeEntries[0].target.dataset.sectionId;

          if (nextActive) {
            appRootRef.current?.style.setProperty(
              "--active-section",
              nextActive,
            );
          }
        }
      },
      {
        root,
        rootMargin: "-12% 0px -30% 0px",
        threshold: [0.18, 0.35, 0.55, 0.75],
      },
    );

    SECTION_CONFIG.forEach((section) => {
      const node = sectionRefs.current[section.id];
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const glow = cursorGlowRef.current;
    const root = appRootRef.current;

    if (!glow || !root) {
      return undefined;
    }

    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) {
      return undefined;
    }

    const xTo = gsap.quickTo(glow, "x", {
      duration: 0.35,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(glow, "y", {
      duration: 0.35,
      ease: "power3.out",
    });

    const handlePointerMove = (event) => {
      const bounds = root.getBoundingClientRect();
      xTo(event.clientX - bounds.left - 180);
      yTo(event.clientY - bounds.top - 180);
      gsap.to(glow, { opacity: 1, duration: 0.2, overwrite: "auto" });
    };

    const handlePointerLeave = () => {
      gsap.to(glow, { opacity: 0, duration: 0.35, overwrite: "auto" });
    };

    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <>
      <div className="app-root" ref={appRootRef}>
        <div
          className="app-theme-flash"
          ref={themeFlashRef}
          aria-hidden="true"
        />
        <div
          className="app-cursor-glow"
          ref={cursorGlowRef}
          aria-hidden="true"
        />

        <div className="app-body">
          <div className="main-col">
            <div className="content-card">
              <div className="scroll-progress-container">
                <div className="scroll-progress-bar" ref={progressBarRef} />
              </div>

              <div className="one-page-scroller" ref={scrollRef}>
                <ScrollSection
                  className="scroll-section--hero"
                  id="home"
                  isVisible={visibleSections.home}
                  navId="home"
                  sectionRef={setSectionRef("home")}
                >
                  <Home
                    onCinematraphie={handleOpenCinematraphie}
                    onNavigate={handleNavigate}
                  />
                </ScrollSection>

                <ScrollSection
                  id="about"
                  isVisible={visibleSections.about}
                  navId="home"
                  sectionRef={setSectionRef("about")}
                >
                  <AboutSection />
                </ScrollSection>

                <ScrollSection
                  id="projects"
                  isVisible={visibleSections.projects}
                  navId="projects"
                  sectionRef={setSectionRef("projects")}
                >
                  <Projects />
                </ScrollSection>

                <ScrollSection
                  id="experience"
                  isVisible={visibleSections.experience}
                  navId="experience"
                  sectionRef={setSectionRef("experience")}
                >
                  <Experience />
                </ScrollSection>

                <ScrollSection
                  id="certifications"
                  isVisible={visibleSections.certifications}
                  navId="certifications"
                  sectionRef={setSectionRef("certifications")}
                >
                  <Certifications />
                </ScrollSection>

                <ScrollSection
                  id="writings"
                  isVisible={visibleSections.writings}
                  navId="writings"
                  sectionRef={setSectionRef("writings")}
                >
                  <Writings />
                </ScrollSection>

                <ScrollSection
                  className="scroll-section--contact"
                  id="contact"
                  isVisible={visibleSections.contact}
                  navId="writings"
                  sectionRef={setSectionRef("contact")}
                >
                  <ContactSection onCinematraphie={handleOpenCinematraphie} />
                </ScrollSection>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCinematraphie ? (
        <Suspense fallback={null}>
          <Cinematraphie onBack={handleCloseCinematraphie} />
        </Suspense>
      ) : null}
    </>
  );
}

export default App;
