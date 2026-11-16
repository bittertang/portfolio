import { useLayoutEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectGrid from "../components/ProjectGrid";
import { CaseStudyPreviewModal } from "./CaseStudy";
import { startPageHandoff } from "../lib/pageHandoff";

// Clicking a card opens its case study as a preview over the grid; the
// preview's expand button grows it to full screen and lands on the real
// case study page (which is that same full-screen frame). The page's shrink
// toggle comes back here with the preview reopened full screen, which then
// shrinks back down.
export default function Works() {
  const location = useLocation();
  const navigate = useNavigate();
  const [returning, setReturning] = useState(() => location.state?.preview ?? null);
  const [previewSlug, setPreviewSlug] = useState(() => returning?.slug ?? null);

  // Clear the hand-off from history so a refresh doesn't reopen the preview.
  useLayoutEffect(() => {
    if (returning) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 py-10 sm:px-10">
      <ProjectGrid onOpen={setPreviewSlug} />
      {previewSlug && (
        <CaseStudyPreviewModal
          key={previewSlug}
          slug={previewSlug}
          startExpanded={returning?.slug === previewSlug}
          initialScrollTop={returning?.slug === previewSlug ? returning.scrollTop : 0}
          onClose={() => {
            setPreviewSlug(null);
            setReturning(null);
          }}
          onExpandToPage={(scrollTop) =>
            startPageHandoff(() =>
              navigate(`/work/${previewSlug}`, { state: { fromPreview: { scrollTop } } }),
            )
          }
        />
      )}
    </div>
  );
}
