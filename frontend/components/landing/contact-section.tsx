"use client";

import { useState, type FormEvent } from "react";
import { BRAND } from "@/constants/brand";
import { createBooking } from "@/services/api";

type ContactSectionProps = {
  contactEmail?: string;
};

const fieldClass =
  "mt-2 w-full rounded-2xl border border-fantasy-200/15 bg-tobago-800/70 px-4 py-3 text-sm text-fantasy-100 outline-none transition placeholder:text-fantasy-200/35 focus:border-rose-400";

export function ContactSection({
  contactEmail = BRAND.email,
}: ContactSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
      });
      setDone(true);
      setName("");
      setEmail("");
      setCompany("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Could not send your message. Please try again or email directly.");
    } finally {
      setSaving(false);
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

        <form onSubmit={onSubmit} className="space-y-4">
          {done ? (
            <p className="rounded-2xl border border-silver-400/25 bg-tobago-800/40 px-4 py-5 text-sm text-fantasy-100">
              Message sent. I’ll get back to you shortly.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
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
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-wider text-muted">Phone</span>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={fieldClass}
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
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-rose-400 px-6 py-3 text-sm font-medium text-tobago-900 transition hover:bg-rose-300 disabled:opacity-60"
          >
            {saving ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
}
