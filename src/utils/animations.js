import gsap from "gsap";

export const BASE_REVEAL = Object.freeze({
  opacity: 0,
  y: 16,
  duration: 0.55,
  stagger: 0.08,
  ease: "power3.out",
  clearProps: "all",
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
      duration: 0.42,
      ease: "power3.out",
      clearProps: "all",
      ...options,
    },
  );
}

export function floatLoop(target, options = {}) {
  if (!target) return null;

  return gsap.to(target, {
    y: -4,
    duration: 2.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
    ...options,
  });
}
