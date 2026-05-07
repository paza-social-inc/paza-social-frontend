"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, X, UserPlus, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usersApi } from "@/lib/data/users";
import { campaignApi } from "@/lib/data/campaigns";
import type { BaseUser } from "@/types/common";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export type JobCollaboratorPick = { id?: number; email?: string; name: string };

function labelFromBaseUser(u: BaseUser): string {
  const fn = u.firstname ?? "";
  const ln = u.lastname ?? "";
  const n = `${fn} ${ln}`.trim();
  return n || u.email || `User ${u.id ?? ""}`;
}

function parseUserId(u: BaseUser): number | null {
  const n = Number(u.id);
  return Number.isFinite(n) && n > 0 ? n : null;
}

type Props = {
  ownerUserId: number;
  value: JobCollaboratorPick[];
  onChange: (next: JobCollaboratorPick[]) => void;
  /** When set, show quick-add for campaign team members that have a user id */
  campaignId?: number;
  className?: string;
};

export function JobCollaboratorsField({
  ownerUserId,
  value,
  onChange,
  campaignId,
  className,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchQuery.trim()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: searchResults = [], isFetching } = useQuery({
    queryKey: ["users-search", debouncedQ],
    queryFn: () => usersApi.search(debouncedQ),
    enabled: debouncedQ.length >= 2,
  });

  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", campaignId, "job-collab-picker"],
    queryFn: () => campaignApi.getById(campaignId!),
    enabled: Boolean(campaignId && campaignId > 0),
  });

  const campaignSuggestions = useMemo(() => {
    if (!campaign?.teams) return [];
    const out: JobCollaboratorPick[] = [];
    const seen = new Set<number>();
    for (const team of campaign.teams) {
      for (const m of team.members ?? []) {
        const mid = m.id;
        if (mid == null) continue;
        const id = Number(mid);
        if (
          !Number.isFinite(id) ||
          id <= 0 ||
          id === ownerUserId ||
          seen.has(id)
        )
          continue;
        seen.add(id);
        const name = (m.name && m.name.trim()) || m.email || `User ${id}`;
        out.push({ id, name });
      }
    }
    return out;
  }, [campaign, ownerUserId]);

  const selectedIds = useMemo(
    () => new Set(value.map((v) => v.id).filter(Boolean)),
    [value],
  );
  const selectedEmails = useMemo(
    () => new Set(value.map((v) => v.email?.toLowerCase()).filter(Boolean)),
    [value],
  );

  const addPick = (pick: JobCollaboratorPick) => {
    if (
      pick.id != null &&
      (pick.id === ownerUserId || selectedIds.has(pick.id))
    )
      return;
    if (pick.email && selectedEmails.has(pick.email.toLowerCase())) return;
    onChange([...value, pick]);
    setSearchQuery("");
    setDebouncedQ("");
  };

  const removePick = (pick: JobCollaboratorPick) => {
    onChange(
      value.filter((v) => {
        if (pick.id != null) return v.id !== pick.id;
        return v.email !== pick.email;
      }),
    );
  };

  const handleAddByEmail = () => {
    const raw = emailInput.trim().toLowerCase();
    if (!raw.includes("@")) return;
    if (selectedEmails.has(raw)) return;
    onChange([...value, { name: raw, email: raw }]);
    setEmailInput("");
  };

  const filteredSearch = useMemo(() => {
    return searchResults.filter((u) => {
      const id = parseUserId(u);
      if (id == null || id === ownerUserId || selectedIds.has(id)) return false;
      if (u.email && selectedEmails.has(u.email.toLowerCase())) return false;
      return true;
    });
  }, [searchResults, ownerUserId, selectedIds, selectedEmails]);

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <FieldLabel>Brand collaborators</FieldLabel>
        <FieldDescription>
          Teammates who can view proposals and update proposal status with you.
          Search by name or email. You cannot add yourself.
        </FieldDescription>
      </div>

      {campaignId != null && campaignId > 0 && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            From this campaign
          </p>
          {campaignLoading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading team…
            </div>
          ) : campaignSuggestions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No campaign members with accounts to add yet. Use search below.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {campaignSuggestions.map((s) => (
                <Button
                  key={s.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  disabled={s.id != null && selectedIds.has(s.id)}
                  onClick={() => addPick(s)}
                >
                  <UserPlus className="h-3 w-3" />
                  {s.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 min-w-0">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Add by email…"
            className="pl-9 min-h-10"
            autoComplete="email"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddByEmail();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          className="shrink-0"
          disabled={!emailInput.trim().includes("@")}
          onClick={handleAddByEmail}
        >
          Add
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="pl-9 min-h-10"
          autoComplete="off"
        />
      </div>

      {debouncedQ.length >= 2 && (
        <div className="max-h-40 overflow-auto rounded-md border border-border bg-card p-1 text-sm">
          {isFetching ? (
            <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground text-xs">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          ) : filteredSearch.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground text-center">
              No users found
            </p>
          ) : (
            filteredSearch.map((u) => {
              const id = parseUserId(u);
              if (id == null) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-muted"
                  onClick={() => addPick({ id, name: labelFromBaseUser(u) })}
                >
                  <span className="truncate font-medium">
                    {labelFromBaseUser(u)}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {u.email}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((c, idx) => (
            <Badge
              key={c.id ?? `email-${c.email}-${idx}`}
              variant="secondary"
              className="gap-1 pr-1 py-1 pl-2 font-normal max-w-full"
            >
              <span className="truncate">{c.name}</span>
              <button
                type="button"
                className="rounded p-0.5 hover:bg-muted-foreground/20 touch-manipulation"
                aria-label={`Remove ${c.name}`}
                onClick={() => removePick(c)}
              >
                <X className="h-3.5 w-3.5 shrink-0" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
