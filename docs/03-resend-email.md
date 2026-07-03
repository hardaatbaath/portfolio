# 3 · Contact form with Resend

The contact form posts to a server action (`actions/send-email.ts`) that sends
mail via [Resend](https://resend.com). Free tier: **3,000 emails/month** — far
more than a personal site needs.

Until you add a key, the form fails gracefully and tells visitors to email you
directly, so it's safe to ship first and wire this up later.

## Steps

1. **Create an account** at <https://resend.com> (sign in with GitHub).

2. **Create an API key.** Go to **API Keys → Create API Key**, name it
   `portfolio`, permission **Sending access**. Copy the key (`re_…`) — you only
   see it once.

3. **Add two env vars.**
   - Locally, in `.env.local`:
     ```bash
     RESEND_API_KEY="re_your_key_here"
     CONTACT_EMAIL="you@example.com"   # where messages are delivered
     ```
   - On Vercel: **Settings → Environment Variables** → add both → **Redeploy**.

4. **Test it.** Open the site's **Contact** section, send yourself a message.
   It arrives at `CONTACT_EMAIL`, and replying goes straight to the sender
   (their address is set as `reply-to`).

## Sending from your own domain (recommended, optional)

Out of the box, mail is sent from `onboarding@resend.dev` — this works
immediately but looks generic and can land in spam. To send from
`hi@yourdomain.com`:

1. In Resend: **Domains → Add Domain**, enter `yourdomain.com`.
2. Add the shown **DNS records** (SPF, DKIM, and a return-path) at your registrar
   — same place you set up the domain in [guide 2](./02-custom-domain.md).
3. Wait for Resend to mark the domain **Verified** (usually minutes).
4. In `actions/send-email.ts`, change the `from` line:
   ```ts
   from: "Hardaat <hi@yourdomain.com>",
   ```
   Commit and push.

## Troubleshooting

- **"Email isn't wired up yet"** on submit → `RESEND_API_KEY` is missing on the
  environment you're testing. Add it and redeploy.
- **Nothing arrives** → check the Resend dashboard **Logs** tab; verify
  `CONTACT_EMAIL` is correct and check spam.
- **Rate/spam concerns** → verify your domain (above); it dramatically improves
  deliverability.

Next: [Analytics, Search Console & SEO →](./04-analytics-seo.md)
