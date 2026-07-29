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

async function withMockFallback<T>(loader: () => Promise<T>, fallback: T): Promise<T> {
  if (isMockMode()) {
    return delay(fallback);
  }

  try {
    return await loader();
  } catch (error) {
    console.warn("[api] Falling back to mock data:", error);
    return fallback;
  }
}

export async function getAbout(): Promise<AboutContent> {
  return withMockFallback(() => apiClient<AboutContent>("/api/v1/about"), mockAbout);
}

export async function getServices(): Promise<Service[]> {
  return withMockFallback(() => apiClient<Service[]>("/api/v1/services"), mockServices);
}

export async function getProjects(): Promise<Project[]> {
  return withMockFallback(() => apiClient<Project[]>("/api/v1/projects"), mockProjects);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (isMockMode()) {
    return delay(mockProjects.find((project) => project.slug === slug));
  }

  try {
    return await apiClient<Project>(`/api/v1/projects/${slug}`, {
      cache: "no-store",
    });
  } catch {
    return undefined;
  }
}

export async function getStats(): Promise<StatsContent> {
  return withMockFallback(async () => {
    const stats = await apiClient<StatsContent>("/api/v1/stats");
    if (!stats.metrics?.length && !stats.chart?.length) {
      return mockStats;
    }
    return stats;
  }, mockStats);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return withMockFallback(
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
