import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Home from "./components/pages/Home";
import AboutSection from "./components/pages/AboutSection";
import Projects from "./components/pages/Projects";
import Experience from "./components/pages/Experience";
import Certifications from "./components/pages/Certifications";
import Writings from "./components/pages/Writings";
import StackSection from "./components/pages/StackSection";
import ContactSection from "./components/pages/ContactSection";

const Cinematraphie = lazy(() => import("./components/pages/Cinematraphie"));

function App() {
  const [showCinematraphie, setShowCinematraphie] = useState(false);

  const handleOpenCinematraphie = useCallback(() => {
    setShowCinematraphie(true);
  }, []);

  const handleCloseCinematraphie = useCallback(() => {
    setShowCinematraphie(false);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (showCinematraphie) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showCinematraphie]);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll(".page-section:not(.page-section--hero)"),
    );

    if (sections.length === 0) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) {
      sections.forEach((section) => {
        section.classList.add("page-section--visible");
      });
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("page-section--visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.16,
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        className={`app-shell${showCinematraphie ? " app-shell--blurred" : ""}`}
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
            <Home />
          </section>

          <section className="page-section" id="about">
            <AboutSection />
          </section>

          <section className="page-section" id="projects">
            <Projects />
          </section>

          <section className="page-section" id="experience">
            <Experience />
          </section>

          <section className="page-section" id="certifications">
            <Certifications />
          </section>

          <section className="page-section" id="writings">
            <Writings />
          </section>

          <section className="page-section" id="stack">
            <StackSection />
          </section>

          <section className="page-section" id="contact">
            <ContactSection onCinematraphie={handleOpenCinematraphie} />
          </section>
        </main>
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
