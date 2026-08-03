import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Recognition } from "@/components/sections/recognition";
import { Writing } from "@/components/sections/writing";
import { Reflections } from "@/components/sections/reflections";
import { Notes } from "@/components/sections/notes";
import { Reading } from "@/components/sections/reading";
import { Timeline } from "@/components/sections/timeline";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

// Re-render hourly so auto-fetched dev.to / Substack posts stay fresh (ISR).
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Recognition />
      <Writing />
      <Reflections />
      <Notes />
      <Reading />
      <Timeline />
      <Contact />
      <Footer />
    </>
  );
}
