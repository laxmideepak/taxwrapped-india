import { ImageResponse } from "@vercel/og";
import { roundToShareBucket } from "@/lib/tax";

export const runtime = "edge";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") === "hi" ? "hi" : "en";
  const variant = url.searchParams.get("variant") === "square" ? "square" : "story";
  const taxBucket = roundToShareBucket(
    Number(url.searchParams.get("taxBucket") ?? "0"),
  );
  const top = url.searchParams.get("top") ?? "budget";
  const height = variant === "square" ? 1080 : 1920;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8f3e8",
          color: "#14120f",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: 72,
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#8d2f20",
              display: "flex",
              fontSize: 32,
              fontWeight: 800,
            }}
          >
            TAX WRAPPED INDIA
          </div>
          <div
            style={{
              display: "flex",
              fontSize: variant === "square" ? 82 : 104,
              fontWeight: 900,
              lineHeight: 0.96,
              marginTop: 96,
            }}
          >
            {locale === "hi" ? "मेरा income tax" : "My income tax"}
          </div>
          <div
            style={{
              color: "#f06f38",
              display: "flex",
              fontSize: variant === "square" ? 104 : 148,
              fontWeight: 900,
              marginTop: 40,
            }}
          >
            ₹{new Intl.NumberFormat("en-IN").format(taxBucket)}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 38,
              lineHeight: 1.25,
              marginTop: 42,
            }}
          >
            {locale === "hi"
              ? `BE 2026-27 spending mix के अनुसार top bucket: ${top}`
              : `Allocated using the BE 2026-27 spending mix. Top bucket: ${top}`}
          </div>
        </div>
        <div
          style={{
            borderTop: "3px solid rgba(20,18,15,0.2)",
            display: "flex",
            fontSize: 30,
            justifyContent: "space-between",
            paddingTop: 32,
          }}
        >
          <span>Income tax only</span>
          <span>taxwrapped.in</span>
        </div>
      </div>
    ),
    {
      height,
      width: 1080,
    },
  );
}
