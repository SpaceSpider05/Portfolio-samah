"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError, createBooking } from "@/services/api";
import type { Service } from "@/types";
import { BRAND } from "@/constants/brand";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { GlassPanel } from "@/components/ui/glass-panel";
import { cn } from "@/lib/utils";

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().min(7, "Enter a phone number").max(40),
  service: z.string().min(1, "Choose a service"),
  businessType: z.string().trim().max(120).optional(),
  notes: z
    .string()
    .trim()
    .min(20, "Tell us a bit more (at least 20 characters)")
    .max(5000),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingFormProps = {
  services: Service[];
};

const fieldClass =
  "mt-2 w-full rounded-2xl border border-fantasy-200/15 bg-tobago-800/70 px-4 py-3 text-sm text-fantasy-100 outline-none transition placeholder:text-fantasy-200/35 focus:border-rose-400";

export function BookingForm({ services }: BookingFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const defaultService = useMemo(() => {
    const slug = searchParams.get("service");
    if (!slug) {
      return services[0]?.title ?? "";
    }
    return services.find((service) => service.slug === slug)?.title ?? services[0]?.title ?? "";
  }, [searchParams, services]);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: defaultService,
      businessType: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (defaultService) {
      reset((values) => ({ ...values, service: defaultService }));
    }
  }, [defaultService, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    try {
      const response = await createBooking({
        name: values.name,
        email: values.email,
        phone: values.phone,
        service: values.service,
        businessType: values.businessType || undefined,
        notes: values.notes,
      });

      setSubmittedEmail(response.email);
      router.replace("/book?success=1", { scroll: false });
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.errors).length > 0) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          const message = messages[0];
          if (!message) {
            return;
          }
          if (
            field === "name" ||
            field === "email" ||
            field === "phone" ||
            field === "service" ||
            field === "businessType" ||
            field === "notes"
          ) {
            setError(field, { message });
          }
        });
        return;
      }

      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  });

  if (submittedEmail || searchParams.get("success") === "1") {
    return (
      <GlassPanel className="p-8 md:p-10">
        <p className="type-overline text-rose-300">Request received</p>
        <h2 className="type-h2 mt-3 text-heading">You’re on the calendar radar</h2>
        <p className="type-body mt-4 max-w-xl text-muted">
          {submittedEmail
            ? `A confirmation email is heading to ${submittedEmail}. `
            : "Your booking request was placed. "}
          We’ll review the brief and reply within one business day.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <MagneticButton onClick={() => router.push("/")}>Back home</MagneticButton>
          <MagneticButton
            variant="secondary"
            onClick={() => {
              setSubmittedEmail(null);
              router.replace("/book");
              reset({
                name: "",
                email: "",
                phone: "",
                service: defaultService,
                businessType: "",
                notes: "",
              });
            }}
          >
            Book another service
          </MagneticButton>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel className="p-6 md:p-10">
      <form onSubmit={onSubmit} className="space-y-6" noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <label className="block">
            <span className="type-caption text-fantasy-200/80">Full name</span>
            <input
              {...register("name")}
              autoComplete="name"
              placeholder="Your full name"
              className={fieldClass}
            />
            {errors.name ? (
              <p className="mt-2 text-xs text-rose-300">{errors.name.message}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="type-caption text-fantasy-200/80">Email</span>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={fieldClass}
            />
            {errors.email ? (
              <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="type-caption text-fantasy-200/80">Phone</span>
            <input
              {...register("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 010 2040"
              className={fieldClass}
            />
            {errors.phone ? (
              <p className="mt-2 text-xs text-rose-300">{errors.phone.message}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="type-caption text-fantasy-200/80">Service</span>
            <select {...register("service")} className={cn(fieldClass, "appearance-none")}>
              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
            {errors.service ? (
              <p className="mt-2 text-xs text-rose-300">{errors.service.message}</p>
            ) : null}
          </label>

          <label className="block md:col-span-2">
            <span className="type-caption text-fantasy-200/80">Business type</span>
            <input
              {...register("businessType")}
              placeholder="SaaS, e-commerce, clinic…"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="type-caption text-fantasy-200/80">
            Project notes
          </span>
          <textarea
            {...register("notes")}
            rows={5}
            placeholder="Goals, timeline, current channels, and anything else we should know…"
            className={cn(fieldClass, "resize-y")}
          />
          {errors.notes ? (
            <p className="mt-2 text-xs text-rose-300">{errors.notes.message}</p>
          ) : null}
        </label>

        {serverError ? (
          <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
            {serverError}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            Confirmation goes to your email. Prefer a call?{" "}
            <a href={`mailto:${BRAND.email}`} className="text-rose-300 hover:underline">
              {BRAND.email}
            </a>
          </p>
          <MagneticButton type="submit" disabled={isSubmitting} className="sm:min-w-44">
            {isSubmitting ? "Sending…" : "Place booking"}
          </MagneticButton>
        </div>
      </form>
    </GlassPanel>
  );
}
