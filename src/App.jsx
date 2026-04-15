import {
  lazy,
  memo,
  Suspense,
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

const Home = lazy(() => import("./components/pages/Home"));
const Projects = lazy(() => import("./components/pages/Projects"));
const Experience = lazy(() => import("./components/pages/Experience"));
const Certifications = lazy(() => import("./components/pages/Tools"));
const Writings = lazy(() => import("./components/pages/Writings"));
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
const DUPLICATED_TICKER_ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

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
        {DUPLICATED_TICKER_ITEMS.map((item, i) => (
          <span
            key={i}
            className="ticker-item icon-card"
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
    </div>
  );
});

gsap.registerPlugin(useGSAP);

function PageTransition({ children, activeTab }) {
  const container = useRef();

  useGSAP(
    () => {
      gsap.from(container.current, {
        opacity: 0,
        y: 15,
        duration: 0.5,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { dependencies: [activeTab] },
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
  const scrollRef = useRef();
  const progressBarRef = useRef();
  const lenisRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
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
    <div className="app-root">
      <div className="app-body">
        {/* LEFT: Sidebar */}
        <div className="sidebar-col">
          <MemoSidebar />
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
  );
}

export default App;
