"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "Not Started" | "In Progress" | "Review" | "Done";
export type TaskRepeat = "Daily" | "Weekly" | "Monthly" | "Yearly";

const schema = z
  .object({
    taskName: z.string().min(2, "Task name is required").max(200, "Max 200 characters"),
    priority: z.enum(["high", "medium", "low"]),
    budgetKsh: z.string().transform((v) => v.trim()),
    status: z.enum(["Not Started", "In Progress", "Review", "Done"]),
    startDate: z.string().min(1, "Start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
    recurTask: z.boolean(),
    repeat: z.enum(["Daily", "Weekly", "Monthly", "Yearly"]).optional(),
    assigneeEmail: z.string().optional(),
    description: z.string().min(1, "Task description is required").max(4000, "Description too long"),
  })
  .refine(
    (data) => {
      const s = new Date(data.startDate).getTime();
      const e = new Date(data.dueDate).getTime();
      if (!Number.isFinite(s) || !Number.isFinite(e)) return true;
      return e >= s;
    },
    { message: "Due date must be on or after start date", path: ["dueDate"] }
  )
  .refine(
    (data) => {
      if (!data.recurTask) return true;
      return !!data.repeat;
    },
    { message: "Please select a repeat frequency", path: ["repeat"] }
  );

type FormData = z.infer<typeof schema>;

export interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignId?: number;
  campaignTitle?: string;
  assigneeOptions?: Array<{ name: string; email: string }>;
  onCreateTask: (payload: CreateTaskPayload) => Promise<void> | void;
}

export interface CreateTaskPayload {
  taskName: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  recurTask: boolean;
  description: string;
  repeat?: TaskRepeat;
  budgetKsh?: string;
  assigneeEmail?: string;
  attachmentFile?: File | null;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  onCreateTask,
  campaignId,
  campaignTitle,
  assigneeOptions = [],
}: CreateTaskModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const [attachmentFile, setAttachmentFile] = React.useState<File | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      taskName: "",
      priority: "high",
      budgetKsh: "",
      status: "Not Started",
      startDate: "",
      dueDate: "",
      recurTask: false,
      repeat: undefined,
      assigneeEmail: "",
      description: "",
    },
  });

  const recurTask = watch("recurTask");

  React.useEffect(() => {
    if (!open) return;
    reset({
      taskName: "",
      priority: "high",
      budgetKsh: "",
      status: "Not Started",
      startDate: "",
      dueDate: "",
      recurTask: false,
      repeat: undefined,
      assigneeEmail: "",
      description: "",
    });
    setAttachmentFile(null);
  }, [open, reset]);

  const onSubmit = async (data: FormData) => {
    if (campaignId == null || !Number.isFinite(campaignId)) {
      toast.error("Select a campaign first.");
      return;
    }
    const payload: CreateTaskPayload = {
      taskName: data.taskName,
      priority: data.priority,
      status: data.status,
      startDate: data.startDate,
      dueDate: data.dueDate,
      recurTask: data.recurTask,
      repeat: data.recurTask ? data.repeat : undefined,
      description: data.description,
      budgetKsh: data.budgetKsh || undefined,
      assigneeEmail:
        data.assigneeEmail && data.assigneeEmail !== "__unassigned__"
          ? data.assigneeEmail
          : undefined,
      attachmentFile: attachmentFile ?? undefined,
    };
    try {
      await onCreateTask(payload);
      toast.success("Task created");
      onOpenChange(false);
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message;
      toast.error(typeof msg === "string" ? msg : "Could not create task");
    }
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-[calc(100vw-2rem)] sm:max-w-lg max-h-[90dvh] overflow-y-auto",
          "rounded-xl border-border bg-card"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="text-lg font-semibold">
          Create task
          {campaignTitle ? (
            <span className="block text-sm font-normal text-muted-foreground mt-1">
              Campaign: {campaignTitle}
            </span>
          ) : null}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel>Task name</FieldLabel>
            <Input {...register("taskName")} placeholder="e.g. Film product reel" className="h-10" />
            <FieldError>{errors.taskName?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Select
                value={watch("priority")}
                onValueChange={(v) => setValue("priority", v as FormData["priority"])}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors.priority?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={watch("status")}
                onValueChange={(v) => setValue("status", v as FormData["status"])}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors.status?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel>Assign to member</FieldLabel>
            <Select
              value={watch("assigneeEmail") ?? "__unassigned__"}
              onValueChange={(v) => setValue("assigneeEmail", v)}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__unassigned__">Unassigned</SelectItem>
                {assigneeOptions.map((opt) => (
                  <SelectItem key={opt.email} value={opt.email}>
                    {opt.name} ({opt.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Start date</FieldLabel>
              <Input type="date" className="h-10" {...register("startDate")} />
              <FieldError>{errors.startDate?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Due date</FieldLabel>
              <Input type="date" className="h-10" {...register("dueDate")} />
              <FieldError>{errors.dueDate?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel>Budget (KSh)</FieldLabel>
            <Input type="text" inputMode="decimal" placeholder="Optional" className="h-10" {...register("budgetKsh")} />
            <FieldError>{errors.budgetKsh?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea rows={4} placeholder="Deliverables, links, notes…" {...register("description")} />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          <div className="flex items-center gap-2">
            <Checkbox
              id="recurTask"
              checked={recurTask}
              onCheckedChange={(c) => setValue("recurTask", c === true)}
            />
            <label htmlFor="recurTask" className="text-sm font-medium leading-none cursor-pointer">
              Recurring task
            </label>
          </div>

          {recurTask ? (
            <Field>
              <FieldLabel>Repeat</FieldLabel>
              <Select
                value={watch("repeat") ?? ""}
                onValueChange={(v) => setValue("repeat", v as FormData["repeat"])}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="How often?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FieldError>{errors.repeat?.message}</FieldError>
            </Field>
          ) : null}

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Attachment (optional)
            </FieldLabel>
            <Input
              type="file"
              className="h-10 cursor-pointer"
              onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                "Create task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
