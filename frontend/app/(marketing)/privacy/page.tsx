import type { Metadata } from "next";
import { BRAND } from "@/constants/brand";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy policy for ${BRAND.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="section-pad mx-auto max-w-3xl pt-32">
      <p className="type-overline mb-3">Legal</p>
      <h1 className="type-h1">Privacy</h1>
      <p className="type-body mt-6 text-muted">
        This placeholder privacy page will be replaced with the full policy before launch.
        Contact {BRAND.email} for data requests.
      </p>
    </section>
  );
}
