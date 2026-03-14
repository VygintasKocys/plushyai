import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plushify",
    short_name: "Plushify",
    description:
      "Transform your photos into adorable plushie versions with AI",
    start_url: "/",
    display: "standalone",
    background_color: "#fff0f5",
    theme_color: "#e8458b",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
