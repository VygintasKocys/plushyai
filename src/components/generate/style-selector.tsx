"use client";

import { PLUSHIE_STYLES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
}

export function StyleSelector({
  selectedStyle,
  onSelectStyle,
}: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {PLUSHIE_STYLES.map((style) => (
        <button
          key={style.id}
          type="button"
          onClick={() => onSelectStyle(style.id)}
          aria-pressed={selectedStyle === style.id}
          className={cn(
            "rounded-lg border p-4 text-left transition-all hover:border-primary/50",
            selectedStyle === style.id
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "border-border"
          )}
        >
          <p className="font-medium mb-1">{style.name}</p>
          <p className="text-sm text-muted-foreground">{style.description}</p>
        </button>
      ))}
    </div>
  );
}
