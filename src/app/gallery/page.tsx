"use client";

import { useMemo, useState } from "react";
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
import { MOCK_GALLERY, PLUSHIE_STYLES } from "@/lib/mock-data";

type SortOrder = "newest" | "oldest";

export default function GalleryPage() {
  const [styleFilter, setStyleFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedItem, setSelectedItem] = useState<
    (typeof MOCK_GALLERY)[number] | null
  >(null);

  const filteredItems = useMemo(() => {
    let items = [...MOCK_GALLERY];
    if (styleFilter !== "all") {
      const styleName = PLUSHIE_STYLES.find((s) => s.id === styleFilter)?.name;
      items = items.filter((item) => item.style === styleName);
    }
    items.sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? db - da : da - db;
    });
    return items;
  }, [styleFilter, sortOrder]);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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

      {filteredItems.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">No items match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      />
    </div>
  );
}
