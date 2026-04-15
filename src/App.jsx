import {
  lazy,
  memo,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import Sidebar from "./components/Sidebar";
import Navigation from "./components/Navigation";
import { revealIn } from "./utils/animations";

const Home = lazy(() => import("./components/pages/Home"));
const Projects = lazy(() => import("./components/pages/Projects"));
const Experience = lazy(() => import("./components/pages/Experience"));
const Certifications = lazy(() => import("./components/pages/Tools"));
const Writings = lazy(() => import("./components/pages/Writings"));
const Cinematraphie = lazy(() => import("./components/pages/Cinematraphie"));
const MemoSidebar = memo(Sidebar);

const TICKER_ITEMS = [
  {
    label: "C++",
    title: "C++",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  {
    label: "Python",
    title: "Python",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    label: "Java",
    title: "Java",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },
  {
    label: "C",
    title: "C",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  },
  {
    label: "Dart",
    title: "Dart",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg",
  },
  {
    label: "Haskell",
    title: "Haskell",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg",
  },
  {
    label: "HTML5",
    title: "HTML5",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  {
    label: "CSS3",
    title: "CSS3",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  {
    label: "JavaScript",
    title: "JavaScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  {
    label: "React",
    title: "React",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    label: "Next.js",
    title: "Next.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  {
    label: "Node.js",
    title: "Node.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    label: "Remix",
    title: "Remix",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/remix.svg",
  },
  {
    label: "Three.js",
    title: "Three.js",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/threedotjs.svg",
  },
  {
    label: "MongoDB",
    title: "MongoDB",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  {
    label: "MySQL",
    title: "MySQL",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  {
    label: "Flutter",
    title: "Flutter",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
  },
  {
    label: "Git",
    title: "Git",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  {
    label: "Linux",
    title: "Linux",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  {
    label: "Arduino",
    title: "Arduino",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg",
  },
  {
    label: "VS Code",
    title: "Visual Studio Code",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
  {
    label: "Eclipse",
    title: "Eclipse",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg",
  },
  {
    label: "Postman",
    title: "Postman",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },
  {
    label: "Figma",
    title: "Figma",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  {
    label: "Android Studio",
    title: "Android Studio",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg",
  },
  {
    label: "Firebase",
    title: "Firebase",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  {
    label: "MATLAB",
    title: "MATLAB",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
  },
  {
    label: "Shopify",
    title: "Shopify",
    src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shopify.svg",
  },
];

const PageFallback = memo(function PageFallback() {
  return (
    <div className="empty-state">
      <p>Loading...</p>
    </div>
  );
});

const BottomTicker = memo(function BottomTicker() {
  return (
    <div className="bottom-ticker">
      <div className="ticker-track">
        <div className="ticker-group">
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={`ticker-a-${i}`}
              className="ticker-item"
              title={item.title || item.label}
              style={item.style}
            >
              <img
                className="skill-icon"
                src={item.src}
                alt={item.title || item.label}
                loading="lazy"
                draggable="false"
              />
            </span>
          ))}
        </div>
        <div className="ticker-group" aria-hidden="true">
          {TICKER_ITEMS.map((item, i) => (
            <span
              key={`ticker-b-${i}`}
              className="ticker-item"
              title={item.title || item.label}
              style={item.style}
            >
              <img
                className="skill-icon"
                src={item.src}
                alt=""
                loading="lazy"
                draggable="false"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

gsap.registerPlugin(useGSAP);

function PageTransition({ children, activeTab }) {
  const container = useRef();

  useGSAP(
    () => {
      gsap.fromTo(
        container.current,
        { opacity: 0, y: 18, scale: 0.995 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.52,
          ease: "power3.out",
          clearProps: "all",
        },
      );

      const scopedTargets = container.current?.querySelectorAll(
        ".page-header, .home-heading",
      );

      if (scopedTargets && scopedTargets.length > 0) {
        revealIn(scopedTargets, {
          y: 12,
          duration: 0.45,
          stagger: 0.04,
        });
      }
    },
    { scope: container, dependencies: [activeTab] },
  );

  return (
    <div
      ref={container}
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const appRootRef = useRef();
  const themeFlashRef = useRef();
  const scrollRef = useRef();
  const progressBarRef = useRef();
  const lenisRef = useRef(null);
  const rafRef = useRef(0);
  const hasMountedThemeRef = useRef(false);

  /* ── Cinematraphie overlay state & transition handlers ── */
  const [showCinematraphie, setShowCinematraphie] = useState(false);

  const handleOpenCinematraphie = useCallback(() => {
    setShowCinematraphie(true); // Mount immediately
    gsap.to(appRootRef.current, {
      filter: "blur(15px)",
      scale: 0.98,
      opacity: 0.5, // Keep semi-opaque to show the blur clearly
      duration: 2.5,
      ease: "power2.inOut",
    });
  }, []);

  const handleCloseCinematraphie = useCallback(() => {
    setShowCinematraphie(false);
    gsap.to(appRootRef.current, {
      filter: "blur(0px)",
      scale: 1,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "filter,transform,opacity",
    });
  }, []);

  useGSAP(
    () => {
      revealIn(".sidebar-col, .main-col", {
        y: 14,
        stagger: 0.08,
        duration: 0.56,
      });

      gsap.fromTo(
        ".bottom-ticker",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          delay: 0.18,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "all",
        },
      );
    },
    { scope: appRootRef },
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
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
        ".nav-bar, .sidebar-card, .content-card, .bottom-ticker, .theme-switch",
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
          duration: 0.2,
        },
        0,
      );

      timeline.fromTo(
        targets,
        {
          y: 8,
          scale: 0.995,
        },
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
  }, [isDark]);

  // Initialize Lenis once; avoid rebuilding RAF loop on every tab change.
  useEffect(() => {
    if (!scrollRef.current || lenisRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.children[1],
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    const onScroll = ({ progress }) => {
      if (progressBarRef.current) {
        // set is cheaper than creating a tween on every scroll event
        gsap.set(progressBarRef.current, { scaleX: progress });
      }
    };
    lenis.on("scroll", onScroll);

    const raf = (time) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, { scaleX: 0 });
    }
  }, [activeTab]);

  const currentPage = useMemo(() => {
    switch (activeTab) {
      case "home":
        return <Home key="home" />;
      case "projects":
        return <Projects key="projects" />;
      case "experience":
        return <Experience key="experience" />;
      case "certifications":
        return <Certifications key="certifications" />;
      case "writings":
        return <Writings key="writings" />;
      default:
        return <Home key="home" />;
    }
  }, [activeTab]);

  return (
    <>
    <div className="app-root" ref={appRootRef}>
      <div className="app-theme-flash" ref={themeFlashRef} aria-hidden="true" />
      <div className="app-body">
        {/* LEFT: Sidebar */}
        <div className="sidebar-col">
          <MemoSidebar onCinematraphie={handleOpenCinematraphie} />
        </div>

        {/* RIGHT: Nav + Content */}
        <div className="main-col">
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLight={isDark}
            setIsLight={setIsDark}
          />
          <div
            className="content-card"
            ref={scrollRef}
            style={{ overflowY: "auto", position: "relative" }}
          >
            <div className="scroll-progress-container">
              <div className="scroll-progress-bar" ref={progressBarRef} />
            </div>
            <div className="lenis-content-wrapper">
              <PageTransition activeTab={activeTab}>
                <Suspense fallback={<PageFallback />}>{currentPage}</Suspense>
              </PageTransition>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: Scrolling Tech Ticker */}
      <BottomTicker />
    </div>

    {showCinematraphie && (
      <Suspense fallback={null}>
        <Cinematraphie onBack={handleCloseCinematraphie} />
      </Suspense>
    )}
    </>
  );
}

export default App;
