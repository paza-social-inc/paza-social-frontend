import { Suspense } from "react";
import NotificationsClient from "./NotificationsClient";

export default function NotificationsPage() {
    return (
        <Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-muted-foreground">Loading...</div>}>
            <NotificationsClient />
        </Suspense>
    );
}
