import type { MetadataRoute } from "next";
import { identity } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: identity.siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
