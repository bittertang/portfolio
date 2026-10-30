import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { profile } from "../data/profile";
import starLogo from "../assets/home/star-logo.webp";
import leaves from "../assets/home/leaves.webp";
import plant from "../assets/about/plant-1.webp";
import flowers from "../assets/garden/flowers.webp";
import LetterReveal from "./LetterReveal";
import SparkleTrail from "./SparkleTrail";

const SECTION_LINKS = [
  { label: "works", to: "/" },
  { label: "garden", to: "/playground" },
  { label: "about", to: "/about" },
];

// On Garden and About, the identity block at the top swaps from "ivy tang" +
// role/education to a short per-tab heading + blurb instead. Works keeps the
// default (no entry here).
const TAB_INTROS = {
  "/playground": {
    heading: "garden",
    blurb: "welcome to my digital garden! dabbling in AI, fabrication, and physical design.",
    image: flowers,
    imageClass: "left-10 w-80",
  },
  "/about": {
    heading: "about",
    blurb: "a little bit about my background and current side quests.",
    image: plant,
    imageClass: "left-10 w-80",
  },
};

// Short, local date like "10/6/26" — the build-time stamp from vite.config.js.
const lastUpdated = new Date(__LAST_UPDATED__);
const LAST_UPDATED_LABEL = `${lastUpdated.getMonth() + 1}/${lastUpdated.getDate()}/${String(
  lastUpdated.getFullYear(),
).slice(2)}`;

const navLinkClass = ({ isActive }) =>
  `inline-block transform transition-all duration-150 hover:translate-x-0.5 ${
    isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
  }`;

// Click to copy the email address, with a brief "copied!" confirmation —
// otherwise looks and sits exactly like the other numbered links.
function EmailLink() {
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
      className="inline-block transform text-left text-gray-700 transition-all duration-150 hover:translate-x-0.5 hover:text-gray-900"
    >
      <span aria-live="polite">{copied ? "copied!" : "email"}</span>
    </button>
  );
}

// The persistent left column: identity, the works/garden/about nav, contact
// links, and the last-updated stamp pinned to the bottom. Stays put (sticky,
// full viewport height) while the content to its right scrolls and swaps.
export default function HomeSidebar({ className = "" }) {
  const intro = TAB_INTROS[useLocation().pathname];

  return (
    <aside className={`relative flex flex-col gap-10 bg-white px-8 py-10 ${className}`}>
      <SparkleTrail />
      {/* A fixed min-height here keeps the nav below at the same spot on
          every tab — Garden/About's heading+blurb is shorter than Works'
          full identity block, so without this the nav would creep upward. */}
      <div className="flex min-h-[168px] flex-col gap-6">
        <div className="flex items-center gap-2.5">
          <img src={starLogo} alt="" className="h-6 w-6" />
          <LetterReveal
            key={intro?.heading ?? "ivy-tang"}
            text={intro?.heading ?? "ivy tang"}
            className="whitespace-nowrap font-serif text-3xl italic font-light text-gray-900"
          />
        </div>

        {intro ? (
          <p
            className="motion-safe:animate-drop-in font-sans text-base leading-relaxed text-gray-700"
            style={{ animationDelay: "400ms" }}
          >
            {intro.blurb}
          </p>
        ) : (
          <div
            className="motion-safe:animate-drop-in font-sans text-base leading-relaxed text-gray-700"
            style={{ animationDelay: "400ms" }}
          >
            <p className="lowercase">{profile.role}</p>
            <p className="lowercase">{profile.education}</p>
          </div>
        )}

      </div>

      <nav
        aria-label="Sections"
        className="motion-safe:animate-drop-in font-heading flex flex-col gap-1.5 text-xs"
        style={{ animationDelay: "650ms" }}
      >
        <p className="text-gray-400">nav</p>
        {SECTION_LINKS.map((link, i) => (
          <div key={link.to} className="flex gap-2">
            <span className="text-gray-400">{i + 1}.</span>
            <NavLink to={link.to} end className={navLinkClass}>
              {link.label}
            </NavLink>
          </div>
        ))}
      </nav>

      {intro?.image && (
        <img
          key={intro.image}
          src={intro.image}
          alt=""
          className={`motion-safe:animate-sprout pointer-events-none absolute bottom-0 z-0 origin-bottom opacity-60 ${intro.imageClass}`}
          style={{ animationDelay: "500ms" }}
        />
      )}

      {!intro && (
        <>
          {/* Sits above the aside's white background but below the
              links/last-updated text (those get `relative` + a z-index) —
              kept clear of the Works cards, not bleeding past the sidebar. */}
          <img
            src={leaves}
            alt=""
            className="motion-safe:animate-sprout pointer-events-none absolute bottom-0 left-24 z-0 w-64 origin-bottom opacity-60"
            style={{ animationDelay: "500ms" }}
          />

          <div
            className="motion-safe:animate-drop-in relative z-10 font-heading flex flex-col gap-2 text-xs"
            style={{ animationDelay: "900ms" }}
          >
            <p className="text-gray-400">links</p>
            <ol className="flex flex-col gap-1.5 text-gray-700">
              <li className="flex gap-2">
                <span className="text-gray-400">4.</span>
                <EmailLink />
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">5.</span>
                <a
                  href={profile.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transform transition-all duration-150 hover:translate-x-0.5 hover:text-gray-900"
                >
                  linkedin
                </a>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">6.</span>
                <a
                  href={profile.contact.resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transform transition-all duration-150 hover:translate-x-0.5 hover:text-gray-900"
                >
                  resume
                </a>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400">7.</span>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transform transition-all duration-150 hover:translate-x-0.5 hover:text-gray-900"
                >
                  github
                </a>
              </li>
            </ol>
          </div>

          <p
            className="motion-safe:animate-drop-in font-heading relative z-10 mt-auto text-xs text-gray-400"
            style={{ animationDelay: "1150ms" }}
          >
            Last updated: {LAST_UPDATED_LABEL}
          </p>
        </>
      )}
    </aside>
  );
}
