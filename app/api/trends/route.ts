import { NextResponse } from "next/server";
import { fetchTrends } from "@/lib/trends";

export const revalidate = 0;

export async function GET() {
  try {
    const items = await fetchTrends(24);
    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed to fetch trends" }, { status: 500 });
  }
}

