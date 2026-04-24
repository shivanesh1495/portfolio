import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function HeroSignatureIntro({ onRevealComplete, targetRef }) {
  const overlayRef = useRef(null);
  const signatureRef = useRef(null);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    const target = targetRef?.current;

    if (!target) {
      return undefined;
    }

    const updateBounds = () => {
      const nextBounds = target.getBoundingClientRect();

      setBounds({
        top: nextBounds.top,
        left: nextBounds.left,
        width: nextBounds.width,
        height: nextBounds.height,
      });
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(updateBounds);
    resizeObserver.observe(target);
    window.addEventListener("resize", updateBounds, { passive: true });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateBounds);
    };
  }, [targetRef]);

  useGSAP(
    () => {
      if (!bounds) {
        return undefined;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(signatureRef.current, { clipPath: "inset(0 0% 0 0)" });
        onRevealComplete?.();
        return undefined;
      }

      const tl = gsap.timeline({
        onComplete: () => onRevealComplete?.(),
      });

      gsap.set(signatureRef.current, { clipPath: "inset(0 100% 0 0)" });

      tl.to(
        signatureRef.current,
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.5,
          ease: "expo.out",
        },
        0.9,
      );

      return () => tl.kill();
    },
    { dependencies: [bounds], scope: overlayRef },
  );

  return (
    <div className="hero-intro" ref={overlayRef} aria-hidden="true">
      <div
        className="hero-intro__signature-wrap"
        style={
          bounds
            ? {
                top: `${bounds.top}px`,
                left: `${bounds.left}px`,
                width: `${bounds.width}px`,
                height: `${bounds.height}px`,
              }
            : undefined
        }
      >
        <img
          src="/shivanesh.svg"
          alt=""
          className="hero-intro__signature"
          ref={signatureRef}
          draggable="false"
        />
      </div>
    </div>
  );
}
