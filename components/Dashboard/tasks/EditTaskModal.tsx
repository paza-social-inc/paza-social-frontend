"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import type { Task } from "@/components/Dashboard/tasks/TasksTab";
import { tasksApi } from "@/lib/data/tasks";
import type { TaskPriority, TaskStatus } from "./CreateTaskModal";

const schema = z
  .object({
    taskName: z.string().min(2, "Task name is required").max(200, "Max 200 characters"),
    priority: z.enum(["high", "medium", "low"]),
    budgetKsh: z.string().transform((v) => v.trim()),
    status: z.enum(["Not Started", "In Progress", "Review", "Done"]),
    startDate: z.string().min(1, "Start date is required"),
    dueDate: z.string().min(1, "Due date is required"),
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
  );

type FormData = z.infer<typeof schema>;

export interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  campaignTitle?: string;
  onSaved?: () => void;
}

export function EditTaskModal({
  open,
  onOpenChange,
  task,
  campaignTitle,
  onSaved,
}: EditTaskModalProps) {
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
      priority: "medium",
      budgetKsh: "",
      status: "Not Started",
      startDate: "",
      dueDate: "",
      description: "",
    },
  });

  React.useEffect(() => {
    if (!open || !task) return;
    reset({
      taskName: task.title,
      priority: (task.priority as TaskPriority) ?? "medium",
      budgetKsh: task.budgetKsh ?? "",
      status: (task.status as TaskStatus) ?? "Not Started",
      startDate: task.startDate ?? "",
      dueDate: task.dueDate ?? "",
      description: task.description ?? "",
    });
    setAttachmentFile(null);
  }, [open, task, reset]);

  const onSubmit = async (data: FormData) => {
    if (!task) return;
    const id = Number(task.id);
    if (!Number.isFinite(id)) {
      toast.error("Invalid task");
      return;
    }
    try {
      await tasksApi.update(id, {
        taskName: data.taskName,
        priority: data.priority,
        status: data.status,
        startDate: data.startDate,
        dueDate: data.dueDate,
        description: data.description,
        budgetKsh: data.budgetKsh || null,
        attachmentName: attachmentFile?.name ?? task.attachmentName ?? undefined,
      });
      toast.success("Task updated");
      onOpenChange(false);
      onSaved?.();
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data
          ?.message;
      toast.error(typeof msg === "string" ? msg : "Could not update task");
    }
  };

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90dvh] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border-border bg-card sm:max-w-lg"
        )}
        aria-describedby={undefined}
      >
        <DialogTitle className="text-lg font-semibold">
          Edit task
          {campaignTitle ? (
            <span className="mt-1 block text-sm font-normal text-muted-foreground">
              Campaign: {campaignTitle}
            </span>
          ) : null}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <Field>
            <FieldLabel>Task name</FieldLabel>
            <Input
              {...register("taskName")}
              placeholder="e.g. Film product reel"
              className="h-10"
            />
            <FieldError>{errors.taskName?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <Input
              type="text"
              inputMode="decimal"
              placeholder="Optional"
              className="h-10"
              {...register("budgetKsh")}
            />
            <FieldError>{errors.budgetKsh?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              rows={4}
              placeholder="Deliverables, links, notes…"
              {...register("description")}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Attachment (optional)
            </FieldLabel>
            {task?.attachmentName ? (
              <p className="text-muted-foreground mb-1 text-xs">
                Current: {task.attachmentName}
              </p>
            ) : null}
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
