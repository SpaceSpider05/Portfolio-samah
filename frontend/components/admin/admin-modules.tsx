import { AdminEmptyState, AdminPageHeader } from "@/components/admin/admin-ui";

type ModulePageProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

function ModulePage({ title, description, emptyTitle, emptyDescription }: ModulePageProps) {
  return (
    <div>
      <AdminPageHeader title={title} description={description} />
      <AdminEmptyState title={emptyTitle} description={emptyDescription} />
    </div>
  );
}

export function BlogsModule() {
  return (
    <ModulePage
      title="Blogs"
      description="Draft and publish articles for the blog preview section."
      emptyTitle="No posts yet"
      emptyDescription="Connect the Laravel/WordPress feed later. Create posts here once the API is live."
    />
  );
}

export function TestimonialsModule() {
  return (
    <ModulePage
      title="Testimonials"
      description="Client quotes and optional video reviews."
      emptyTitle="No testimonials"
      emptyDescription="Add client feedback to power the public testimonials carousel."
    />
  );
}

export function MessagesModule() {
  return (
    <ModulePage
      title="Messages"
      description="Contact form and inbox messages."
      emptyTitle="Inbox is empty"
      emptyDescription="Inbound contact messages will appear here after the contact API is connected."
    />
  );
}

export function BookingsModule() {
  return (
    <ModulePage
      title="Bookings"
      description="Consultation requests from the multi-step booking flow."
      emptyTitle="No bookings"
      emptyDescription="When the booking wizard goes live, requests will land in this queue."
    />
  );
}

export function AiConversationsModule() {
  return (
    <ModulePage
      title="AI Conversations"
      description="Marketing assistant chats from the public site."
      emptyTitle="No conversations"
      emptyDescription="AI assistant transcripts will be stored here for review and training."
    />
  );
}

export function GalleryModule() {
  return (
    <ModulePage
      title="Gallery"
      description="Media library for project covers, blog images, and campaign assets."
      emptyTitle="Gallery is empty"
      emptyDescription="Upload and organize brand assets once media storage is connected."
    />
  );
}

export function AnalyticsModule() {
  return (
    <ModulePage
      title="Analytics"
      description="Traffic, conversions, and campaign performance snapshots."
      emptyTitle="Analytics pending"
      emptyDescription="Hook into GA4 / Laravel analytics endpoints to populate this board."
    />
  );
}

export function SettingsModule() {
  return (
    <ModulePage
      title="Settings"
      description="Brand profile, contact details, and admin preferences."
      emptyTitle="Settings shell ready"
      emptyDescription="Profile, notification, and integration settings will live here."
    />
  );
}

export function SeoModule() {
  return (
    <ModulePage
      title="SEO"
      description="Meta titles, descriptions, Open Graph, and schema controls."
      emptyTitle="SEO controls coming soon"
      emptyDescription="Designed to sync with Yoast / Laravel SEO fields for page-level metadata."
    />
  );
}
