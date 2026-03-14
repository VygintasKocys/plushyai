"use client";

import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BeforeAfterCard } from "@/components/before-after-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GalleryItem {
  id: string;
  title: string;
  style: string;
  createdAt: string;
  creditCost: number;
  beforeFrom: string;
  beforeTo: string;
  afterFrom: string;
  afterTo: string;
}

interface GalleryDetailModalProps {
  item: GalleryItem | null;
  open: boolean;
  onClose: () => void;
}

export function GalleryDetailModal({
  item,
  open,
  onClose,
}: GalleryDetailModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
        </DialogHeader>
        <BeforeAfterCard
          beforeFrom={item.beforeFrom}
          beforeTo={item.beforeTo}
          afterFrom={item.afterFrom}
          afterTo={item.afterTo}
        />
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <Badge variant="secondary">{item.style}</Badge>
          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          <span>{item.creditCost} credit used</span>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => toast.info("Download started")}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast.success("Deleted from gallery");
              onClose();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
