"use client";

import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

interface AIButtonProps {
  onGenerate: () => Promise<void>;
  loading?: boolean;
  disabled?: boolean;
}

export function AIButton({
  onGenerate,
  loading = false,
  disabled = false,
}: AIButtonProps) {
  return (
    <Button
      type="button"
      onClick={onGenerate}
      disabled={loading || disabled}
      className="gap-2"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="size-4" />
          Generate with Gemini
        </>
      )}
    </Button>
  );
}