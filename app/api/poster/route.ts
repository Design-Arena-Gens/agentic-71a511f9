import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

function parseIntParam(value: string | null, fallback: number): number {
  const n = value ? parseInt(value, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Interior Trends";
  const source = searchParams.get("source") || "Trend Source";
  const url = searchParams.get("url") || "";
  const width = parseIntParam(searchParams.get("w"), 1080);
  const height = parseIntParam(searchParams.get("h"), 1350);
  const download = searchParams.get("download") === "1";

  const gradient = [
    "#0ea5e9", // sky-500
    "#7c3aed", // violet-600
    "#f43f5e"  // rose-500
  ];
  const bg = `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]} 40%, ${gradient[2]})`;

  const maxLen = 120;
  const safeTitle = title.length > maxLen ? title.slice(0, maxLen - 1) + "?" : title;

  const img = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          color: "white",
          padding: 60,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.14)",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Interior Trends
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05 }}>{safeTitle}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, opacity: 0.9 }}>{source}</div>
            {url && (
              <div style={{ fontSize: 22, opacity: 0.85, marginTop: 6 }}>
                {new URL(url).hostname.replace(/^www\./, "")}
              </div>
            )}
          </div>
          <div
            style={{
              width: 180,
              height: 180,
              background: "rgba(255,255,255,0.12)",
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Poster
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
    }
  );

  if (download) {
    img.headers.set("Content-Disposition", `attachment; filename="poster.png"`);
  }
  return img;
}

