import type { Metadata } from "next";
import { AdminAiConversationsManager } from "@/components/admin/admin-ai-conversations-manager";

export const metadata: Metadata = { title: "AI Conversations" };

export default function Page() {
  return <AdminAiConversationsManager />;
}
