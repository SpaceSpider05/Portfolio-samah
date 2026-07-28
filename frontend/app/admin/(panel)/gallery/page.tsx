import type { Metadata } from "next";
import { GalleryModule } from "@/components/admin/admin-modules";

export const metadata: Metadata = { title: "Gallery" };

export default function Page() {
  return <GalleryModule />;
}
