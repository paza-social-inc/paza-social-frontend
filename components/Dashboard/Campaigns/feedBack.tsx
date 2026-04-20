"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignApi } from "@/lib/data/campaigns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";

interface FeedBackTabProps {
  campaignId: number;
}

export default function FeedBackTab({ campaignId }: FeedBackTabProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [desc, setDesc] = useState("");

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; feedback: string; desc: string }) => {
      return campaignApi.addFeedback(campaignId, data);
    },
    onSuccess: () => {
      toast.success("Feedback submitted successfully!");
      setName("");
      setEmail("");
      setFeedback("");
      setDesc("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
      queryClient.invalidateQueries({ queryKey: ["campaign-feedback", campaignId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit feedback");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    submitFeedbackMutation.mutate({ name, email, feedback, desc });
  };

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="min-h-11 w-full shrink-0 gap-2 rounded-xl bg-orange-500 px-4 font-semibold text-black hover:bg-orange-600 sm:w-auto sm:min-w-[160px]"
      >
        <MessageSquarePlus className="h-4 w-4" aria-hidden />
        Leave feedback
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[min(90dvh,720px)] w-[calc(100%-1.25rem)] max-w-[calc(100%-1.25rem)] gap-0 overflow-hidden p-0 sm:max-w-lg"
        >
          <div className="border-b border-border px-4 pb-4 pt-2 sm:px-6 sm:pb-5 sm:pt-4">
            <DialogHeader className="gap-2 text-left">
              <DialogTitle className="text-xl font-semibold leading-tight">
                Feedback for this campaign
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Your message is visible to everyone with access to this campaign.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="flex max-h-[min(90dvh-100px,620px)] flex-col">
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              <div className="space-y-2">
                <Label htmlFor="feedback-name" className="text-sm font-medium">
                  Name <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="feedback-name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-11 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-email" className="text-sm font-medium">
                  Email <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="feedback-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-11 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-body" className="text-sm font-medium">
                  Feedback <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="feedback-body"
                  name="feedback"
                  required
                  placeholder="Share your thoughts…"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="min-h-[120px] resize-y text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback-desc" className="text-sm font-medium">
                  Extra context <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="feedback-desc"
                  name="desc"
                  placeholder="Short note or link"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="min-h-11 text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-border bg-muted/30 p-4 sm:flex-row sm:justify-end sm:gap-3 sm:p-6">
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full sm:w-auto"
                onClick={() => setOpen(false)}
                disabled={submitFeedbackMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-h-11 w-full sm:w-auto"
                disabled={submitFeedbackMutation.isPending}
              >
                {submitFeedbackMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit feedback"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
