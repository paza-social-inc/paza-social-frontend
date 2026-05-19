"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { /* useMutation ,*/ useQuery } from "@tanstack/react-query";
import { Loader2, Mail, Search, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usersApi } from "@/lib/data/users";
import type { BaseUser } from "@/types/common";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

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

export type ProposalCollaboratorPick = {
  id?: number;
  email?: string;
  name: string;
};

type Props = {
  currentUserId: number;
  jobOwnerUserId: number | null;
  value: ProposalCollaboratorPick[];
  onChange: React.Dispatch<React.SetStateAction<ProposalCollaboratorPick[]>>;
  className?: string;
};

export function ProposalCollaboratorsField({
  currentUserId,
  jobOwnerUserId,
  value,
  onChange,
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

  const { data: rawSuggested = [], isLoading: suggestedLoading } = useQuery({
    queryKey: ["users-suggested-collaborators"],
    queryFn: () => usersApi.suggestedCollaborators(),
  });

  const selectedIds = useMemo(
    () => new Set(value.map((v) => v.id).filter(Boolean)),
    [value],
  );
  const selectedEmails = useMemo(
    () => new Set(value.map((v) => v.email?.toLowerCase()).filter(Boolean)),
    [value],
  );

  const excludeIds = useMemo(() => {
    const s = new Set<number>([currentUserId]);
    if (jobOwnerUserId != null && Number.isFinite(jobOwnerUserId)) {
      s.add(jobOwnerUserId);
    }
    return s;
  }, [currentUserId, jobOwnerUserId]);

  const suggested = useMemo(() => {
    const out: ProposalCollaboratorPick[] = [];
    const seen = new Set<number>();
    for (const u of rawSuggested) {
      const id = parseUserId(u);
      if (
        id == null ||
        excludeIds.has(id) ||
        selectedIds.has(id) ||
        seen.has(id)
      )
        continue;
      if (u.accountType != null && u.accountType !== "Creator") continue;
      seen.add(id);
      out.push({ id, name: labelFromBaseUser(u), email: u.email });
    }
    return out;
  }, [rawSuggested, excludeIds, selectedIds]);

  const addPick = (pick: ProposalCollaboratorPick) => {
    if (pick.id != null && excludeIds.has(pick.id)) return;
    onChange((prev) => {
      if (pick.id != null && prev.some((p) => p.id === pick.id)) return prev;
      if (
        pick.email &&
        prev.some((p) => p.email?.toLowerCase() === pick.email?.toLowerCase())
      )
        return prev;
      return [...prev, pick];
    });
    setSearchQuery("");
    setDebouncedQ("");
  };

  const removePick = (pick: ProposalCollaboratorPick) => {
    onChange((prev) =>
      prev.filter((v) => {
        if (pick.id != null) return v.id !== pick.id;
        return v.email !== pick.email;
      }),
    );
  };

  const filteredSearch = useMemo(() => {
    return searchResults.filter((u) => {
      const id = parseUserId(u);
      if (id == null || excludeIds.has(id) || selectedIds.has(id)) return false;
      if (u.email && selectedEmails.has(u.email.toLowerCase())) return false;
      if (u.accountType != null && u.accountType !== "Creator") return false;
      return true;
    });
  }, [searchResults, excludeIds, selectedIds, selectedEmails]);

  const handleAddByEmail = async () => {
    const raw = emailInput.trim().toLowerCase();
    if (!raw.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (selectedEmails.has(raw)) {
      toast.error("This email is already added.");
      return;
    }

    // We add the email as a pick. SendProposalForm will segregate it into collaboratorEmails
    onChange((prev) => {
      if (prev.some((p) => p.email?.toLowerCase() === raw)) return prev;
      return [...prev, { name: raw, email: raw }];
    });
    setEmailInput("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <FieldLabel>Collaborators (optional)</FieldLabel>
        <FieldDescription>
          Add other creators joining this proposal. Search by name or email,
          pick from your showcase teammates, or enter an email if they already
          use Paza.
        </FieldDescription>
      </div>

      {suggested.length > 0 || suggestedLoading ? (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            From your showcase projects
          </p>
          {suggestedLoading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading suggestions…
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {suggested.map((s) => (
                <Button
                  key={s.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  disabled={selectedIds.has(s.id)}
                  onClick={() => addPick(s)}
                >
                  <UserPlus className="h-3 w-3" />
                  {s.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : null}

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
          placeholder="Search creators by name or email…"
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
              No creators found
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
                  onClick={() =>
                    addPick({
                      id,
                      name: labelFromBaseUser(u),
                      email: u.email?.toLowerCase(),
                    })
                  }
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
          {value.map((c, i) => (
            <Badge
              key={c.id ?? `email-${c.email}-${i}`}
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
