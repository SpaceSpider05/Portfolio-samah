import { LANDING } from "@/constants/landing";

export function CertificationsSection() {
  return (
    <section id="certifications" className="section-pad">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline mb-3">Certifications</p>
          <h2 className="type-h2">Proof of craft and platform fluency</h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING.certifications.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-silver-400/15 bg-tobago-800/35 p-6"
            >
              <p className="font-display text-2xl text-heading">{item.name}</p>
              <p className="mt-3 text-sm text-muted">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
