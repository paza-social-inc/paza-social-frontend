'use client';
import * as React from 'react';
import {
    CalendarBody,
    CalendarDate,
    CalendarDatePagination,
    CalendarDatePicker,
    CalendarHeader,
    CalendarItem,
    CalendarMonthPicker,
    CalendarProvider,
    CalendarYearPicker,
    type Feature as CalendarFeature,
    type Status as CalendarStatus,
} from '@/components/ui/shadcn-io/calendar';

import type { Task } from '@/components/Dashboard/tasks/TasksTab';

const STATUSES: CalendarStatus[] = [
    { id: 'planned', name: 'Planned', color: '#6B7280' },
    { id: 'inProgress', name: 'In Progress', color: '#F59E0B' },
    { id: 'done', name: 'Done', color: '#10B981' },
];

const parseYMDToLocalMidnight = (ymd: string) => {
    // Expect YYYY-MM-DD; create local date to avoid timezone shifts.
    const [y, m, d] = ymd.split('-').map((x) => Number(x));
    if (![y, m, d].every((n) => Number.isFinite(n))) return new Date(ymd);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
};

const taskStatusToCalendarStatus = (status: Task['status']) => {
    if (status === 'Done') return STATUSES[2];
    if (status === 'In Progress') return STATUSES[1];
    return STATUSES[0];
};

export default function CalendarTab({ tasks = [] }: { tasks?: Task[] }) {
    const features = React.useMemo(() => {
        return tasks
            .filter((t) => !!t.startDate || !!t.dueDate)
            .map((t) => {
                const day = t.startDate ?? t.dueDate!;
                const dt = parseYMDToLocalMidnight(day);
                return {
                    id: t.id,
                    name: t.title,
                    startAt: dt,
                    endAt: dt, // CalendarBody uses endAt to decide which day to render.
                    status: taskStatusToCalendarStatus(t.status),
                } satisfies CalendarFeature;
            });
    }, [tasks]);

    const earliestYear = React.useMemo(() => {
        const years = features.map((f) => f.startAt.getFullYear());
        return (years.sort((a, b) => a - b)[0] as number | undefined) ?? new Date().getFullYear();
    }, [features]);

    const latestYear = React.useMemo(() => {
        const years = features.map((f) => f.endAt.getFullYear());
        return (years.sort((a, b) => b - a)[0] as number | undefined) ?? new Date().getFullYear();
    }, [features]);

    return (
        <CalendarProvider>
            <CalendarDate>
                <CalendarDatePicker>
                    <CalendarMonthPicker />
                    <CalendarYearPicker end={latestYear} start={earliestYear} />
                </CalendarDatePicker>
                <CalendarDatePagination />
            </CalendarDate>
            <CalendarHeader />
            <CalendarBody features={features}>
                {({ feature }) => <CalendarItem feature={feature} key={feature.id} />}
            </CalendarBody>
        </CalendarProvider>
    );
}
