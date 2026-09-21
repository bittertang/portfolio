import { useEffect, useState } from "react";
import headshot from "../assets/about/headshot.webp";
import arlo from "../assets/about/arlo.webp";

const TITLE = "Problem solver, games enthusiast, & arts and crafts dabbler";

// Types the text out one character at a time. The full text is rendered
// invisibly underneath so the layout doesn't shift as it fills in.
function Typewriter({ text, speed = 45 }) {
  const [count, setCount] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? text.length : 0,
  );

  useEffect(() => {
    if (count >= text.length) return;
    const id = setTimeout(() => setCount(count + 1), speed);
    return () => clearTimeout(id);
  }, [count, text, speed]);

  return (
    <h1 aria-label={text} className="relative font-serif text-3xl font-semibold text-gray-900">
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {text.slice(0, count)}
        <span className="ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] animate-caret bg-gray-900" />
      </span>
    </h1>
  );
}

export default function About() {
  return (
    <div className="px-4 pb-10 pt-4 lg:pb-16 lg:pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-20">
        <div className="flex flex-col gap-4 sm:w-80">
          <img src={headshot} alt="Ivy" className="aspect-square w-full object-cover" />
        </div>
        <div className="flex flex-1 flex-col gap-4 text-sm leading-relaxed text-gray-700">
          <Typewriter text={TITLE} />
          <p>
            Hi, I’m Ivy, a designer based in the Bay Area! I have a background in Cognitive Science, and it’s
            something I bring with me whenever I think about how users think, behave, and interact.
          </p>
          <p>
            My favorite part about design is the process — the spark of ideas, unexpected turns, roadbumps,
            continuous iterations, all culminating in something that looks completely different from the
            starting vision.
          </p>
          <p>When I’m not dabbling on Figma, I’m…</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>redesigning my farm layout on Stardew Valley for the millionth time</li>
            <li>updating my Strava with my latest grass-touching adventure</li>
            <li>being a cat mom (to my foster{" "}
              <span
                tabIndex={0}
                className="group relative cursor-default underline decoration-dotted underline-offset-2 outline-none hover:text-black focus-visible:text-black"
              >
                Arlo
                <img
                  src={arlo}
                  alt="Arlo"
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 aspect-square w-48 max-w-none -translate-x-1/2 translate-y-2 rotate-2 scale-95 rounded-3xl object-cover opacity-0 shadow-2xl transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:scale-100 group-focus-visible:opacity-100"
                />
              </span>
              ) and plant mom (to Dottie, my{" "}
              <a
                href="https://en.wikipedia.org/wiki/Begonia_maculata"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-black"
              >
                begonia maculata
              </a>
              )</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
