import { apiClient, isMockMode } from "@/services/api/client";
import {
  mockAbout,
  mockProjects,
  mockServices,
  mockStats,
} from "@/services/api/mock/data";
import type { AboutContent, Project, Service, StatsContent } from "@/types";

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
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function getStats(): Promise<StatsContent> {
  return withMockFallback(() => apiClient<StatsContent>("/api/v1/stats"), mockStats);
}
