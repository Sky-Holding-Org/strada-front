import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Strada Properties - Luxury Real Estate in Egypt";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #013344 0%, #028180 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              marginBottom: "20px",
              textTransform: "uppercase",
            }}
          >
            Strada Properties
          </h1>
          <p
            style={{
              fontSize: "36px",
              marginBottom: "40px",
              opacity: 0.9,
            }}
          >
            Luxury Real Estate in Egypt
          </p>
          <p
            style={{
              fontSize: "28px",
              opacity: 0.8,
              maxWidth: "900px",
            }}
          >
            Where The Road Leads You Home
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
