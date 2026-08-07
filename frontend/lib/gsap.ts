"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    // ScrollTrigger is unused on marketing — do not register it.
    gsap.registerPlugin(useGSAP);
    registered = true;
  }

  return gsap;
}

export { gsap, useGSAP };
