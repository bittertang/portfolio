import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";
import LetterReveal from "./LetterReveal";

// Breaks a label into lines of at most `max` characters, wrapping on word
// boundaries so long subsection labels don't run past the nav column.
function wrapLabel(text, max = 24) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function getSections(project) {
  return [
    !project.hideOverview && { id: "overview", label: "Overview" },
    !project.hideContext && { id: "problem", label: project.contextLabel || "Context" },
    project.solution && { id: "solution", label: "Solution" },
    !project.hideResearch && { id: "research", label: project.researchLabel || "Research" },
    !project.hidePrototyping && { id: "prototyping", label: project.prototypingLabel || "Design" },
    project.round2TestingSection && { id: "round-2-testing", label: "Round 2 Testing" },
    project.nextSteps && { id: "next-steps", label: "Next Steps" },
    !project.hideUsabilityTesting && { id: "failed-concepts", label: "Usability Testing" },
    !project.hideIterations && { id: "iterations", label: "Iterations" },
    !project.hideDesignSystem && { id: "design-system", label: "Design System" },
    project.mvpSection && { id: "mvp", label: project.mvpSection.label },
    !project.hideFinalFlow && { id: "final-flow", label: project.finalFlowLabel || "Final flow" },
    !project.hideReflection &&
      (project.reflection || project.reflectionCards) && {
        id: "reflection",
        label: "Reflection",
      },
    !project.outcomeUnderReflection &&
      !project.hideOutcome && { id: "outcome", label: project.outcomeLabel || "Outcome" },
  ].filter(Boolean);
}

export default function CaseStudySidebar({
  project,
  subsections = {},
  scrollContainerRef,
  hideAllWorkLink = false,
}) {
  const SECTIONS = getSections(project);
  const hasTags = project.tags && project.tags.length > 0;
  const flatIds = SECTIONS.flatMap((s) => [s.id, ...(subsections[s.id] || []).map((sub) => sub.id)]);
  const activeId = useActiveSection(flatIds, scrollContainerRef);

  const scrollToId = (id) => (e) => {
    const container = scrollContainerRef?.current;
    if (!container) return;
    e.preventDefault();
    container.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const activeSectionId =
    SECTIONS.find((s) => s.id === activeId || (subsections[s.id] || []).some((sub) => sub.id === activeId))
      ?.id ?? activeId;
  const itemRefs = useRef({});
  const [markerTop, setMarkerTop] = useState(0);

  useEffect(() => {
    const el = itemRefs.current[activeSectionId];
    if (el) {
      setMarkerTop(el.offsetTop + el.offsetHeight / 2);
    }
  }, [activeSectionId]);

  // Two alignments, both set imperatively and re-measured via ResizeObserver
  // (not just on scroll/resize), since the main content's height shifts once
  // its hero image/video finishes loading:
  //   - the wrapper's margin-top pushes the whole group down so the bottom
  //     of the meta block (Role/Tools/Timeline/Team) lines up with the
  //     bottom of the hero image.
  //   - the nav's own margin-top then adds whatever extra gap (on top of its
  //     normal flex gap from the meta block) is needed so its top lines up
  //     with a further point in the main content: the hero image's bottom
  //     too by default (so no extra gap), or, when a project opts in via
  //     `alignTocWithContext`, the border under Overview instead (the one
  //     above "01 — Context").
  const navWrapperRef = useRef(null);
  const metaRef = useRef(null);
  const navRef = useRef(null);
  useEffect(() => {
    const container = scrollContainerRef?.current;
    const q = (id) => (container ? container.querySelector(`#${id}`) : document.getElementById(id));
    const heroImage = q("hero-image");
    const navWrapperEl = navWrapperRef.current;
    const metaEl = metaRef.current;
    const navEl = navRef.current;
    if (!heroImage || !navWrapperEl || !metaEl) return undefined;

    // The hero's actual media, rather than its wrapper — in the modal a
    // compact hero's wrapper reserves extra blank space below/around it (so
    // nothing peeks in before scrolling), which would otherwise push the
    // meta block down to the wrapper's bottom instead of the visible media.
    const heroMedia = heroImage.querySelector("video, img") || heroImage;

    // Only present when the nav (table of contents) is actually rendered —
    // some projects hide it via `hideToc`, in which case there's nothing
    // beyond the meta-to-hero alignment below to do.
    const navTarget = navEl && (project.alignTocWithContext ? q("overview") : heroMedia);

    const update = () => {
      // Below `lg`, the sidebar stacks above the main content instead of
      // sitting beside it, so there's nothing to align with.
      if (window.innerWidth < 1024) {
        navWrapperEl.style.marginTop = "";
        if (navEl) navEl.style.marginTop = "";
        return;
      }
      navWrapperEl.style.marginTop = "0px";
      if (navEl) navEl.style.marginTop = "0px";
      const heroBottom = heroMedia.getBoundingClientRect().bottom;
      const metaBottom = metaEl.getBoundingClientRect().bottom;
      navWrapperEl.style.marginTop = `${Math.max(0, heroBottom - metaBottom)}px`;

      if (navEl && navTarget) {
        // Measured after the wrapper shift above, so this already reflects
        // the normal flex gap below the meta block — only the extra gap
        // needed to reach navTarget gets added on top of that.
        const navNaturalTop = navEl.getBoundingClientRect().top;
        const navTargetBottom = navTarget.getBoundingClientRect().bottom;
        navEl.style.marginTop = `${Math.max(0, navTargetBottom - navNaturalTop)}px`;
      }
    };

    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(heroImage);
    if (heroMedia !== heroImage) resizeObserver.observe(heroMedia);
    if (navTarget && navTarget !== heroImage && navTarget !== heroMedia) resizeObserver.observe(navTarget);
    window.addEventListener("resize", update);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [scrollContainerRef, project.slug, project.alignTocWithContext]);

  // Whether the sticky nav has actually locked in place (its top sitting at
  // the `lg:top-10` offset) rather than just sitting in normal flow above
  // that point — determines whether the "all work" shortcut above it shows.
  const [navStuck, setNavStuck] = useState(false);
  useEffect(() => {
    const navEl = navRef.current;
    if (!navEl) return undefined;
    const container = scrollContainerRef?.current;

    const update = () => {
      if (window.innerWidth < 1024) {
        setNavStuck(false);
        return;
      }
      // The `lg:top-10` pin point is 41px below the scrolling container's
      // own top — which is the viewport's top (0) for the full page, but
      // sits lower (below the modal's header) inside the modal.
      const containerTop = container ? container.getBoundingClientRect().top : 0;
      setNavStuck(navEl.getBoundingClientRect().top <= containerTop + 41);
    };

    const scrollTarget = container || window;
    update();
    scrollTarget.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      scrollTarget.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollContainerRef, project.slug]);

  return (
    // Same frame as HomeSidebar (width, background, padding) — only the nav
    // content differs — so the left column doesn't visibly shift moving
    // between the landing page and a case study. Only the nav itself is
    // sticky — the title/tagline and meta block (Role/Tools/Timeline/Team)
    // above it scroll away normally, and once the nav reaches its aligned
    // position it locks in place for the rest of the scroll (the aside
    // stretches to match the full page height, giving it room to).
    <div className="flex h-full flex-col gap-8 px-8 py-10">
      <div>
        {!hideAllWorkLink && (
          <Link to="/" className="text-xs text-gray-500 hover:text-black">
            ← all work
          </Link>
        )}

        {hasTags && (
          <div className={`flex flex-wrap gap-2 ${hideAllWorkLink ? "" : "mt-6"}`}>
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

        <LetterReveal
          key={`title-${project.slug}`}
          as="h1"
          text={project.title}
          className={`font-serif text-2xl font-light leading-snug text-gray-900 ${
            hideAllWorkLink && !hasTags ? "" : "mt-4"
          }`}
        />

        {project.tagline && (
          <p
            key={`tagline-${project.slug}`}
            className="motion-safe:animate-drop-in mt-3 text-sm text-gray-600"
            style={{ animationDelay: "250ms" }}
          >
            {project.tagline}
          </p>
        )}
      </div>

      {/* flex-1 (not just sticky's own doing) gives the nav inside room to
          roam for the whole remaining scroll — without it, this wrapper is
          only as tall as its own content and the nav un-sticks almost
          immediately once scrolled past. */}
      <div ref={navWrapperRef} className="flex flex-1 flex-col gap-6">
        {/* The ref'd wrapper itself is never transformed — only its child
            is — so its measured position/height (used for the hero-bottom
            alignment below) stays correct from the very first frame,
            instead of the whole block visibly re-settling once the reveal
            animation finishes playing. */}
        <div ref={metaRef} className="flex flex-col gap-4">
          <div
            key={project.slug}
            className="motion-safe:animate-drop-in flex flex-col gap-4"
            style={{ animationDelay: "400ms" }}
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Role</p>
              <p className="mt-1 whitespace-pre-line text-xs text-gray-700">{project.meta.role}</p>
            </div>
            {project.meta.tools && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Tools</p>
                <p className="mt-1 whitespace-pre-line text-xs text-gray-700">{project.meta.tools}</p>
              </div>
            )}
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Timeline</p>
              <p className="mt-1 text-xs text-gray-700">{project.meta.timeline}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">Team</p>
              <p className="mt-1 whitespace-pre-line text-xs text-gray-700">{project.meta.team}</p>
            </div>
          </div>
        </div>

        {!project.hideToc && (
          <nav ref={navRef} className="lg:sticky lg:top-10">
            {!hideAllWorkLink && (
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  navStuck ? "mb-3 max-h-6 opacity-100" : "mb-0 max-h-0 opacity-0"
                }`}
              >
                <Link to="/" className="text-xs text-gray-500 hover:text-black">
                  ← all work
                </Link>
              </div>
            )}
            <ul className="relative space-y-0.5 pl-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-0.5 h-1.5 w-1.5 select-none rounded-full bg-black transition-[top] duration-300 ease-out"
                style={{ top: markerTop, transform: "translateY(-50%)" }}
              />
            {SECTIONS.map((s) => (
              <li key={s.id} ref={(el) => (itemRefs.current[s.id] = el)}>
                <a
                  href={`#${s.id}`}
                  onClick={scrollToId(s.id)}
                  className={`block py-1 text-xs transition-colors ${
                    activeId === s.id ? "font-semibold text-black" : "text-gray-500 hover:text-black"
                  }`}
                >
                  {s.label}
                </a>
                {activeSectionId === s.id && (subsections[s.id] || []).length > 0 && (
                  <ul className="space-y-0.5 border-l border-gray-200 pb-1 pl-3">
                    {subsections[s.id].map((sub) => (
                      <li key={sub.id}>
                        <a
                          href={`#${sub.id}`}
                          onClick={scrollToId(sub.id)}
                          className={`block py-1 text-xs transition-colors ${
                            activeId === sub.id ? "font-semibold text-black" : "text-gray-500 hover:text-black"
                          }`}
                        >
                          {wrapLabel(sub.label).map((line, i) => (
                            <span key={i} className="block">
                              {line}
                            </span>
                          ))}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
