
import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import NavMenu from "@/components/Dashboard/nav-menu/nav-menu";

export default function DashLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <div className="w-full">
                    <div className="w-full">
                        <header className="flex  sticky z-40 top-0 bg-background flex-wrap gap-3  shrink-0 items-center transition-all ease-linear">
                            {/* Left side */}
                            <div className="flex flex-1 border-b   py-4 items-center gap-2 w-full">
                                <SidebarTrigger className="ms-2" />
                                <div className="max-lg:hidden lg:contents">
                                    <Separator
                                        orientation="vertical"
                                        className="me-2 data-[orientation=vertical]:h-4"
                                    />
                                    <NavMenu />
                                </div>
                            </div>
                            {/* Right side */}
                        </header>
                        <div className="overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
