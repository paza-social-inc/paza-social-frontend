import JobBoard from "@/components/Dashboard/Jobs/sections/AllJobsTab";
import MyJobBoard from "@/components/Dashboard/Jobs/sections/MyJobsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



export default function Page() {
    return (
        <Tabs defaultValue="myjobs" className="full p-3">
            <TabsList className="md:min-w-xs h-10">
                <TabsTrigger value="myjobs">My Jobs</TabsTrigger>
                <TabsTrigger value="alljobs">All Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="myjobs">
                <MyJobBoard />
            </TabsContent>
            <TabsContent value="alljobs" >
                <JobBoard syncUrl />
            </TabsContent>
        </Tabs>
    )
}

