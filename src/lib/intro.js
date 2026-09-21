// The home page opens on a full-screen intro (the name and illustrations),
// which holds for a moment and then slides up to reveal the tabs and work.
export const INTRO_HOLD_MS = 1000;

// Only plays once per page load, and not when the visit began on a case study.
export const intro = {
  played: typeof window !== "undefined" && window.location.pathname.startsWith("/work/"),
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
