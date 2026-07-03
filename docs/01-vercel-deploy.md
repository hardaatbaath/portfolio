# 1 · Deploy to Vercel

Vercel is the company behind Next.js — deploying there is the smoothest path,
and the free "Hobby" tier is plenty for a personal site.

## Before you start

- Your code is pushed to GitHub (repo: `hardaatbaath/portfolio`).
- You have your `.env.local` values ready (see [`.env.example`](../.env.example)).

## Steps

1. **Sign up / log in** at <https://vercel.com> — click **"Continue with GitHub"**
   so Vercel can see your repos.

2. **Import the project.** On the dashboard click **Add New… → Project**, find
   `portfolio` in the list, and click **Import**. If you don't see it, click
   **Adjust GitHub App Permissions** and grant access to the repo.

3. **Framework preset** is auto-detected as **Next.js** — leave build settings
   at their defaults (Build command `next build`, output handled automatically).

4. **Add environment variables.** Expand **Environment Variables** and add each
   line from your `.env.local`. At minimum:

   | Name | Example | Notes |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` | your final URL |
   | `NEXT_PUBLIC_EMAIL` | `you@example.com` | shown on the site |
   | `NEXT_PUBLIC_GITHUB_USERNAME` | `hardaatbaath` | |
   | `NEXT_PUBLIC_LINKEDIN_URL` | `https://linkedin.com/in/…` | |
   | `NEXT_PUBLIC_DEVTO_USERNAME` | `your-handle` | drives the Writing feed |
   | `NEXT_PUBLIC_SUBSTACK_URL` | `https://you.substack.com` | drives Reflections |
   | `RESEND_API_KEY` | `re_…` | see [Resend guide](./03-resend-email.md) — can add later |
   | `CONTACT_EMAIL` | `you@example.com` | where contact messages go |
   | `NEXT_PUBLIC_GA_ID` | `G-XXXX` | optional — [Analytics guide](./04-analytics-seo.md) |

   > Tip: apply each variable to **Production, Preview, and Development** (the
   > default). `NEXT_PUBLIC_*` values are exposed to the browser; the rest stay
   > server-side.

5. **Click Deploy.** First build takes ~1–2 minutes. You'll get a live URL like
   `portfolio-xxxx.vercel.app`.

## After deploying

- **Every `git push` to `main` auto-deploys.** Pull requests get their own
  preview URL.
- **Changed an env var?** Update it in **Settings → Environment Variables**, then
  **Deployments → ⋯ → Redeploy** (env changes don't apply until the next build).
- **Blogs not showing?** Confirm `NEXT_PUBLIC_DEVTO_USERNAME` /
  `NEXT_PUBLIC_SUBSTACK_URL` are correct. The site refetches hourly; to force it
  sooner, redeploy.

Next: [connect a custom domain →](./02-custom-domain.md)
