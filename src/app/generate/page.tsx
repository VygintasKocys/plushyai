"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
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

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

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

    try {
      const formData = new FormData();
      formData.append("style", selectedStyle);
      formData.append("imageFile", selectedFile);

      const result = await generatePlushie(formData);

      if ("error" in result) {
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

      if ("success" in result && result.generation) {
        setGeneratedResult({
          originalImageUrl: result.generation.originalImageUrl,
          generatedImageUrl: result.generation.generatedImageUrl,
        });
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
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
