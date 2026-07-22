"use client";

import React, { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RiUploadCloud2Line,
  RiDeleteBinLine,
  RiLoader2Line,
  RiFileTextLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "@remixicon/react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

/**
 * Upload a file to the PDE S3 upload endpoint.
 */
async function uploadPdeFile(
  businessId: number | string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<{ url: string; key: string; fileName: string; size: number } | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessId", String(businessId));

  try {
    const xhr = new XMLHttpRequest();

    const result = await new Promise<{ url: string; key: string; fileName: string; size: number } | null>(
      (resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable && onProgress) {
            onProgress(Math.round((e.loaded / e.total) * 100));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              if (data.success && data.data) {
                resolve(data.data);
              } else {
                resolve(null);
              }
            } catch {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });

        xhr.addEventListener("error", () => reject(new Error("Network error")));

        xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL || ""}/api/pde-upload/upload`);
        xhr.withCredentials = true;
        xhr.send(formData);
      }
    );

    return result;
  } catch {
    return null;
  }
}

/* ── Types ── */

export interface S3UploadedFile {
  url: string;
  key: string;
  fileName: string;
  size: number;
}

export type UploadCategory =
  | "customerReviews"
  | "faqs"
  | "supportTickets"
  | "supportEmails"
  | "marketingCopy"
  | "customerCommunications"
  | "whatsappChats"
  | "salesData";

const UPLOAD_CATEGORIES: { key: UploadCategory; label: string; description: string; accept: string }[] = [
  {
    key: "customerReviews",
    label: "Customer Reviews",
    description: "Existing customer reviews, ratings, testimonials (.csv, .txt, .json)",
    accept: ".csv,.txt,.json,.jsonl",
  },
  {
    key: "faqs",
    label: "FAQs",
    description: "Frequently asked questions and answers (.csv, .txt, .json)",
    accept: ".csv,.txt,.json",
  },
  {
    key: "supportTickets",
    label: "Support Tickets",
    description: "Customer support ticket logs (.csv, .txt, .json)",
    accept: ".csv,.txt,.json,.jsonl",
  },
  {
    key: "supportEmails",
    label: "Support Emails",
    description: "Customer support email threads (.csv, .txt, .json)",
    accept: ".csv,.txt,.json",
  },
  {
    key: "marketingCopy",
    label: "Marketing Copy",
    description: "Ad copy, landing pages, promotional content (.csv, .txt, .json)",
    accept: ".csv,.txt,.json,.md",
  },
  {
    key: "customerCommunications",
    label: "Customer Communications",
    description: "Broadcast messages, newsletters, announcements (.csv, .txt, .json)",
    accept: ".csv,.txt,.json",
  },
  {
    key: "whatsappChats",
    label: "WhatsApp Chats",
    description: "WhatsApp chat exports (.txt, .csv, .json)",
    accept: ".txt,.csv,.json,.jsonl",
  },
  {
    key: "salesData",
    label: "Sales Data",
    description: "Sales records, transaction logs (.csv, .json)",
    accept: ".csv,.json",
  },
];

/* ── Props ── */

interface BrandPdeFileUploadProps {
  businessId: number | string;
  /** Called when files finish uploading — returns S3 URLs per category */
  onUploadComplete?: (uploads: Record<UploadCategory, S3UploadedFile[]>) => void;
  /** Pre-populated URLs (e.g. from a previous session) */
  existingUploads?: Record<UploadCategory, S3UploadedFile[]>;
}

/* ── Component ── */

export default function BrandPdeFileUpload({
  businessId,
  onUploadComplete,
  existingUploads,
}: BrandPdeFileUploadProps) {
  const [uploadsByCategory, setUploadsByCategory] = useState<
    Record<UploadCategory, S3UploadedFile[]>
  >(existingUploads ?? ({} as Record<UploadCategory, S3UploadedFile[]>));
  const [uploading, setUploading] = useState<UploadCategory | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileSelect = useCallback(
    async (category: UploadCategory, files: FileList | null) => {
      if (!files || files.length === 0) return;

      setUploading(category);

      const uploaded: S3UploadedFile[] = [];
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        const fileKey = `${category}:${file.name}`;
        const result = await uploadPdeFile(businessId, file, (pct) => {
          setProgress((prev) => ({ ...prev, [fileKey]: pct }));
        });

        if (result) {
          uploaded.push(result);
          toast.success(`Uploaded: ${file.name}`);
        } else {
          toast.error(`Failed to upload: ${file.name}`);
        }
      }

      setUploadsByCategory((prev) => {
        const existing = prev[category] ?? [];
        const updated = { ...prev, [category]: [...existing, ...uploaded] };
        return updated;
      });

      setProgress({});
      setUploading(null);

      // Notify parent
      if (onUploadComplete) {
        const all = { ...uploadsByCategory, [category]: [...(uploadsByCategory[category] ?? []), ...uploaded] };
        onUploadComplete(all);
      }

      // Reset file input
      if (fileInputRefs.current[category]) {
        fileInputRefs.current[category]!.value = "";
      }
    },
    [businessId, onUploadComplete, uploadsByCategory]
  );

  const removeFile = useCallback(
    (category: UploadCategory, index: number) => {
      setUploadsByCategory((prev) => {
        const existing = prev[category] ?? [];
        const updated = existing.filter((_, i) => i !== index);
        return { ...prev, [category]: updated };
      });
    },
    []
  );

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalFiles = Object.values(uploadsByCategory).reduce(
    (sum, files) => sum + files.length,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiUploadCloud2Line className="h-5 w-5 text-primary" />
          Upload Business Data
        </CardTitle>
        <CardDescription>
          Upload customer reviews, support tickets, FAQs, and other business data.
          Files are stored in S3 and referenced by URL — no size limit restrictions
          for large datasets spanning years of data.
          {totalFiles > 0 && (
            <span className="block mt-1 text-xs font-medium text-primary">
              {totalFiles} file{totalFiles > 1 ? "s" : ""} uploaded
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {UPLOAD_CATEGORIES.map((cat) => {
            const uploadedFiles = uploadsByCategory[cat.key] ?? [];
            const isUploading = uploading === cat.key;

            return (
              <div
                key={cat.key}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  uploadedFiles.length > 0
                    ? "border-primary/20 bg-primary/5"
                    : "border-dashed border-muted-foreground/25"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <Label className="text-sm font-medium">{cat.label}</Label>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                  <div className="shrink-0">
                    <input
                      ref={(el) => { fileInputRefs.current[cat.key] = el; }}
                      type="file"
                      accept={cat.accept}
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileSelect(cat.key, e.target.files)}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isUploading}
                      onClick={() => fileInputRefs.current[cat.key]?.click()}
                    >
                      {isUploading ? (
                        <>
                          <RiLoader2Line className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <RiUploadCloud2Line className="mr-1.5 h-3.5 w-3.5" />
                          Upload
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Uploaded files list */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {uploadedFiles.map((file, i) => (
                      <div
                        key={`${file.key}-${i}`}
                        className="flex items-center gap-2 text-xs bg-background rounded px-2.5 py-1.5 border"
                      >
                        <RiFileTextLine className="size-3.5 text-primary shrink-0" />
                        <span className="truncate flex-1">{file.fileName}</span>
                        <span className="text-muted-foreground shrink-0">
                          {formatSize(file.size)}
                        </span>
                        <RiCheckLine className="size-3 text-green-500 shrink-0" />
                        <button
                          type="button"
                          onClick={() => removeFile(cat.key, i)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <RiDeleteBinLine className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progress indicator */}
                {isUploading && Object.keys(progress).length > 0 && (
                  <div className="mt-2">
                    {Object.entries(progress).map(([key, pct]) => (
                      <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-300 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right">{pct}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info callout */}
        <div className="mt-6 p-3 rounded-lg bg-muted/50 border flex items-start gap-2">
          <RiInformationLine className="size-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-0.5">How this works</p>
            <p>
              Files are uploaded to your S3 bucket. When you run a PDE analysis, the system
              downloads them from S3 and processes each line as a separate data point.
              You can upload files with tens of thousands of entries — there is no payload limit.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
