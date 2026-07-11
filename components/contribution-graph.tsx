"use client";

import { GitHubCalendar } from "react-github-calendar";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { socials } from "@/site.config";

// Accent-tinted levels (empty → most active), tuned to the site palette.
const theme = {
  light: ["#e9ecf5", "#c3d4ff", "#8fb0ff", "#5b93ff", "#2563eb"],
  dark: ["#1b1f27", "#233a63", "#305aa0", "#4f8cff", "#9cc0ff"],
};

export function ContributionGraph() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="no-scrollbar overflow-x-auto text-muted [&_text]:fill-muted">
      <GitHubCalendar
        username={socials.githubUsername}
        theme={theme}
        colorScheme={mounted && resolvedTheme === "light" ? "light" : "dark"}
        blockSize={11}
        blockMargin={3}
        fontSize={12}
        showColorLegend={false}
        showTotalCount={false}
        style={{ maxWidth: "100%" }}
      />
    </div>
  );
}
