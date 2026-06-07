import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1d3557",
          borderRadius: "40px",
        }}
      >
        <div
          style={{
            color: "#e63946",
            fontSize: 80,
            fontWeight: 900,
            fontFamily: "sans-serif",
            lineHeight: 1,
          }}
        >
          J
        </div>
        <div
          style={{
            color: "#f4a261",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "sans-serif",
            letterSpacing: "2px",
            marginTop: 4,
          }}
        >
          JEMLA
        </div>
      </div>
    ),
    { ...size }
  );
}
