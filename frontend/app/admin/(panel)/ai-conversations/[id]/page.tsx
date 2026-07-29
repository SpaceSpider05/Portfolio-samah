import type { Metadata } from "next";
import { AdminAiConversationDetail } from "@/components/admin/admin-ai-conversation-detail";

export const metadata: Metadata = { title: "AI Conversation" };

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <AdminAiConversationDetail conversationId={id} />;
}
