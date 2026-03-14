import { GradientPlaceholder } from "@/components/gradient-placeholder";
import { cn } from "@/lib/utils";

interface BeforeAfterCardProps {
  beforeFrom: string;
  beforeTo: string;
  afterFrom: string;
  afterTo: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterCard({
  beforeFrom,
  beforeTo,
  afterFrom,
  afterTo,
  beforeLabel = "Original",
  afterLabel = "Plushified",
  className,
}: BeforeAfterCardProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <GradientPlaceholder
        fromColor={beforeFrom}
        toColor={beforeTo}
        label={beforeLabel}
        className="aspect-square"
      />
      <GradientPlaceholder
        fromColor={afterFrom}
        toColor={afterTo}
        label={afterLabel}
        className="aspect-square"
      />
    </div>
  );
}
