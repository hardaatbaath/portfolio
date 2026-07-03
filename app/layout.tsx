import type { Metadata, Viewport } from "next";
import { Geist, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { identity } from "@/site.config";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { CommandPalette } from "@/components/command-palette";
import { Analytics } from "@/components/analytics";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const description = `${identity.name} — ${identity.tagline} A personal workshop of projects, technical writing, and reflections.`;

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title: {
    default: `${identity.name} — ${identity.roles[0]}`,
    template: `%s · ${identity.name}`,
  },
  description,
  keywords: ["AI Engineer", "Systems Programmer", "Researcher", identity.name],
  authors: [{ name: identity.name }],
  openGraph: {
    type: "website",
    title: `${identity.name} — ${identity.roles.join(", ")}`,
    description,
    url: identity.siteUrl,
    siteName: identity.name,
  },
  twitter: { card: "summary_large_image", title: identity.name, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <ThemeProvider>
          <a
            href="#overview"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
          >
            Skip to content
          </a>
          <Navigation />
          <CommandPalette />
          <div className="lg:pl-72">
            <main className="mx-auto max-w-4xl px-6 pt-20 md:px-10 lg:pt-0">
              {children}
            </main>
          </div>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
