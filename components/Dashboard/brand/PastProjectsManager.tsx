"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { RiAddLine, RiDeleteBinLine, RiImageLine, RiLoader2Line, RiExternalLinkLine } from "@remixicon/react";
import { BrandPastProject, addBrandPastProject, removeBrandPastProject } from "@/lib/data/brands";
import toast from "react-hot-toast";

interface PastProjectsManagerProps {
    businessId: number;
    initialProjects: BrandPastProject[];
    onUpdate?: () => void;
}

export default function PastProjectsManager({ businessId, initialProjects, onUpdate }: PastProjectsManagerProps) {
    const [projects, setProjects] = React.useState<BrandPastProject[]>(initialProjects);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const [newProject, setNewProject] = React.useState<Omit<BrandPastProject, 'id'>>({
        title: "",
        period: "",
        description: "",
        participationRole: "",
        paidSpend: "prefer_not",
        spendBand: "",
        mediaLinks: []
    });

    const handleAdd = async () => {
        if (!newProject.title) return toast.error("Title is required");
        setIsSubmitting(true);
        try {
            const res = await addBrandPastProject(businessId, newProject);
            if (res.success) {
                toast.success("Project added to portfolio");
                setProjects([...projects, res.data]);
                setOpen(false);
                setNewProject({ ...newProject, title: "", description: "", participationRole: "" });
                if (onUpdate) onUpdate();
            }
        } catch (err) {
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
        } catch (err) {
            toast.error("Failed to remove");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Case Studies & Past Projects</CardTitle>
                    <CardDescription>Showcase your brand's previous campaign successes.</CardDescription>
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
                                    <img src={project.mediaLinks[0]} alt={project.title} className="w-full h-full object-cover" />
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
                                    <Badge variant="outline">{project.participationRole}</Badge>
                                    <Badge variant="secondary">{project.spendBand}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add Past Campaign / Project</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Project Title</Label>
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
                                <div className="space-y-2">
                                    <Label>Your Role</Label>
                                    <Input 
                                        value={newProject.participationRole}
                                        onChange={(e) => setNewProject(p => ({ ...p, participationRole: e.target.value }))}
                                        placeholder="e.g. Lead Brand"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea 
                                        value={newProject.description}
                                        onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
                                        className="h-[125px]"
                                        placeholder="Summary of objectives and results..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Spend Band</Label>
                                    <Input 
                                        value={newProject.spendBand}
                                        onChange={(e) => setNewProject(p => ({ ...p, spendBand: e.target.value }))}
                                        placeholder="e.g. $10k - $50k"
                                    />
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
