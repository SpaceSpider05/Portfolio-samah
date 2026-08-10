import { apiClient, ApiError, isMockMode } from "@/services/api/client";
import {
  mockAbout,
  mockProjects,
  mockServices,
  mockSiteSettings,
  mockStats,
} from "@/services/api/mock/data";
import type { AboutContent, Project, Service, SiteSettings, StatsContent } from "@/types";

export type BookingPayload = {
  name: string;
  email: string;
  phone: string;
  service: string;
  businessType?: string;
  notes?: string;
  /** Client-generated UUID; backend rejects duplicate creates for the same key. */
  idempotencyKey?: string;
};

export type BookingResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  message?: string;
};

function delay<T>(data: T, ms = 80): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
}

/** Use mock data only when mock mode is explicitly enabled (never on API failure). */
async function loadContent<T>(loader: () => Promise<T>, mock: T): Promise<T> {
  if (isMockMode()) {
    return delay(mock);
  }

  return loader();
}

export async function getAbout(): Promise<AboutContent> {
  return loadContent(() => apiClient<AboutContent>("/api/v1/about"), mockAbout);
}

export async function getServices(): Promise<Service[]> {
  return loadContent(() => apiClient<Service[]>("/api/v1/services"), mockServices);
}

export async function getProjects(): Promise<Project[]> {
  return loadContent(() => apiClient<Project[]>("/api/v1/projects"), mockProjects);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (isMockMode()) {
    return delay(mockProjects.find((project) => project.slug === slug));
  }

  try {
    return await apiClient<Project>(`/api/v1/projects/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return undefined;
    }
    throw error;
  }
}

export async function getStats(): Promise<StatsContent> {
  return loadContent(async () => {
    return apiClient<StatsContent>("/api/v1/stats");
  }, mockStats);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return loadContent(
    () => apiClient<SiteSettings>("/api/v1/site-settings"),
    mockSiteSettings,
  );
}

export async function createBooking(payload: BookingPayload): Promise<BookingResponse> {
  if (isMockMode()) {
    return delay({
      id: "mock-booking",
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      service: payload.service,
      status: "pending",
      message:
        "Your booking request has been received. A confirmation email is on its way.",
    });
  }

  return apiClient<BookingResponse>("/api/v1/bookings", {
    method: "POST",
    body: payload,
    cache: "no-store",
  });
}

export { ApiError };
