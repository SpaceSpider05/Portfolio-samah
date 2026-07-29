"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";
import { cn } from "@/lib/utils";

export type AdminBooking = {
  id: string;
  service: string | null;
  businessType: string | null;
  name: string;
  email: string;
  phone: string | null;
  status: string;
  source?: string;
  notes: string | null;
  createdAt: string | null;
};

export function AdminBookingsManager() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/bookings", { cache: "no-store" });
      const payload = (await response.json()) as
        | AdminBooking[]
        | { message?: string };

      if (!response.ok) {
        setError(
          !Array.isArray(payload) && payload.message
            ? payload.message
            : "Could not load bookings.",
        );
        setBookings([]);
        return;
      }

      setBookings(Array.isArray(payload) ? payload : []);
    } catch {
      setError("Could not load bookings.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  return (
    <div>
      <AdminPageHeader
        title="Bookings"
        description="Consultation requests from the public booking page."
        action={
          <button
            type="button"
            onClick={() => void loadBookings()}
            className="rounded-full border border-silver-400/25 px-4 py-2 text-sm text-fantasy-100"
          >
            Refresh
          </button>
        }
      />

      {error ? (
        <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}

      {loading ? (
        <AdminLoadingState label="Loading bookings…" />
      ) : bookings.length === 0 ? (
        <AdminCard>
          <p className="font-display text-2xl text-heading">No bookings yet</p>
          <p className="mt-2 text-sm text-muted">
            When someone submits `/book`, their request will show up here.
          </p>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <AdminCard key={booking.id} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-fantasy-100">{booking.name}</p>
                  <p className="mt-1 text-sm text-silver-300">
                    {booking.service ?? "Service not specified"}
                    {booking.businessType ? ` · ${booking.businessType}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                <span
                  className={cn(
                    "w-fit rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider",
                    booking.status === "pending"
                      ? "bg-rose-400/20 text-rose-200"
                      : "bg-silver-400/15 text-silver-300",
                  )}
                >
                  {booking.status}
                </span>
                {booking.source === "ai_agent" ? (
                  <span className="w-fit rounded-full bg-fantasy-200/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-silver-300">
                    AI agent
                  </span>
                ) : null}
                </div>
              </div>

              <div className="grid gap-2 text-sm text-muted sm:grid-cols-2">
                <p>
                  <span className="text-silver-400">Email:</span>{" "}
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-fantasy-100 hover:text-rose-300"
                  >
                    {booking.email}
                  </a>
                </p>
                <p>
                  <span className="text-silver-400">Phone:</span>{" "}
                  {booking.phone ? (
                    <a
                      href={`tel:${booking.phone}`}
                      className="text-fantasy-100 hover:text-rose-300"
                    >
                      {booking.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </p>
                <p className="sm:col-span-2">
                  <span className="text-silver-400">Submitted:</span>{" "}
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString()
                    : "—"}
                </p>
              </div>

              {booking.notes ? (
                <p className="rounded-2xl border border-border bg-tobago-900/30 px-4 py-3 text-sm text-fantasy-200/85">
                  {booking.notes}
                </p>
              ) : null}
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
