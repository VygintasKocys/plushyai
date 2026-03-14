import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/docs", "/privacy", "/terms"],
        disallow: ["/api/", "/dashboard/", "/profile/", "/generate/", "/gallery/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
