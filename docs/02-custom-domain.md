# 2 · Buy & connect a custom domain

A custom domain (e.g. `hardaat.dev`) makes the site yours. Two parts: **buy it**,
then **point it at Vercel**.

## Where to buy

Any registrar works. Good options:

- **[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/)** — at-cost pricing, no markup. Recommended.
- **[Namecheap](https://www.namecheap.com)** — cheap, simple UI.
- **Vercel Domains** (in the Vercel dashboard) — buy it directly and it's
  auto-configured; simplest, slightly pricier.

For an engineer, a `.dev`, `.io`, or `.com` on your name reads well
(e.g. `hardaatbaath.dev`). `.dev` domains are always HTTPS — perfect here.

> Cost: typically **$10–15/year** for `.com`, ~$12/year for `.dev`.

## Connect it to Vercel

### Option A — you bought it at a normal registrar (Cloudflare, Namecheap, …)

1. In Vercel: **Project → Settings → Domains → Add**, type your domain
   (`yourdomain.com`), click **Add**.
2. Vercel shows you DNS records to create. You'll usually add:
   - An **A record** for the apex/root: `@ → 76.76.21.21`
   - A **CNAME** for `www`: `www → cname.vercel-dns.com`

   (Vercel displays the exact values — always copy from there.)
3. Go to your registrar's **DNS settings** and add those records.
   - **Cloudflare users:** set the record's proxy status to **DNS only** (grey
     cloud), not proxied, or TLS can conflict.
4. Back in Vercel, the domain flips to **Valid** once DNS propagates (minutes to
   a couple of hours). HTTPS certificates are issued automatically.

### Option B — you bought it through Vercel

Nothing to do — it's connected automatically. Skip to the last step.

## Final steps

1. **Pick a primary domain.** In **Settings → Domains**, set either the apex
   (`yourdomain.com`) or `www` as primary; Vercel redirects the other to it.
2. **Update the site URL.** Set `NEXT_PUBLIC_SITE_URL` to your new domain in
   **Settings → Environment Variables**, then redeploy. This fixes canonical
   URLs, `sitemap.xml`, and Open Graph tags.
3. **Update Search Console** later with the new domain — see the
   [Analytics & SEO guide](./04-analytics-seo.md).

Next: [wire up the contact form →](./03-resend-email.md)
