import type { Metadata } from "next";
import { MessagesModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Messages" };

export default function Page() {
  return <MessagesModule />;
}
