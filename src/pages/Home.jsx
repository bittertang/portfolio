import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { profile } from "../data/profile";
import CursorTrail from "../components/CursorTrail";
import Footer from "../components/Footer";
import flower from "../assets/home/flower.webp";
import plant from "../assets/home/plant.webp";
import leaves from "../assets/home/leaves.webp";
import { INTRO_HOLD_MS, intro, prefersReducedMotion } from "../lib/intro";

const SECTION_LINKS = [
  { label: "Works", to: "/" },
  { label: "Garden", to: "/playground" },
  { label: "About", to: "/about" },
];

// Hovering the dotted illustrations lights each dot up with a warm glow.
const GLOW =
  "transition-[filter] duration-500 ease-out [filter:contrast(1)_drop-shadow(0_0_0_rgba(255,196,80,0))_drop-shadow(0_0_0_rgba(255,170,60,0))] hover:[filter:contrast(1.5)_drop-shadow(0_0_2px_rgba(255,196,80,1))_drop-shadow(0_0_7px_rgba(255,170,60,0.9))]";

// Looks like the tabs, but instead of going anywhere it copies the email
// address to the clipboard and briefly says so.
function CopyEmailTab() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    const email = profile.contact.email;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API unavailable (e.g. insecure context): fall back to a
      // hidden textarea and the legacy copy command.
      const field = document.createElement("textarea");
      field.value = email;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      document.body.removeChild(field);
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={profile.contact.email}
      className="font-heading -mb-px border-b-2 border-transparent pb-3 text-xs uppercase tracking-widest text-gray-500 transition-colors hover:text-gray-900"
    >
      <span aria-live="polite">{copied ? "Copied!" : "Email"}</span>
    </button>
  );
}

// The landing shell: the intro and tab bar stay put while the routed content
// underneath (works, garden, about) swaps in through <Outlet />.
export default function Home() {
  const [playIntro] = useState(() => !intro.played && !prefersReducedMotion());
  const [settled, setSettled] = useState(!playIntro);
  const [naturalHeight, setNaturalHeight] = useState(null);
  const sectionRef = useRef(null);

  // Track the intro's normal height, so it has something to shrink down to.
  useEffect(() => {
    const el = sectionRef.current;
    const observer = new ResizeObserver(() => setNaturalHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hold the full-screen intro (page locked in place), then let it slide up.
  useEffect(() => {
    intro.played = true;
    if (!playIntro) return;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      document.body.style.overflow = "";
      setSettled(true);
    }, INTRO_HOLD_MS);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [playIntro]);

  return (
    <div>
      <CursorTrail />
      <div
        className="relative flex flex-col justify-center overflow-hidden transition-[height] duration-[1100ms] ease-[cubic-bezier(0.7,0,0.2,1)]"
        style={{ height: settled ? (naturalHeight ?? undefined) : "100vh" }}
      >
        <img
          src={leaves}
          alt=""
          className={`motion-safe:animate-bloom absolute left-0 top-0 h-auto w-72 origin-top-left sm:w-[28rem] ${GLOW}`}
        />

        <section
          ref={sectionRef}
          className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-40 sm:flex-row sm:items-center sm:pt-44 lg:px-6 lg:pt-44"
        >
          <div>
            <h1 className="motion-safe:animate-rise mb-3 font-serif text-6xl font-semibold leading-none sm:text-8xl">Ivy Tang</h1>
            <p className="font-heading mt-6 text-xs uppercase tracking-wide text-gray-500">{profile.education}</p>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">{profile.pitch}</p>
          </div>

          <img
            src={flower}
            alt=""
            className={`motion-safe:animate-bloom w-full max-w-sm shrink-0 self-start sm:ml-auto sm:w-[26rem] sm:max-w-none sm:self-center ${GLOW}`}
          />
        </section>
      </div>

      <nav aria-label="Sections" className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl gap-8 px-4 pt-3 lg:px-6">
          {SECTION_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `font-heading -mb-px border-b-2 pb-3 text-xs uppercase tracking-widest transition-colors ${
                  isActive
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <CopyEmailTab />
        </div>
      </nav>

      <Outlet context={{ playIntro }} />

      <Footer
        image={<img src={plant} alt="" className={`h-auto w-72 max-w-full shrink-0 sm:w-[22rem] ${GLOW}`} />}
      />
    </div>
  );
}
