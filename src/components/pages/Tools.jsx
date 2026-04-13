import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import {
  FramerSVG,
  FigmaSVG,
  LemonSVG,
  ChatGPTSVG,
  NotionSVG,
  NextSVG
} from '../icons/BrandIcons';

const TOOLS = [
  { name: 'Framer',        category: 'Website Builder',    Icon: FramerSVG },
  { name: 'Figma',         category: 'Design Tool',         Icon: FigmaSVG  },
  { name: 'Lemon Squeezy', category: 'Payments Provider',   Icon: LemonSVG  },
  { name: 'ChatGPT',       category: 'AI Assistant',        Icon: ChatGPTSVG },
  { name: 'Notion',        category: 'Productivity Tool',   Icon: NotionSVG },
  { name: 'Nextjs',        category: 'React framework',     Icon: NextSVG   },
];

export default function Tools() {
  const container = useRef();
  
  useGSAP(() => {
    gsap.from('.tool-card', {
      opacity: 0,
      scale: 0.95,
      y: 15,
      duration: 0.4,
      stagger: 0.08,
      ease: 'back.out(1.2)',
      clearProps: 'all'
    });
  }, { scope: container });

  return (
    <div className="tools-page" ref={container}>
      <h1 className="tools-hero-heading">
        <span className="solid">PREMIUM</span>
        <span className="ghost">TOOLS</span>
      </h1>

      <div className="tools-grid">
        {TOOLS.map((tool, i) => (
          <div className="tool-card" key={i}>
            <div className="tool-icon-wrap">
              <tool.Icon />
            </div>
            <div className="tool-text">
              <span className="tool-name">{tool.name}</span>
              <span className="tool-category">{tool.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
