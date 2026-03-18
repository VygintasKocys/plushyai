"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Clock, Cpu } from "lucide-react";
import { toast } from "sonner";
import { GenerationResult } from "@/components/generate/generation-result";
import { StyleSelector } from "@/components/generate/style-selector";
import { UploadZone } from "@/components/generate/upload-zone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { generatePlushie } from "./actions";

type GenerationStatus = "pending" | "processing" | "completed" | "failed";

interface GeneratedResult {
  originalImageUrl: string;
  generatedImageUrl: string;
}

export default function GeneratePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] =
    useState<GeneratedResult | null>(null);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] =
    useState<GenerationStatus | null>(null);
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  // Poll for generation status using recursive timeout to prevent overlapping requests
  useEffect(() => {
    if (
      !generationId ||
      !generationStatus ||
      generationStatus === "completed" ||
      generationStatus === "failed"
    ) {
      return;
    }

    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await fetch(`/api/generation/${generationId}`);
        if (!res.ok || cancelled) return;

        const data = await res.json();
        if (cancelled) return;

        setGenerationStatus(data.status);

        if (data.status === "completed" && data.generatedImageUrl) {
          setGeneratedResult({
            originalImageUrl: data.originalImageUrl,
            generatedImageUrl: data.generatedImageUrl,
          });
          setIsGenerating(false);
          setGenerationId(null);
          return;
        } else if (data.status === "failed") {
          toast.error(data.errorMessage ?? "Generation failed. Please try again.");
          setIsGenerating(false);
          setGenerationId(null);
          return;
        }
      } catch {
        // Silently ignore polling errors — will retry on next tick
      }

      if (!cancelled) {
        pollingRef.current = setTimeout(poll, 2000);
      }
    }

    pollingRef.current = setTimeout(poll, 2000);

    return () => {
      cancelled = true;
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [generationId, generationStatus]);

  const handleFileSelect = useCallback(
    (file: File, url: string) => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(url);
      setGeneratedResult(null);
    },
    [previewUrl]
  );

  const handleClear = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setGeneratedResult(null);
  }, [previewUrl]);

  const handleGenerate = useCallback(async () => {
    if (!selectedFile) return;
    setIsGenerating(true);
    setGenerationStatus(null);
    setGenerationId(null);

    try {
      const formData = new FormData();
      formData.append("style", selectedStyle);
      formData.append("imageFile", selectedFile);

      const result = await generatePlushie(formData);

      if ("error" in result) {
        setIsGenerating(false);
        switch (result.error) {
          case "unauthorized":
            router.replace("/login");
            return;
          case "insufficient_credits":
            toast.error(
              "Insufficient credits! Please purchase more credits to continue generating."
            );
            return;
          case "generation_failed":
            toast.error("Image generation failed. Please try again.");
            return;
          case "validation_failed":
            toast.error("Invalid input. Please check your file and try again.");
            return;
        }
      }

      if ("success" in result && result.generationId) {
        setGenerationId(result.generationId);
        setGenerationStatus("pending");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsGenerating(false);
    }
  }, [selectedFile, selectedStyle, router]);

  const handleDownload = useCallback(async () => {
    if (!generatedResult) return;
    try {
      const response = await fetch(generatedResult.generatedImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plushified.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Please try again.");
    }
  }, [generatedResult]);

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setGeneratedResult(null);
    setGenerationId(null);
    setGenerationStatus(null);
    setSelectedStyle("classic");
  }, [previewUrl]);

  if (isPending || !session) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Generate a Plushie</h1>
        <p className="text-muted-foreground">
          Upload a photo and transform it into an adorable plushie version
        </p>
      </div>

      {generatedResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Plushie is Ready!</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerationResult
              beforeImageUrl={generatedResult.originalImageUrl}
              afterImageUrl={generatedResult.generatedImageUrl}
              onDownload={handleDownload}
              onReset={handleReset}
            />
          </CardContent>
        </Card>
      ) : isGenerating && generationStatus ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4 text-center">
              {generationStatus === "pending" ? (
                <>
                  <Clock className="h-10 w-10 animate-pulse text-muted-foreground" />
                  <div>
                    <p className="text-lg font-medium">Your plushie is queued...</p>
                    <p className="text-sm text-muted-foreground">
                      Waiting for an available slot
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Cpu className="h-10 w-10 animate-spin text-primary" />
                  <div>
                    <p className="text-lg font-medium">
                      AI is generating your plushie...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This usually takes 10–30 seconds
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Upload Your Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                onClear={handleClear}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Choose a Style</CardTitle>
            </CardHeader>
            <CardContent>
              <StyleSelector
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  This will use <strong>1 credit</strong>.
                </p>
                <Button
                  size="lg"
                  disabled={!selectedFile || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Plushie
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
