import DashLayout from "@/components/layout/DashLayout";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <DashLayout>
            {children}
        </DashLayout>
    )
}
