import CalendarTab from "@/components/Dashboard/tasks/Calendar";
import TasksTab from "@/components/Dashboard/tasks/TasksTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function page() {
    return (
        <Tabs defaultValue="tasks" className="full p-3">
            <TabsList className="md:min-w-xs h-10">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
                <TasksTab />
            </TabsContent>
            <TabsContent value="calendar" className="border p-3">
                <CalendarTab />
            </TabsContent>
        </Tabs>
    )
}
