import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { projects } from "../data/projects";
import PlaceholderImage from "../components/PlaceholderImage";
import CaseStudySidebar from "../components/CaseStudySidebar";
import { ProjectTile } from "../components/ProjectGrid";

// Animates a number counting up from 0 to `target` once `active` becomes true.
function useCountUp(target, active, duration = 1500) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return undefined;
    let start = null;
    let raf;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

// A stat callout with numbers that count up once the card scrolls into view.
function ImpactCard({ impact }) {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const low = useCountUp(impact.low, active);
  const high = useCountUp(impact.high, active);

  return (
    <div ref={ref} className="mt-8 max-w-5xl rounded-lg border border-gray-200 bg-gray-50 p-6">
      {impact.prefix && <p className="text-sm text-gray-600">{impact.prefix}</p>}
      <p className="font-heading mt-1 text-4xl font-normal tracking-tight text-gray-900 sm:text-5xl">
        ~{low.toLocaleString()} <span className="text-gray-400">–</span> {high.toLocaleString()}
      </p>
      {impact.suffix && <p className="mt-2 text-sm text-gray-600">{impact.suffix}</p>}
    </div>
  );
}

function Block({ id, eyebrow, title, children }) {
  return (
    <section
      id={id}
      className="max-w-5xl scroll-mt-10 border-b border-gray-200 py-10 first:pt-0 last:border-b-0"
    >
      {eyebrow && (
        <p className="font-heading mb-3 text-xs uppercase tracking-widest text-gray-500">{eyebrow}</p>
      )}
      {title && <h2 className="font-serif mb-4 text-2xl font-light sm:text-3xl">{title}</h2>}
      {children}
    </section>
  );
}

// Wraps an image (real or placeholder) so clicking it opens the lightbox.
function Zoomable({ onClick, className = "", children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full cursor-zoom-in border-0 p-0 text-left ${className}`}
    >
      {children}
    </button>
  );
}

// Full-screen modal shown when a Zoomable image is clicked.
function Lightbox({ image, onClose }) {
  useEffect(() => {
    if (!image) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 transition hover:border-gray-500 hover:text-gray-900"
        >
          <PlusIcon expanded className="h-3 w-3" />
        </button>
        {image.video ? (
          <video
            src={image.src}
            controls
            autoPlay
            muted
            loop
            className="max-h-[70vh] w-full object-contain"
          />
        ) : image.src ? (
          <img src={image.src} alt={image.alt} className="max-h-[70vh] w-full object-contain" />
        ) : (
          <PlaceholderImage
            label={`[${image.type === "video" ? "Video" : "Image"} placeholder — ${image.label}]`}
            className="aspect-video w-full"
          />
        )}
        {(image.label || image.alt) && (
          <p className="p-4 text-sm text-gray-500">{image.label || image.alt}</p>
        )}
      </div>
    </div>
  );
}

// Minimal markdown support for prose fields: **bold** and [text](url).
function parseRichText(text) {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-dotted underline-offset-2 transition-opacity hover:opacity-60"
        >
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

// Splits a "Label. Detail sentence(s)." string into its short label (no
// trailing punctuation) and the remaining detail text.
function splitLabel(text) {
  const match = text.match(/^(.*?[.!?])\s+([\s\S]*)$/);
  if (!match) return { label: text, rest: "" };
  return { label: match[1].replace(/[.!?]+$/, ""), rest: match[2] };
}

// Converts a youtu.be / youtube.com/watch link into its embeddable form, or
// returns null if the URL isn't a recognizable YouTube link.
function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]+)/,
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?mute=1` : null;
}

// Turns a heading string into a URL-safe anchor id, e.g. for nav-linkable
// subsections whose headings come from freeform project data.
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Formats seconds as "m:ss", for the final-flow video progress bar.
function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Subsection({ id, label, children }) {
  return (
    <div id={id} className="mt-6 scroll-mt-24 first:mt-0">
      <p className="text-sm font-semibold text-gray-900">{label}</p>
      <p className="mt-2 max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
        {parseRichText(children)}
      </p>
    </div>
  );
}

// Plus icon that rotates into an X when its toggle is expanded.
function PlusIcon({ expanded, className = "h-3 w-3" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={`transition-transform ${expanded ? "rotate-45" : ""} ${className}`}
    >
      <path d="M6 1v10M1 6h10" />
    </svg>
  );
}

// Four-corner expand/collapse glyph, used to toggle the case study modal
// between a contained dialog and covering the full screen.
function FullScreenIcon({ expanded, className = "h-4 w-4" }) {
  return expanded ? (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M6 2v3a1 1 0 0 1-1 1H2M10 2v3a1 1 0 0 0 1 1h3M6 14v-3a1 1 0 0 0-1-1H2M10 14v-3a1 1 0 0 1 1-1h3" />
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M2 6V3a1 1 0 0 1 1-1h3M14 6V3a1 1 0 0 0-1-1h-3M2 10v3a1 1 0 0 0 1 1h3M14 10v3a1 1 0 0 1-1 1h-3" />
    </svg>
  );
}

// Circular replay arrow, used to restart a video from the beginning.
function ReplayIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 4.5A3.8 3.8 0 1 0 10 6" />
      <path d="M9.5 1.8v2.7h-2.7" />
    </svg>
  );
}

// Small play triangle / pause bars, used to toggle video playback.
function PlayIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className}>
      <path d="M3 1.8v8.4l7-4.2-7-4.2z" />
    </svg>
  );
}

function PauseIcon({ className = "h-3.5 w-3.5" }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" className={className}>
      <rect x="2.5" y="1.5" width="2.3" height="9" rx="0.5" />
      <rect x="7.2" y="1.5" width="2.3" height="9" rx="0.5" />
    </svg>
  );
}

// Horizontal card showing only the finding's first sentence until the plus
// icon is toggled.
// Small checkmark, used in place of a "T1"-style label for takeaway cards.
function CheckIcon({ className = "h-2.5 w-2.5" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 6.5 5 9l4.5-6" />
    </svg>
  );
}

// Small magnifying glass, used in place of an "F1"-style label for research
// finding cards.
function SearchIcon({ className = "h-2.5 w-2.5" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="5.25" cy="5.25" r="3.25" />
      <path d="m10 10-2.4-2.4" />
    </svg>
  );
}

// Small exclamation mark, used to flag a limitation/constraint card.
function WarningIcon({ className = "h-2.5 w-2.5" }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 2.5v4" />
      <circle cx="6" cy="9" r="0.25" fill="currentColor" />
    </svg>
  );
}

function FindingCard({
  index,
  text,
  prefix = "F",
  icon = null,
  hoverable = false,
  hideMarker = false,
  forceExpanded = false,
  label = null,
  boldFirst = false,
  blue = false,
  center = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const match = text.match(/^(.*?[.!?])\s+([\s\S]*)$/);
  const first = match ? match[1] : text;
  const rest = match ? match[2] : "";
  const expandable = rest && !forceExpanded;

  const toggle = () => expandable && setExpanded((e) => !e);

  return (
    <div
      role={expandable ? "button" : undefined}
      tabIndex={expandable ? 0 : undefined}
      onClick={toggle}
      onKeyDown={(e) => {
        if (expandable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={expandable ? expanded : undefined}
      className={`relative rounded-lg border p-4 ${
        blue ? "border-blue-100 bg-blue-50" : "border-gray-300"
      } ${expandable ? "cursor-pointer" : ""} ${
        hoverable
          ? blue
            ? "transition-colors hover:border-blue-300"
            : "transition-colors hover:border-gray-500 hover:bg-gray-50"
          : ""
      } ${center ? "text-center" : ""}`}
    >
      {label && (
        <p className="font-heading mb-2 text-xs uppercase tracking-widest text-gray-500">
          {label}
        </p>
      )}
      <div className={center ? "" : "flex items-start justify-between gap-4"}>
        <div className={center ? "" : "flex items-start gap-4"}>
          {!hideMarker &&
            (icon ? (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500">
                {icon}
              </span>
            ) : (
              <span className="shrink-0 text-xs text-gray-500">
                {prefix}
                {index}
              </span>
            ))}
          <p className={`text-sm leading-relaxed ${boldFirst ? "font-semibold" : ""}`}>
            {parseRichText(first)}
          </p>
        </div>
        {expandable && !center && (
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
          >
            <PlusIcon expanded={expanded} />
          </span>
        )}
      </div>
      {expandable && center && (
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
        >
          <PlusIcon expanded={expanded} />
        </span>
      )}
      {(forceExpanded || expanded) && rest && (
        <p
          className={`mt-2 text-sm leading-relaxed text-gray-600 ${
            center ? "" : hideMarker ? "" : icon ? "pl-9" : "pl-8"
          }`}
        >
          {parseRichText(rest)}
        </p>
      )}
    </div>
  );
}

// Shows only the placeholder image and the concept's label until the plus
// icon is toggled, then reveals the description.
function ConceptCard({ concept }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((e) => !e);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={expanded}
      className="cursor-pointer rounded-lg border border-gray-300 p-4"
    >
      {concept.image ? (
        <img
          src={concept.image}
          alt={concept.label}
          className="mb-4 aspect-video w-full rounded-md object-cover"
        />
      ) : (
        <PlaceholderImage label="[Image placeholder]" className="mb-4 aspect-video w-full rounded-md" />
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500">
            <WarningIcon />
          </span>
          <p className="text-sm font-semibold leading-relaxed">{concept.label}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
        >
          <PlusIcon expanded={expanded} />
        </span>
      </div>
      {expanded && (
        <p className="mt-2 pl-9 text-sm leading-relaxed text-gray-600">{concept.description}</p>
      )}
    </div>
  );
}

// Expandable, fully clickable card for a user-testing finding — header stays
// visible, the text/quote/image hide until toggled.
// Expandable "Insight" callout — header stays visible, text hides until toggled.
function InsightBox({ insight }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => insight.text && setExpanded((e) => !e);

  return (
    <div
      role={insight.text ? "button" : undefined}
      tabIndex={insight.text ? 0 : undefined}
      onClick={toggle}
      onKeyDown={(e) => {
        if (insight.text && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={insight.text ? expanded : undefined}
      className={`mb-4 rounded-lg border border-blue-100 bg-blue-50 p-4 ${
        insight.text ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="font-heading mb-1 text-xs uppercase tracking-widest text-gray-500">
            User Insight
          </p>
          <p className="text-sm text-gray-900">{insight.header}</p>
        </div>
        {insight.text && (
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
          >
            <PlusIcon expanded={expanded} />
          </span>
        )}
      </div>
      {expanded && insight.text && (
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-700">
          {parseRichText(insight.text)}
        </p>
      )}
    </div>
  );
}

function UserTestingCard({ card }) {
  const [expanded, setExpanded] = useState(false);
  const solutionMatch = card.header.match(/^Solution:\s*(.*)$/i);
  const toggle = () => setExpanded((e) => !e);

  const body = (
    <>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-700">
        {parseRichText(card.text)}
      </p>
      {card.quote && (
        <blockquote className="mt-4 border-l-2 border-gray-300 pl-4 text-sm italic text-gray-600">
          "{parseRichText(card.quote)}"
        </blockquote>
      )}
    </>
  );

  if (solutionMatch) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        aria-expanded={expanded}
        className="cursor-pointer rounded-lg border border-gray-300 p-4"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-heading mb-1 text-xs uppercase tracking-widest text-gray-500">
              Solution
            </p>
            <p className="text-sm text-gray-900">{solutionMatch[1]}</p>
          </div>
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
          >
            <PlusIcon expanded={expanded} />
          </span>
        </div>
        {expanded && body}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={expanded}
      className="cursor-pointer rounded-lg border border-blue-100 bg-blue-50 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 text-center">
          <p className="font-heading mb-1 text-xs uppercase tracking-widest text-gray-500">
            User Insight
          </p>
          <p className="text-sm text-gray-900">{card.header}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
        >
          <PlusIcon expanded={expanded} />
        </span>
      </div>
      {expanded && (
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start">
          <p className="flex-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {parseRichText(card.text)}
          </p>
          {card.quote && (
            <blockquote className="flex-1 border-t border-gray-200 pt-4 text-sm italic text-gray-600 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
              "{parseRichText(card.quote)}"
            </blockquote>
          )}
        </div>
      )}
    </div>
  );
}

// Expandable, fully clickable card for a { label, description } item —
// label stays visible, description hides until toggled.
function RequirementCard({ item, insightStyle }) {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded((e) => !e);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      }}
      aria-expanded={expanded}
      className={
        insightStyle
          ? "cursor-pointer rounded-lg border border-blue-100 bg-blue-50 p-4"
          : "cursor-pointer rounded-lg border border-gray-300 p-4 transition-colors hover:border-gray-500 hover:bg-gray-50"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className={insightStyle ? "flex-1 text-center" : "flex-1"}>
          {insightStyle && (
            <p className="font-heading mb-1 text-xs uppercase tracking-widest text-gray-500">
              User Insight
            </p>
          )}
          <p className="text-sm font-semibold text-gray-900">{item.label}</p>
        </div>
        <span
          aria-hidden="true"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition"
        >
          <PlusIcon expanded={expanded} />
        </span>
      </div>
      {expanded && (
        <p className={`mt-1 text-sm leading-relaxed text-gray-700 ${insightStyle ? "text-center" : ""}`}>
          {item.description}
        </p>
      )}
    </div>
  );
}

// A subsection heading (same visual level as the Block's own title) with an
// expandable disclosure holding the research behind the requirement cards.
function DesignRequirementsSection({
  requirements,
  media,
  onImageClick,
  title = "Design Requirements",
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="design-requirements" className="mt-10 max-w-5xl scroll-mt-24">
      {title && <h3 className="font-serif text-2xl font-light sm:text-3xl">{title}</h3>}
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {requirements.items.map((item) => (
          <RequirementCard key={item.label} item={item} insightStyle={requirements.insightStyle} />
        ))}
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 p-4">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
            <PlusIcon expanded={expanded} className="h-2.5 w-2.5" />
          </span>
          {expanded ? "Show less" : "How we got here"}
        </button>
        {expanded && (
          <div className="mt-4 pl-7">
            <MediaGrid items={media} onImageClick={onImageClick} />
            {requirements.intro && (
              <p className="mt-4 text-base leading-relaxed text-gray-700">{requirements.intro}</p>
            )}
            {requirements.tabs && requirements.tabs.length > 0 && (
              <Tabs
                tabs={requirements.tabs.map((tab) => ({
                  label: tab.label,
                  content: (
                    <div>
                      {!tab.noImage && (
                        <div className="rounded-lg bg-gray-100 p-4">
                          <div className="mx-auto max-w-xl">
                            <Zoomable onClick={() => onImageClick?.(tab)}>
                              {tab.src ? (
                                <img
                                  src={tab.src}
                                  alt={tab.label}
                                  className="block h-auto w-full rounded-lg"
                                />
                              ) : (
                                <PlaceholderImage
                                  label={`[Image placeholder — ${tab.label}]`}
                                  className="aspect-video w-full"
                                />
                              )}
                            </Zoomable>
                          </div>
                        </div>
                      )}
                      {tab.caption && (
                        <p className="mt-2 px-4 text-center text-xs text-gray-500">{tab.caption}</p>
                      )}
                      {tab.text && (
                        <p
                          className={`text-base leading-relaxed text-gray-700 ${
                            tab.noImage ? "" : "mt-4"
                          }`}
                        >
                          {tab.text}
                        </p>
                      )}
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        )}
      </div>
      {requirements.showQuote && (
        <blockquote className="mt-6 border-l-2 border-gray-300 pl-4 text-base italic text-gray-600">
          "[Quote placeholder]"
        </blockquote>
      )}
    </div>
  );
}

function AudienceCards({ id, audience }) {
  return (
    <div id={id} className="mt-6 scroll-mt-24 first:mt-0">
      <p className="text-sm font-semibold text-gray-900">Audience</p>
      <div
        className={`mt-4 grid max-w-5xl gap-4 ${
          audience.groups.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {audience.groups.map((group) => (
          <div key={group.label} className="flex items-start gap-4 rounded-lg border border-gray-300 p-4">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-xs">
              👤
            </span>
            <p className="text-sm leading-relaxed text-gray-700">{group.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengeCard({ id, dark, orange, label = "The challenge", children }) {
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };
  const glow = dark || orange ? "rgba(255,255,255,0.16)" : "rgba(17,24,39,0.07)";

  return (
    <div
      id={id}
      onMouseMove={handleMouseMove}
      className={`group relative mt-6 max-w-5xl scroll-mt-24 overflow-hidden rounded-lg p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        dark
          ? "border border-blue-950 bg-blue-950 text-white"
          : orange
            ? "border border-orange-900 bg-orange-800 text-white"
            : "border border-gray-900 bg-gray-50"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle 220px at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 70%)`,
        }}
      />
      <p
        className={`font-heading relative text-xs uppercase tracking-widest ${
          dark || orange ? "text-center text-white" : "text-gray-900"
        }`}
      >
        {label}
      </p>
      <p
        className={`relative mt-3 whitespace-pre-line text-xl font-light leading-relaxed ${
          dark ? "text-center text-blue-100" : orange ? "text-center text-orange-50" : "text-gray-700"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

// Renders placeholders for a section's `project.media` entries (images and
// videos from the original case study that haven't been added yet).
// Image placeholder on the left; hovering (or focusing) a card on the right
// swaps which item's placeholder is shown.
// Simple tab switcher — pass tabs as [{ label, content }].
function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  const buttonRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = buttonRefs.current[active];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, tabs]);

  return (
    <div className="mt-6 max-w-5xl">
      <div className="relative flex gap-1 rounded-t-lg border border-b-0 border-gray-200 p-1">
        <div
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-full bg-gray-200 transition-[left,width] duration-300 ease-out"
          style={{ left: indicator.left, width: indicator.width }}
        />
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => (buttonRefs.current[i] = el)}
            type="button"
            onClick={() => setActive(i)}
            aria-selected={active === i}
            className={`relative flex-1 rounded-full px-3 py-2 text-center text-sm font-semibold transition-colors duration-300 ${
              active === i ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex min-h-[320px] flex-col overflow-hidden rounded-b-lg border border-gray-200 [&>*]:mt-0 [&>*]:flex-1">
        {tabs[active].content}
      </div>
    </div>
  );
}

function HoverableTokenPreview({ items, onImageClick, aspect = "aspect-square", hideTabs = false }) {
  const [active, setActive] = useState(0);
  if (!items || items.length === 0) return null;
  const current = items[active];

  return (
    <div className={`flex flex-col ${hideTabs ? "" : "items-center"}`}>
      <Zoomable className={hideTabs ? "w-full" : "w-full sm:w-2/3"} onClick={() => onImageClick?.(current)}>
        {current.src ? (
          <img
            src={current.src}
            alt={current.label}
            className={`block w-full object-cover ${hideTabs ? "rounded-lg" : "rounded-t-lg"} ${aspect}`}
          />
        ) : (
          <PlaceholderImage
            label={`[Image placeholder — ${current.label}]`}
            className={`w-full ${aspect}`}
          />
        )}
      </Zoomable>
      {!hideTabs && (
        <div className="flex w-full overflow-hidden rounded-b-lg border border-t-0 border-gray-300 sm:w-2/3">
          {items.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`flex-1 border-r border-gray-300 p-4 text-sm font-semibold transition last:border-r-0 ${
                active === i ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {item.short || item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Renders a labeled group of stacked Problem/Solution cards (one problem
// followed by one or more solutions, connected by down arrows), with an
// optional quote + stat placed alongside the first (problem) card.
// An image with a stack of clickable cards beside it — clicking a card swaps
// which image is shown, e.g. for switching between layout explorations.
function TabImageWithCards({ tab, onImageClick }) {
  const [active, setActive] = useState(0);
  const current = tab.sideCards[active];
  const src = current.src || tab.src;

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 sm:flex-row sm:items-stretch">
      <div className="bg-gray-100 p-6 sm:flex-1">
        <Zoomable onClick={() => onImageClick({ src, label: current.label })}>
          {src ? (
            <img
              src={src}
              alt={current.label}
              className="block aspect-[3/2] w-full object-contain"
            />
          ) : (
            <PlaceholderImage
              label={`[Image placeholder — ${current.label}]`}
              className="aspect-[3/2] w-full"
            />
          )}
        </Zoomable>
      </div>
      <div className="flex flex-col divide-y divide-gray-200 border-t border-gray-200 sm:w-48 sm:border-l sm:border-t-0">
        {tab.sideCards.map((card, i) => (
          <button
            key={card.label}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            aria-pressed={active === i}
            className={`px-3 py-3 text-center text-sm font-semibold transition-colors sm:flex-1 ${
              active === i
                ? "bg-gray-100 text-gray-900"
                : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {card.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProblemSolutionGroup({ group, openLightbox }) {
  const [problemCard, ...solutionCards] = group.cards;
  return (
    <div className="mt-6">
      {group.title && (
        <p className="font-heading mb-3 text-xs uppercase tracking-widest text-gray-500">
          {group.title}
        </p>
      )}
      <div className="flex flex-col gap-4">
        {group.insight && <InsightBox insight={group.insight} />}
        <div className="flex flex-col gap-4 rounded-lg border border-gray-300 p-4 sm:flex-row sm:items-stretch">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{problemCard.label}</p>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
              {problemCard.description}
            </p>
          </div>
          <blockquote className="flex-1 border-t border-gray-200 pt-4 text-sm italic text-gray-600 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <p
              className="hidden select-none text-sm font-semibold text-transparent sm:block"
              aria-hidden="true"
            >
              {problemCard.label}
            </p>
            <p className="mt-1">
              "{group.quote ? parseRichText(group.quote) : "[Quote placeholder]"}"
            </p>
          </blockquote>
        </div>
        {solutionCards.length > 0 && (
          <>
            <div className="flex justify-center text-gray-400">↓</div>
            <div
              className={`grid gap-4 ${
                solutionCards.length > 1 && !solutionCards.some((c) => (c.video || c.image) && !c.imageBelow)
                  ? "sm:grid-cols-2"
                  : ""
              }`}
            >
              {solutionCards.map((card, i) => {
                const hasMedia = card.video || card.image || card.imagePlaceholder;
                return (
                  <div
                    key={i}
                    className={`rounded-lg border border-gray-300 p-4 ${
                      hasMedia
                        ? card.imageBelow
                          ? "flex flex-col gap-4"
                          : "flex flex-col gap-4 sm:flex-row sm:items-center"
                        : ""
                    }`}
                  >
                    <div className={hasMedia && !card.imageBelow ? "sm:flex-1" : ""}>
                      <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                        {card.description}
                      </p>
                    </div>
                    {card.video ? (
                      <div className="rounded-lg bg-gray-100 p-3 sm:flex-1">
                        <Zoomable
                          onClick={() => openLightbox({ src: card.video, label: card.description, video: true })}
                        >
                          <video
                            src={card.video}
                            loop
                            autoPlay
                            muted
                            playsInline
                            className="block aspect-video w-full rounded-lg object-cover"
                          />
                        </Zoomable>
                      </div>
                    ) : card.image ? (
                      <div className={`rounded-lg bg-gray-100 p-3 ${card.imageBelow ? "" : "sm:flex-1"}`}>
                        <Zoomable onClick={() => openLightbox({ src: card.image, label: card.description })}>
                          <img
                            src={card.image}
                            alt={card.description}
                            className={`block w-full rounded-lg ${
                              card.imageBelow ? "h-auto" : "aspect-video object-cover"
                            }`}
                          />
                        </Zoomable>
                      </div>
                    ) : (
                      card.imagePlaceholder && (
                        <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full sm:flex-1" />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {!group.hidePlaceholder && (
        <PlaceholderImage label="[Image placeholder]" className="mt-6 aspect-video w-full" />
      )}
    </div>
  );
}

// A single autoplay/loop video with its own top-right restart/play-pause
// controls, used for the finalFlowFeatures grid.
function FeatureVideo({ src, label }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

  const togglePlay = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying((p) => !p);
  };

  const restart = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setPlaying(true);
  };

  return (
    <div className="relative rounded-lg bg-gray-100 p-3">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        aria-label={label}
        className="block aspect-video w-full rounded-lg object-cover"
      />
      <div className="absolute right-5 top-5 flex gap-1.5">
        <button
          type="button"
          onClick={restart}
          aria-label="Restart"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-gray-600 shadow-sm transition hover:border-gray-500 hover:text-gray-900"
        >
          <ReplayIcon className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 bg-white/90 text-gray-600 shadow-sm transition hover:border-gray-500 hover:text-gray-900"
        >
          {playing ? <PauseIcon className="h-3 w-3" /> : <PlayIcon className="h-3 w-3" />}
        </button>
      </div>
    </div>
  );
}

// Final-flow wall projection + touchscreen mockups, sharing one grey backdrop
// with replay/play-pause controls that drive both videos together.
function FinalFlowMockups({ project, openLightbox }) {
  const wallRef = useRef(null);
  const touchscreenRef = useRef(null);
  const endedFlags = useRef({ wall: false, touchscreen: false });
  const durations = useRef({ wall: 0, touchscreen: 0 });
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeKeys = [
    project.finalFlowWallVideo && "wall",
    project.finalFlowTouchscreenVideo && "touchscreen",
  ].filter(Boolean);

  const refFor = (key) => (key === "wall" ? wallRef.current : touchscreenRef.current);
  const videos = () => activeKeys.map(refFor).filter(Boolean);

  const restartTogether = () => {
    videos().forEach((v) => {
      v.currentTime = 0;
    });
    endedFlags.current = { wall: false, touchscreen: false };
    setElapsed(0);
    videos().forEach((v) => v.play());
  };

  const handleEnded = (key) => {
    endedFlags.current[key] = true;
    if (activeKeys.every((k) => endedFlags.current[k])) {
      restartTogether();
    }
  };

  const handleLoadedMetadata = (key) => {
    const el = refFor(key);
    if (el) {
      durations.current[key] = el.duration || 0;
      setDuration(Math.max(...activeKeys.map((k) => durations.current[k])));
    }
  };

  const handleTimeUpdate = () => {
    setElapsed(Math.max(...videos().map((v) => v.currentTime)));
  };

  useEffect(() => {
    restartTogether();
    setPlaying(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePlay = () => {
    if (playing) {
      videos().forEach((v) => v.pause());
    } else {
      videos().forEach((v) => v.play());
    }
    setPlaying((p) => !p);
  };

  const replay = () => {
    restartTogether();
    setPlaying(true);
  };

  const progress = duration > 0 ? Math.min(elapsed / duration, 1) : 0;

  return (
    <div className="relative mt-6 max-w-5xl rounded-2xl bg-gray-100 p-6">
      <div className="absolute right-4 top-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={replay}
          aria-label="Replay"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-gray-500 hover:text-gray-900"
        >
          <ReplayIcon />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 shadow-sm transition hover:border-gray-500 hover:text-gray-900"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-10 sm:flex-row">
        {project.finalFlowWallProjection && (
          <div className="sm:w-2/5">
            <Zoomable
              onClick={() =>
                openLightbox(
                  project.finalFlowWallVideo
                    ? {
                        src: project.finalFlowWallVideo,
                        label: "Final flow — wall projection",
                        video: true,
                      }
                    : { label: "Final flow screenshot — wall projection" },
                )
              }
            >
              {project.finalFlowWallVideo ? (
                <video
                  ref={wallRef}
                  src={project.finalFlowWallVideo}
                  onEnded={() => handleEnded("wall")}
                  onLoadedMetadata={() => handleLoadedMetadata("wall")}
                  onTimeUpdate={handleTimeUpdate}
                  muted
                  playsInline
                  className="block aspect-[9/16] w-full rounded-sm object-cover shadow-lg"
                />
              ) : (
                <PlaceholderImage
                  label="[Final flow screenshot — wall projection]"
                  className="aspect-[9/16] w-full rounded-sm shadow-lg"
                />
              )}
            </Zoomable>
            <p className="font-heading mt-2 text-center text-xs uppercase tracking-widest text-gray-500">
              Projection
            </p>
          </div>
        )}
        {project.finalFlowDeviceFrame && (
          <div className="sm:w-3/5">
            <div className="rounded-[2rem] border-[10px] border-gray-900 bg-gray-900 p-2 shadow-xl">
              <Zoomable
                onClick={() =>
                  openLightbox(
                    project.finalFlowTouchscreenVideo
                      ? {
                          src: project.finalFlowTouchscreenVideo,
                          label: "Final flow — touchscreen",
                          video: true,
                        }
                      : { label: "Final flow screenshot" },
                  )
                }
              >
                {project.finalFlowTouchscreenVideo ? (
                  <video
                    ref={touchscreenRef}
                    src={project.finalFlowTouchscreenVideo}
                    onEnded={() => handleEnded("touchscreen")}
                    onLoadedMetadata={() => handleLoadedMetadata("touchscreen")}
                    onTimeUpdate={handleTimeUpdate}
                    muted
                    playsInline
                    className="block h-auto w-full rounded-lg"
                  />
                ) : (
                  <PlaceholderImage
                    label="[Final flow screenshot — touchscreen]"
                    className="aspect-video w-full rounded-lg"
                  />
                )}
              </Zoomable>
            </div>
            <p className="font-heading mt-2 text-center text-xs uppercase tracking-widest text-gray-500">
              Touchscreen
            </p>
          </div>
        )}
      </div>
      {(project.finalFlowWallVideo || project.finalFlowTouchscreenVideo) && (
        <div className="mt-4 flex items-center gap-3">
          <span className="font-heading text-xs text-gray-500">{formatTime(elapsed)}</span>
          <div className="h-1 flex-1 rounded-full bg-gray-300">
            <div
              className="h-1 rounded-full bg-gray-900 transition-[width] duration-150 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="font-heading text-xs text-gray-500">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
}

// A CSS-only macOS browser window: title bar with traffic lights and an
// address pill, wrapping `children` as the page content.
function BrowserFrame({ children }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/10">
      <div className="flex items-center gap-3 border-b border-gray-300/70 bg-[#ececef] px-3.5 py-2.5">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto h-6 w-full max-w-md rounded-md bg-white/90 ring-1 ring-black/5" aria-hidden="true" />
        <div className="w-[3.75rem] shrink-0" aria-hidden="true" />
      </div>
      {children}
    </div>
  );
}

function MediaGrid({ items, onImageClick, aspect = "aspect-video", grey = false }) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`mt-6 grid max-w-5xl gap-4 ${items.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {items.map((item, i) => {
        const embedUrl = !item.src && getYouTubeEmbedUrl(item.url);
        return (
          <div key={i}>
            <div className={grey ? "rounded-lg bg-gray-100 p-3" : ""}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={item.label}
                  className={`block w-full rounded-lg ${aspect}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Zoomable onClick={() => onImageClick?.(item)}>
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.label}
                      className={`block w-full rounded-lg object-cover ${aspect}`}
                    />
                  ) : (
                    <PlaceholderImage
                      label={`[${item.type === "video" ? "Video" : "Image"} placeholder — ${item.label}]`}
                      className={`w-full ${aspect}`}
                    />
                  )}
                </Zoomable>
              )}
            </div>
            {item.url && !embedUrl && <p className="mt-1 text-xs text-gray-400">{item.url}</p>}
          </div>
        );
      })}
    </div>
  );
}

// Renders a full case study (sidebar + all sections) for the given project.
// Used both by the routed CaseStudy page and by LinkedCaseStudyModal, which
// renders a child project's full case study inside an overlay without
// changing the URL.
function CaseStudyContent({ project, isModal = false, scrollContainerRef }) {
  const [lightboxImage, setLightboxImage] = useState(null);
  const openLightbox = (image) => setLightboxImage(image);
  const [openLinkedSlug, setOpenLinkedSlug] = useState(null);

  let sectionNumber = 0;
  const numbered = (label) => `${String(++sectionNumber).padStart(2, "0")} — ${label}`;

  const subsections = {
    problem: project.problem.plainText
      ? []
      : [
          { id: "significance", label: project.problem.significanceLabel || "Significance" },
          { id: "audience", label: "Audience" },
          project.problem.approach && { id: "approach", label: "Game Format" },
          { id: "challenge", label: "The challenge" },
        ].filter(Boolean),
    research: [
      project.research.designRequirements &&
        project.research.designRequirements.title !== "" && {
          id: "design-requirements",
          label: project.research.designRequirements.title || "Design Requirements",
        },
      project.research.mappingTheFlow &&
        project.research.mappingTheFlowTitle !== "" && {
          id: "mapping-the-flow",
          label: project.research.mappingTheFlowTitle || "Mapping the Flow",
        },
    ].filter(Boolean),
    prototyping: [
      project.sectionTitles?.prototyping && {
        id: "prototyping-intro",
        label: project.sectionTitles.prototyping,
      },
      (project.translatingResearch ||
        (project.translatingResearchGroups && project.translatingResearchGroups.length > 0)) && {
        id: "translating-research",
        label: project.translatingResearchTitle || "Translating research into design",
      },
      project.expandingMentorship && {
        id: "expanding-mentorship",
        label: "Expanding mentorship opportunities",
      },
      ...(project.userTestingCards || [])
        .filter((group) => group.label)
        .map((group) => ({ id: slugify(group.label), label: group.label })),
    ].filter(Boolean),
    "round-2-testing": [
      project.round2TestingSection?.title && {
        id: "round-2-testing-intro",
        label: project.round2TestingSection.title,
      },
      project.round2TestingSection?.subsectionTitle && {
        id: slugify(project.round2TestingSection.subsectionTitle),
        label: project.round2TestingSection.subsectionTitle,
      },
      project.technicalChallenges && {
        id: "technical-challenges",
        label: project.technicalChallenges.title,
      },
    ].filter(Boolean),
    "failed-concepts": [
      project.failedConcepts.takeaways &&
        project.failedConcepts.takeaways.length > 0 && { id: "takeaways", label: "Takeaways" },
      project.failedConcepts.concepts &&
        project.failedConcepts.concepts.length > 0 && { id: "limitations", label: "Testing Challenges" },
      project.iterations.round2Testing && { id: "round2-testing", label: "Round 2 Testing" },
    ].filter(Boolean),
    "design-system": [
      project.copywriting && { id: "copywriting", label: "Copywriting Guidelines" },
      project.aiDesignDecisions && { id: "ai-design-decisions", label: "AI-design decisions" },
    ].filter(Boolean),
    reflection: [
      project.outcomeUnderReflection &&
        !project.hideOutcome && { id: "outcome", label: project.outcomeLabel || "Outcome" },
    ].filter(Boolean),
  };

  return (
    <div className="mx-auto grid max-w-[1800px] lg:grid-cols-[220px_1fr]">
      <aside className="border-b border-gray-200 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:border-b-0">
        <CaseStudySidebar
          project={project}
          subsections={subsections}
          scrollContainerRef={scrollContainerRef}
          hideAllWorkLink={isModal}
        />
      </aside>

      <main className="py-4 pl-1 pr-2 lg:py-6 lg:pl-0 lg:pr-6">
        <Block id="overview">
          <Zoomable
            className="max-w-5xl"
            onClick={() =>
              openLightbox(
                project.heroVideo
                  ? { src: project.heroVideo, label: `${project.title} hero`, video: true }
                  : project.heroImage
                    ? { src: project.heroImage, alt: `${project.title} hero mockup` }
                    : { label: "Hero screenshot" },
              )
            }
          >
            {project.heroVideo ? (
              <video
                src={project.heroVideo}
                loop
                autoPlay
                muted
                playsInline
                className={
                  project.heroVideoCompact
                    ? "mx-auto block max-h-96 w-auto rounded-lg"
                    : "block h-auto w-full rounded-lg"
                }
              />
            ) : project.heroImage ? (
              <img
                src={project.heroImage}
                alt={`${project.title} hero mockup`}
                className={
                  project.heroImageCompact
                    ? "mx-auto block max-h-64 w-auto rounded-lg"
                    : "h-auto w-full rounded-lg"
                }
              />
            ) : (
              <PlaceholderImage label="[Hero screenshot]" className="aspect-video w-full" />
            )}
          </Zoomable>
          <h1 className="font-serif mt-8 text-4xl font-light sm:text-5xl">{project.title}</h1>
          <p className="mt-3 max-w-xl text-lg text-gray-600">{project.tagline}</p>
          {project.tags && project.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-300 px-3 py-1 text-xs uppercase tracking-wide text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <MediaGrid items={project.media?.overview} onImageClick={openLightbox} />
          <div className="mt-8 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Role</p>
              <p className="mt-1 whitespace-pre-line text-sm">{project.meta.role}</p>
            </div>
            {project.meta.tools && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Tools</p>
                <p className="mt-1 whitespace-pre-line text-sm">{project.meta.tools}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Timeline</p>
              <p className="mt-1 text-sm">{project.meta.timeline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Team</p>
              <p className="mt-1 whitespace-pre-line text-sm">{project.meta.team}</p>
            </div>
          </div>
          {!project.hideTldr && (
            <div className="mt-8 flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              {project.tldrImage && (
                <Zoomable
                  className="shrink-0 sm:w-80"
                  onClick={() =>
                    openLightbox({ src: project.tldrImage, alt: `${project.title} project photo` })
                  }
                >
                  <img
                    src={project.tldrImage}
                    alt={`${project.title} project photo`}
                    className="block h-auto w-full rounded-lg"
                  />
                </Zoomable>
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">TLDR</p>
                <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-gray-700">
                  {parseRichText(project.cover)}
                </p>
                {project.finalConceptCta && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = scrollContainerRef?.current
                        ? scrollContainerRef.current.querySelector("#final-flow")
                        : document.getElementById("final-flow");
                      target?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-900"
                  >
                    {project.finalConceptCta} →
                  </button>
                )}
              </div>
            </div>
          )}
          {project.impact && <ImpactCard impact={project.impact} />}
          {project.linkedCaseStudies && project.linkedCaseStudies.length > 0 && (
            <div className="mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
              {project.linkedCaseStudies.map((slug) => {
                const linked = projects.find((p) => p.slug === slug);
                if (!linked) return null;
                return (
                  <ProjectTile
                    key={slug}
                    project={linked}
                    onClick={() => setOpenLinkedSlug(slug)}
                    alwaysExpanded
                  />
                );
              })}
            </div>
          )}
        </Block>

        {!project.hideContext && (
        <Block
          id="problem"
          eyebrow={numbered(project.contextLabel || "Context")}
          title={project.sectionTitles?.problem}
        >
          {project.problem.plainText ? (
            <>
              <p className="max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
                {parseRichText(project.problem.plainText)}
              </p>
              {project.problem.challenge && (
                <ChallengeCard
                  dark={project.challengeDark}
                  orange={project.challengeOrange}
                  label={project.problem.challengeLabel}
                >
                  {project.problem.challenge}
                </ChallengeCard>
              )}
              {project.problem.notice && (
                <div className="mt-4 max-w-5xl rounded-lg p-4 text-sm leading-relaxed text-gray-700">
                  {parseRichText(project.problem.notice)}
                </div>
              )}
            </>
          ) : (
            <>
          <Subsection id="significance" label={project.problem.significanceLabel || "Significance"}>
            {project.problem.significance}
          </Subsection>
          {project.problem.theAsk && (
            <p className="mt-4 max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
              {parseRichText(project.problem.theAsk)}
            </p>
          )}
          <AudienceCards id="audience" audience={project.problem.audience} />
          {project.problem.approach && (
            <Subsection id="approach" label="Game Format">
              {project.problem.approach}
            </Subsection>
          )}
          <ChallengeCard id="challenge" dark={project.challengeDark} orange={project.challengeOrange}>
            {project.problem.challenge}
          </ChallengeCard>
            </>
          )}
        </Block>
        )}

        {project.solution && (
          <Block id="solution" eyebrow={numbered("Solution")} title={project.sectionTitles?.solution}>
            <p className="max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
              {parseRichText(project.solution)}
            </p>
            {project.solutionFeatures &&
              project.solutionFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className="mt-6 flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
                >
                  <div className="sm:w-56 sm:shrink-0">
                    <p className="font-serif text-2xl font-semibold text-gray-900">{feature.label}</p>
                    {feature.description && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {feature.description}
                      </p>
                    )}
                  </div>
                  <Zoomable
                    className="min-w-0 sm:flex-1"
                    onClick={() => openLightbox({ src: feature.src, label: feature.label })}
                  >
                    {feature.src ? (
                      feature.bg ? (
                        <div className="rounded-lg p-4 sm:p-8" style={{ backgroundColor: feature.bg }}>
                          {feature.device === "browser" ? (
                            <BrowserFrame>
                              <img
                                src={feature.src}
                                alt={feature.label}
                                className="block h-auto w-full"
                              />
                            </BrowserFrame>
                          ) : (
                            <img
                              src={feature.src}
                              alt={feature.label}
                              className="block h-auto w-full rounded-lg shadow-sm"
                            />
                          )}
                        </div>
                      ) : (
                        <img
                          src={feature.src}
                          alt={feature.label}
                          className="block h-auto w-full rounded-lg"
                        />
                      )
                    ) : (
                      <PlaceholderImage
                        label={`[Image placeholder — ${feature.label}]`}
                        className="aspect-video w-full"
                      />
                    )}
                  </Zoomable>
                </div>
              ))}
          </Block>
        )}

        {!project.hideResearch && (
        <Block
          id="research"
          eyebrow={numbered(project.researchLabel || "Research")}
          title={project.sectionTitles?.research}
        >
          <Zoomable
            className="mb-6 max-w-5xl"
            onClick={() => openLightbox({ src: project.research.heroImage, label: "Research" })}
          >
            {project.research.heroImage ? (
              <div className={project.research.heroImageGrey ? "rounded-lg bg-gray-100 p-3" : ""}>
                <img
                  src={project.research.heroImage}
                  alt="Research"
                  className={
                    project.research.heroImageCompact
                      ? "mx-auto block max-h-96 w-auto rounded-lg"
                      : "block h-auto w-full rounded-lg"
                  }
                />
              </div>
            ) : (
              <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
            )}
          </Zoomable>
          <p className="max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
            {parseRichText(project.research.intro)}
          </p>
          {project.research.findings && project.research.findings.length > 0 && (
            <div className="mt-10 grid max-w-5xl gap-3 sm:grid-cols-3">
              {project.research.findings.map((finding, i) => (
                <FindingCard
                  key={i}
                  index={i + 1}
                  text={finding}
                  icon={<SearchIcon />}
                  forceExpanded
                  boldFirst
                />
              ))}
            </div>
          )}
          {project.research.tabs && project.research.tabs.length > 0 && (
            <Tabs
              tabs={project.research.tabs.map((tab) => ({
                label: tab.label,
                content: tab.video ? (
                  <div className="flex items-center justify-center bg-gray-100 p-3">
                    <Zoomable
                      className="w-full"
                      onClick={() => openLightbox({ src: tab.video, label: tab.label, video: true })}
                    >
                      <video
                        src={tab.video}
                        loop
                        autoPlay
                        muted
                        playsInline
                        className="block h-auto w-full rounded-lg"
                      />
                    </Zoomable>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-100 p-3">
                    <Zoomable className="w-full" onClick={() => openLightbox({ src: tab.src, label: tab.label })}>
                      {tab.src ? (
                        <img src={tab.src} alt={tab.label} className="block h-auto w-full rounded-lg" />
                      ) : (
                        <PlaceholderImage
                          label={`[Image placeholder — ${tab.label}]`}
                          className="aspect-video w-full"
                        />
                      )}
                    </Zoomable>
                  </div>
                ),
              }))}
            />
          )}
          {project.research.designRequirements && (
            <DesignRequirementsSection
              requirements={project.research.designRequirements}
              media={project.media?.designRequirements}
              onImageClick={openLightbox}
              title={project.research.designRequirements.title}
            />
          )}
          {project.research.mappingTheFlow && (
            <div id="mapping-the-flow" className="mt-10 max-w-5xl scroll-mt-24">
              {project.research.mappingTheFlowTitle !== "" && (
                <h3 className="font-serif text-2xl font-light sm:text-3xl">
                  {project.research.mappingTheFlowTitle || "Mapping the Flow"}
                </h3>
              )}
              <p className="mt-3 text-base leading-relaxed text-gray-700">
                {project.research.mappingTheFlow}
              </p>
              <div className={project.research.mappingTheFlowCompact ? "max-w-sm" : ""}>
                <MediaGrid items={project.media?.mappingTheFlow} onImageClick={openLightbox} />
              </div>
              {project.research.mappingTheFlowOutro && (
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  {parseRichText(project.research.mappingTheFlowOutro)}
                </p>
              )}
              {project.research.mappingTheFlowColumns &&
                project.research.mappingTheFlowColumns.length > 0 && (
                  <div className="mt-6 overflow-x-auto rounded-lg border border-gray-300">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr>
                          {project.research.mappingTheFlowColumns.map((column) => (
                            <th
                              key={column.label}
                              className="border-b border-gray-300 p-4 font-semibold text-gray-900"
                            >
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({
                          length: Math.max(
                            ...project.research.mappingTheFlowColumns.map((c) => c.cards.length),
                          ),
                        }).map((_, rowIndex) => (
                          <tr key={rowIndex}>
                            {project.research.mappingTheFlowColumns.map((column) => (
                              <td
                                key={column.label}
                                className="border-t border-gray-200 p-4 align-top leading-relaxed text-gray-700"
                              >
                                {column.cards[rowIndex] || ""}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          )}
        </Block>
        )}

        {!project.hidePrototyping && (
        <Block
          id="prototyping"
          eyebrow={numbered(project.prototypingLabel || "Design")}
          title={project.sectionTitles?.prototyping}
        >
          {(project.prototypingHeroImage || project.prototypingHeroPlaceholder) && (
            <div className="mb-6 max-w-5xl rounded-lg bg-gray-100 p-6">
              <div className="mx-auto max-w-3xl">
                <Zoomable
                  onClick={() =>
                    openLightbox({ src: project.prototypingHeroImage, label: "Design Process" })
                  }
                >
                  {project.prototypingHeroImage ? (
                    <img
                      src={project.prototypingHeroImage}
                      alt="Design Process"
                      className="block h-auto w-full rounded-lg"
                    />
                  ) : (
                    <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
                  )}
                </Zoomable>
              </div>
            </div>
          )}
          {project.userTestingIntro ? (
            <div
              id="prototyping-intro"
              className="flex scroll-mt-24 flex-col gap-6 sm:flex-row sm:items-start sm:gap-10"
            >
              <div className={project.userTestingImage ? "sm:w-1/3" : "sm:w-1/2"}>
                <Zoomable
                  onClick={() =>
                    openLightbox({ src: project.userTestingImage, label: "User testing setup" })
                  }
                >
                  {project.userTestingImage ? (
                    <img
                      src={project.userTestingImage}
                      alt="User testing setup"
                      className="block h-auto w-full rounded-lg"
                    />
                  ) : (
                    <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
                  )}
                </Zoomable>
              </div>
              <p className="flex-1 text-base leading-relaxed text-gray-700">
                {parseRichText(project.userTestingIntro)}
              </p>
            </div>
          ) : null}
          {project.userTestingCards &&
            project.userTestingCards.map((group, i) => (
              <div
                key={i}
                id={group.label ? slugify(group.label) : undefined}
                className="mt-10 max-w-5xl scroll-mt-24"
              >
                {group.label && (
                  <h3 className="font-serif mb-4 text-2xl font-light sm:text-3xl">{group.label}</h3>
                )}
                <div className="space-y-4">
                  {(group.cards || [group]).map((card, j) =>
                    card.imageTabs ? (
                      <div key={j} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                        <div className="sm:w-1/2">
                          <UserTestingCard card={card} />
                        </div>
                        <div className="-mt-6 sm:w-1/2">
                          <Tabs
                            tabs={card.imageTabs.map((tab) => ({
                              label: tab.label,
                              content: (
                                <div className="flex h-full flex-col">
                                  <div className="flex flex-1 items-center justify-center bg-gray-100 p-3">
                                    {tab.video ? (
                                      <Zoomable
                                        className="w-full"
                                        onClick={() =>
                                          openLightbox({ src: tab.video, label: tab.label, video: true })
                                        }
                                      >
                                        <video
                                          src={tab.video}
                                          loop
                                          autoPlay
                                          muted
                                          playsInline
                                          className="block h-auto w-full rounded-lg"
                                        />
                                      </Zoomable>
                                    ) : (
                                      <PlaceholderImage
                                        label={`[Image placeholder — ${tab.label}]`}
                                        className="aspect-video w-full"
                                      />
                                    )}
                                  </div>
                                  {tab.caption && (
                                    <p className="mt-2 px-4 text-center text-xs text-gray-500">
                                      {tab.caption}
                                    </p>
                                  )}
                                </div>
                              ),
                            }))}
                          />
                        </div>
                      </div>
                    ) : (
                      <UserTestingCard key={j} card={card} />
                    ),
                  )}
                </div>
                {group.video && (
                  <div className="mt-4 rounded-lg bg-gray-100 p-4">
                    <Zoomable
                      onClick={() => openLightbox({ src: group.video, label: group.label, video: true })}
                    >
                      <video
                        src={group.video}
                        loop
                        autoPlay
                        muted
                        playsInline
                        className="block h-auto w-full rounded-lg"
                      />
                    </Zoomable>
                  </div>
                )}
              </div>
            ))}
          {!project.userTestingIntro && (
            <p
              id="prototyping-intro"
              className="max-w-5xl scroll-mt-24 whitespace-pre-line text-base leading-relaxed text-gray-700"
            >
              {project.prototyping}
            </p>
          )}
          {!project.userTestingIntro && project.prototypingTabs && (
            <div className="mt-6 space-y-8">
              {project.prototypingTabs.map((tab) => (
                <div key={tab.label}>
                  <p className="font-heading mb-3 text-xs uppercase tracking-widest text-gray-500">
                    {tab.label}
                  </p>
                  {!tab.noImage &&
                    (tab.sideCards && tab.sideCards.length > 0 ? (
                      <TabImageWithCards tab={tab} onImageClick={openLightbox} />
                    ) : (
                      <div className="rounded-lg bg-gray-100 p-4">
                        <Zoomable onClick={() => openLightbox({ src: tab.src, label: tab.label })}>
                          {tab.src ? (
                            <img
                              src={tab.src}
                              alt={tab.label}
                              className="block h-auto w-full rounded-lg"
                            />
                          ) : (
                            <PlaceholderImage
                              label={`[Image placeholder — ${tab.label}]`}
                              className="aspect-video w-full"
                            />
                          )}
                        </Zoomable>
                      </div>
                    ))}
                  {tab.text && (
                    <p
                      className={`whitespace-pre-line text-base leading-relaxed text-gray-700 ${
                        tab.noImage ? "" : "mt-4"
                      }`}
                    >
                      {tab.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {!project.userTestingIntro && !project.prototypingTabs && (
            <>
              <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
                <div className="sm:w-1/2">
                  <HoverableTokenPreview
                    items={project.media?.prototyping}
                    onImageClick={openLightbox}
                  />
                </div>
                <p className="whitespace-pre-line text-base leading-relaxed text-gray-700 sm:w-1/2">
                  {project.prototypingProcess}
                </p>
              </div>
              {project.prototypingOutro && (
                <p className="mt-6 max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
                  {project.prototypingOutro}
                </p>
              )}
              <MediaGrid items={project.media?.prototypingDemo} onImageClick={openLightbox} />
              {project.prototypingLimitation && (
                <div className="mt-6 flex max-w-5xl items-start gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-red-300 text-red-600">
                    <WarningIcon />
                  </span>
                  <div>
                    {project.prototypingLimitationLabel && (
                      <p className="font-heading text-xs uppercase tracking-widest text-gray-500">
                        {project.prototypingLimitationLabel}
                      </p>
                    )}
                    <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-700">
                      {parseRichText(project.prototypingLimitation)}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
          {project.prototypingExtraPlaceholder && (
            <div className="mt-4 max-w-5xl">
              <div className="rounded-lg bg-blue-50 p-8">
                <p className="font-heading mb-3 text-center text-xs uppercase tracking-widest text-gray-500">
                  Our Dashboard Design
                </p>
                <Zoomable
                  className="mx-auto block max-w-2xl"
                  onClick={() =>
                    openLightbox({
                      src: project.prototypingExtraImage,
                      label: "Dashboard explorations",
                    })
                  }
                >
                  {project.prototypingExtraImage ? (
                    <img
                      src={project.prototypingExtraImage}
                      alt="Dashboard explorations"
                      className="block h-auto w-full rounded-lg"
                    />
                  ) : (
                    <PlaceholderImage
                      label="[Image placeholder — Dashboard explorations]"
                      className="aspect-video w-full"
                    />
                  )}
                </Zoomable>
              </div>
              {project.prototypingHeroText && (
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  {parseRichText(project.prototypingHeroText)}
                </p>
              )}
            </div>
          )}
          {(project.translatingResearch ||
            (project.translatingResearchGroups &&
              project.translatingResearchGroups.length > 0)) && (
            <div id="translating-research" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">
                {project.translatingResearchTitle || "Translating research into design"}
              </h3>
              {project.translatingResearch && (
                <p className="mt-3 text-base leading-relaxed text-gray-700">
                  {project.translatingResearch}
                </p>
              )}
              <MediaGrid items={project.media?.translatingResearch} onImageClick={openLightbox} />
              {project.translatingResearchGroups &&
                project.translatingResearchGroups.map((group, gi) => (
                  <ProblemSolutionGroup key={gi} group={group} openLightbox={openLightbox} />
                ))}
            </div>
          )}
          {project.expandingMentorship && (
            <div id="expanding-mentorship" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">
                Expanding mentorship opportunities
              </h3>
              <p className="mt-3 text-base leading-relaxed text-gray-700">
                {parseRichText(project.expandingMentorship)}
              </p>
              {project.expandingMentorshipGroups &&
                project.expandingMentorshipGroups.map((group, gi) => (
                  <ProblemSolutionGroup key={gi} group={group} openLightbox={openLightbox} />
                ))}
            </div>
          )}
        </Block>
        )}

        {project.round2TestingSection && (
          <Block
            id="round-2-testing"
            eyebrow={numbered("Round 2 Testing")}
            title={project.round2TestingSection.title}
          >
            <p
              id="round-2-testing-intro"
              className="max-w-5xl scroll-mt-24 text-base leading-relaxed text-gray-700"
            >
              {parseRichText(project.round2TestingSection.text)}
            </p>
            {project.round2TestingSection.cards && project.round2TestingSection.cards.length > 0 && (
              <div className="mt-6 flex max-w-5xl flex-col gap-6">
                {project.round2TestingSection.cards.map((card, i) => (
                  <div key={i} className="rounded-lg border border-gray-300 p-4">
                    {card.insight && <InsightBox insight={card.insight} />}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-10">
                      <div className={card.video ? "sm:w-1/4" : "sm:w-1/2"}>
                        {card.video ? (
                          <div className="rounded-lg bg-gray-100 p-3">
                            <Zoomable
                              onClick={() =>
                                openLightbox({ src: card.video, label: card.header, video: true })
                              }
                            >
                              <video
                                src={card.video}
                                loop
                                autoPlay
                                muted
                                playsInline
                                className="block h-auto w-full rounded-lg"
                              />
                            </Zoomable>
                          </div>
                        ) : (
                          <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
                        )}
                      </div>
                      <div className={card.video ? "flex-1" : "sm:w-1/2"}>
                        <p className="text-sm font-semibold text-gray-900">{card.header}</p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {parseRichText(card.text)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {project.round2TestingSection.subsectionTitle && (
              <div
                id={slugify(project.round2TestingSection.subsectionTitle)}
                className="mt-10 max-w-5xl scroll-mt-24"
              >
                <h3 className="font-serif text-2xl font-light sm:text-3xl">
                  {project.round2TestingSection.subsectionTitle}
                </h3>
                {project.round2TestingSection.subsectionImage ? (
                  <div className="mt-3">
                    <div className="rounded-lg bg-gray-100 p-3">
                      <Zoomable
                        onClick={() =>
                          openLightbox({
                            src: project.round2TestingSection.subsectionImage,
                            label: project.round2TestingSection.subsectionTitle,
                          })
                        }
                      >
                        <img
                          src={project.round2TestingSection.subsectionImage}
                          alt={project.round2TestingSection.subsectionTitle}
                          className="block h-auto w-full rounded-lg"
                        />
                      </Zoomable>
                    </div>
                    {project.round2TestingSection.subsectionText && (
                      <p className="mt-4 text-base leading-relaxed text-gray-700">
                        {parseRichText(project.round2TestingSection.subsectionText)}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    {project.round2TestingSection.subsectionText && (
                      <p className="mt-3 text-base leading-relaxed text-gray-700">
                        {parseRichText(project.round2TestingSection.subsectionText)}
                      </p>
                    )}
                    <Zoomable
                      className="mt-6"
                      onClick={() => openLightbox({ label: project.round2TestingSection.subsectionTitle })}
                    >
                      <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
                    </Zoomable>
                  </>
                )}
              </div>
            )}
            {project.technicalChallenges && (
              <div id="technical-challenges" className="mt-10 max-w-5xl scroll-mt-24">
                <h3 className="font-serif text-2xl font-light sm:text-3xl">
                  {project.technicalChallenges.title}
                </h3>
                {project.technicalChallenges.intro && (
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    {parseRichText(project.technicalChallenges.intro)}
                  </p>
                )}
                {project.technicalChallenges.cards && project.technicalChallenges.cards.length > 0 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {project.technicalChallenges.cards.map((concept, i) => (
                      <div key={i} className="rounded-lg border border-gray-300 p-4">
                        <p className="text-sm font-semibold text-gray-900">{concept.label}</p>
                        <p className="mt-2 text-sm leading-relaxed text-gray-700">
                          {concept.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Block>
        )}

        {project.nextSteps && (
          <Block id="next-steps" eyebrow={numbered("Next Steps")} title={project.nextSteps.title}>
            {project.nextSteps.cards && project.nextSteps.cards.length > 0 && (
              <div className="grid max-w-5xl gap-3 sm:grid-cols-3">
                {project.nextSteps.cards.map((card, i) => (
                  <div key={i} className="rounded-lg border border-gray-300 p-4">
                    <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">{card.description}</p>
                  </div>
                ))}
              </div>
            )}
          </Block>
        )}

        {!project.hideUsabilityTesting && (
        <Block
          id="failed-concepts"
          eyebrow={numbered("Usability Testing")}
          title={project.sectionTitles?.failedConcepts}
        >
          <p className="max-w-5xl text-base leading-relaxed text-gray-700">
            {project.failedConcepts.intro}
          </p>
          {(project.media?.failedConcepts?.length > 0 ||
            (project.failedConcepts.takeaways && project.failedConcepts.takeaways.length > 0)) && (
            <div className="mt-6 flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-start">
              {project.media?.failedConcepts && project.media.failedConcepts.length > 0 && (
                <div className="sm:w-1/2">
                  <p className="font-heading text-xs uppercase tracking-widest text-gray-500">Setup</p>
                  <HoverableTokenPreview
                    items={project.media.failedConcepts}
                    onImageClick={openLightbox}
                    aspect="aspect-[4/3]"
                    hideTabs
                  />
                </div>
              )}
              {project.failedConcepts.takeaways && project.failedConcepts.takeaways.length > 0 && (
                <div id="takeaways" className="scroll-mt-24 sm:w-1/2">
                  <p className="font-heading text-xs uppercase tracking-widest text-gray-500">Takeaways</p>
                  <div className="mt-4 space-y-3">
                    {project.failedConcepts.takeaways.map((takeaway, i) => (
                      <FindingCard key={i} index={i + 1} text={takeaway} icon={<CheckIcon />} forceExpanded />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {project.failedConcepts.concepts && project.failedConcepts.concepts.length > 0 && (
            <div id="limitations" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">Testing Challenges</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.failedConcepts.concepts.map((concept) => (
                  <ConceptCard key={concept.label} concept={concept} />
                ))}
              </div>
            </div>
          )}
          {project.iterations.round2Testing && (
            <div id="round2-testing" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">
                Gameplay iterations emerged from a second round of testing.
              </h3>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">
                {project.iterations.round2Testing.intro}
              </p>
              <div className="max-w-5xl">
                <MediaGrid items={project.media?.iterations} onImageClick={openLightbox} />
                {project.iterations.round2Testing.studyDetails && (
                  <div className="mt-4 rounded-lg border border-gray-300 p-4">
                    <p className="font-heading text-xs uppercase tracking-widest text-gray-500">
                      Setup Changes
                    </p>
                    <p className="mt-2 text-base leading-relaxed text-gray-700">
                      {project.iterations.round2Testing.studyDetails}
                    </p>
                  </div>
                )}
              </div>
              {project.iterations.round2Testing.takeaways &&
                project.iterations.round2Testing.takeaways.length > 0 && (
                  <div className="mt-6 space-y-4">
                    {project.iterations.round2Testing.takeaways.map((takeaway, i) => (
                      <div key={i}>
                        <p className="font-heading text-xs uppercase tracking-widest text-gray-500">
                          {takeaway.theme}
                        </p>
                        <div className="mt-2 flex flex-col gap-4">
                          <div className="mx-auto w-full max-w-3xl">
                            <FindingCard
                              index={i + 1}
                              text={takeaway.text}
                              label={takeaway.insightLabel}
                              hoverable
                              hideMarker
                              blue
                              center
                            />
                          </div>
                          <Zoomable
                            className="mx-auto max-w-3xl"
                            onClick={() =>
                              openLightbox({
                                src: takeaway.video || takeaway.image,
                                video: !!takeaway.video,
                                label: takeaway.theme,
                              })
                            }
                          >
                            <div className="rounded-lg bg-gray-100 p-3">
                              {takeaway.video ? (
                                <video
                                  src={takeaway.video}
                                  autoPlay
                                  muted
                                  loop
                                  playsInline
                                  className="block aspect-video w-full rounded-lg object-cover"
                                />
                              ) : takeaway.image ? (
                                <img
                                  src={takeaway.image}
                                  alt={takeaway.theme}
                                  className="block aspect-video w-full rounded-lg object-cover"
                                />
                              ) : (
                                <PlaceholderImage
                                  label="[Image placeholder]"
                                  className="aspect-video w-full"
                                />
                              )}
                            </div>
                          </Zoomable>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}
        </Block>
        )}

        {!project.hideIterations && (
        <Block id="iterations" eyebrow={numbered("Iterations")} title={project.sectionTitles?.iterations}>
          <p className="max-w-5xl text-base leading-relaxed text-gray-700">
            {project.iterations.intro}
          </p>
          <Tabs
            tabs={project.iterations.rounds.map((round, i) => {
              const { label, rest } = splitLabel(round);
              return {
                label: `Iteration ${i + 1}`,
                content: (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Zoomable
                      className="sm:w-1/2"
                      onClick={() => openLightbox({ label })}
                    >
                      <PlaceholderImage
                        label={`[Image placeholder — ${label}]`}
                        className="aspect-video w-full"
                      />
                    </Zoomable>
                    <div className="sm:w-1/2">
                      <p className="font-heading text-xs uppercase tracking-widest text-gray-500">
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {parseRichText(rest)}
                      </p>
                    </div>
                  </div>
                ),
              };
            })}
          />
        </Block>
        )}

        {!project.hideDesignSystem && (
        <Block
          id="design-system"
          eyebrow={numbered("Design System")}
          title={project.sectionTitles?.designSystem}
        >
          <p className="max-w-5xl text-base leading-relaxed text-gray-700">
            {parseRichText(project.designSystem)}
          </p>
          <MediaGrid items={project.media?.designSystem} onImageClick={openLightbox} grey />
          {project.copywriting && (
            <div id="copywriting" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">Copywriting Guidelines</h3>
              <p className="mt-3 text-base leading-relaxed text-gray-700">{project.copywriting}</p>
              <MediaGrid items={project.media?.copywriting} onImageClick={openLightbox} />
            </div>
          )}
          {project.aiDesignDecisions && (
            <div id="ai-design-decisions" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">AI-design decisions</h3>
              <div className="mt-3 flex flex-col gap-6 sm:flex-row sm:items-start">
                <p className="text-base leading-relaxed text-gray-700 sm:w-1/2">
                  {parseRichText(project.aiDesignDecisions)}
                </p>
                <div className="rounded-lg bg-gray-100 p-3 sm:w-1/2">
                  <Zoomable
                    onClick={() =>
                      openLightbox({ src: project.aiDesignDecisionsImage, label: "AI-design decisions" })
                    }
                  >
                    {project.aiDesignDecisionsImage ? (
                      <img
                        src={project.aiDesignDecisionsImage}
                        alt="AI-design decisions"
                        className="block h-auto w-full rounded-lg"
                      />
                    ) : (
                      <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
                    )}
                  </Zoomable>
                </div>
              </div>
            </div>
          )}
        </Block>
        )}

        {project.mvpSection && (
        <Block
          id="mvp"
          eyebrow={numbered(project.mvpSection.label)}
          title={project.mvpSection.title}
        >
          {project.mvpSection.text && (
            <p className="max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
              {parseRichText(project.mvpSection.text)}
            </p>
          )}
          {project.mvpSection.items && project.mvpSection.items.length > 0 && (
            <div className="mt-8 grid grid-cols-1 items-center gap-x-8 gap-y-8 sm:grid-cols-[2fr_1fr] sm:gap-y-10">
              {project.mvpSection.items.flatMap((item, i) => [
                <div key={`image-${i}`} className="rounded-lg bg-gray-100 p-8 sm:p-[4.5rem]">
                  <Zoomable onClick={() => openLightbox({ src: item.src, label: item.label })}>
                    {item.src ? (
                      <BrowserFrame>
                        <img src={item.src} alt={item.label} className="block h-auto w-full" />
                      </BrowserFrame>
                    ) : (
                      <PlaceholderImage label="[Image placeholder]" className="aspect-video w-full" />
                    )}
                  </Zoomable>
                </div>,
                <div key={`text-${i}`}>
                  <p className="font-serif text-2xl font-semibold text-gray-900">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.description}</p>
                </div>,
              ])}
            </div>
          )}
        </Block>
        )}

        {!project.hideFinalFlow && (
        <Block
          id="final-flow"
          eyebrow={numbered(project.finalFlowLabel || "Final flow")}
          title={project.sectionTitles?.finalFlow}
        >
          {project.finalFlow && (
            <p className="max-w-5xl text-base leading-relaxed text-gray-700">{project.finalFlow}</p>
          )}
          {project.finalFlowWallProjection || project.finalFlowDeviceFrame ? (
            <FinalFlowMockups project={project} openLightbox={openLightbox} />
          ) : (
            !project.hideFinalFlowScreenshot && (
              <Zoomable
                className="mt-6 max-w-5xl"
                onClick={() => openLightbox({ label: "Final flow screenshot" })}
              >
                <PlaceholderImage label="[Final flow screenshot]" className="aspect-video w-full" />
              </Zoomable>
            )
          )}
          {project.finalFlowFeatures && project.finalFlowFeatures.length > 0 && (
            <div className="mt-6 grid max-w-6xl grid-cols-[3fr_1fr] items-center gap-x-6 gap-y-24">
              {project.finalFlowFeatures.flatMap((feature, i) => [
                feature.video ? (
                  <FeatureVideo key={`image-${i}`} src={feature.video} label={feature.label} />
                ) : (
                  <Zoomable
                    key={`image-${i}`}
                    onClick={() => openLightbox({ src: feature.image, label: feature.label })}
                  >
                    {feature.image ? (
                      <img
                        src={feature.image}
                        alt={feature.label}
                        className="block aspect-video w-full rounded-lg object-cover"
                      />
                    ) : (
                      <PlaceholderImage
                        label="[Image placeholder]"
                        className="aspect-video w-full"
                      />
                    )}
                  </Zoomable>
                ),
                <div key={`text-${i}`}>
                  <p className="font-serif text-xl font-semibold">{feature.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">
                    {feature.description}
                  </p>
                </div>,
              ])}
            </div>
          )}
          <div className="mt-12">
            <MediaGrid items={project.media?.finalFlow} onImageClick={openLightbox} />
          </div>
          {project.showBackToTop && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  const container = scrollContainerRef?.current;
                  if (container) {
                    container.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-gray-900"
              >
                ↑ Back to top
              </button>
            </div>
          )}
        </Block>
        )}

        {!project.hideReflection && (project.reflection || project.reflectionCards) && (
        <Block
          id="reflection"
          eyebrow={numbered("Reflection")}
          title={project.sectionTitles?.reflection}
        >
          {project.reflection && (
            <p className="max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
              {project.reflection}
            </p>
          )}
          {project.reflectionCards && project.reflectionCards.length > 0 && (
            <div className="grid max-w-5xl gap-4 sm:grid-cols-2">
              {project.reflectionCards.map((card, i) => (
                <div key={i} className="rounded-lg border border-gray-300 p-4">
                  <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{card.description}</p>
                </div>
              ))}
            </div>
          )}
          {project.outcomeUnderReflection && !project.hideOutcome && (
            <div id="outcome" className="mt-10 max-w-5xl scroll-mt-24">
              <h3 className="font-serif text-2xl font-light sm:text-3xl">
                {project.sectionTitles?.outcome}
              </h3>
              {project.outcome && (
                <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-gray-700">
                  {project.outcome}
                </p>
              )}
              {project.outcomeCards && project.outcomeCards.length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.outcomeCards.map((card, i) => (
                    <div key={i} className="rounded-lg border border-gray-300 p-4">
                      <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-700">
                        {card.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <MediaGrid items={project.media?.outcome} onImageClick={openLightbox} />
            </div>
          )}
        </Block>
        )}

        {!project.outcomeUnderReflection && !project.hideOutcome && (
        <Block
          id="outcome"
          eyebrow={numbered(project.outcomeLabel || "Outcome")}
          title={project.sectionTitles?.outcome}
        >
          {project.outcome && (
            <p className="max-w-5xl whitespace-pre-line text-base leading-relaxed text-gray-700">
              {project.outcome}
            </p>
          )}
          {project.outcomeCards && project.outcomeCards.length > 0 && (
            <div className="mt-6 grid max-w-5xl gap-4 sm:grid-cols-2">
              {project.outcomeCards.map((card, i) => (
                <div key={i} className="rounded-lg border border-gray-300 p-4">
                  <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{card.description}</p>
                </div>
              ))}
            </div>
          )}
          <MediaGrid items={project.media?.outcome} onImageClick={openLightbox} />
        </Block>
        )}
      </main>
      <Lightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      {openLinkedSlug && (
        <LinkedCaseStudyModal slug={openLinkedSlug} onClose={() => setOpenLinkedSlug(null)} />
      )}
    </div>
  );
}

// Overlay showing a linked project's full case study without navigating away
// from the parent page. Starts as a large centered dialog with an option to
// expand to fill the screen; the back button always closes the overlay.
function LinkedCaseStudyModal({ slug, onClose }) {
  const linkedProject = projects.find((p) => p.slug === slug);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!linkedProject) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-0 sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-black"
          >
            ← Back
          </button>
          <Link
            to={`/work/${slug}`}
            onClick={onClose}
            aria-label="Open full page"
            className="text-gray-600 hover:text-black"
          >
            <FullScreenIcon expanded={false} />
          </Link>
        </div>
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          <CaseStudyContent project={linkedProject} isModal scrollContainerRef={scrollContainerRef} />
        </div>
      </div>
    </div>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <p className="text-2xl font-semibold">Couldn't find that project.</p>
        <Link to="/" className="mt-4 inline-block underline">
          back home
        </Link>
      </div>
    );
  }

  return <CaseStudyContent project={project} />;
}
