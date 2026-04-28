import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yoko & Yoshi — polski przewodnik dla opiekunów psów i kotów";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#FBF3E7",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 80,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 28,
          color: "#8A6B4A",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        Yoko & Yoshi
      </div>
      <div
        style={{
          fontSize: 88,
          color: "#5C3A1E",
          lineHeight: 1.05,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          marginBottom: 24,
        }}
      >
        Wszystko poza <span style={{ color: "#F08C7A" }}>miską</span>.
      </div>
      <div
        style={{
          fontSize: 28,
          color: "#8A6B4A",
          maxWidth: 900,
          lineHeight: 1.4,
        }}
      >
        Polski przewodnik dla opiekunów psów i kotów. Polecamy, klikasz na
        Allegro, dostajesz pod drzwi.
      </div>
    </div>,
    size,
  );
}
