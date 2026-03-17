"use client";

import { useState } from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteGalleryItem } from "@/app/gallery/actions";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import type { GalleryItem } from "@/components/gallery/gallery-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PLUSHIE_STYLES } from "@/lib/mock-data";

interface GalleryDetailModalProps {
  item: GalleryItem | null;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function GalleryDetailModal({
  item,
  open,
  onClose,
  onDelete,
}: GalleryDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!item) return null;

  const styleName =
    PLUSHIE_STYLES.find((s) => s.id === item.style)?.name ?? item.style;

  const handleDownload = async () => {
    try {
      const response = await fetch(item.generatedImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title.replace(/\s+/g, "-").toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this generation? This cannot be undone."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteGalleryItem(item.id);
      if ("error" in result) {
        toast.error("Failed to delete. Please try again.");
        return;
      }
      toast.success("Deleted from gallery");
      onClose();
      onDelete();
    } catch {
      toast.error("Failed to delete. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        <BeforeAfterSlider
          beforeImageUrl={item.originalImageUrl}
          afterImageUrl={item.generatedImageUrl}
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{styleName}</Badge>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          <span>{item.creditCost} credit used</span>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
