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

  return (
    <>
      <div className={`app-shell${showCinematraphie ? " app-shell--blurred" : ""}`}>
        <main className="portfolio-main">
          <section className="page-section page-section--hero" id="home">
            <Home onCinematraphie={handleOpenCinematraphie} />
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
            <ContactSection />
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
