"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { usersApi } from "@/lib/data/users";
import { projectsApi } from "@/lib/data/projects";
import Image from "next/image";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export function CollaboratorSearchSheet({
  open,
  onOpenChange,
  projectId,
  existingMemberUserIds = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  existingMemberUserIds?: number[];
}) {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const normalized = query.trim();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users-search", normalized],
    queryFn: () => usersApi.search(normalized),
    enabled: open && normalized.length >= 2,
  });

  const addMutation = useMutation({
    mutationFn: async (userId: number) => {
      if (!projectId) throw new Error("Project id missing");
      return projectsApi.addMember(projectId, userId);
    },
    onSuccess: () => {
      toast.success("Collaborator added");
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["creator-projects", projectId] });
      }
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to add collaborator");
    },
  });

  const { data: pendingInvites = [] } = useQuery({
    queryKey: ["creator-project-member-invites", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      return projectsApi.getMemberInvites(projectId);
    },
    enabled: open && Boolean(projectId),
  });

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("Project id missing");
      const email = inviteEmail.trim().toLowerCase();
      if (!email) throw new Error("Email is required");
      return projectsApi.inviteMember(projectId, { email, name: inviteName.trim() || undefined });
    },
    onSuccess: (invite) => {
      if (invite?.emailSent === false) {
        toast.success("Invite created. Email was not sent; share link manually from pending invites.");
      } else {
        toast.success("Invite created and email sent");
      }
      setInviteEmail("");
      setInviteName("");
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["creator-project-member-invites", projectId] });
      }
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to create invite");
    },
  });

  const cancelInviteMutation = useMutation({
    mutationFn: async (inviteId: number) => {
      if (!projectId) throw new Error("Project id missing");
      await projectsApi.cancelMemberInvite(projectId, inviteId);
    },
    onSuccess: () => {
      toast.success("Invite cancelled");
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["creator-project-member-invites", projectId] });
      }
    },
    onError: (err: unknown) => {
      toast.error(err instanceof Error ? err.message : "Failed to cancel invite");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "rounded-xl border-border bg-card p-0 gap-0 max-w-[calc(100%-2rem)] sm:max-w-md",
          "max-h-[85dvh] flex flex-col overflow-hidden"
        )}
      >
        <DialogHeader className="shrink-0 p-4 pb-3 border-b border-border">
          <DialogTitle className="text-left text-lg font-semibold text-foreground">
            Collaborator
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 pb-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search collaborator"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                "pl-9 h-11 rounded-lg bg-muted/50 border-border w-full",
                "focus-visible:ring-primary focus-visible:border-primary"
              )}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4 space-y-3">
          {normalized.length < 2 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Type at least 2 characters to search users.
            </p>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : users.map((u) => {
            const uid = u.id ? Number(u.id) : NaN;
            const exists = Number.isFinite(uid) && existingMemberUserIds.includes(uid);
            const name =
              [u.firstname, u.lastname].filter(Boolean).join(" ").trim() ||
              u.email ||
              "User";
            const avatar = u.avatar ?? u.preview ?? "";
            return (
              <button
                key={`${u.id ?? u.email}`}
                type="button"
                disabled={exists || !Number.isFinite(uid) || addMutation.isPending}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left touch-manipulation border border-transparent hover:border-border disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => {
                  if (!Number.isFinite(uid)) return;
                  addMutation.mutate(uid);
                }}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted shrink-0">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {name[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm truncate">{name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                {exists ? (
                  <span className="text-[10px] text-muted-foreground">Added</span>
                ) : null}
              </button>
            );
          })}
          {normalized.length >= 2 && !isLoading && users.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No collaborators found.
            </p>
          )}

          <div className="rounded-lg border border-border p-3 space-y-2">
            <p className="text-sm font-medium text-foreground">Invite by email</p>
            <Input
              type="text"
              placeholder="Name (optional)"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="h-10"
            />
            <Input
              type="email"
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-10"
            />
            <Button
              type="button"
              className="w-full"
              onClick={() => inviteMutation.mutate()}
              disabled={inviteMutation.isPending || !inviteEmail.trim()}
            >
              {inviteMutation.isPending ? "Inviting..." : "Send invite"}
            </Button>
          </div>

          {pendingInvites.length > 0 ? (
            <div className="rounded-lg border border-border p-3 space-y-2">
              <p className="text-sm font-medium text-foreground">Pending invites</p>
              <div className="space-y-2">
                {pendingInvites.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-muted/30 p-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">
                        {inv.name?.trim() || inv.email}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{inv.email}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => cancelInviteMutation.mutate(inv.id)}
                      disabled={cancelInviteMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
