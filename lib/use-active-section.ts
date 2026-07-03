"use client";

import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section currently crossing the viewport's
 * middle band, and keeps the URL hash in sync (via replaceState, so links stay
 * shareable without polluting history).
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
      // A thin band across the vertical middle: whichever section sits there wins.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
