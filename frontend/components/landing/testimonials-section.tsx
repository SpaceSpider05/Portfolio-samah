import { LANDING } from "@/constants/landing";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="section-pad section-alt">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="type-overline mb-3">Testimonials</p>
          <h2 className="type-h2">What partners say after the work ships</h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {LANDING.testimonials.map((item) => (
            <figure
              key={item.name}
              className="flex h-full flex-col rounded-3xl border border-silver-400/15 bg-tobago-800/35 p-6"
            >
              <p className="text-rose-300" aria-label={`${item.rating} out of 5`}>
                {"★".repeat(item.rating)}
              </p>
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-heading-soft">
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border/60 pt-4">
                <p className="font-display text-xl text-heading">{item.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.role}, {item.company}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
