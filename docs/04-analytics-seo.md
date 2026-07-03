# 4 · Analytics, Search Console & SEO

Three things: **know your traffic** (Analytics), **get indexed by Google**
(Search Console), and **rank/preview well** (SEO — mostly already done).

---

## A · Google Analytics (GA4)

1. Go to <https://analytics.google.com> → **Admin → Create → Account**, then
   create a **Property** for your site.
2. Under the property, add a **Web data stream** with your site URL. It gives you
   a **Measurement ID** that looks like `G-XXXXXXXXXX`.
3. Add it as an env var:
   - `.env.local`: `NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"`
   - Vercel: **Settings → Environment Variables** → add → **Redeploy**.
4. That's it — `components/analytics.tsx` loads GA only when this var is set, and
   it loads *after* the page is interactive so it doesn't hurt performance.

> Prefer something lighter and privacy-friendly? **Vercel Web Analytics**
> (Project → **Analytics** tab, one click) or **Plausible** are great
> alternatives. GA4 is the most common, so it's the default here.

---

## B · Google Search Console (get indexed)

This is how Google discovers and ranks your site.

1. Go to <https://search.google.com/search-console> → **Add property**.
2. Choose **URL prefix** and enter your full URL (`https://yourdomain.com`).
3. **Verify ownership.** Easiest method: **HTML tag**. Copy the
   `<meta name="google-site-verification" content="…">` value, then add it to
   `app/layout.tsx` metadata:
   ```ts
   export const metadata: Metadata = {
     // …existing fields
     verification: { google: "paste-the-content-value-here" },
   };
   ```
   Commit, push, wait for deploy, then click **Verify**.
   *(Alternative: if your DNS is at Cloudflare/Vercel, use the **Domain** method
   with a TXT record instead — no code change.)*
4. **Submit your sitemap.** In Search Console → **Sitemaps**, enter
   `sitemap.xml` and submit. Your site already generates one at
   `/sitemap.xml` (see `app/sitemap.ts`), and `/robots.txt` points to it.
5. Indexing takes a few days. Use **URL Inspection → Request indexing** to nudge
   the homepage.

---

## C · SEO — what's already handled

The site ships with the essentials, driven by `site.config.ts` +
`app/layout.tsx`:

- ✅ `<title>` + meta description, with a per-page title template
- ✅ Open Graph + Twitter card tags (nice link previews in chats/social)
- ✅ `metadataBase` + canonical via `NEXT_PUBLIC_SITE_URL`
- ✅ `sitemap.xml` and `robots.txt`
- ✅ `theme-color`, favicon, semantic HTML, alt text, keyboard nav
- ✅ Statically prerendered + fast fonts = strong Core Web Vitals

### To maximize your scores

- Set `NEXT_PUBLIC_SITE_URL` to your **real domain** (canonical/OG depend on it).
- **Add an OG image** for richer link previews: drop a 1200×630 image at
  `app/opengraph-image.png` — Next picks it up automatically, no code needed.
- Run **[PageSpeed Insights](https://pagespeed.web.dev)** on your live URL and
  aim for 95+ / 100 / 100 / 100. Also check the **Lighthouse** tab in Chrome
  DevTools.
- After launch, watch **Search Console → Experience / Core Web Vitals** for any
  regressions.

---

That's the full setup. With Vercel + domain + Resend + Analytics wired, the site
deploys on every push, updates its blog feeds hourly, and is discoverable and
measurable.
