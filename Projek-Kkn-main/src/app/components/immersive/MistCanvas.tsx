import { memo, useEffect, useRef } from "react";

type Theme = "light" | "dark";

interface Palette {
  blobs: string[];
  dust: string; // "r, g, b"
}

const PALETTES: Record<Theme, Palette> = {
  dark: {
    blobs: [
      "rgba(18, 53, 36, 0.95)",
      "rgba(27, 67, 50, 0.85)",
      "rgba(10, 32, 20, 0.95)",
      "rgba(104, 64, 25, 0.45)",
      "rgba(245, 187, 137, 0.12)",
      "rgba(15, 40, 28, 0.9)",
    ],
    dust: "245, 221, 170",
  },
  light: {
    blobs: [
      "rgba(180, 206, 188, 0.55)",
      "rgba(214, 228, 205, 0.6)",
      "rgba(244, 166, 35, 0.16)",
      "rgba(169, 111, 44, 0.12)",
      "rgba(190, 214, 196, 0.5)",
      "rgba(231, 242, 235, 0.6)",
    ],
    dust: "150, 120, 60",
  },
};

/**
 * Ambient "living mist" backdrop rendered on a 2D canvas.
 * - Theme-aware palette (light + dark).
 * - Mobile-friendly: fewer particles, capped DPR, animation pauses when
 *   offscreen or when the tab is hidden, and respects reduced-motion.
 */
export const MistCanvas = memo(function MistCanvas({
  className = "",
  theme = "dark",
}: {
  className?: string;
  theme?: Theme;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pal = PALETTES[theme];
    const isMobile =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia?.("(pointer: coarse)").matches);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5);
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const blobCount = isMobile ? 4 : pal.blobs.length;
    const blobs = Array.from({ length: blobCount }).map((_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: (isMobile ? 200 : 280) + Math.random() * (isMobile ? 160 : 260),
      dx: (Math.random() - 0.5) * 0.14,
      dy: (Math.random() - 0.5) * 0.14,
      color: pal.blobs[i % pal.blobs.length],
    }));

    const dustCount = isMobile ? 22 : 56;
    const dust = Array.from({ length: dustCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      a: Math.random() * 0.4 + 0.1,
      dy: -(Math.random() * 0.25 + 0.05),
      dx: (Math.random() - 0.5) * 0.12,
    }));

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        b.x += b.dx;
        b.y += b.dy;
        if (b.x < -b.r) b.x = width + b.r;
        if (b.x > width + b.r) b.x = -b.r;
        if (b.y < -b.r) b.y = height + b.r;
        if (b.y > height + b.r) b.y = -b.r;
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const d of dust) {
        d.y += d.dy;
        d.x += d.dx;
        if (d.y < 0) d.y = height;
        if (d.x < 0) d.x = width;
        if (d.x > width) d.x = 0;
        ctx.fillStyle = "rgba(" + pal.dust + ", " + d.a + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (reduce) {
        drawStatic();
        return;
      }
      if (raf) cancelAnimationFrame(raf);
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    start();

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Pause when the hero (canvas) scrolls out of view to save battery / CPU.
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries[0]?.isIntersecting;
          if (visible) start();
          else stop();
        },
        { threshold: 0.01 },
      );
      observer.observe(canvas);
    }

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (observer) observer.disconnect();
    };
  }, [theme]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
});
