"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { openingsApi } from "@/lib/data/openings";
import {
  OPENING_ROLE_TYPES,
  OPENING_COMPENSATION_TYPES,
  type OpeningRoleType,
  type OpeningCompensationType,
} from "@/types/openings";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters")
    .max(200, "Title must be 200 characters or less"),
  roleType: z.enum(OPENING_ROLE_TYPES as unknown as [string, ...string[]], {
    message: "Select a role type",
  }),
  compensation: z.enum(OPENING_COMPENSATION_TYPES as unknown as [string, ...string[]], {
    message: "Select a compensation type",
  }),
  description: z.string().max(2000, "Description must be 2000 characters or less").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export interface CreateOpeningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectTitle?: string;
}

export function CreateOpeningModal({
  open,
  onOpenChange,
  projectId,
  projectTitle,
}: CreateOpeningModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      roleType: undefined,
      compensation: undefined,
      description: "",
    },
  });

  const roleType = watch("roleType");
  const compensation = watch("compensation");

  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      openingsApi.create(projectId, {
        title: data.title,
        roleType: data.roleType as OpeningRoleType,
        compensation: data.compensation as OpeningCompensationType,
        description: data.description || undefined,
      }),
    onSuccess: () => {
      toast.success("Opening created");
      queryClient.invalidateQueries({ queryKey: ["openings", projectId] });
      queryClient.invalidateQueries({ queryKey: ["creator-projects"] });
      reset();
      onOpenChange(false);
    },
    onError: (err: unknown) => {
      const res = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error(res.response?.data?.message ?? res.message ?? "Failed to create opening");
    },
  });

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={true}
        className={cn(
          "max-w-[calc(100vw-2rem)] sm:max-w-md max-h-[90dvh] overflow-y-auto",
          "rounded-xl border-border bg-card p-0 gap-0"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Create opening</DialogTitle>

        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-bold text-foreground">Create opening</h2>
          {projectTitle && (
            <p className="text-sm text-muted-foreground mt-0.5">For: {projectTitle}</p>
          )}

          <form
            onSubmit={handleSubmit((data) => createMutation.mutate(data))}
            className="space-y-4 mt-5"
          >
            <Field>
              <FieldLabel>Title *</FieldLabel>
              <Input
                {...register("title")}
                placeholder="e.g. Creative Director"
                className="min-h-11 border-border bg-background"
                autoComplete="off"
                aria-invalid={!!errors.title}
              />
              <FieldError>{errors.title?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Role type *</FieldLabel>
              <Select
                value={roleType ?? ""}
                onValueChange={(v) => setValue("roleType", v as OpeningRoleType)}
              >
                <SelectTrigger
                  className="min-h-11 border-border bg-background"
                  aria-invalid={!!errors.roleType}
                >
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  {OPENING_ROLE_TYPES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.roleType?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Compensation *</FieldLabel>
              <Select
                value={compensation ?? ""}
                onValueChange={(v) => setValue("compensation", v as OpeningCompensationType)}
              >
                <SelectTrigger
                  className="min-h-11 border-border bg-background"
                  aria-invalid={!!errors.compensation}
                >
                  <SelectValue placeholder="Select compensation" />
                </SelectTrigger>
                <SelectContent>
                  {OPENING_COMPENSATION_TYPES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{errors.compensation?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Description (optional)</FieldLabel>
              <Textarea
                {...register("description")}
                placeholder="Describe the role and what you're looking for..."
                rows={4}
                className="border-border bg-background resize-none"
                aria-invalid={!!errors.description}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
              <Button type="button" variant="outline" className="border-border" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="bg-primary text-primary-foreground hover:opacity-90"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating…
                  </>
                ) : (
                  "Create opening"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
