"use client";

import { useRouter } from "next/navigation";
import { MagneticButton } from "@/components/ui/magnetic-button";

export function ProjectBookCta() {
  const router = useRouter();

  return (
    <MagneticButton onClick={() => router.push("/book")}>
      Book similar project
    </MagneticButton>
  );
}
