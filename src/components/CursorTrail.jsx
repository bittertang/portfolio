import { useEffect, useRef } from "react";

const CHARS = ["✦", "✧", "★", "◆", "✿", "⬥", "✺", "⟡"];
const TRAIL_LIFETIME = 700; // ms
const MIN_SPAWN_DIST = 18;
const BASE_SIZE = 16;

// A sparkle trail that follows the cursor, spawning a random glyph every
// few pixels of movement and fading/shrinking it out over its lifetime.
export default function CursorTrail() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const lastSpawnRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      const { x, y } = { x: e.clientX, y: e.clientY };
      const last = lastSpawnRef.current;
      if (last && Math.hypot(x - last.x, y - last.y) < MIN_SPAWN_DIST) return;
      lastSpawnRef.current = { x, y };
      particlesRef.current.push({
        x,
        y,
        char: CHARS[Math.floor(Math.random() * CHARS.length)],
        rotation: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.4,
        time: performance.now(),
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let raf;
    const draw = () => {
      const now = performance.now();
      particlesRef.current = particlesRef.current.filter((p) => now - p.time < TRAIL_LIFETIME);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current.forEach((p) => {
        const age = (now - p.time) / TRAIL_LIFETIME;
        const pop = Math.min(1, age / 0.15);
        const alpha = 1 - age;
        const size = BASE_SIZE * pop * (1 - age * 0.35);

        ctx.save();
        ctx.translate(p.x, p.y - age * 12);
        ctx.rotate(p.rotation + age * p.drift);
        ctx.font = `${size}px sans-serif`;
        ctx.fillStyle = `rgba(30, 30, 30, ${alpha})`;
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-40" aria-hidden="true" />
  );
}
