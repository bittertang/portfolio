import { useState } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import HomeSidebar from "../components/HomeSidebar";

// The order the tabs live in, used to pick which way the slide animation
// should travel (forward when moving right along this list, back otherwise).
const TAB_ORDER = ["/", "/playground", "/about"];

// Swaps in the routed tab content (Works/Garden/About) with a short slide,
// directionally matching whether the tab moved right or left along the nav.
// A fresh `key` on each switch remounts the wrapper so the CSS animation
// (which only plays forward, via the `both` fill mode) replays every time.
function TabOutlet() {
  const location = useLocation();
  const outlet = useOutlet();
  const [slot, setSlot] = useState(() => ({ path: location.pathname, node: outlet, dir: null }));

  // Adjusting state during render (rather than in an effect) here is the
  // React-endorsed way to derive state from a prop change — it re-renders
  // immediately with the new slot instead of committing a stale frame first.
  if (slot.path !== location.pathname) {
    const from = TAB_ORDER.indexOf(slot.path);
    const to = TAB_ORDER.indexOf(location.pathname);
    setSlot({ path: location.pathname, node: outlet, dir: to > from ? 1 : -1 });
  }

  const animateClass =
    slot.dir === 1
      ? "motion-safe:animate-tab-in-right"
      : slot.dir === -1
        ? "motion-safe:animate-tab-in-left"
        : "";

  return (
    <div key={slot.path} className={`overflow-x-clip ${animateClass}`}>
      {slot.node}
    </div>
  );
}

// The landing shell: a persistent sidebar (identity, nav, contact links) next
// to the routed tab content (works, garden, about), which swaps in place.
export default function Home() {
  return (
    <div>
      <div className="mx-auto max-w-[1800px]">
        {/* `fixed` (not `sticky`) so it never moves, even by the few px a
            sticky sidebar drifts once the page's scrollable area runs out
            near the bottom. The left offset re-derives where a centered
            max-w-[1800px] container's edge sits, since `fixed` positions
            against the viewport rather than this wrapper. */}
        <HomeSidebar className="border-b border-gray-200 lg:fixed lg:left-[max(0px,calc(50%-900px))] lg:top-0 lg:h-screen lg:w-[360px] lg:overflow-hidden lg:border-b-0" />
        <main className="min-w-0 lg:ml-[360px]">
          <TabOutlet />
        </main>
      </div>
    </div>
  );
}
