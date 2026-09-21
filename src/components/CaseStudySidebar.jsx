import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useActiveSection } from "../hooks/useActiveSection";

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
    { id: "overview", label: "Overview" },
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

  return (
    <div className="flex h-full flex-col gap-8 py-4 pl-3 pr-0 lg:py-6 lg:pl-4 lg:pr-0">
      <div>
        {!hideAllWorkLink && (
          <Link to="/" className="text-xs text-gray-500 hover:text-black">
            ← all work
          </Link>
        )}

        <nav className={hideAllWorkLink ? "" : "mt-8"}>
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
      </div>

    </div>
  );
}
