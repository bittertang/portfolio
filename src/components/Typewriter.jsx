import { useEffect, useState } from "react";

// Types `text` out one character at a time with a blinking caret at the end.
// The full text is rendered invisibly underneath so the layout doesn't shift
// as it fills in. Skips straight to the full text for prefers-reduced-motion.
export default function Typewriter({ text, speed = 45, as: Tag = "span", className = "" }) {
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? text.length
      : 0,
  );

  useEffect(() => {
    if (count >= text.length) return;
    const id = setTimeout(() => setCount(count + 1), speed);
    return () => clearTimeout(id);
  }, [count, text, speed]);

  return (
    <Tag aria-label={text} className={`relative inline-block ${className}`}>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {text.slice(0, count)}
        <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-caret bg-gray-900" />
      </span>
    </Tag>
  );
}
