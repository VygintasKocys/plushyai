"use client";

import { useState, useCallback, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_USER } from "@/lib/mock-data";

export default function GeneratePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("classic");
  const [size, setSize] = useState("1024");
  const [quality, setQuality] = useState("standard");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Revoke the preview URL on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = useCallback((file: File, url: string) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setShowResult(false);
  }, []);

  const handleClear = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowResult(false);
  }, []);

  const handleGenerate = useCallback(() => {
    if (!selectedFile) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 2000);
  }, [selectedFile]);

  const handleReset = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowResult(false);
    setSelectedStyle("classic");
    setSize("1024");
    setQuality("standard");
  }, []);

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate a Plushie</h1>
        <p className="text-muted-foreground">
          Upload a photo and transform it into an adorable plushie version
        </p>
      </div>

      {showResult && previewUrl ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Plushie is Ready!</CardTitle>
          </CardHeader>
          <CardContent>
            <GenerationResult
              beforeImageUrl={previewUrl}
              onSave={() => toast.success("Saved to gallery!")}
              onDownload={() => toast.info("Download started")}
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
            <CardHeader>
              <CardTitle>3. Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size</label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="512">512 x 512</SelectItem>
                      <SelectItem value="1024">1024 x 1024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quality</label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hd">HD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  This will use <strong>1 credit</strong>. You have{" "}
                  <strong>{MOCK_USER.credits} remaining</strong>.
                </p>
                <Button
                  size="lg"
                  disabled={!selectedFile || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
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
