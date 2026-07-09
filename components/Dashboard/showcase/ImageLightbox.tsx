"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: string[];
  open: boolean;
  index: number;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  alt?: string;
}

export function ImageLightbox({
  images,
  open,
  index,
  onOpenChange,
  onIndexChange,
  alt = "Image",
}: ImageLightboxProps) {
  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goPrev, goNext]);

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[95vw] sm:max-w-4xl w-full h-[85vh] p-0 border-0 bg-black/95 flex items-center justify-center overflow-hidden"
      >
        {/* Radix requires a DialogTitle for a11y; visually hidden here */}
        <DialogTitle className="sr-only">
          {alt} — image {index + 1} of {images.length}
        </DialogTitle>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="absolute top-4 left-4 z-20 text-sm text-white/70">
          {index + 1} / {images.length}
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        <div className="relative w-full h-full flex items-center justify-center px-4">
          <div className="relative w-full h-full max-w-full max-h-full">
            <Image
              src={images[index]}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-contain"
              sizes="95vw"
              priority
            />
          </div>
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2 px-4">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "relative h-10 w-14 shrink-0 overflow-hidden rounded-md border transition-opacity",
                  i === index
                    ? "border-white opacity-100"
                    : "border-white/30 opacity-50 hover:opacity-80"
                )}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
