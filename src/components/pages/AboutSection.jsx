import React, { memo, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useGitHubProfile } from "../../hooks/useGitHub";
import { fetchGitHubBio } from "../../services/github";
import { useInView } from "../../hooks/useInView";

const FALLBACK_BIO_PARAGRAPHS = [
  "Full-stack developer with a bias for clean code and a passion for building tools that solve real problems. Currently exploring systems programming with Go while shipping web apps that actually matter.",
  "I believe in shipping fast and iterating faster, turning complex problems into elegant, minimal solutions. Always at the intersection of backend engineering and thoughtful design.",
];

function AboutSection() {
  const sectionRef = useRef(null);
  const { isInView, targetRef } = useInView();
  const { profile } = useGitHubProfile(isInView);
  const [bioParagraphs, setBioParagraphs] = useState(FALLBACK_BIO_PARAGRAPHS);
  const yearsExp = profile?.yearsExperience || 3;
  const repositories = profile?.public_repos || 15;
  const joinedYear = profile?.created_at
    ? new Date(profile.created_at).getFullYear()
    : 2023;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const copyParallax = useSpring(
    useTransform(scrollYProgress, [0, 1], [24, -24]),
    {
      stiffness: 110,
      damping: 20,
      mass: 0.26,
    },
  );

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    let cancelled = false;

    async function loadBio() {
      try {
        const bioText = await fetchGitHubBio();
        const parsedParagraphs = bioText
          .split(/\r?\n\s*\r?\n/g)
          .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
          .filter(Boolean);

        if (!cancelled && parsedParagraphs.length > 0) {
          setBioParagraphs(parsedParagraphs);
        }
      } catch {
        // Keep fallback copy when remote fetch fails.
      }
    }

    loadBio();

    return () => {
      cancelled = true;
    };
  }, [isInView]);

  return (
    <div
      className="scene scene--about"
      ref={(node) => {
        sectionRef.current = node;
        targetRef.current = node;
      }}
    >
      <div className="scene__rail" aria-hidden="true">
        <span className="scene__index">01</span>
        <span className="scene__line" />
      </div>

      <div className="scene__body scene__body--about">
        <motion.div className="scene__lead" style={{ y: copyParallax }}>
          <motion.header
            className="scene__intro"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="section-title-serif">About</h2>
          </motion.header>

          <div className="section-copy section-copy--spacious about-copy">
            {bioParagraphs.map((paragraph, index) => (
              <motion.p
                key={`about-bio-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.26 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <motion.div
            className="about-metrics"
            role="list"
            aria-label="About metrics"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="about-metric"
              role="listitem"
              whileHover={{ y: -2 }}
            >
              <span>Experience</span>
              <strong>{yearsExp}+</strong>
              <small>Years</small>
            </motion.div>
            <motion.div
              className="about-metric"
              role="listitem"
              whileHover={{ y: -2 }}
            >
              <span>Repositories</span>
              <strong>{repositories}+</strong>
              <small>Shipped work</small>
            </motion.div>
            <motion.div
              className="about-metric"
              role="listitem"
              whileHover={{ y: -2 }}
            >
              <span>Focused Since</span>
              <strong>{joinedYear}</strong>
              <small>Building systems</small>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default memo(AboutSection);
