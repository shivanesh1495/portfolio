import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useGitHubProfile } from "../../hooks/useGitHub";

function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

const Stat = ({ value, label, showPlus = true }) => {
  const count = useCountUp(value);
  return (
    <div className="stat-block">
      <span className="stat-value">
        {showPlus ? "+" : ""}
        {count}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
};

export default function Home() {
  const { profile } = useGitHubProfile();

  // Default values while loading
  const yearsExp = profile?.yearsExperience || 3;
  const projects = profile?.public_repos || 46;

  const container = useRef();

  useGSAP(
    () => {
      gsap.from(".home-heading span, .stat-card", {
        opacity: 0,
        y: 15,
        stagger: 0.08,
        duration: 0.5,
        ease: "power3.out",
        clearProps: "all",
      });
    },
    { scope: container },
  );

  return (
    <div className="home-page" ref={container}>
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="home-heading">
            <span className="heading-line solid">FULL STACK</span>
            <span className="heading-line solid">& CLOUD </span>
            <span className="heading-line ghost">ENGINEER</span>
          </h1>
        </div>
      </div>

      <div className="home-stats-grid">
        <div className="stat-card">
          <div className="stat-number">{yearsExp}</div>
          <div className="stat-text">
            Years Into
            <br />
            Coding Journey
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-number">+{projects}</div>
          <div className="stat-text">
            Projects
            <br />
            Completed
          </div>
        </div>
      </div>
    </div>
  );
}
