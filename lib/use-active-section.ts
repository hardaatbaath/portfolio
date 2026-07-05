"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll-spy: returns the id of the section crossing the viewport's middle band
 * and keeps the URL hash in sync. `select` is called on nav clicks to highlight
 * the target immediately and briefly suppress the observer, so clicking a short
 * section (which can't scroll into the middle band) still highlights correctly.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const lockUntil = useRef(0);

  const select = useCallback((id: string) => {
    setActive(id);
    // Ignore observer updates while the click-triggered smooth scroll settles.
    lockUntil.current =
      (typeof performance !== "undefined" ? performance.now() : 0) + 1000;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < lockUntil.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActive(id);
            if (typeof window !== "undefined" && window.location.hash !== `#${id}`) {
              window.history.replaceState(null, "", `#${id}`);
            }
          }
        }
      },
      // Thin band across the vertical middle: whichever section sits there wins.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return { active, select };
}
