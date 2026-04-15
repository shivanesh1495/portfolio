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
  { label: "CSS3", type: "text" },
  { label: "JS", type: "badge" },
  { label: "TS", type: "badge" },
  { label: "Node.js", type: "text" },
  {
    label: "express",
    type: "text",
    style: { fontStyle: "italic", fontWeight: 400 },
  },
  { label: "◆", type: "text", title: "MongoDB" },
  { label: "🐘", type: "text", title: "PostgreSQL" },
  { label: "→GO", type: "text", style: { fontStyle: "italic" } },
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
            className="ticker-item"
            title={item.title || item.label}
            style={item.style}
          >
            {item.type === "badge" ? (
              <span className="ticker-badge">{item.label}</span>
            ) : (
              item.label
            )}
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
