"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { sendEmail, type ContactState } from "@/actions/send-email";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const initial: ContactState = { status: "idle" };

const fieldClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-colors focus:border-accent focus:outline-none";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendEmail, initial);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input name="name" type="text" required placeholder="Your name" aria-label="Your name" className={fieldClass} />
        <input name="email" type="email" required placeholder="Your email" aria-label="Your email" className={fieldClass} />
      </div>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Your message"
        aria-label="Your message"
        className={cn(fieldClass, "resize-y")}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={pending}>
          <Send className="h-4 w-4" aria-hidden />
          {pending ? "Sending…" : "Send message"}
        </Button>
        {state.status !== "idle" && state.message && (
          <p
            role="status"
            className={cn(
              "text-sm",
              state.status === "success" ? "text-success" : "text-muted",
            )}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
