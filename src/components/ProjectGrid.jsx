import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";

// How many projects share the first horizontal row. Any beyond this render
// below in a plain grid.
const FEATURED_COUNT = 3;

// The cards rise in from below the first time the home page loads, but not
// again when you come back to the Works tab.
let introPlayed = false;

// Exported so other pages (e.g. the linked-case-study cards on a case study
// page) can reuse the exact same card UI and hover animation as the home
// page. Passing `onClick` renders it as a button (e.g. to open a modal)
// instead of a Link.
export function ProjectTile({
  project,
  className = "",
  style,
  imageHeight = "h-44",
  onClick,
  alwaysExpanded = false,
}) {
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
      className={`group relative z-0 flex min-h-[12rem] w-full flex-col text-left hover:z-20 ${className}`}
    >
      {/* On the home page the tags appear over the cover on hover. Where the
          card is always expanded (linked case studies), they sit in the
          caption instead. */}
      <div className={`${imageHeight} w-full rounded-t-lg p-2`}>
        <div className="relative h-full w-full overflow-hidden rounded-md">
          <div className="h-full w-full transition-opacity duration-300 group-hover:opacity-70">
            {project.heroVideo ? (
              <video
                src={project.heroVideo}
                loop
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : project.heroImage ? (
              <img
                src={project.heroImage}
                alt={`${project.title} cover`}
                className={`h-full w-full ${project.heroImageCompact ? "object-contain" : "object-cover"}`}
              />
            ) : (
              <div className="relative h-full w-full bg-gray-100">
                <span className="absolute left-6 top-6 text-[10px] uppercase tracking-widest text-gray-400">
                  [Cover image coming soon]
                </span>
              </div>
            )}
          </div>
          {!alwaysExpanded && project.tags && project.tags.length > 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 flex-wrap gap-2 p-3 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
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
      </div>

      <div className="flex-1 rounded-b-lg bg-white px-6 py-4">
        <h2 className="font-serif text-lg font-semibold text-gray-900">{project.title}</h2>
        <p className="mt-1 text-sm text-gray-700">{project.tagline}</p>
        {alwaysExpanded && project.tags && project.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-400/40 px-3 py-1 text-xs lowercase text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default function ProjectGrid({ startDelay = 0 }) {
  const [animate] = useState(() => !introPlayed);
  useEffect(() => {
    introPlayed = true;
  }, []);

  const visibleProjects = projects.filter((p) => !p.hideFromHome);
  const featured = visibleProjects.slice(0, FEATURED_COUNT);
  const rest = visibleProjects.slice(FEATURED_COUNT);

  // Stagger each card slightly so they arrive one after another.
  const riseProps = (index) =>
    animate
      ? { style: { animationDelay: `${startDelay + 0.25 + index * 0.15}s` }, animateClass: "motion-safe:animate-rise-up" }
      : { animateClass: "" };

  return (
    <div>
      <div className="flex flex-col gap-8 lg:flex-row">
        {featured.map((project, i) => {
          const { style, animateClass } = riseProps(i);
          return (
            <ProjectTile
              key={project.slug}
              project={project}
              imageHeight="h-80"
              className={`lg:flex-1 ${animateClass}`}
              style={style}
            />
          );
        })}
      </div>

      {rest.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project, i) => {
            const { style, animateClass } = riseProps(featured.length + i);
            return (
              <ProjectTile
                key={project.slug}
                project={project}
                className={`min-h-[16rem] ${animateClass}`}
                style={style}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
