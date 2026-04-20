"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { campaignApi, parseCampaignId } from "@/lib/data/campaigns";
import type { CreateCampaignDto } from "@/types/campaigns/campaignTypes";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  title: z.string().min(2, "Name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  budget: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^\d+(\.\d+)?$/.test(val), "Invalid number"),
  active: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export interface EditCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId: number | null;
}

export function EditCampaignModal({ open, onOpenChange, campaignId }: EditCampaignModalProps) {
  const queryClient = useQueryClient();
  const numericId = campaignId != null ? parseCampaignId(campaignId) : null;

  const { data: campaign, isLoading } = useQuery({
    queryKey: ["campaign", numericId],
    queryFn: () => campaignApi.getById(numericId!),
    enabled: open && numericId != null,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", description: "", budget: "", active: true },
  });

  React.useEffect(() => {
    if (!campaign) return;
    reset({
      title: campaign.title ?? "",
      description: campaign.description ?? "",
      budget: campaign.budget != null ? String(campaign.budget) : "",
      active: campaign.active !== false,
    });
  }, [campaign, reset]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCampaignDto> }) => campaignApi.update(id, data),
    onSuccess: () => {
      toast.success("Campaign updated");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      if (numericId != null) queryClient.invalidateQueries({ queryKey: ["campaign", numericId] });
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } } };
      toast.error(res.response?.data?.message ?? "Update failed");
    },
  });

  const onSubmit = (data: FormData) => {
    if (numericId == null) return;
    const payload: Partial<CreateCampaignDto> & { active?: boolean } = {
      title: data.title,
      description: data.description || undefined,
      budget: data.budget ? Number(data.budget) : undefined,
      active: data.active,
    };
    updateMutation.mutate({ id: numericId, data: payload });
  };

  const active = watch("active");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogTitle>Edit campaign</DialogTitle>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        )}
        {!isLoading && campaign && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input {...register("title")} />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea rows={3} {...register("description")} />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Budget (KSh)</FieldLabel>
              <Input {...register("budget")} />
              <FieldError>{errors.budget?.message}</FieldError>
            </Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-campaign-active"
                checked={active !== false}
                onCheckedChange={(c) => setValue("active", c === true)}
              />
              <label htmlFor="edit-campaign-active" className="text-sm cursor-pointer">
                Active
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
                {(isSubmitting || updateMutation.isPending) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Save
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
