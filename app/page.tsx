/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";

type TrendItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  publishedAt?: string;
};

type PostSuggestion = {
  trendId: string;
  variants: {
    caption: string;
    hashtags: string[];
  }[];
};

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [posts, setPosts] = useState<Record<string, PostSuggestion>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/posts", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        setTrends(data.trends);
        const map: Record<string, PostSuggestion> = {};
        for (const p of data.posts as PostSuggestion[]) {
          map[p.trendId] = p;
        }
        setPosts(map);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const topHashtags = useMemo(() => {
    const freq = new Map<string, number>();
    Object.values(posts).forEach(p =>
      p.variants.forEach(v => v.hashtags.forEach(h => freq.set(h, (freq.get(h) ?? 0) + 1)))
    );
    return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([h]) => h);
  }, [posts]);

  return (
    <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Interior Trends Agent</h1>
        <a
          href="https://agentic-71a511f9.vercel.app"
          target="_blank"
          rel="noreferrer"
          style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}
        >
          Live URL
        </a>
      </header>

      <section style={{ marginTop: 12, color: "#374151" }}>
        <p style={{ margin: 0 }}>
          Auto-discovers interior design trends, generates social post ideas, and produces downloadable poster images.
        </p>
      </section>

      {loading && <p style={{ marginTop: 24 }}>Loading latest trends?</p>}
      {error && <p style={{ marginTop: 24, color: "#b91c1c" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <section style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Top Hashtags</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topHashtags.map((h) => (
                <span key={h} style={{ background: "#eef2ff", color: "#3730a3", padding: "4px 8px", borderRadius: 8, fontSize: 13 }}>
                  {h}
                </span>
              ))}
              {topHashtags.length === 0 && <span style={{ color: "#6b7280" }}>No hashtags yet.</span>}
            </div>
          </section>

          <section style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Trending Topics</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 16
              }}
            >
              {trends.map((t) => {
                const p = posts[t.id];
                return (
                  <article key={t.id} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <a href={t.link} target="_blank" rel="noreferrer" style={{ color: "#111827", fontWeight: 600, textDecoration: "none" }}>
                        {t.title}
                      </a>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>
                        <span>{t.source}</span>
                        {t.publishedAt && <span> ? {new Date(t.publishedAt).toLocaleString()}</span>}
                      </div>
                      {p && (
                        <div style={{ marginTop: 4 }}>
                          <h3 style={{ fontSize: 14, margin: "8px 0" }}>Post ideas</h3>
                          <ul style={{ paddingLeft: 18, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                            {p.variants.map((v, idx) => (
                              <li key={idx} style={{ fontSize: 14, color: "#111827" }}>
                                <div>{v.caption}</div>
                                <div style={{ marginTop: 4, fontSize: 12, color: "#6b7280" }}>
                                  {v.hashtags.map(h => <span key={h} style={{ marginRight: 6 }}>{h}</span>)}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                        <a
                          href={`/api/poster?title=${encodeURIComponent(t.title)}&source=${encodeURIComponent(t.source)}&url=${encodeURIComponent(t.link)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #e5e7eb",
                            padding: "8px 12px",
                            borderRadius: 8,
                            textDecoration: "none",
                            color: "#111827",
                            fontWeight: 600
                          }}
                        >
                          Open Poster
                        </a>
                        <a
                          href={`/api/poster?title=${encodeURIComponent(t.title)}&source=${encodeURIComponent(t.source)}&url=${encodeURIComponent(t.link)}&download=1`}
                          download
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#111827",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: 8,
                            textDecoration: "none",
                            fontWeight: 600
                          }}
                        >
                          Download
                        </a>
                      </div>
                      <div style={{ marginTop: 8, borderRadius: 8, overflow: "hidden", border: "1px solid #f3f4f6" }}>
                        <img
                          alt="Poster preview"
                          src={`/api/poster?title=${encodeURIComponent(t.title)}&source=${encodeURIComponent(t.source)}&url=${encodeURIComponent(t.link)}&w=600&h=800`}
                          style={{ width: "100%", height: "auto", display: "block" }}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

