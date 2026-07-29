import type { Metadata } from "next";
import { Suspense } from "react";
import { BRAND } from "@/constants/brand";
import { getServices } from "@/services/api";
import { BookingForm } from "@/components/booking/booking-form";
import { GlassPanel } from "@/components/ui/glass-panel";

export const metadata: Metadata = {
  title: "Book a consultation",
  description: `Book ${BRAND.name}'s digital marketing services. Confirmation arrives by email.`,
  alternates: { canonical: "/book" },
};

export default async function BookPage() {
  const services = await getServices();

  return (
    <section className="section-pad relative mx-auto max-w-5xl pt-32">
      <div className="pointer-events-none absolute inset-x-0 top-20 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--rose-400)_22%,transparent),transparent_70%)]" />

      <div className="mb-10 max-w-2xl">
        <p className="type-overline text-rose-300">Book services</p>
        <h1 className="type-h1 mt-3">{BRAND.name}</h1>
        <p className="type-subheading mt-4 text-heading-soft">
          Tell us what you need. We’ll confirm by email and follow up with next steps.
        </p>
      </div>

      <Suspense
        fallback={
          <GlassPanel className="p-10">
            <p className="type-body text-muted">Loading booking form…</p>
          </GlassPanel>
        }
      >
        <BookingForm services={services} />
      </Suspense>
    </section>
  );
}
