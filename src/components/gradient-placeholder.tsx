import { cn } from "@/lib/utils";

interface GradientPlaceholderProps {
  fromColor: string;
  toColor: string;
  className?: string;
  label?: string;
}

export function GradientPlaceholder({
  fromColor,
  toColor,
  className,
  label,
}: GradientPlaceholderProps) {
  return (
    <div
      className={cn("rounded-lg relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
      }}
    >
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-sm font-medium bg-black/30 px-3 py-1 rounded-full">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
