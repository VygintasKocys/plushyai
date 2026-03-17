"use client";

import { Download, RefreshCw } from "lucide-react";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { Button } from "@/components/ui/button";

interface GenerationResultProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  onDownload: () => void;
  onReset: () => void;
}

export function GenerationResult({
  beforeImageUrl,
  afterImageUrl,
  onDownload,
  onReset,
}: GenerationResultProps) {
  return (
    <div className="space-y-4">
      <BeforeAfterSlider
        beforeImageUrl={beforeImageUrl}
        afterImageUrl={afterImageUrl}
      />
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="outline" onClick={onDownload}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button variant="ghost" onClick={onReset}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Generate Another
        </Button>
      </div>
    </div>
  );
}
