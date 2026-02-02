import { ProjectCarousel } from "@/components/Dashboard/showcase/ProjectCarousel"
import { ProjectSidebar } from "@/components/Dashboard/showcase/ProjectSidebar"


export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col md:flex-row items-start justify-center gap-6 p-6">
            <ProjectCarousel />
            <ProjectSidebar />
        </div>
    )
}
