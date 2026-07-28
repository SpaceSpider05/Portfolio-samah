import type { Metadata } from "next";
import { AdminCard, AdminPageHeader } from "@/components/admin/admin-ui";
import { getProjects } from "@/services/api";

export const metadata: Metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Featured case studies shown on the public portfolio."
        action={
          <button
            type="button"
            className="rounded-full bg-rose-400 px-4 py-2 text-sm font-medium text-tobago-900"
          >
            Add project
          </button>
        }
      />
      <div className="space-y-3">
        {projects.map((project) => (
          <AdminCard key={project.id} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-fantasy-100">{project.title}</p>
              <p className="text-xs text-silver-400">
                {project.client} · {project.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-full border border-silver-400/25 px-3 py-1.5 text-xs text-fantasy-100">
                Edit
              </button>
              <button type="button" className="rounded-full border border-rose-400/30 px-3 py-1.5 text-xs text-rose-200">
                Delete
              </button>
            </div>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
