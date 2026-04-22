"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RiMailLine, RiShieldUserLine, RiUserAddLine, RiLoader2Line, RiDeleteBinLine } from "@remixicon/react";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { 
    Collaborator, 
    getBusinessCollaborators, 
    createInvitation, 
    removeCollaborator 
} from "@/lib/data/collaborations";
import toast from "react-hot-toast";

export function TeamSection() {
    const { user } = useAuth();
    const [members, setMembers] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [openInvite, setOpenInvite] = useState(false);

    // Invitation state
    const [inviteData, setInviteData] = useState({
        email: "",
        role: "Collaborated",
        message: ""
    });

    const businessId = (user as { businessId?: number })?.businessId || (user?.id ? Number(user.id) : null);

    const loadMembers = React.useCallback(async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            const res = await getBusinessCollaborators(businessId);
            if (res.success) {
                setMembers(res.data);
            }
        } catch {
            toast.error("Failed to load team members");
        } finally {
            setLoading(false);
        }
    }, [businessId]);

    useEffect(() => {
        loadMembers();
    }, [loadMembers]);

    const handleSendInvite = async () => {
        if (!inviteData.email) return toast.error("Email is required");
        setIsInviting(true);
        try {
            const res = await createInvitation({
                collaborationType: "Business",
                entityId: businessId,
                role: inviteData.role,
                inviteeEmail: inviteData.email,
                message: inviteData.message || "Join our team on Paza Social"
            });
            if (res.success) {
                toast.success(`Invitation sent to ${inviteData.email}`);
                setOpenInvite(false);
                setInviteData({ email: "", role: "Collaborator", message: "" });
            }
        } catch {
            toast.error("Failed to send invitation");
        } finally {
            setIsInviting(false);
        }
    };

    const handleRemove = async (collabId: number) => {
        if (!confirm("Remove this member from your team?")) return;
        try {
            const res = await removeCollaborator(collabId);
            if (res.success) {
                toast.success("Member removed");
                setMembers(members.filter(m => m.id !== collabId));
            }
        } catch {
            toast.error("Failed to remove member");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-balance">Team Management</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your organization&apos;s members and their access roles.
                    </p>
                </div>
                <Dialog open={openInvite} onOpenChange={setOpenInvite}>
                    <DialogTrigger asChild>
                        <Button className="rounded-xl gap-2">
                            <RiUserAddLine className="h-4 w-4" /> Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input 
                                    type="email" 
                                    placeholder="colleague@brand.com" 
                                    value={inviteData.email}
                                    onChange={(e) => setInviteData(p => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select 
                                    value={inviteData.role}
                                    onValueChange={(val) => setInviteData(p => ({ ...p, role: val }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin (Full Access)</SelectItem>
                                        <SelectItem value="Manager">Manager (Edit Profile & Jobs)</SelectItem>
                                        <SelectItem value="Collaborator">Collaborator (View Only)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Personal Note (Optional)</Label>
                                <Input 
                                    placeholder="Hey, join our brand workspace!" 
                                    value={inviteData.message}
                                    onChange={(e) => setInviteData(p => ({ ...p, message: e.target.value }))}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpenInvite(false)}>Cancel</Button>
                            <Button onClick={handleSendInvite} disabled={isInviting}>
                                {isInviting && <RiLoader2Line className="animate-spin mr-2 h-4 w-4" />}
                                Send Invite
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>All people currently part of this business account.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center py-10 gap-4">
                            <RiLoader2Line className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Loading members...</p>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                            <RiShieldUserLine className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-3" />
                            <p className="text-muted-foreground">You are the only member in this team.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                            <AvatarImage src={member.user?.avatar} />
                                            <AvatarFallback className="bg-primary/10 text-primary uppercase">
                                                {member.user?.firstName?.[0]}{member.user?.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-semibold text-base">
                                                {member.user?.firstName} {member.user?.lastName}
                                                {member.userId === Number(user?.id) && (
                                                    <Badge variant="secondary" className="ml-2 text-[10px] py-0">You</Badge>
                                                )}
                                            </h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <RiMailLine className="h-3 w-3" /> {member.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="outline" className="font-medium">{member.role}</Badge>
                                        {member.userId !== Number(user?.id) && (
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => handleRemove(member.id)}
                                            >
                                                <RiDeleteBinLine className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg">Recent Invitations</CardTitle>
                    <CardDescription>Pending invites for your team.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground italic">List of pending invitations will appear here as they are created.</p>
                </CardContent>
            </Card>
        </div>
    );
}
