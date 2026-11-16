// Swaps a full-screen case study preview for the real case study page inside
// a View Transition, so the browser crossfades the two instead of cutting.
//
// The router commits navigations in a React transition (asynchronously), so
// the page itself signals when it has rendered and restored the reader's
// scroll position by calling `finishPageHandoff()` from a layout effect. A
// timeout keeps the transition from hanging if that never happens.

let resolvePending = null;

// Previews only open at Tailwind's `sm` breakpoint and up; on a phone-sized
// screen a card goes straight to the case study page.
export function previewsEnabled() {
  return window.matchMedia("(min-width: 640px)").matches;
}

export function startPageHandoff(update) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion) {
    update();
    return;
  }

  const root = document.documentElement;
  root.classList.add("page-handoff");
  const transition = document.startViewTransition(
    () =>
      new Promise((resolve) => {
        resolvePending = resolve;
        window.setTimeout(resolve, 1000);
        update();
      }),
  );
  transition.finished.finally(() => {
    root.classList.remove("page-handoff");
    resolvePending = null;
  });
}

export function finishPageHandoff() {
  resolvePending?.();
  resolvePending = null;
}
