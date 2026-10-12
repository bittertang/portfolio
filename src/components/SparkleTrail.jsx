import { useEffect, useRef } from "react";

const DEFAULT_CHARS = ["⊹", "₊", " ", "⁺", "‧", "₊", "˚", "✴"];
const DEFAULT_COLORS = ["text-gray-300", "text-gray-400", "text-gray-500"];

// Spawns small glyphs that trail the cursor as it moves across the parent
// section, each playing a one-shot scale/rotate/fade animation before
// removing itself. Must be rendered as a direct child of a `position:
// relative` (or similarly positioned) section — it listens for `mousemove`
// on that parent and overlays its own spawned spans on top of it.
export default function SparkleTrail({
  chars = DEFAULT_CHARS,
  colors = DEFAULT_COLORS,
  gridSize = 24,
  minSize = 13,
  maxSize = 26,
  duration = 900,
}) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const section = overlay?.parentElement;
    if (!overlay || !section) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    let lastCell = null;

    const onMouseMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Throttles spawning to once per grid cell crossed, rather than once
      // per pixel of mouse movement — the spawn itself still lands at the
      // raw cursor position, only the "should we spawn?" check is snapped.
      const cellKey = `${Math.round(x / gridSize)},${Math.round(y / gridSize)}`;
      if (cellKey === lastCell) return;
      lastCell = cellKey;

      const span = document.createElement("span");
      span.textContent = chars[Math.floor(Math.random() * chars.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = minSize + Math.random() * (maxSize - minSize);
      span.className = `font-heading pointer-events-none absolute select-none ${color}`;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.fontSize = `${size}px`;
      span.style.animation = `sparkle-trail ${duration}ms ease-out forwards`;

      const remove = () => span.remove();
      span.addEventListener("animationend", remove);
      // Fallback in case the animation never fires its end event.
      setTimeout(remove, duration + 100);

      overlay.appendChild(span);
    };

    section.addEventListener("mousemove", onMouseMove);
    return () => {
      section.removeEventListener("mousemove", onMouseMove);
      overlay.replaceChildren();
    };
  }, [chars, colors, gridSize, minSize, maxSize, duration]);

  return <div ref={overlayRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" />;
}
