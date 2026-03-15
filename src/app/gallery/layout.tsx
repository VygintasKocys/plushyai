import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | Plushify",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
