"use client";

import { GradientPlaceholder } from "@/components/gradient-placeholder";
import { Badge } from "@/components/ui/badge";

interface GalleryItem {
  id: string;
  title: string;
  style: string;
  createdAt: string;
  afterFrom: string;
  afterTo: string;
}

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export function GalleryCard({ item, onClick }: GalleryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-lg border overflow-hidden text-left transition-all hover:ring-2 hover:ring-primary/20"
    >
      <div className="relative">
        <GradientPlaceholder
          fromColor={item.afterFrom}
          toColor={item.afterTo}
          className="aspect-square"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
            View
          </span>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-1">
          <Badge variant="secondary" className="text-xs">
            {item.style}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </button>
  );
}
