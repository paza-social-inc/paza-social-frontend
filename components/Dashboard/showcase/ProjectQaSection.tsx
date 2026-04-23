"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import toast from "react-hot-toast";
import { Loader2, MessageSquarePlus, MoreHorizontal, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectQaApi } from "@/lib/data/projectQa";
import { useAuth } from "@/hooks/store/auth/useAuth";
import type { ProjectQaPost } from "@/types/projects/projectTypes";
import { cn } from "@/lib/utils";

function authorLabel(a: ProjectQaPost["author"]): string {
  const n = [a.firstName, a.lastName].filter(Boolean).join(" ").trim();
  return n || a.email || `User ${a.id}`;
}

function QaPostCard({
  post,
  depth,
  projectId,
  isOwner,
  canReply,
  replyingTo,
  setReplyingTo,
  replyDraft,
  setReplyDraft,
  onReplySubmit,
  replyPending,
  onModerate,
  moderatePending,
}: {
  post: ProjectQaPost;
  depth: number;
  projectId: string;
  isOwner: boolean;
  canReply: boolean;
  replyingTo: number | null;
  setReplyingTo: (id: number | null) => void;
  replyDraft: string;
  setReplyDraft: (s: string) => void;
  onReplySubmit: (parentId: number) => void;
  replyPending: boolean;
  onModerate: (postId: number, action: "hide" | "unhide" | "delete") => void;
  moderatePending: boolean;
}) {
  const showModeration = isOwner && !post.isDeleted;

  return (
    <div
      className={cn("rounded-xl border border-border bg-card/60", depth > 0 && "ml-4 sm:ml-8 mt-3 border-l-2 border-l-primary/30 pl-3")}
    >
      <div className="px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{authorLabel(post.author)}</span>
              {post.createdAt
                ? ` · ${(() => {
                    try {
                      return format(parseISO(post.createdAt), "dd MMM yyyy, HH:mm");
                    } catch {
                      return "";
                    }
                  })()}`
                : null}
              {post.isHidden ? (
                <span className="ml-2 text-amber-600 dark:text-amber-400">(hidden)</span>
              ) : null}
            </p>
            <p className="mt-1.5 text-sm text-foreground whitespace-pre-wrap wrap-break-word">
              {post.body ?? "—"}
            </p>
          </div>
          {showModeration && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  disabled={moderatePending}
                  aria-label="Moderation"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {post.isHidden ? (
                  <DropdownMenuItem onClick={() => onModerate(post.id, "unhide")}>
                    Unhide
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => onModerate(post.id, "hide")}>
                    Hide
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => onModerate(post.id, "delete")}
                >
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {canReply && (
          <div className="mt-2">
            {replyingTo === post.id ? (
              <div className="space-y-2 pt-1">
                <Textarea
                  value={replyDraft}
                  onChange={(e) => setReplyDraft(e.target.value)}
                  rows={3}
                  placeholder="Write a reply…"
                  className="text-sm"
                />
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyDraft("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={replyPending || !replyDraft.trim()}
                    onClick={() => onReplySubmit(post.id)}
                  >
                    {replyPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post reply"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 px-2 text-xs text-primary"
                onClick={() => {
                  setReplyingTo(post.id);
                  setReplyDraft("");
                }}
              >
                <Reply className="h-3.5 w-3.5" />
                Reply
              </Button>
            )}
          </div>
        )}
      </div>
      {(post.replies?.length ?? 0) > 0 && (
        <div className="border-t border-border/50 px-2 py-2 sm:px-3">
          {post.replies.map((r) => (
            <QaPostCard
              key={r.id}
              post={r}
              depth={depth + 1}
              projectId={projectId}
              isOwner={isOwner}
              canReply={canReply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyDraft={replyDraft}
              setReplyDraft={setReplyDraft}
              onReplySubmit={onReplySubmit}
              replyPending={replyPending}
              onModerate={onModerate}
              moderatePending={moderatePending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type Props = {
  projectId: string;
  /** Fetch when the Q&A tab is active */
  enabled: boolean;
  isOwner: boolean;
  isTeamMember: boolean;
  isPublic: boolean;
};

export function ProjectQaSection({ projectId, enabled, isOwner, isTeamMember, isPublic }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [askOpen, setAskOpen] = useState(false);
  const [askDraft, setAskDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyDraft, setReplyDraft] = useState("");

  const canFetch = Boolean(enabled && user && projectId);

  const { data: threads = [], isLoading, isError, error } = useQuery({
    queryKey: ["project-qa", projectId],
    queryFn: () => projectQaApi.list(projectId),
    enabled: canFetch,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { body: string; parentId?: number | null }) =>
      projectQaApi.create(projectId, payload),
    onSuccess: () => {
      toast.success("Posted");
      queryClient.invalidateQueries({ queryKey: ["project-qa", projectId] });
      setAskOpen(false);
      setAskDraft("");
      setReplyingTo(null);
      setReplyDraft("");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not post";
      toast.error(String(msg));
    },
  });

  const moderateMutation = useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: number;
      payload: { isHidden?: boolean; isDeleted?: boolean };
    }) => projectQaApi.moderate(projectId, postId, payload),
    onSuccess: () => {
      toast.success("Updated");
      queryClient.invalidateQueries({ queryKey: ["project-qa", projectId] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not update";
      toast.error(String(msg));
    },
  });

  const uid = user?.id != null ? Number(user.id) : NaN;
  const normalizedAccountType = String(
    (user as { accountType?: string; account?: { accountType?: string } } | null)?.accountType ??
      (user as { accountType?: string; account?: { accountType?: string } } | null)?.account?.accountType ??
      ""
  )
    .trim()
    .toLowerCase();
  const isCreatorOrBrandAccount =
    normalizedAccountType === "creator" ||
    normalizedAccountType === "brand" ||
    normalizedAccountType === "business";
  const canStartQuestion = Boolean(user) && Number.isFinite(uid) && isCreatorOrBrandAccount;

  /** Server enforces thread access; any signed-in user may attempt a reply. */
  const canReply = Boolean(user);

  const onModerate = (postId: number, action: "hide" | "unhide" | "delete") => {
    if (action === "hide") {
      moderateMutation.mutate({ postId, payload: { isHidden: true } });
    } else if (action === "unhide") {
      moderateMutation.mutate({ postId, payload: { isHidden: false } });
    } else {
      moderateMutation.mutate({ postId, payload: { isDeleted: true } });
    }
  };

  if (!user) {
    return (
      <div className="space-y-3 text-sm text-muted-foreground">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
        <p>Sign in to view and post questions about this project.</p>
      </div>
    );
  }

  if (!enabled) {
    return null;
  }

  return (
    <div className="space-y-5 text-sm sm:text-base text-muted-foreground">
      <div className="space-y-1">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Frequently Asked Questions</h2>
        <p className="text-sm">
          {threads.length === 0
            ? "No questions yet. Ask something about this project."
            : "Questions and discussion about this project."}
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading…
        </div>
      )}

      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message ?? "Could not load Q&A."}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="space-y-3 list-none p-0 m-0">
          {threads.map((q) => (
            <li key={q.id}>
              <QaPostCard
                post={q}
                depth={0}
                projectId={projectId}
                isOwner={isOwner}
                canReply={canReply}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyDraft={replyDraft}
                setReplyDraft={setReplyDraft}
                onReplySubmit={(parentId) => {
                  const t = replyDraft.trim();
                  if (!t) return;
                  createMutation.mutate({ body: t, parentId });
                }}
                replyPending={createMutation.isPending}
                onModerate={onModerate}
                moderatePending={moderateMutation.isPending}
              />
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-3 pt-2 border-t border-border">
        {canStartQuestion && !askOpen && (
          <Button
            type="button"
            onClick={() => setAskOpen(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90"
          >
            <MessageSquarePlus className="h-4 w-4" />
            Ask a question
          </Button>
        )}

        {canStartQuestion && askOpen && (
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const v = askDraft.trim();
              if (!v) return;
              createMutation.mutate({ body: v, parentId: null });
            }}
          >
            <Textarea
              value={askDraft}
              onChange={(e) => setAskDraft(e.target.value)}
              rows={4}
              placeholder="Type your question"
              className="text-sm"
            />
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAskOpen(false);
                  setAskDraft("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !askDraft.trim()}>
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Post question"
                )}
              </Button>
            </div>
          </form>
        )}

        {!canStartQuestion && (
          <p className="text-xs text-muted-foreground">
            Only signed-in creator or brand/business accounts can start a new Q&amp;A thread.
          </p>
        )}
      </div>
    </div>
  );
}
