import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight } from 'lucide-react';

const EXPERIENCE = [
  {
    company: 'PixelForge Studios',
    role: 'Lead Product Engineer',
    period: 'Jan 2020 – Present',
    desc: 'Led the design team in creating user-centric mobile and web applications, improving the user experience and increasing user engagement.',
  },
  {
    company: 'BlueWave Innovators',
    role: 'Senior Full Stack Developer',
    period: 'Mar 2017 – Dec 2019',
    desc: 'Developed and implemented design strategies for new product lines, collaborated closely with engineers and product managers.',
  },
  {
    company: 'NexGen Systems',
    role: 'Software Engineer',
    period: 'Jun 2014 – Feb 2017',
    desc: 'Built scalable backend APIs and cross-platform mobile features using React Native and Node.js.',
  },
];

export default function Experience() {
  const container = useRef();
  
  useGSAP(() => {
    gsap.from('.exp-card', {
      opacity: 0,
      y: 15,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }, { scope: container });

  return (
    <div className="experience-page" ref={container}>
      <h1 className="exp-hero-heading">
        <span className="solid">1 YEAR OF</span>
        <span className="ghost">EXPERIENCE</span>
      </h1>

      <div className="exp-list">
        {EXPERIENCE.map((exp, i) => (
          <div className="exp-card" key={i}>
            <div className="exp-card-top">
              <div>
                <p className="exp-company-name">{exp.company}</p>
                <span className="exp-role-title">{exp.role}</span>
              </div>
              <ArrowUpRight size={20} className="exp-arrow-icon" />
            </div>
            <p className="exp-description">{exp.desc}</p>
            <span className="exp-period">{exp.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
