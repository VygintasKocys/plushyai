"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/components/gallery/gallery-card";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { GalleryDetailModal } from "@/components/gallery/gallery-detail-modal";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { PLUSHIE_STYLES } from "@/lib/mock-data";
import { getGalleryItems } from "./actions";

type SortOrder = "newest" | "oldest";

export default function GalleryPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [styleFilter, setStyleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getGalleryItems();
      if ("error" in result) return;
      setItems(result.items);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchItems();
    }
  }, [session, fetchItems]);

  const filteredItems = useMemo(() => {
    let filtered = [...items];
    if (styleFilter !== "all") {
      filtered = filtered.filter((item) => item.style === styleFilter);
    }
    filtered.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return filtered;
  }, [items, styleFilter, sortOrder]);

  if (isPending || !session) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Your Gallery</h1>
          <Badge variant="secondary">{filteredItems.length} items</Badge>
        </div>
        <div className="flex gap-3">
          <Select value={styleFilter} onValueChange={setStyleFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Styles</SelectItem>
              {PLUSHIE_STYLES.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  {style.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortOrder}
            onValueChange={(v) => setSortOrder(v as SortOrder)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {items.length === 0 ? (
            <p className="text-lg">
              No plushie generations yet. Go create your first one!
            </p>
          ) : (
            <p className="text-lg">No items match your filter.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      )}

      <GalleryDetailModal
        item={selectedItem}
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        onDelete={fetchItems}
      />
    </div>
  );
}
