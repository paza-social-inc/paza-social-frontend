"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RiAddLine, RiDeleteBinLine, RiImageLine, RiLoader2Line, RiPlayCircleLine } from "@remixicon/react";
import { CreatorPastProject, addCreatorPastProject, removeCreatorPastProject } from "@/lib/data/creator";
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

export default function CreatorPortfolioManager({ initialProjects, onUpdate }: { initialProjects: CreatorPastProject[], onUpdate?: () => void }) {
    const [projects, setProjects] = React.useState<CreatorPastProject[]>(initialProjects);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [open, setOpen] = React.useState(false);

    const [newProject, setNewProject] = React.useState<Omit<CreatorPastProject, 'id'>>({
        title: "",
        period: "",
        description: "",
        mediaLinks: [],
        producedReusableAsset: false,
        revenueBand: "<$500",
        projectRoleIndustry: "",
        projectRoleBrand: "",
        outcomeTypes: [],
        measurementSources: []
    });

    const handleAdd = async () => {
        if (!newProject.title) return toast.error("Title is required");
        setIsSubmitting(true);
        try {
            const res = await addCreatorPastProject(newProject);
            if (res.success) {
                toast.success("Project added to portfolio");
                setProjects([...projects, res.data]);
                setOpen(false);
                setNewProject({ title: "", period: "", description: "", mediaLinks: [], producedReusableAsset: false, revenueBand: "<$500", projectRoleIndustry: "", projectRoleBrand: "", outcomeTypes: [], measurementSources: [] });
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

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Portfolio & Case Studies</CardTitle>
                    <CardDescription>Showcase your best work to brands.</CardDescription>
                </div>
                <Button size="sm" onClick={() => setOpen(true)}>
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
                                </CardContent>
                            </Card>
                        )
                    ))}
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add Creator Project</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Project Title</Label>
                                    <Input 
                                        value={newProject.title}
                                        onChange={(e) => setNewProject(p => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Nike Summer Ad"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Period</Label>
                                    <Input 
                                        value={newProject.period}
                                        onChange={(e) => setNewProject(p => ({ ...p, period: e.target.value }))}
                                        placeholder="e.g. Jan 2024"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Industry Role</Label>
                                    <Select 
                                        onValueChange={(val) => setNewProject(p => ({ ...p, projectRoleIndustry: val }))}
                                        defaultValue={newProject.projectRoleIndustry}
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
                                        onValueChange={(val) => setNewProject(p => ({ ...p, projectRoleBrand: val }))}
                                        defaultValue={newProject.projectRoleBrand}
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
                                    value={newProject.description}
                                    onChange={(e) => setNewProject(p => ({ ...p, description: e.target.value }))}
                                    className="h-[80px]"
                                    placeholder="Campaign goals and your specific contribution..."
                                />
                            </div>

                            <div className="space-y-4 border-t pt-4">
                                <h4 className="text-sm font-bold">Commercial Evidence</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Revenue Band</Label>
                                        <Select onValueChange={(val) => setNewProject(p => ({ ...p, revenueBand: val as never }))}>
                                            <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                                            <SelectContent>
                                                {REVENUE_BANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Measurement Source</Label>
                                        <Select onValueChange={(val) => setNewProject(p => ({ ...p, measurementSource: val }))}>
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
                                                variant={(newProject.outcomeTypes || []).includes(o) ? "default" : "outline"}
                                                className="cursor-pointer text-[10px]"
                                                onClick={() => {
                                                    const current = newProject.outcomeTypes || [];
                                                    if (current.includes(o)) setNewProject(p => ({ ...p, outcomeTypes: current.filter(x => x !== o) }));
                                                    else setNewProject(p => ({ ...p, outcomeTypes: [...current, o] }));
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
                            <Button onClick={handleAdd} disabled={isSubmitting}>
                                {isSubmitting && <RiLoader2Line className="mr-2 h-4 w-4 animate-spin" />}
                                Add Project
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
