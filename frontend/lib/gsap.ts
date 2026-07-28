"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap(): typeof gsap {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    registered = true;
  }

  return gsap;
}

export { gsap, useGSAP, ScrollTrigger };
