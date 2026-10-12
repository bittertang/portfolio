// Reveals `text` one letter at a time on mount — each letter rises and fades
// in, staggered via animation-delay. A plain, fully-visible copy underneath
// keeps it readable (and the layout stable) for reduced-motion and non-JS
// contexts; `motion-safe:` on the letters skips the stagger entirely when
// the visitor prefers reduced motion.
export default function LetterReveal({ text, as: Tag = "span", className = "", stagger = 35, delay = 0 }) {
  const words = text.split(" ");
  let letterCount = 0;

  return (
    <Tag aria-label={text} className={`relative block ${className}`}>
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {words.map((word, wi) => (
          <span key={wi}>
            {/* Each word is its own nowrap unit — letters inside it are split
                into spans for the animation, but can't be separated across a
                line break. The plain space after it (outside the nowrap
                span) is a normal, valid place to wrap. */}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, ci) => {
                const i = letterCount;
                letterCount += 1;
                return (
                  <span
                    key={ci}
                    className="motion-safe:animate-letter-rise inline-block"
                    style={{ animationDelay: `${delay + i * stagger}ms` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 ? " " : ""}
          </span>
        ))}
      </span>
    </Tag>
  );
}
