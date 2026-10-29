"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * Renders any `<pre class="mermaid">` blocks in the note body into SVG diagrams.
 * Mermaid (~large) is dynamically imported only on note pages that use it, and
 * the diagrams re-render when the light/dark theme changes. The raw source is
 * cached in `data-src` so a re-render can restore it before drawing again.
 */
export function Mermaid() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("pre.mermaid"),
      );
      if (nodes.length === 0) return;

      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: resolvedTheme === "dark" ? "dark" : "default",
        securityLevel: "strict",
        fontFamily: "var(--font-sans)",
      });

      for (const el of nodes) {
        // Preserve the original definition so theme switches can redraw.
        if (!el.dataset.src) el.dataset.src = el.textContent ?? "";
        el.removeAttribute("data-processed");
        el.innerHTML = el.dataset.src ?? "";
      }

      try {
        await mermaid.run({ nodes });
      } catch {
        // Leave the raw definition visible if a diagram fails to parse.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolvedTheme]);

  return null;
}
