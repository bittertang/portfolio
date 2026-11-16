import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import posthog from "posthog-js";
import Home from "./pages/Home";
import Works from "./pages/Works";
import CaseStudy from "./pages/CaseStudy";
import About from "./pages/About";
import Playground from "./pages/Playground";

// The three home tabs share one page shell, so moving between them keeps the
// scroll position. Everything else (opening or leaving a case study) starts at
// the top — unless it was opened from a home-grid preview, in which case the
// case study page restores the reader's position itself.
const TAB_PATHS = ["/", "/playground", "/about"];

function PageViewTracker() {
  const location = useLocation();

  useEffect(() => {
    posthog.capture("$pageview");
  }, [location]);

  return null;
}

function ScrollToTop() {
  const { pathname, state } = useLocation();
  const previous = useRef(pathname);

  useEffect(() => {
    const switchedTabs = TAB_PATHS.includes(previous.current) && TAB_PATHS.includes(pathname);
    previous.current = pathname;
    if (!switchedTabs && !state?.fromPreview && !state?.preview) window.scrollTo(0, 0);
    // Only a path change should trigger this; `state` is read, not watched.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen pb-12">
      <ScrollToTop />
      <PageViewTracker />
      <Routes>
        <Route element={<Home />}>
          <Route path="/" element={<Works />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/about" element={<About />} />
        </Route>
        <Route path="/work/:slug" element={<CaseStudy />} />
      </Routes>
    </div>
  );
}
