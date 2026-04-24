"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RiAddLine, RiDeleteBinLine, RiImageLine, RiLoader2Line, RiCloseLine } from "@remixicon/react";
import { BrandPastProject, addBrandPastProject, removeBrandPastProject } from "@/lib/data/brands";
import {
    PARTICIPATION_ROLES,
    PAID_SPEND_OPTIONS,
    SPEND_BANDS,
    SPEND_TYPES,
    OUTCOME_TYPES,
    MEASUREMENT_SOURCES,
} from "@/lib/constants/brandTaxonomy";
import toast from "react-hot-toast";

interface PastProjectsManagerProps {
    businessId: number;
    initialProjects: BrandPastProject[];
    onUpdate?: () => void;
}

const EMPTY_PROJECT: Omit<BrandPastProject, 'id'> = {
    title: "",
    period: "",
    description: "",
    participationRole: "",
    collaborators: "",
    paidSpend: "prefer_not",
    spendTypes: [],
    spendBand: "",
    outcomeTypes: [],
    measurementSource: "",
    mediaLinks: [],
};

export default function PastProjectsManager({ businessId, initialProjects, onUpdate }: PastProjectsManagerProps) {
    const [projects, setProjects] = React.useState<BrandPastProject[]>(initialProjects);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [newProject, setNewProject] = React.useState<Omit<BrandPastProject, 'id'>>({ ...EMPTY_PROJECT });

    const handleAdd = async () => {
        if (!newProject.title) return toast.error("Title is required");
        setIsSubmitting(true);
        try {
            const res = await addBrandPastProject(businessId, newProject);
            if (res.success) {
                toast.success("Project added to portfolio");
                setProjects([...projects, res.data]);
                setOpen(false);
                setNewProject({ ...EMPTY_PROJECT });
                if (onUpdate) onUpdate();
            }
        } catch {
            toast.error("Failed to add project");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await removeBrandPastProject(businessId, id);
            if (res.success) {
                toast.success("Project removed");
                setProjects(projects.filter(p => p.id !== id));
                if (onUpdate) onUpdate();
            }
        } catch {
            toast.error("Failed to remove");
        }
    };

    const toggleArrayItem = (field: "spendTypes" | "outcomeTypes", value: string) => {
        const current = newProject[field] || [];
        if (current.includes(value)) {
            setNewProject(p => ({ ...p, [field]: current.filter(v => v !== value) }));
        } else {
            setNewProject(p => ({ ...p, [field]: [...current, value] }));
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Case Studies & Past Projects</CardTitle>
                    <CardDescription>Showcase your brand&apos;s previous campaign successes.</CardDescription>
                </div>
                <Button size="sm" onClick={() => setOpen(true)}>
                    <RiAddLine className="mr-1 h-4 w-4" /> Add Project
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map(project => (
                        <Card key={project.id} className="overflow-hidden group relative">
                            <div className="aspect-video bg-muted flex items-center justify-center relative">
                                {project.mediaLinks?.[0] ? (
                                    <Image src={project.mediaLinks[0]} alt={project.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                                ) : (
                                    <RiImageLine className="h-12 w-12 text-muted-foreground opacity-20" />
                                )}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.participationRole && <Badge variant="outline">{project.participationRole}</Badge>}
                                    {project.spendBand && <Badge variant="secondary">{project.spendBand}</Badge>}
                                    {project.outcomeTypes?.map(o => (
                                        <Badge key={o} variant="secondary" className="text-xs">{o}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/30">
                        <RiImageLine className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <p className="text-muted-foreground">No past projects added yet.</p>
                        <Button variant="link" onClick={() => setOpen(true)}>Add your first campaign</Button>
                    </div>
                )}

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add Past Campaign / Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            {/* Basics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Project Title *</Label>
                                    <Input
                                        value={newProject.title}
                                        onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Summer Launch 2023"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Period</Label>
                                    <Input
                                        value={newProject.period}
                                        onChange={(e) => setNewProject(p => ({ ...p, period: e.target.value }))}
                                        placeholder="e.g. June - Aug 2023"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Your Role</Label>
                                    <Select
                                        value={newProject.participationRole}
                                        onValueChange={(val) => setNewProject(p => ({ ...p, participationRole: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PARTICIPATION_ROLES.map(role => (
                                                <SelectItem key={role} value={role}>{role}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Collaborators</Label>
                                    <Input
                                        value={newProject.collaborators || ""}
                                        onChange={(e) => setNewProject(p => ({ ...p, collaborators: e.target.value }))}
                                        placeholder="e.g. Agency X, Creator Y"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Description <span className="text-muted-foreground">(max 300 chars)</span></Label>
                                <Textarea
                                    value={newProject.description}
                                    onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value.slice(0, 300) }))}
                                    className="h-[100px]"
                                    placeholder="Summary of objectives and results..."
                                />
                                <p className="text-xs text-muted-foreground text-right">{(newProject.description?.length || 0)}/300</p>
                            </div>

                            {/* Commercial Evidence */}
                            <div className="space-y-4 border-t pt-4">
                                <Label className="text-base font-semibold">Commercial Evidence</Label>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Paid Spend?</Label>
                                        <Select
                                            value={newProject.paidSpend}
                                            onValueChange={(val) => setNewProject(p => ({ ...p, paidSpend: val as BrandPastProject["paidSpend"] }))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAID_SPEND_OPTIONS.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {newProject.paidSpend === "yes" && (
                                        <div className="space-y-2">
                                            <Label>Spend Band</Label>
                                            <Select
                                                value={newProject.spendBand}
                                                onValueChange={(val) => setNewProject(p => ({ ...p, spendBand: val }))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select range" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {SPEND_BANDS.map(band => (
                                                        <SelectItem key={band} value={band}>{band}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>

                                {newProject.paidSpend === "yes" && (
                                    <div className="space-y-2">
                                        <Label>Spend Types</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {SPEND_TYPES.map(type => (
                                                <Badge
                                                    key={type}
                                                    variant={(newProject.spendTypes || []).includes(type) ? "default" : "outline"}
                                                    className="cursor-pointer py-1 px-2.5 text-xs transition-all"
                                                    onClick={() => toggleArrayItem("spendTypes", type)}
                                                >
                                                    {type}
                                                    {(newProject.spendTypes || []).includes(type) && <RiCloseLine className="ml-1 h-3 w-3" />}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Outcome Types</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {OUTCOME_TYPES.map(type => (
                                            <Badge
                                                key={type}
                                                variant={(newProject.outcomeTypes || []).includes(type) ? "default" : "outline"}
                                                className="cursor-pointer py-1 px-2.5 text-xs transition-all"
                                                onClick={() => toggleArrayItem("outcomeTypes", type)}
                                            >
                                                {type}
                                                {(newProject.outcomeTypes || []).includes(type) && <RiCloseLine className="ml-1 h-3 w-3" />}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Measurement Source</Label>
                                    <Select
                                        value={newProject.measurementSource}
                                        onValueChange={(val) => setNewProject(p => ({ ...p, measurementSource: val }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="How did you measure?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {MEASUREMENT_SOURCES.map(src => (
                                                <SelectItem key={src} value={src}>{src}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleAdd} disabled={isSubmitting}>
                                {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                                Add to Portfolio
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
