import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditBadgeProps {
  credits: number;
  variant?: "inline" | "card";
}

export function CreditBadge({ credits, variant = "inline" }: CreditBadgeProps) {
  if (variant === "card") {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
        <Sparkles className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm text-muted-foreground">Credits</p>
          <p className="text-lg font-bold">{credits}</p>
        </div>
      </div>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
      )}
    >
      <Sparkles className="h-3 w-3" />
      {credits} credits
    </span>
  );
}
