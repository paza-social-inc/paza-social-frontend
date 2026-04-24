"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RiImageAddLine, RiDeleteBinLine, RiLoader2Line, RiImageLine } from "@remixicon/react";
import { uploadBrandLogo, uploadBrandCoverImage } from "@/lib/data/brands";
import toast from "react-hot-toast";

interface BrandMediaUploadProps {
    businessId: number;
    currentLogo?: string;
    currentCover?: string;
    onUpdate?: (updates: { logo?: string; coverImage?: string }) => void;
}

export default function BrandMediaUpload({ businessId, currentLogo, currentCover, onUpdate }: BrandMediaUploadProps) {
    const [logo, setLogo] = React.useState<string | undefined>(currentLogo);
    const [cover, setCover] = React.useState<string | undefined>(currentCover);
    const [uploadingLogo, setUploadingLogo] = React.useState(false);
    const [uploadingCover, setUploadingCover] = React.useState(false);

    const logoRef = React.useRef<HTMLInputElement>(null);
    const coverRef = React.useRef<HTMLInputElement>(null);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingLogo(true);
        try {
            const res = await uploadBrandLogo(businessId, file);
            if (res.data?.logo) {
                setLogo(res.data.logo);
                toast.success("Logo uploaded");
                onUpdate?.({ logo: res.data.logo });
            }
        } catch {
            toast.error("Logo upload failed");
        } finally {
            setUploadingLogo(false);
            if (logoRef.current) logoRef.current.value = "";
        }
    };

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingCover(true);
        try {
            const res = await uploadBrandCoverImage(businessId, file);
            if (res.data?.coverImage) {
                setCover(res.data.coverImage);
                toast.success("Cover image uploaded");
                onUpdate?.({ coverImage: res.data.coverImage });
            }
        } catch {
            toast.error("Cover upload failed");
        } finally {
            setUploadingCover(false);
            if (coverRef.current) coverRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <RiImageLine className="h-5 w-5 text-primary" />
                    Brand Media
                </CardTitle>
                <CardDescription>Upload your brand logo and cover image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Logo */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">Brand Logo</Label>
                    <div className="flex items-center gap-6">
                        <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center bg-muted/30 shrink-0">
                            {logo ? (
                                <>
                                    <Image src={logo} alt="Brand logo" fill className="object-cover" sizes="96px" />
                                    <button
                                        type="button"
                                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"
                                        onClick={() => logoRef.current?.click()}
                                    >
                                        <RiDeleteBinLine className="h-5 w-5 text-white" />
                                    </button>
                                </>
                            ) : (
                                <RiImageAddLine className="h-8 w-8 text-muted-foreground/40" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={uploadingLogo}
                                onClick={() => logoRef.current?.click()}
                            >
                                {uploadingLogo ? (
                                    <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <RiImageAddLine className="mr-2 h-4 w-4" />
                                )}
                                {logo ? "Replace Logo" : "Upload Logo"}
                            </Button>
                            <p className="text-xs text-muted-foreground">PNG, JPG, or SVG. Recommended 512×512px.</p>
                        </div>
                    </div>
                    <input
                        ref={logoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoUpload}
                    />
                </div>

                {/* Cover Image */}
                <div className="space-y-3 border-t pt-6">
                    <Label className="text-base font-semibold">Cover Image</Label>
                    <div className="relative aspect-[3/1] max-h-48 rounded-xl border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center bg-muted/30">
                        {cover ? (
                            <>
                                <Image src={cover} alt="Brand cover" fill className="object-cover" sizes="(max-width: 768px) 100vw, 600px" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => coverRef.current?.click()}
                                    >
                                        Replace
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="flex flex-col items-center gap-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                                onClick={() => coverRef.current?.click()}
                            >
                                <RiImageAddLine className="h-10 w-10" />
                                <span className="text-sm">Click to upload cover image</span>
                            </button>
                        )}
                        {uploadingCover && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <RiLoader2Line className="h-8 w-8 text-white animate-spin" />
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended 1500×500px. JPG or PNG.</p>
                    <input
                        ref={coverRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
