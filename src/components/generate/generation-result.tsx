"use client";

import { Download, Save, RefreshCw } from "lucide-react";
import { GradientPlaceholder } from "@/components/gradient-placeholder";
import { Button } from "@/components/ui/button";

interface GenerationResultProps {
  beforeImageUrl: string;
  onSave: () => void;
  onDownload: () => void;
  onReset: () => void;
}

export function GenerationResult({
  beforeImageUrl,
  onSave,
  onDownload,
  onReset,
}: GenerationResultProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground text-center">
            Original
          </p>
          <div className="rounded-lg border overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={beforeImageUrl}
              alt="Original"
              className="w-full aspect-square object-cover"
            />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground text-center">
            Plushified
          </p>
          <GradientPlaceholder
            fromColor="#f9a8d4"
            toColor="#c084fc"
            label="Plushified!"
            className="aspect-square"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={onSave}>
          <Save className="h-4 w-4 mr-2" />
          Save to Gallery
        </Button>
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="ghost" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate Another
        </Button>
      </div>
    </div>
  );
}
