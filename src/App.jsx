import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';

import Home from './components/pages/Home';
import Projects from './components/pages/Projects';
import Experience from './components/pages/Experience';
import Tools from './components/pages/Tools';
import Writings from './components/pages/Writings';

const TICKER_ITEMS = [
  { label: 'CSS3', type: 'text' },
  { label: 'JS',   type: 'badge' },
  { label: 'TS',   type: 'badge' },
  { label: 'Node.js', type: 'text' },
  { label: 'express', type: 'text', style: { fontStyle: 'italic', fontWeight: 400 } },
  { label: '◆',    type: 'text', title: 'MongoDB' },
  { label: '🐘',   type: 'text', title: 'PostgreSQL' },
  { label: '→GO',  type: 'text', style: { fontStyle: 'italic' } },
];

function BottomTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop
  return (
    <div className="bottom-ticker">
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="ticker-item" title={item.title || item.label} style={item.style}>
            {item.type === 'badge'
              ? <span className="ticker-badge">{item.label}</span>
              : item.label}
          </span>
        ))}
      </div>
    </div>
  );
}


gsap.registerPlugin(useGSAP);

function PageTransition({ children, activeTab }) {
  const container = useRef();
  
  useGSAP(() => {
    gsap.from(container.current, {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }, { dependencies: [activeTab] });

  return (
    <div ref={container} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {children}
    </div>
  );
}

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(true);
  const scrollRef = useRef();
  const progressBarRef = useRef();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Integrated Lenis smooth scrolling
  useGSAP(() => {
    if (!scrollRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: scrollRef.current.children[1], // Targeting .lenis-content-wrapper
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', ({ progress }) => {
      if (progressBarRef.current) {
        gsap.to(progressBarRef.current, {
          scaleX: progress,
          duration: 0.1,
          ease: 'none',
        });
      }
    });

    // Reset scroll on tab change
    lenis.scrollTo(0, { immediate: true });

    return () => {
      lenis.destroy();
    };
  }, { dependencies: [activeTab] });

  const renderPage = () => {
    switch (activeTab) {
      case 'home':       return <Home key="home" />;
      case 'projects':   return <Projects key="projects" />;
      case 'experience': return <Experience key="experience" />;
      case 'tools':      return <Tools key="tools" />;
      case 'writings':   return <Writings key="writings" />;
      default:           return <Home key="home" />;
    }
  };

  return (
    <div className="app-root">
      <div className="app-body">
        {/* LEFT: Sidebar */}
        <div className="sidebar-col">
          <Sidebar />
        </div>

        {/* RIGHT: Nav + Content */}
        <div className="main-col">
          <Navigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLight={isDark}
            setIsLight={setIsDark}
          />
          <div className="content-card" ref={scrollRef} style={{ overflowY: 'auto', position: 'relative' }}>
            <div className="scroll-progress-container">
              <div className="scroll-progress-bar" ref={progressBarRef} />
            </div>
            <div className="lenis-content-wrapper">
              <PageTransition activeTab={activeTab}>
                {renderPage()}
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

