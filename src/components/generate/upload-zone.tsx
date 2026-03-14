"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function UploadZone({
  onFileSelect,
  selectedFile,
  onClear,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onClear();
    if (inputRef.current) inputRef.current.value = "";
  }, [previewUrl, onClear]);

  if (selectedFile && previewUrl) {
    return (
      <div className="relative rounded-lg border overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Preview"
          className="w-full max-h-80 object-contain bg-muted"
        />
        <div className="absolute top-2 right-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClear}
          >
            <X className="h-4 w-4 mr-1" />
            Change Image
          </Button>
        </div>
        <div className="p-3 bg-card border-t">
          <p className="text-sm text-muted-foreground truncate">
            {selectedFile.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleChange}
      />
      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium mb-1">
        Drag & drop your image here
      </p>
      <p className="text-sm text-muted-foreground">
        or click to browse (PNG, JPG up to 10MB)
      </p>
    </div>
  );
}
