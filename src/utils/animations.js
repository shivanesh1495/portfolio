import gsap from "gsap";

export const BASE_REVEAL = Object.freeze({
  opacity: 0,
  y: 12,
  duration: 0.29,
  stagger: 0.02,
  ease: "power2.out",
  force3D: true,
  overwrite: "auto",
  clearProps: "transform,opacity",
});

export function revealIn(targets, options = {}) {
  return gsap.from(targets, {
    ...BASE_REVEAL,
    ...options,
  });
}

export function pulseActive(target, options = {}) {
  if (!target) return null;

  return gsap.fromTo(
    target,
    { scale: 0.94, opacity: 0.78 },
    {
      scale: 1,
      opacity: 1,
      duration: 0.24,
      ease: "power2.out",
      force3D: true,
      overwrite: "auto",
      clearProps: "transform,opacity",
      ...options,
    },
  );
}

export function floatLoop(target, options = {}) {
  if (!target) return null;

  return gsap.to(target, {
    y: -2,
    duration: 4.2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    force3D: true,
    ...options,
  });
}
