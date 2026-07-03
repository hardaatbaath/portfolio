"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Fade + slide-up on scroll into view (once). Renders an identical tree on
 * server and client to avoid hydration mismatches; reduced-motion is handled
 * globally by <MotionConfig reducedMotion="user"> in the theme provider, which
 * makes these animations resolve instantly for users who prefer less motion.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
