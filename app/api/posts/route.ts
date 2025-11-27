import { NextResponse } from "next/server";
import { fetchTrends } from "@/lib/trends";
import { extractKeywords, postVariants } from "@/lib/text";

export const revalidate = 0;

export async function GET() {
  try {
    const trends = await fetchTrends(18);
    const posts = trends.map((t) => ({
      trendId: t.id,
      variants: postVariants(t.title, t.link, extractKeywords(t.title))
    }));
    return NextResponse.json({ trends, posts }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to build posts" }, { status: 500 });
  }
}

