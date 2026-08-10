"use client";

import { useRef, useState, type FormEvent } from "react";
import { BRAND } from "@/constants/brand";
import { createBooking } from "@/services/api";
import { useUiStore } from "@/stores/ui-store";

type ContactSectionProps = {
  contactEmail?: string;
};

const fieldClass =
  "mt-2 w-full rounded-2xl border border-fantasy-200/15 bg-tobago-800/70 px-4 py-3 text-sm text-fantasy-100 outline-none transition placeholder:text-fantasy-200/35 focus:border-rose-400";

function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function ContactSection({
  contactEmail = BRAND.email,
}: ContactSectionProps) {
  const showToast = useUiStore((state) => state.showToast);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const submitLockRef = useRef(false);
  const idempotencyKeyRef = useRef(createIdempotencyKey());

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitLockRef.current || saving) {
      return;
    }

    submitLockRef.current = true;
    setSaving(true);
    setError(null);

    try {
      await createBooking({
        name,
        email,
        phone,
        service: "Marketing Consultation",
        businessType: company || undefined,
        notes: message,
        idempotencyKey: idempotencyKeyRef.current,
      });
      setDone(true);
      showToast({
        type: "success",
        title: "Message sent",
        message: "Thanks! I’ll get back to you shortly.",
      });
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setMessage("");
      // Keep locked after success — done UI replaces the form.
    } catch {
      submitLockRef.current = false;
      setSaving(false);
      idempotencyKeyRef.current = createIdempotencyKey();
      setError("Could not send your message. Please try again or email directly.");
    }
  };

  return (
    <section id="contact-form" className="section-pad">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="type-overline mb-3">Contact</p>
          <h2 className="type-h2">Let’s start a conversation</h2>
          <p className="mt-5 max-w-md text-base text-muted">
            Share a little about your brand and goals. I’ll reply with next steps.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-heading-soft">
            <li>
              <a href={`mailto:${contactEmail}`} className="hover:text-rose-300">
                {contactEmail}
              </a>
            </li>
            <li>
              <a
                href={BRAND.socials.linkedin}
                className="hover:text-rose-300"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={BRAND.socials.instagram}
                className="hover:text-rose-300"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" aria-busy={saving}>
          {done ? (
            <p className="rounded-2xl border border-silver-400/25 bg-tobago-800/40 px-4 py-5 text-sm text-fantasy-100">
              Message sent. I’ll get back to you shortly.
            </p>
          ) : (
            <>
          {error ? (
            <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-muted">Name</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
                disabled={saving}
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-muted">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
                disabled={saving}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-muted">Company</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={fieldClass}
                disabled={saving}
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-muted">Phone</span>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
                disabled={saving}
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-xs uppercase tracking-wider text-muted">Message</span>
            <textarea
              required
              rows={5}
              minLength={20}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${fieldClass} resize-y`}
              placeholder="Tell me about your goals..."
              disabled={saving}
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-rose-400 px-6 py-3 text-sm font-medium text-tobago-900 transition hover:bg-rose-300 disabled:opacity-60 disabled:pointer-events-none"
          >
            {saving ? "Submitting…" : "Send message"}
          </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
