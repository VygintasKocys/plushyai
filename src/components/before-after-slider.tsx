"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfterSlider({
  beforeImageUrl,
  afterImageUrl,
  beforeLabel = "Original",
  afterLabel = "Plushified",
  className,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalUp = () => setIsDragging(false);
    window.addEventListener("pointerup", handleGlobalUp);
    return () => window.removeEventListener("pointerup", handleGlobalUp);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative cursor-col-resize select-none overflow-hidden rounded-2xl shadow-2xl",
        className
      )}
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After image (full, underneath) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterImageUrl}
        alt={afterLabel}
        className="block h-auto w-full"
        draggable={false}
      />

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImageUrl}
          alt={beforeLabel}
          className="block h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-lg"
        style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
      >
        {/* Slider handle */}
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-gray-700"
          >
            <path
              d="M6 10L2 10M2 10L5 7M2 10L5 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 10L18 10M18 10L15 7M18 10L15 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-3 left-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity"
        style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
      >
        {beforeLabel}
      </div>
      <div
        className="absolute top-3 right-3 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm transition-opacity"
        style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
      >
        {afterLabel}
      </div>
    </div>
  );
}
