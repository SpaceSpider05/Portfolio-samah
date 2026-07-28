import type { Metadata } from "next";
import { AiConversationsModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "AI Conversations" };

export default function Page() {
  return <AiConversationsModule />;
}
