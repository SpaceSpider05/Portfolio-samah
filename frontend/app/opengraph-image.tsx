import { ImageResponse } from "next/og";
import { BRAND } from "@/constants/brand";

export const runtime = "edge";
export const alt = `${BRAND.name} — Digital Marketing Strategist`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(145deg, #1c1410 0%, #2a1f1a 45%, #3d2420 100%)",
          color: "#f5ebe0",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#e8a598",
          }}
        >
          Digital Marketing Strategist
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1 }}>
            {BRAND.name}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 900,
              fontSize: 34,
              lineHeight: 1.35,
              color: "#d9cfc4",
            }}
          >
            SEO · Content · Social · Ads that grow brands
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 26,
            color: "#c4b5a8",
          }}
        >
          <span>growwithsamah.com</span>
          <span>Book a free consultation</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
