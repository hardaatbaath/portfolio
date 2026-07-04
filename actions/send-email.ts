"use server";

import { Resend } from "resend";
import { identity } from "@/site.config";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

const isEmail = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);

export async function sendEmail(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message)
    return { status: "error", message: "Please fill in all fields." };
  if (name.length < 2 || message.length < 10)
    return { status: "error", message: "Please add a name and a bit more detail." };
  if (!isEmail(email))
    return { status: "error", message: "That email address looks off." };
  if (message.length > 5000)
    return { status: "error", message: "That message is a little too long." };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey)
    return {
      status: "error",
      message: `Email isn't wired up yet — reach me at ${identity.email}.`,
    };

  const to = process.env.CONTACT_EMAIL || identity.email;

  try {
    const resend = new Resend(apiKey);
    // `onboarding@resend.dev` works before you verify a domain. After you verify
    // your own domain in Resend, set CONTACT_FROM (e.g. "Hardaat <hi@hardaatsinghbaath.com>")
    // — no code change needed.
    const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) throw new Error(error.message);
    return { status: "success", message: "Thanks — I'll get back to you soon." };
  } catch {
    return {
      status: "error",
      message: `Couldn't send that. Email me directly at ${identity.email}.`,
    };
  }
}
