import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/constants/brand";
import { SEO, pageMetadata } from "@/constants/seo";

export const metadata: Metadata = pageMetadata(SEO.pages.privacy);

const LAST_UPDATED = "July 29, 2026";

export default function PrivacyPage() {
  return (
    <article className="section-pad mx-auto max-w-3xl pt-32">
      <p className="type-overline mb-3 text-rose-300">Legal</p>
      <h1 className="type-h1">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
      <p className="type-body mt-6 text-muted">
        This Privacy Policy explains how <strong className="text-heading">{BRAND.name}</strong>{" "}
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects, uses, and protects personal information
        when you visit{" "}
        <a href={SEO.siteUrl} className="text-rose-300 hover:underline">
          {SEO.siteUrl.replace(/^https?:\/\//, "")}
        </a>
        , book a consultation, contact us, or chat with Samah AI.
      </p>

      <div className="mt-12 space-y-10 text-base leading-relaxed text-muted">
        <section>
          <h2 className="type-h3 text-heading">1. Who we are</h2>
          <p className="mt-3">
            We operate a digital marketing portfolio and booking website under the brand{" "}
            {BRAND.name} (also known as Grow with Samah). For privacy questions or data
            requests, email{" "}
            <a href={`mailto:${BRAND.email}`} className="text-rose-300 hover:underline">
              {BRAND.email}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">2. Information we collect</h2>
          <p className="mt-3">We may collect:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-heading">Contact &amp; booking details</strong> — name,
              email, phone, business type, service interest, goals, notes, and preferred
              schedule when you use the booking or contact forms.
            </li>
            <li>
              <strong className="text-heading">Samah AI chat data</strong> — messages you send,
              replies from the assistant, optional profile details you share (such as name,
              email, company, goals), and related lead or booking information created from
              the chat.
            </li>
            <li>
              <strong className="text-heading">Technical data</strong> — IP address, browser
              type, device information, pages visited, and approximate location derived from
              server logs needed to operate and secure the site.
            </li>
            <li>
              <strong className="text-heading">Communication records</strong> — emails we send
              or receive about bookings, confirmations, or follow-ups.
            </li>
          </ul>
          <p className="mt-3">
            We do not ask for payment card details on this website. Paid work is arranged
            separately if you hire us.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">3. How we use your information</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Respond to inquiries and schedule consultations</li>
            <li>Provide digital marketing advice through Samah AI</li>
            <li>Create and manage bookings linked to your request</li>
            <li>Send confirmation, reminder, or follow-up emails</li>
            <li>Improve the website, services, and assistant quality</li>
            <li>Protect against abuse, spam, and security incidents</li>
            <li>Meet legal or accounting obligations when required</li>
          </ul>
        </section>

        <section>
          <h2 className="type-h3 text-heading">4. Legal bases</h2>
          <p className="mt-3">
            Where applicable (including GDPR-style rules), we process data based on:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="text-heading">Contract / pre-contract steps</strong> — when you
              book or request services
            </li>
            <li>
              <strong className="text-heading">Legitimate interests</strong> — operating the site,
              preventing abuse, and improving the experience
            </li>
            <li>
              <strong className="text-heading">Consent</strong> — when you voluntarily share
              details in forms or chat, or opt into optional communications
            </li>
            <li>
              <strong className="text-heading">Legal obligation</strong> — when the law requires
              retention or disclosure
            </li>
          </ul>
        </section>

        <section>
          <h2 className="type-h3 text-heading">5. AI processing (Samah AI)</h2>
          <p className="mt-3">
            Samah AI uses a third-party language model provider (currently Groq) to generate
            replies. Message content you submit in chat is sent to that provider solely to
            produce a response and operate the assistant features described on the site.
          </p>
          <p className="mt-3">
            Do not share sensitive personal data in chat (passwords, financial account numbers,
            government IDs, health information, or similar). We may store conversation history
            so we can follow up if you leave contact details or request a booking.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">6. Sharing &amp; processors</h2>
          <p className="mt-3">We share data only with trusted processors needed to run the site:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Hosting / VPS provider (website &amp; database)</li>
            <li>Email / SMTP provider (booking and follow-up messages)</li>
            <li>AI model provider (Groq) for Samah AI replies</li>
          </ul>
          <p className="mt-3">
            We do not sell your personal information. We may disclose information if required
            by law or to protect rights, safety, and security.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">7. Cookies &amp; similar tech</h2>
          <p className="mt-3">
            We use essential cookies and local storage required for the site to function —
            for example keeping the admin session signed in, remembering UI preferences, and
            maintaining Samah AI chat continuity in your browser.
          </p>
          <p className="mt-3">
            We do not run third-party advertising trackers on the marketing site by default.
            If analytics tools are added later, this policy will be updated.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">8. Retention</h2>
          <p className="mt-3">
            Booking and contact records are kept as long as needed to manage the inquiry and
            for reasonable business records. AI conversation logs may be retained to support
            follow-up and quality review, then deleted or anonymized when no longer needed.
            You can ask us to delete your data sooner where legally allowed.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">9. Your rights</h2>
          <p className="mt-3">Depending on your location, you may request to:</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Correct inaccurate information</li>
            <li>Delete your data (subject to legal limits)</li>
            <li>Restrict or object to certain processing</li>
            <li>Receive a copy of data you provided (portability)</li>
            <li>Withdraw consent where processing is consent-based</li>
          </ul>
          <p className="mt-3">
            Email{" "}
            <a href={`mailto:${BRAND.email}`} className="text-rose-300 hover:underline">
              {BRAND.email}
            </a>{" "}
            with the subject line &ldquo;Privacy request&rdquo;. We may need to verify your
            identity before fulfilling the request.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">10. Security</h2>
          <p className="mt-3">
            We use HTTPS, access controls, and server hardening practices appropriate for a
            small business site. No method of transmission or storage is 100% secure; please
            use strong unique passwords for any admin accounts and avoid sharing secrets in
            forms or chat.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">11. International transfers</h2>
          <p className="mt-3">
            Our hosting, email, or AI providers may process data in countries other than yours.
            Where required, we rely on appropriate safeguards offered by those providers and
            applicable law.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">12. Children</h2>
          <p className="mt-3">
            This site is intended for business audiences and is not directed at children under
            16. We do not knowingly collect children&apos;s personal data.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">13. Changes</h2>
          <p className="mt-3">
            We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at
            the top will change when we do. Continued use of the site after updates means you
            acknowledge the revised policy.
          </p>
        </section>

        <section>
          <h2 className="type-h3 text-heading">14. Contact</h2>
          <p className="mt-3">
            Privacy contact:{" "}
            <a href={`mailto:${BRAND.email}`} className="text-rose-300 hover:underline">
              {BRAND.email}
            </a>
            <br />
            Website:{" "}
            <a href={SEO.siteUrl} className="text-rose-300 hover:underline">
              {SEO.siteUrl}
            </a>
            <br />
            Prefer a call?{" "}
            <Link href="/book" className="text-rose-300 hover:underline">
              Book a consultation
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
