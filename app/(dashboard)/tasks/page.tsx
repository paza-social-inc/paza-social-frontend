"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CalendarTab from "@/components/Dashboard/tasks/Calendar";
import TasksTab, { type TaskColumnKey, type Task } from "@/components/Dashboard/tasks/TasksTab";
import { TaskDetailsModal } from "@/components/Dashboard/tasks/TaskDetailsModal";
import { EditTaskModal } from "@/components/Dashboard/tasks/EditTaskModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SelectCampaignForJobModal } from "@/components/Dashboard/tasks/SelectCampaignForJobModal";
import { CreateTaskModal, type CreateTaskPayload } from "@/components/Dashboard/tasks/CreateTaskModal";
import type { Campaign } from "@/types/campaigns/campaignTypes";
import { parseCampaignId } from "@/lib/data/campaigns";
import { tasksApi, type TaskListItem } from "@/lib/data/tasks";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { DASHBOARD_TABS_LIST_TWO_UP_CLASS } from "@/components/layout/DashboardPageShell";

function mapStatusToColumn(status?: string): TaskColumnKey {
  if (status === "In Progress") return "inProgress";
  if (status === "Review") return "review";
  if (status === "Done") return "done";
  return "backlog";
}

function displayUserName(
  u?: TaskListItem["assignee"] | TaskListItem["createdBy"]
): string {
  if (!u) return "—";
  const fn = u.firstName ?? u.firstname;
  const ln = u.lastName ?? u.lastname;
  if (fn || ln) return `${fn ?? ""} ${ln ?? ""}`.trim();
  return u.email ?? "—";
}

function toIsoTimestamp(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === "string") return v;
  if (v instanceof Date) return v.toISOString();
  return undefined;
}

function normalizeApiTask(task: TaskListItem): Task {
  const assigneeName = displayUserName(task.assignee ?? undefined);
  const assigneeDisplay =
    assigneeName === "—" ? undefined : assigneeName;

  return {
    id: String(task.id),
    title: task.title,
    priority: (task.priority as Task["priority"]) || "medium",
    description: task.description,
    status: task.status as Task["status"],
    assignee: assigneeDisplay,
    assigneeAvatar: task.assignee?.avatar,
    startDate: String(task.startDate).slice(0, 10),
    dueDate: String(task.dueDate).slice(0, 10),
    budgetKsh: task.budgetKsh ?? undefined,
    attachmentName: task.attachmentName ?? undefined,
    createdBy: {
      name: displayUserName(task.createdBy ?? undefined),
      avatar: task.createdBy?.avatar,
    },
    labels: undefined,
    campaignTitle: task.campaign?.title,
    recurTask: task.recurTask ?? false,
    repeat: task.repeatFrequency ?? undefined,
    createdAt: toIsoTimestamp(
      (task as TaskListItem & { createdAt?: unknown }).createdAt
    ),
    updatedAt: toIsoTimestamp(
      (task as TaskListItem & { updatedAt?: unknown }).updatedAt
    ),
  };
}

export default function TasksPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isCreatorAccount =
    String(user?.accountType ?? "").toLowerCase() === "creator";
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [campaignPickerOpen, setCampaignPickerOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [columns, setColumns] = useState<Record<TaskColumnKey, Task[]>>(() => ({
    backlog: [],
    inProgress: [],
    review: [],
    done: [],
  }));

  const { data: myTasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks", "mine"],
    queryFn: () => tasksApi.getMine(),
    retry: false,
  });

  useEffect(() => {
    if (!myTasks) return;
    const next: Record<TaskColumnKey, Task[]> = {
      backlog: [],
      inProgress: [],
      review: [],
      done: [],
    };
    for (const row of myTasks) {
      const mapped = normalizeApiTask(row);
      const col = mapStatusToColumn(mapped.status);
      next[col].push(mapped);
    }
    setColumns(next);
  }, [myTasks]);

  const tasksForCalendar = useMemo(() => Object.values(columns).flat(), [columns]);

  const creatorNameForNewTask = useMemo(() => {
    if (!user) return "You";
    const u = user as {
      firstName?: string;
      lastName?: string;
      email?: string;
    };
    const n = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
    return n || u.email || "You";
  }, [user]);

  const assigneeOptions = useMemo(() => {
    const teams = selectedCampaign?.teams ?? [];
    const rows = teams.flatMap((t) => t.members ?? []);
    const seen = new Set<string>();
    return rows
      .map((m) => {
        const email = String(m.email ?? "").trim().toLowerCase();
        const name = String(m.name ?? "").trim() || email;
        return { name, email };
      })
      .filter((m) => {
        if (!m.email) return false;
        if (seen.has(m.email)) return false;
        seen.add(m.email);
        return true;
      });
  }, [selectedCampaign]);

  const handleMarkTaskComplete = (task: Task) => {
    setColumns((prev) => {
      const next: Record<TaskColumnKey, Task[]> = {
        backlog: [],
        inProgress: [],
        review: [],
        done: [],
      };
      (Object.keys(prev) as TaskColumnKey[]).forEach((col) => {
        next[col] = prev[col].filter((t) => t.id !== task.id);
      });
      next.done = [
        { ...task, status: "Done", milestonePercent: 100 },
        ...next.done,
      ];
      return next;
    });
    toast.success("Task marked as completed");
  };

  const handleOpenCreateJob = () => {
    setCampaignPickerOpen(true);
  };

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCampaignPickerOpen(false);
    setCreateTaskOpen(true);
  };

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    if (!selectedCampaign) {
      throw new Error("Campaign not selected");
    }

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    const statusToColumn: Record<string, TaskColumnKey> = {
      "Not Started": "backlog",
      "In Progress": "inProgress",
      Review: "review",
      Done: "done",
    };

    const columnKey = statusToColumn[payload.status] ?? "backlog";

    const campaignId = parseCampaignId(selectedCampaign.id);
    if (campaignId == null) {
      throw new Error("Invalid campaignId");
    }

    await tasksApi.create({
      campaignId,
      taskName: payload.taskName,
      assigneeEmail: payload.assigneeEmail,
      priority: payload.priority,
      status: payload.status,
      startDate: payload.startDate, // YYYY-MM-DD
      dueDate: payload.dueDate, // YYYY-MM-DD
      recurTask: payload.recurTask,
      repeat: payload.recurTask ? payload.repeat : undefined,
      description: payload.description,
      budgetKsh: payload.budgetKsh,
      attachmentName: payload.attachmentFile?.name ?? undefined,
    });

    const now = new Date().toISOString();
    const newTask: Task = {
      id,
      title: payload.taskName,
      priority: payload.priority,
      description: payload.description,
      status: payload.status,
      startDate: payload.startDate,
      dueDate: payload.dueDate,
      budgetKsh: payload.budgetKsh,
      createdBy: { name: creatorNameForNewTask },
      labels: undefined,
      campaignTitle: selectedCampaign?.title,
      recurTask: payload.recurTask,
      repeat: payload.repeat,
      createdAt: now,
      updatedAt: now,
    };

    setColumns((prev) => ({
      ...prev,
      [columnKey]: [newTask, ...prev[columnKey]],
    }));
  };

  const handleTaskSaved = () => {
    void queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
  };

  return (
    <>
      <EditTaskModal
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditTask(null);
        }}
        task={editTask}
        campaignTitle={
          editTask?.labels?.[0]
            ? String(editTask.labels[0])
            : selectedCampaign?.title
        }
        onSaved={handleTaskSaved}
      />
      <TaskDetailsModal
        open={detailTask != null}
        onOpenChange={(open) => {
          if (!open) setDetailTask(null);
        }}
        task={detailTask}
        onMarkComplete={handleMarkTaskComplete}
        onRequestEdit={(t) => {
          setDetailTask(null);
          setEditTask(t);
          setEditOpen(true);
        }}
        onDeleted={async (t) => {
          await tasksApi.delete(Number(t.id));
          await queryClient.invalidateQueries({ queryKey: ["tasks", "mine"] });
        }}
      />
      <div className="flex flex-col gap-3 px-0 pb-1 pt-1 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:pt-3">
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-foreground sm:text-lg">Tasks</h1>
          {isCreatorAccount ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Tasks assigned to you by brands appear here.
            </p>
          ) : null}
        </div>
        {!isCreatorAccount ? (
          <Button size="sm" className="h-9 w-full shrink-0 sm:w-auto" onClick={handleOpenCreateJob}>
            Create task
          </Button>
        ) : null}
      </div>
      <Tabs defaultValue="tasks" className="w-full min-w-0 space-y-3 pt-1">
        <TabsList className={DASHBOARD_TABS_LIST_TWO_UP_CLASS}>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">
            Tasks
          </TabsTrigger>
          <TabsTrigger value="calendar" className="text-xs sm:text-sm">
            Calendar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          {isTasksLoading ? (
            <div className="text-sm text-muted-foreground py-6">Loading tasks…</div>
          ) : (
            <TasksTab
              columns={columns}
              setColumns={setColumns}
              onTaskOpen={(t) => setDetailTask(t)}
            />
          )}
        </TabsContent>
        <TabsContent value="calendar" className="border p-3">
          <CalendarTab tasks={tasksForCalendar} />
        </TabsContent>
      </Tabs>

      <SelectCampaignForJobModal
        open={campaignPickerOpen}
        onOpenChange={setCampaignPickerOpen}
        onSelect={handleCampaignSelect}
      />
      <CreateTaskModal
        open={createTaskOpen}
        onOpenChange={setCreateTaskOpen}
        campaignId={selectedCampaign ? parseCampaignId(selectedCampaign.id) ?? undefined : undefined}
        campaignTitle={selectedCampaign?.title}
        assigneeOptions={assigneeOptions}
        onCreateTask={(payload) => handleCreateTask(payload)}
      />
    </>
  );
}

