import { useEffect, useState } from "react";

// Tracks which of the given section ids is currently most visible, for
// highlighting the matching item in a sticky sidebar nav as the user scrolls.
//
// `containerRef`, when given, is the actual scrolling element to both search
// within and listen for scroll events on — needed when this nav lives inside
// a modal with its own scrollable area, where ids can collide with an
// identical case study rendered behind it on the page.
export function useActiveSection(ids, containerRef) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const container = containerRef?.current;
    const elements = ids
      .map((id) => (container ? container.querySelector(`#${CSS.escape(id)}`) : document.getElementById(id)))
      .filter(Boolean);
    if (elements.length === 0) return undefined;

    // A thin-band IntersectionObserver can skip over short sections entirely
    // during a fast scroll (the section's whole height passes through the
    // band between two rendered frames, so it never registers as
    // intersecting). Checking each element's position directly against a
    // reference line on every scroll frame can't skip anything, since it
    // always reflects the current, exact layout — regardless of how far or
    // fast the page just scrolled.
    const REFERENCE_RATIO = 0.15;
    let ticking = false;

    const update = () => {
      ticking = false;
      const referenceY = window.innerHeight * REFERENCE_RATIO;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= referenceY) {
          current = el.id;
        }
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    const scrollTarget = container || window;
    update();
    scrollTarget.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scrollTarget.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, containerRef]);

  return activeId;
}
