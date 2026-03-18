"use client";

import { Badge } from "@/components/ui/badge";
import { PLUSHIE_STYLES } from "@/lib/mock-data";

export interface GalleryItem {
  id: string;
  title: string;
  style: string;
  createdAt: Date;
  creditCost: number;
  originalImageUrl: string;
  generatedImageUrl: string | null;
}

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  const styleName =
    PLUSHIE_STYLES.find((s) => s.id === item.style)?.name ?? item.style;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View ${item.title}`}
      className="group overflow-hidden rounded-lg border text-left transition-all hover:ring-2 hover:ring-primary/20"
    >
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.generatedImageUrl ?? undefined}
          alt={item.title}
          className="aspect-square w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            View
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium">{item.title}</p>
        <div className="mt-1 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            {styleName}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </button>
  );
}
