import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";

// The cards rise in from below the first time the home page loads, but not
// again when you come back to the Works tab.
let introPlayed = false;

// Exported so other pages (e.g. the linked-case-study cards on a case study
// page) can reuse the exact same card UI and hover animation as the home
// page. Passing `onClick` renders it as a button (e.g. to open a modal)
// instead of a Link.
export function ProjectTile({ project, className = "", style, imageHeight = "h-44", onClick }) {
  const Wrapper = onClick ? "button" : project.slug ? Link : "div";
  const wrapperProps = onClick
    ? { type: "button", onClick }
    : project.slug
      ? { to: `/work/${project.slug}` }
      : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={style}
      className={`group flex w-full flex-col overflow-hidden rounded-lg border border-gray-200 p-4 text-left shadow-sm transition-shadow duration-300 hover:shadow-xl ${className}`}
    >
      {/* Square corners — no rounding on the cover itself, and no fill
          behind it — the rounding/border live on the card around it. Matches
          the Works-grid cards (ProjectRow) so linked case studies read as the
          same visual family. */}
      <div className={`relative w-full overflow-hidden rounded-none ${imageHeight}`}>
        {project.heroVideo ? (
          <video
            src={project.heroVideo}
            loop
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-80"
          />
        ) : project.heroImage ? (
          <img
            src={project.heroImage}
            alt={`${project.title} cover`}
            className={`h-full w-full transition-opacity duration-300 group-hover:opacity-80 ${
              project.heroImageCompact ? "object-contain" : "object-cover"
            }`}
          />
        ) : (
          <div className="relative h-full w-full bg-gray-100">
            <span className="absolute left-6 top-6 text-[10px] uppercase tracking-widest text-gray-400">
              [Cover image coming soon]
            </span>
          </div>
        )}
        {/* Tags slide down from the top of the image on hover. */}
        {project.tags && project.tags.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex -translate-y-2 flex-wrap gap-2 p-3 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/95 px-3 py-1 text-xs lowercase text-gray-800 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 pb-2 pt-5">
        <h2 className="font-serif text-lg font-light leading-snug text-balance text-gray-900 sm:text-xl">
          {project.title}
        </h2>
        <p className="text-sm text-gray-700">{project.tagline}</p>
      </div>
    </Wrapper>
  );
}

// Every card's cover is this same size — big, and matching across all three.
const IMAGE_HEIGHT = "h-80 sm:h-[26rem]";
// Cards whose cover is shown uncropped (object-contain) leave empty space
// above and below the media itself — a shorter box keeps that gap in check.
const COMPACT_IMAGE_HEIGHT = "h-56 sm:h-72";

// A single card in the two-column Works list: the cover media on top, a
// serif headline underneath it. Separate from `ProjectTile` above (which the
// linked-case-study cards still use) since the two live in very different
// layouts.
function ProjectRow({ project, style, animateClass }) {
  // `column-span: all` breaks a card out of the two-column flow to span the
  // full row — CSS multi-column's equivalent of a grid item spanning both
  // columns. No Tailwind utility for it, so it's set directly.
  const rowStyle = project.listFullWidth ? { ...style, columnSpan: "all" } : style;
  const imageHeight =
    project.listHeroContain || project.heroImageCompact ? COMPACT_IMAGE_HEIGHT : IMAGE_HEIGHT;

  return (
    <Link
      to={`/work/${project.slug}`}
      style={rowStyle}
      className={`group mb-6 flex break-inside-avoid flex-col overflow-hidden rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow duration-300 hover:shadow-xl ${animateClass}`}
    >
      {/* Square corners — no rounding on the cover itself, and no fill
          behind it — the rounding/border live on the card around it. */}
      <div className={`relative w-full overflow-hidden rounded-none ${imageHeight}`}>
        {project.heroVideo ? (
          <video
            src={project.heroVideo}
            loop
            autoPlay
            muted
            playsInline
            className={`h-full w-full transition-opacity duration-300 group-hover:opacity-80 ${
              project.listHeroContain ? "object-contain" : "object-cover"
            }`}
          />
        ) : project.heroImage ? (
          <img
            src={project.heroImage}
            alt={`${project.title} cover`}
            className={`h-full w-full transition-opacity duration-300 group-hover:opacity-80 ${
              project.heroImageCompact ? "object-contain" : "object-cover"
            }`}
          />
        ) : (
          <div className="h-full w-full" aria-hidden="true" />
        )}
        {/* Tags slide down from the top of the image on hover. */}
        {project.tags && project.tags.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex -translate-y-2 flex-wrap gap-2 p-3 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/95 px-3 py-1 text-xs lowercase text-gray-800 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 pb-2 pt-5">
        {project.listTitle ? (
          <>
            <h2 className="font-serif font-light text-lg leading-snug text-balance text-gray-900 sm:text-xl">
              {project.listTitle}
            </h2>
            <p className="font-sans text-sm text-gray-500">{project.listHeadline || project.tagline}</p>
          </>
        ) : (
          <h2 className="font-serif font-light text-lg leading-snug text-balance text-gray-900 sm:text-xl">
            {project.listHeadline || project.tagline}
          </h2>
        )}
      </div>
    </Link>
  );
}

export default function ProjectGrid() {
  const [animate] = useState(() => !introPlayed);
  useEffect(() => {
    introPlayed = true;
  }, []);

  const visibleProjects = projects.filter((p) => !p.hideFromHome);

  return (
    <div className="columns-1 gap-6 sm:columns-2">
      {visibleProjects.map((project, i) => (
        <ProjectRow
          key={project.slug}
          project={project}
          animateClass={animate ? "motion-safe:animate-rise-up" : ""}
          style={animate ? { animationDelay: `${0.1 + i * 0.1}s` } : undefined}
        />
      ))}
    </div>
  );
}
