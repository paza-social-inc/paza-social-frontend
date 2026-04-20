'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Kanban,
    KanbanBoard,
    KanbanColumn,
    KanbanColumnContent,
    KanbanColumnHandle,
    KanbanItem,
    KanbanItemHandle,
    KanbanOverlay,
} from '@/components/ui/kanban';
import { GripVertical } from 'lucide-react';

export type TaskColumnKey = 'backlog' | 'inProgress' | 'review' | 'done';

export interface Task {
    id: string;
    title: string;
    priority: 'low' | 'medium' | 'high';
    description?: string;
    assignee?: string;
    assigneeAvatar?: string;
    status?: 'Not Started' | 'In Progress' | 'Review' | 'Done';
    startDate?: string; // YYYY-MM-DD
    dueDate?: string;
    budgetKsh?: string;
    spentKsh?: string;
    milestonePercent?: number;
    labels?: string[];
    createdBy?: { name: string; avatar?: string };
    attachmentName?: string;
    recurTask?: boolean;
    repeat?: string;
    /** Linked campaign name from API */
    campaignTitle?: string;
    /** ISO timestamps from API */
    createdAt?: string;
    updatedAt?: string;
}

const COLUMN_TITLES: Record<string, string> = {
    backlog: 'Backlog',
    inProgress: 'In Progress',
    review: 'Review',
    done: 'Done',
};

interface TaskCardProps extends Omit<React.ComponentProps<typeof KanbanItem>, 'value' | 'children'> {
    task: Task;
    asHandle?: boolean;
    onOpen?: (task: Task) => void;
}

function TaskCard({ task, asHandle, onOpen, ...props }: TaskCardProps) {
    const formatShortDate = (isoOrDate?: string) => {
        if (!isoOrDate) return undefined;
        // If already human-readable (e.g. "Aug 25, 2025"), still try Date parse.
        if (isoOrDate.includes('-')) {
            const [y, m, d] = isoOrDate.split('-').map((x) => Number(x));
            if ([y, m, d].every((n) => Number.isFinite(n))) {
                const dt = new Date(y, m - 1, d);
                return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        }
        const dObj = new Date(isoOrDate);
        if (Number.isNaN(dObj.getTime())) return isoOrDate;
        return dObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const cardInner = (
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-left">
            <div className="flex items-center justify-between gap-2">
                <span className="line-clamp-1 font-medium text-sm">{task.title}</span>
                <Badge
                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                    className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize shrink-0"
                >
                    {task.priority}
                </Badge>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-xs">
                {task.assignee && (
                    <div className="flex items-center gap-1">
                        <Avatar className="size-4">
                            <AvatarImage src={task.assigneeAvatar} />
                            <AvatarFallback>{task.assignee.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="line-clamp-1">{task.assignee}</span>
                    </div>
                )}
                {task.dueDate && (
                    <time className="text-[10px] tabular-nums whitespace-nowrap">
                        {formatShortDate(task.dueDate)}
                    </time>
                )}
            </div>
        </div>
    );

    const cardContent = asHandle ? (
        <div className="flex gap-1.5 rounded-md border bg-card p-2.5 pr-2 shadow-xs">
            <KanbanItemHandle asChild>
                <button
                    type="button"
                    className="mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Drag to move task"
                >
                    <GripVertical className="size-4" />
                </button>
            </KanbanItemHandle>
            <button
                type="button"
                className="min-w-0 flex-1 rounded-md outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-orange-500/60"
                onClick={() => onOpen?.(task)}
            >
                {cardInner}
            </button>
        </div>
    ) : (
        <div className="rounded-md border bg-card p-3 shadow-xs">{cardInner}</div>
    );

    return (
        <KanbanItem value={task.id} {...props}>
            {cardContent}
        </KanbanItem>
    );
}

interface TaskColumnProps extends Omit<React.ComponentProps<typeof KanbanColumn>, 'children'> {
    tasks: Task[];
    isOverlay?: boolean;
    onTaskOpen?: (task: Task) => void;
}

function TaskColumn({ value, tasks, isOverlay, onTaskOpen, className, ...props }: TaskColumnProps) {
    return (
        <KanbanColumn
            value={value}
            {...props}
            className={cn(
                'min-h-0 min-w-0 rounded-md border bg-card p-2.5 shadow-xs',
                className,
            )}
        >
            <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="text-sm font-semibold">{COLUMN_TITLES[value]}</span>
                    <Badge variant="secondary">{tasks.length}</Badge>
                </div>
                <KanbanColumnHandle asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                        <GripVertical />
                    </Button>
                </KanbanColumnHandle>
            </div>
            <KanbanColumnContent
                value={value}
                className="flex max-h-[min(65vh,560px)] flex-col gap-2.5 overflow-y-auto overflow-x-hidden p-0.5 [scrollbar-gutter:stable] xl:max-h-[min(70vh,720px)]"
            >
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        asHandle={!isOverlay}
                        onOpen={onTaskOpen}
                    />
                ))}
            </KanbanColumnContent>
        </KanbanColumn>
    );
}

export const initialTasksColumns: Record<TaskColumnKey, Task[]> = {
    backlog: [
        {
            id: '1',
            title: 'Add authentication',
            priority: 'high',
            assignee: 'John Doe',
            assigneeAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
                status: 'Not Started',
                startDate: '2025-01-10',
                dueDate: '2025-01-10',
        },
        {
            id: '2',
            title: 'Create API endpoints',
            priority: 'medium',
            assignee: 'Jane Smith',
            assigneeAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
                status: 'Not Started',
                startDate: '2025-01-15',
                dueDate: '2025-01-15',
        },
        {
            id: '3',
            title: 'Write documentation',
            priority: 'low',
            assignee: 'Bob Johnson',
            assigneeAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
                status: 'Not Started',
                startDate: '2025-01-20',
                dueDate: '2025-01-20',
        },
    ],
    inProgress: [
        {
            id: '4',
            title: 'Design system updates',
            priority: 'high',
            assignee: 'Alice Brown',
            assigneeAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
                status: 'In Progress',
                startDate: '2025-08-25',
                dueDate: '2025-08-25',
        },
        {
            id: '5',
            title: 'Implement dark mode',
            priority: 'medium',
            assignee: 'Charlie Wilson',
            assigneeAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
                status: 'In Progress',
                startDate: '2025-08-25',
                dueDate: '2025-08-25',
        },
    ],
    review: [],
    done: [
        {
            id: '7',
            title: 'Setup project',
            priority: 'high',
            assignee: 'Eve Davis',
            assigneeAvatar: 'https://randomuser.me/api/portraits/women/6.jpg',
                status: 'Done',
            startDate: '2025-09-25',
            dueDate: '2025-09-25',
        },
        {
            id: '8',
            title: 'Initial commit',
            priority: 'low',
            assignee: 'Frank White',
            assigneeAvatar: 'https://randomuser.me/api/portraits/men/7.jpg',
                status: 'Done',
            startDate: '2025-09-20',
            dueDate: '2025-09-20',
        },
    ],
};

interface TasksTabProps {
    columns: Record<TaskColumnKey, Task[]>;
    setColumns: React.Dispatch<React.SetStateAction<Record<TaskColumnKey, Task[]>>>;
    onTaskOpen?: (task: Task) => void;
}

export default function TasksTab({ columns, setColumns, onTaskOpen }: TasksTabProps) {
    // Prevent @dnd-kit hydration mismatch by not rendering on the server.
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
            <KanbanBoard className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {(
                    Object.entries(columns) as Array<[TaskColumnKey, Task[]]>
                ).map(([columnValue, tasks]) => (
                    <TaskColumn
                        key={columnValue}
                        value={columnValue}
                        tasks={tasks}
                        onTaskOpen={onTaskOpen}
                    />
                ))}
            </KanbanBoard>
            <KanbanOverlay>
                <div className="rounded-md bg-muted/60 size-full" />
            </KanbanOverlay>
        </Kanban>
    );
}
