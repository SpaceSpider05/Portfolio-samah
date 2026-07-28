"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

/** Public marketing site stays on the cinematic dark Tobago theme. */
export function MarketingThemeLock() {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);

  return null;
}
