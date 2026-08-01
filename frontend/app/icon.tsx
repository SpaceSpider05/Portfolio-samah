import { ImageResponse } from "next/og";
import { BRAND } from "@/constants/brand";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2a1f1a",
          color: "#e8a598",
          fontSize: 20,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        {BRAND.name.slice(0, 1)}
      </div>
    ),
    { ...size },
  );
}
