"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RiAddLine, RiDeleteBinLine, RiImageLine, RiLoader2Line, RiPencilLine, RiPlayCircleLine, RiUpload2Line } from "@remixicon/react";
import {
    CreatorPastProject,
    addCreatorPastProject,
    removeCreatorPastProject,
    updateCreatorPastProject,
} from "@/lib/data/creator";
import { DEFAULT_API_URL, pazaApi } from "@/lib/axiosClients";
import {
    PROJECT_ROLES_INDUSTRY,
    PROJECT_ROLES_BRAND,
    OUTCOME_TYPES,
    MEASUREMENT_SOURCES,
    REVENUE_BANDS
} from "@/lib/constants/creatorTaxonomy";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

// Extend the base type locally for the two reflection questions — safe if the
// backend doesn't store them yet (frontend-only until the API/type is extended).
type ProjectDraft = Omit<CreatorPastProject, "id"> & {
    styleEpitome?: string;
    meaningfulWork?: string;
};

const EMPTY_PROJECT: ProjectDraft = {
    title: "",
    period: "",
    description: "",
    mediaLinks: [],
    producedReusableAsset: false,
    revenueBand: "<$500",
    projectRoleIndustry: "",
    projectRoleBrand: "",
    outcomeTypes: [],
    measurementSources: [],
    styleEpitome: "",
    meaningfulWork: "",
};

function toAbsoluteUploadUrl(url: string): string {
    const v = String(url ?? "").trim();
    if (!v) return "";
    if (/^https?:\/\//i.test(v) || v.startsWith("blob:") || v.startsWith("data:")) return v;
    if (v.startsWith("/uploads/")) {
        const base = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "");
        return `${base}${v}`;
    }
    return v;
}

function projectToDraft(project: CreatorPastProject): ProjectDraft {
    const p = project as CreatorPastProject & { styleEpitome?: string; meaningfulWork?: string };
    return {
        title: p.title ?? "",
        period: p.period ?? "",
        description: p.description ?? "",
        mediaLinks: p.mediaLinks ?? [],
        producedReusableAsset: p.producedReusableAsset ?? false,
        revenueBand: p.revenueBand ?? "<$500",
        projectRoleIndustry: p.projectRoleIndustry ?? "",
        projectRoleBrand: p.projectRoleBrand ?? "",
        outcomeTypes: p.outcomeTypes ?? [],
        measurementSources: p.measurementSources ?? [],
        styleEpitome: p.styleEpitome ?? "",
        meaningfulWork: p.meaningfulWork ?? "",
    };
}

export default function CreatorPortfolioManager({ initialProjects, onUpdate }: { initialProjects: CreatorPastProject[], onUpdate?: () => void }) {
    const [projects, setProjects] = React.useState<CreatorPastProject[]>(initialProjects);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [imageUploadPending, setImageUploadPending] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<number | null>(null);

    const [draft, setDraft] = React.useState<ProjectDraft>(EMPTY_PROJECT);

    const isEditing = editingId !== null;

    const openCreate = () => {
        setEditingId(null);
        setDraft(EMPTY_PROJECT);
        setOpen(true);
    };

    const openEdit = (project: CreatorPastProject) => {
        setEditingId(project.id);
        setDraft(projectToDraft(project));
        setOpen(true);
    };

    const uploadImage = async (file: File): Promise<string> => {
        const form = new FormData();
        form.append("file", file);
        const endpoints = ["/api/uploads/image", "/api/uploads/file"];
        for (const endpoint of endpoints) {
            try {
                const res = await pazaApi.post(endpoint, form, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                const url = res?.data?.data?.url;
                if (typeof url === "string" && url.trim()) return url.trim();
                throw new Error("Upload succeeded but no file URL was returned.");
            } catch (err: unknown) {
                const status = (err as { response?: { status?: number } })?.response?.status;
                if (status === 404) continue;
                throw err;
            }
        }
        throw new Error("Upload endpoint not available on this backend.");
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.currentTarget.value = "";
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file.");
            return;
        }
        try {
            setImageUploadPending(true);
            const url = await uploadImage(file);
            setDraft((p) => ({ ...p, mediaLinks: [url] }));
            toast.success("Image uploaded");
        } catch (err: unknown) {
            const msg =
                String((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "").trim() ||
                (err as Error)?.message ||
                "Failed to upload image";
            toast.error(msg);
        } finally {
            setImageUploadPending(false);
        }
    };

    const handleSave = async () => {
        if (!draft.title) return toast.error("Title is required");
        setIsSubmitting(true);
        try {
            if (isEditing && editingId !== null) {
                const res = await updateCreatorPastProject(editingId, draft as Omit<CreatorPastProject, "id">);
                if (res.success) {
                    toast.success("Project updated");
                    setProjects((prev) => prev.map((p) => (p.id === editingId ? res.data : p)));
                    setOpen(false);
                    setEditingId(null);
                    setDraft(EMPTY_PROJECT);
                    if (onUpdate) onUpdate();
                }
            } else {
                const res = await addCreatorPastProject(draft as Omit<CreatorPastProject, "id">);
                if (res.success) {
                    toast.success("Project added to portfolio");
                    setProjects((prev) => [...prev, res.data]);
                    setOpen(false);
                    setDraft(EMPTY_PROJECT);
                    if (onUpdate) onUpdate();
                }
            }
        } catch {
            toast.error(isEditing ? "Failed to update project" : "Failed to add project");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await removeCreatorPastProject(id);
            if (res.success) {
                toast.success("Project removed");
                setProjects(projects.filter(p => p.id !== id));
                if (onUpdate) onUpdate();
            }
        } catch {
            toast.error("Failed to remove");
        }
    };

    const previewImageUrl = draft.mediaLinks?.[0] ? toAbsoluteUploadUrl(draft.mediaLinks[0]) : "";

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Portfolio & Case Studies</CardTitle>
                    <CardDescription>Showcase your best work to brands.</CardDescription>
                </div>
                <Button size="sm" onClick={openCreate}>
                    <RiAddLine className="mr-1 h-4 w-4" /> Add Project
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.length === 0 ? (
                        <div className="col-span-full text-center py-20 border-2 border-dashed rounded-lg">
                            <RiPlayCircleLine className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                            <p className="text-muted-foreground">Your portfolio is empty. Add projects to attract brands!</p>
                        </div>
                    ) : (
                        projects.map(project => (
                            <Card key={project.id} className="overflow-hidden group relative">
                                <div className="aspect-video bg-muted flex items-center justify-center relative">
                                    {project.mediaLinks?.[0] ? (
                                        <Image src={toAbsoluteUploadUrl(project.mediaLinks[0])} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                                    ) : (
                                        <RiImageLine className="h-12 w-12 text-muted-foreground opacity-20" />
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openEdit(project)}>
                                            <RiPencilLine className="h-4 w-4" />
                                        </Button>
                                        <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(project.id)}>
                                            <RiDeleteBinLine className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardContent className="p-4 space-y-2">
                                    <h4 className="font-bold flex items-center justify-between">
                                        {project.title}
                                        <span className="text-xs font-normal text-muted-foreground">{project.period}</span>
                                    </h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                                </CardContent>
                            </Card>
                        )
                    ))}
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>{isEditing ? "Edit Creator Project" : "Add Creator Project"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4 overflow-y-auto max-h-[70vh] pr-1">

                            <div className="space-y-2">
                                <Label>Project Image</Label>
                                <div className="rounded-lg border border-border p-3">
                                    {previewImageUrl ? (
                                        <div className="relative mb-3 h-44 w-full overflow-hidden rounded-md">
                                            <Image src={previewImageUrl} alt="Project preview" fill className="object-cover" sizes="800px" />
                                        </div>
                                    ) : (
                                        <div className="mb-3 flex h-44 w-full items-center justify-center rounded-md bg-muted">
                                            <RiImageLine className="h-10 w-10 text-muted-foreground opacity-30" />
                                        </div>
                                    )}
                                    <input
                                        id="portfolio-project-image-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={imageUploadPending}
                                        onClick={() => document.getElementById("portfolio-project-image-upload")?.click()}
                                    >
                                        {imageUploadPending ? (
                                            <>
                                                <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading…
                                            </>
                                        ) : (
                                            <>
                                                <RiUpload2Line className="mr-2 h-4 w-4" />
                                                {previewImageUrl ? "Change image" : "Upload image"}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Project Title</Label>
                                    <Input
                                        value={draft.title}
                                        onChange={(e) => setDraft(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Nike Summer Ad"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Period</Label>
                                    <Input
                                        type="month"
                                        value={draft.period}
                                        onChange={(e) => setDraft(p => ({ ...p, period: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Industry Role</Label>
                                    <Select
                                        onValueChange={(val) => setDraft(p => ({ ...p, projectRoleIndustry: val }))}
                                        value={draft.projectRoleIndustry || undefined}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                                        <SelectContent>
                                            {PROJECT_ROLES_INDUSTRY.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Brand Role (The Energy)</Label>
                                    <Select
                                        onValueChange={(val) => setDraft(p => ({ ...p, projectRoleBrand: val }))}
                                        value={draft.projectRoleBrand || undefined}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select Energy" /></SelectTrigger>
                                        <SelectContent>
                                            {PROJECT_ROLES_BRAND.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={draft.description}
                                    onChange={(e) => setDraft(p => ({ ...p, description: e.target.value }))}
                                    className="h-[90px]"
                                    placeholder="Campaign goals and your specific contribution..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-4">
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold">Reflection</h4>
                                    <div className="space-y-2">
                                        <Label>Which of your works epitomizes your style?</Label>
                                        <Textarea
                                            value={draft.styleEpitome}
                                            onChange={(e) => setDraft(p => ({ ...p, styleEpitome: e.target.value }))}
                                            className="h-[80px]"
                                            placeholder="Describe the work that best represents your creative style…"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold invisible md:visible">&nbsp;</h4>
                                    <div className="space-y-2">
                                        <Label>Describe a work that was very meaningful to you and why?</Label>
                                        <Textarea
                                            value={draft.meaningfulWork}
                                            onChange={(e) => setDraft(p => ({ ...p, meaningfulWork: e.target.value }))}
                                            className="h-[80px]"
                                            placeholder="What made this project stand out to you personally?"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <h4 className="text-sm font-bold">Commercial Evidence</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Revenue Band</Label>
                                        <Select
                                            onValueChange={(val) => setDraft(p => ({ ...p, revenueBand: val as never }))}
                                            value={draft.revenueBand || undefined}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                                            <SelectContent>
                                                {REVENUE_BANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Measurement Source</Label>
                                        <Select
                                            onValueChange={(val) => setDraft(p => ({ ...p, measurementSource: val }))}
                                            value={(draft as unknown as { measurementSource?: string }).measurementSource || undefined}
                                        >
                                            <SelectTrigger><SelectValue placeholder="How was it measured?" /></SelectTrigger>
                                            <SelectContent>
                                                {MEASUREMENT_SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Outcome Types</Label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {OUTCOME_TYPES.map(o => (
                                            <Badge
                                                key={o}
                                                variant={(draft.outcomeTypes || []).includes(o) ? "default" : "outline"}
                                                className="cursor-pointer text-[10px]"
                                                onClick={() => {
                                                    const current = draft.outcomeTypes || [];
                                                    if (current.includes(o)) setDraft(p => ({ ...p, outcomeTypes: current.filter(x => x !== o) }));
                                                    else setDraft(p => ({ ...p, outcomeTypes: [...current, o] }));
                                                }}
                                            >
                                                {o}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={isSubmitting || imageUploadPending}>
                                {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? "Save Changes" : "Add Project"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}