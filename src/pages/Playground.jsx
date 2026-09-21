import { useEffect, useLayoutEffect, useRef, useState } from "react";
import makeMyDay from "../assets/garden/make-my-day.mp4";
import iParent from "../assets/garden/iparent.webp";
import tapTapLove from "../assets/garden/taptaplove.webp";
import corporateWorkPolice from "../assets/garden/corporate-work-police.mp4";

const MIN_SCALE = 0.25;
const MAX_SCALE = 3;
// The canvas opens (and resets) zoomed out a little so more of it is in view.
const START_SCALE = 0.7;
const GRID = 32;

// Everything lives in "world" coordinates, with (0, 0) at the middle of the
// first view. Add, move, or remove items here freely — the canvas has no edges.
const ITEMS = [
  {
    id: "make-my-day",
    video: makeMyDay,
    label: "Make My Day app demo",
    aspect: "9 / 16",
    x: -800,
    y: -215,
    w: 240,
    // Hovering the media opens a card around it with the details on its right.
    card: {
      title: "MakeMyDay",
      description:
        "Walking itinerary planner. Upon inputting an initial location, the app returns highly rated locations within walking distance to add to your itinerary.",
      tags: ["React Native", "Vibecoding", "Places API"],
    },
  },
  {
    id: "iparent",
    image: iParent,
    label: "iParent board game prototype",
    aspect: "1404 / 792",
    x: 340,
    y: -122,
    w: 260,
    card: {
      title: "iParent",
      description:
        "A digital parenting board game inspired by the Game of Life. Players, taking on the role of parents, face digital ethics scenarios with their hypothetical child, while trying to balance trust and safety.",
      tags: ["3D Printing", "Game Design"],
    },
  },
  {
    id: "tap-tap-love",
    image: tapTapLove,
    label: "Tap, Tap, Love. game",
    aspect: "1326 / 970",
    x: 0,
    y: 84,
    w: 240,
    card: {
      title: "Tap, Tap, Love.",
      description:
        "Interactive compatibility game where 2 participants answer a series of this-or-that questions that determine whether they’re soulmates... or not.\n\nWarning: can get awkward.",
      tags: ["3D Printing", "Arduino", "TinkerCAD"],
    },
  },
  {
    id: "corporate-screen-police",
    video: corporateWorkPolice,
    label: "Corporate Screen Police demo",
    aspect: "16 / 9",
    x: -330,
    y: -362,
    w: 260,
    card: {
      title: "Corporate Screen Police",
      description:
        "A light sensor that detects a corporate worker’s productivity through the light on their work computer... and blasts an alarm when it goes dark.\n\n(Disclaimer: this is not a real product!)",
      tags: ["Sensors", "Arduino"],
    },
  },
];

const CARD_TEXT_W = 260;

// A video or image on the canvas. Hovering (or focusing) it opens a white card
// around it with the details to its right. The text sits in normal flow, so the
// card is as tall as its content and the media stays centred inside it.
function MediaItem({ item, pos, raised }) {
  const { card } = item;
  const shown =
    "group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100";
  // Raised off the canvas at rest; the shadow hands over to the card's own once
  // it opens.
  // The card folds away while the project is being dragged around.
  const hideCard = raised ? { opacity: 0 } : undefined;
  const mediaClass =
    "block w-full max-w-none rounded-2xl object-cover shadow-lg shadow-gray-900/15 ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-none group-focus-within:shadow-none";

  return (
    <div
      data-drag-id={item.id}
      className="group pointer-events-none absolute grid items-center hover:z-20 focus-within:z-20"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: raised ? 30 : undefined,
        gridTemplateColumns: `${item.w}px ${CARD_TEXT_W}px`,
        columnGap: 24,
      }}
    >
      {card && (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -bottom-3 -left-6 -right-8 -top-3 origin-left scale-95 rounded-3xl border border-gray-200 bg-white opacity-0 shadow-2xl transition duration-300 ease-out group-hover:scale-100 group-focus-within:scale-100 ${shown}`}
          style={hideCard}
        />
      )}

      <div tabIndex={card ? 0 : undefined} className="pointer-events-auto relative col-start-1 cursor-grab outline-none active:cursor-grabbing">
        {item.video ? (
          <video
            src={item.video}
            aria-label={item.label}
            autoPlay
            loop
            muted
            playsInline
            draggable={false}
            className={mediaClass}
            style={{ aspectRatio: item.aspect }}
          />
        ) : (
          <img
            src={item.image}
            alt={item.label}
            draggable={false}
            className={mediaClass}
            style={{ aspectRatio: item.aspect }}
          />
        )}
      </div>

      {card && (
        <div
          className={`pointer-events-none relative col-start-2 -translate-x-2 py-1 opacity-0 transition duration-300 ease-out group-hover:translate-x-0 group-focus-within:translate-x-0 ${shown}`}
          style={hideCard}
        >
          <h2 className="font-serif text-3xl font-semibold text-gray-900">{card.title}</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-gray-600">{card.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {card.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-gray-400/40 px-3 py-1 text-xs uppercase tracking-wide text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function Playground() {
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(ITEMS.map((item) => [item.id, { x: item.x, y: item.y }])),
  );
  const [dragging, setDragging] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: START_SCALE });

  // Zoom keeping the world point under (px, py) fixed on screen.
  const zoomAt = (px, py, factor) => {
    setView((v) => {
      const scale = clamp(v.scale * factor, MIN_SCALE, MAX_SCALE);
      const ratio = scale / v.scale;
      return { scale, x: px - (px - v.x) * ratio, y: py - (py - v.y) * ratio };
    });
  };

  const zoomFromCenter = (factor) => {
    const rect = containerRef.current.getBoundingClientRect();
    zoomAt(rect.width / 2, rect.height / 2, factor);
  };

  const resetView = () => {
    const rect = containerRef.current.getBoundingClientRect();
    setView({ x: rect.width / 2, y: rect.height / 2, scale: START_SCALE });
  };

  // Start with the world origin in the middle of the canvas.
  useLayoutEffect(() => {
    const rect = containerRef.current.getBoundingClientRect();
    setView({ x: rect.width / 2, y: rect.height / 2, scale: START_SCALE });
  }, []);

  // Trackpad scroll pans; pinch (ctrl+wheel) and cmd+scroll zoom at the cursor.
  useEffect(() => {
    const el = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) {
        zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.01));
      } else {
        setView((v) => ({ ...v, x: v.x - e.deltaX, y: v.y - e.deltaY }));
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Pressing on a project picks it up; pressing anywhere else pans the canvas.
  const onPointerDown = (e) => {
    if (e.target.closest("[data-canvas-ui]")) return;
    const itemId = e.target.closest("[data-drag-id]")?.dataset.dragId ?? null;
    dragRef.current = { x: e.clientX, y: e.clientY, itemId };
    setActiveId(itemId);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const drag = dragRef.current;
    if (!drag) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    dragRef.current = { ...drag, x: e.clientX, y: e.clientY };
    if (drag.itemId) {
      // Screen movement maps to world movement through the zoom level.
      setPositions((prev) => ({
        ...prev,
        [drag.itemId]: {
          x: prev[drag.itemId].x + dx / view.scale,
          y: prev[drag.itemId].y + dy / view.scale,
        },
      }));
    } else {
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
    }
  };

  const endDrag = () => {
    dragRef.current = null;
    setActiveId(null);
    setDragging(false);
  };

  const gridSize = GRID * view.scale;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative h-[calc(100vh-18rem)] min-h-[26rem] w-full select-none overflow-hidden bg-white ${
        dragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{
        touchAction: "none",
        backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1.2px)",
        backgroundSize: `${gridSize}px ${gridSize}px`,
        backgroundPosition: `${view.x}px ${view.y}px`,
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {ITEMS.map((item) =>
          item.video || item.image ? (
            <MediaItem key={item.id} item={item} pos={positions[item.id]} raised={activeId === item.id} />
          ) : (
            <p
              key={item.id}
              className="absolute text-center font-serif text-4xl font-light text-gray-900"
              style={{ left: item.x, top: item.y, width: item.w }}
            >
              {item.text}
            </p>
          ),
        )}
      </div>

      <div
        data-canvas-ui
        className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-gray-200 bg-white/90 p-1 text-sm shadow-sm backdrop-blur"
      >
        <button
          type="button"
          onClick={() => zoomFromCenter(1 / 1.25)}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset view"
          className="font-heading min-w-[3.5rem] rounded-full px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
        >
          {Math.round(view.scale * 100)}%
        </button>
        <button
          type="button"
          onClick={() => zoomFromCenter(1.25)}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
        >
          +
        </button>
      </div>

      <p className="pointer-events-none absolute right-4 top-4 hidden text-xs text-gray-400 sm:block">
        Hover to learn more!
      </p>
    </div>
  );
}
