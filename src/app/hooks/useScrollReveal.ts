import { useEffect, useRef, useState } from "react";

/**
 * Hook IntersectionObserver untuk efek scroll-reveal.
 * Tambahkan ref ke elemen, lalu terapkan class `is-visible` ketika `visible` true.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options?: { threshold?: number; once?: boolean; rootMargin?: string }
) {
  const { threshold = 0.15, once = true, rootMargin = "0px 0px -10% 0px" } = options ?? {};
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, visible };
}
