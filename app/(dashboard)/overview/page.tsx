
"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight, CreditCard, Timer, Loader2 } from "lucide-react";
import Calendar from "@/components/Dashboard/tasks/Calendar";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label } from "recharts";
import { jobsApi } from "@/lib/data/jobs";
import { useAuth } from "@/hooks/store/auth/useAuth";
import { tasksApi } from "@/lib/data/tasks";
import { campaignApi } from "@/lib/data/campaigns";
import { escrowPaymentsApi } from "@/lib/data/escrowPayments";

type Transaction = {
    id: string;
    title: string;
    date: string;
    amount: number;
    type: "credit" | "debit";
};

type CampaignProgress = {
    id: string;
    name: string;
    tasks: number;
    percent: number;
    fill: string;
};

function toAmount(raw: unknown): number {
    if (typeof raw === "number") return Number.isFinite(raw) ? raw : 0;
    const n = Number(String(raw ?? "").replace(/[^\d.-]/g, ""));
    return Number.isFinite(n) ? n : 0;
}

function formatShortDate(iso?: string): string {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function OverviewPage() {
    const { user } = useAuth();
    const numericUserId = user?.id ? Number(user.id) : NaN;
    const hasNumericUserId = Number.isFinite(numericUserId);

    const { data: jobsResponse, isLoading: jobsLoading } = useQuery({
        queryKey: ["user-jobs", numericUserId],
        queryFn: async () => {
            if (!hasNumericUserId) return { data: [] };
            const response = await jobsApi.getByOwner(numericUserId);
            return { data: response };
        },
        enabled: hasNumericUserId,
    });

    const { data: tasks = [] } = useQuery({
        queryKey: ["overview-tasks"],
        queryFn: () => tasksApi.getMine(),
        enabled: hasNumericUserId,
    });

    const { data: campaigns = [] } = useQuery({
        queryKey: ["overview-campaigns"],
        queryFn: () => campaignApi.getMine(),
        enabled: hasNumericUserId,
    });

    const { data: escrowStats } = useQuery({
        queryKey: ["overview-escrow-stats"],
        queryFn: () => escrowPaymentsApi.getStats(),
        enabled: hasNumericUserId,
    });

    const { data: escrowList } = useQuery({
        queryKey: ["overview-escrow-list"],
        queryFn: () => escrowPaymentsApi.list(1, 30),
        enabled: hasNumericUserId,
    });

    const jobs = jobsResponse?.data ?? [];
    const escrows = escrowList?.escrows ?? [];

    const stats = {
        totalJobs: jobs.length,
        totalProposals: jobs.reduce((acc, job) => acc + (job.proposals?.length || 0), 0),
        activeJobs: jobs.filter((job) => job.isActive)?.length || 0,
    };

    const totalEarnings = escrowStats ? Math.max(0, escrowStats.totalEarnedKobo / 100) : 0;
    const totalSpending = escrows.reduce((sum, e) => {
        if (e.buyer?.id !== numericUserId) return sum;
        return sum + (e.totalAmountKES ?? 0);
    }, 0);

    const recentTransactions: Transaction[] = escrows
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 8)
        .map((e) => {
            const isCredit = e.seller?.id === numericUserId;
            const amount = isCredit ? (e.sellerAmountKES ?? e.totalAmountKES ?? 0) : (e.totalAmountKES ?? 0);
            return {
                id: String(e.id),
                title: e.title?.trim() || `Escrow #${e.id}`,
                date: formatShortDate(e.updatedAt),
                amount: toAmount(amount),
                type: isCredit ? "credit" : "debit",
            };
        });

    const latestTaskRow = [...tasks]
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];
    const latestTask = latestTaskRow
        ? {
              title: latestTaskRow.title || "Untitled task",
              due: formatShortDate(latestTaskRow.dueDate),
              status: latestTaskRow.status || "Pending",
          }
        : { title: "No tasks yet", due: "—", status: "Pending" };

    const campaignRows: CampaignProgress[] =
        campaigns.length > 0
            ? campaigns.slice(0, 1).map((c) => {
                  const milestones = c.milestones ?? [];
                  const completed = milestones.filter((m) => m.status === "Completed").length;
                  return {
                      id: String(c.id),
                      name: c.title || "Campaign",
                      tasks: milestones.length,
                      percent: milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0,
                      fill: "var(--color-primary)",
                  };
              })
            : [{ id: "default", name: "No active campaigns", tasks: 0, percent: 0, fill: "var(--color-primary)" }];

    if (jobsLoading && hasNumericUserId) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-foreground tracking-wider">Overview</h1>
                    <p className="text-sm dark:text-neutral-400 text-foreground">Track your earnings, campaign performance, and activity at a glance.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Total Earnings */}
                    <Card className="dark:bg-neutral-900 bg-card dark:border-neutral-700 border flex-1">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL EARNINGS</p>
                                    <p className="text-2xl font-bold dark:text-white text-foreground font-mono">
                                        ${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs dark:text-neutral-500 text-foreground/80 mt-1">
                                        Approved payouts from campaigns and collaborations
                                    </p>
                                </div>
                                <ArrowUpRight className="w-8 h-8 text-emerald-400" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 px-4 pb-4">
                            <div className="flex w-full items-center justify-between text-xs">
                                <span className="dark:text-neutral-400 text-foreground/80">This month</span>
                                <span className="text-emerald-400 font-mono">+12.4%</span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Total Spending */}
                    <Card className="dark:bg-neutral-900 bg-card dark:border-neutral-700 border flex-1">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL SPENDING</p>
                                    <p className="text-2xl font-bold dark:text-white text-foreground font-mono">
                                        ${totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-xs dark:text-neutral-500 text-foreground/80 mt-1">
                                        Ad spend, service fees, and creator payments
                                    </p>
                                </div>
                                <ArrowDownRight className="w-8 h-8 text-rose-400" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 px-4 pb-4">
                            <div className="flex w-full items-center justify-between text-xs">
                                <span className="dark:text-neutral-400 text-foreground/80">This month</span>
                                <span className="text-rose-400 font-mono">-4.1%</span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Total Proposals - ✅ REAL DATA */}
                    <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 flex-1">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL PROPOSALS</p>
                                    <p className="text-2xl font-bold dark:text-white text-foreground/80 font-mono">
                                        {stats.totalProposals}
                                    </p>
                                    <p className="text-xs dark:text-neutral-500 text-foreground/80 mt-1">
                                        Proposals received on your jobs
                                    </p>
                                </div>
                                <ArrowUpRight className="w-8 h-8 text-emerald-400" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 px-4 pb-4">
                            <div className="flex w-full items-center justify-between text-xs">
                                <span className="dark:text-neutral-400 text-foreground/80">All time</span>
                                <span className="text-emerald-400 font-mono">
                                    {stats.activeJobs} active jobs
                                </span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Total Jobs - ✅ REAL DATA */}
                    <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 flex-1">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL JOBS</p>
                                    <p className="text-2xl font-bold dark:text-white text-foreground font-mono">
                                        {stats.totalJobs}
                                    </p>
                                    <p className="text-xs dark:text-neutral-500 text-foreground mt-1">
                                        Jobs you&apos;ve posted
                                    </p>
                                </div>
                                <ArrowUpRight className="w-8 h-8 text-emerald-400" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 px-4 pb-4">
                            <div className="flex w-full items-center justify-between text-xs">
                                <span className="dark:text-neutral-400 text-foreground">Active</span>
                                <span className="text-emerald-400 font-mono">
                                    {stats.activeJobs} / {stats.totalJobs}
                                </span>
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                {/* Campaign Progress - ✅ REAL DATA */}
                <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 flex-1 flex flex-col">
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm text-white">
                                {campaignRows[0].name}
                            </CardTitle>
                            <Badge className="bg-white/10 text-neutral-200">
                                {campaignRows[0].tasks} milestones
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {(() => {
                            const c = campaignRows[0];
                            const chartData = [{ key: "progress", value: c.percent, fill: c.fill }];
                            const chartConfig: ChartConfig = { 
                                progress: { label: "Progress", color: "hsl(var(--chart-2))" } 
                            };
                            return (
                                <ChartContainer id="campaign-progress" config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
                                    <RadialBarChart 
                                        data={chartData} 
                                        startAngle={90} 
                                        endAngle={450} 
                                        innerRadius={80} 
                                        outerRadius={110}
                                    >
                                        <PolarGrid 
                                            gridType="circle" 
                                            radialLines={false} 
                                            stroke="none" 
                                            className="first:fill-muted last:fill-background" 
                                            polarRadius={[86, 74]} 
                                        />
                                        <RadialBar dataKey="value" background cornerRadius={10} />
                                        <PolarRadiusAxis 
                                            domain={[0, 100]} 
                                            tick={false} 
                                            tickLine={false} 
                                            axisLine={false}
                                        >
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text 
                                                                x={viewBox.cx} 
                                                                y={viewBox.cy} 
                                                                textAnchor="middle" 
                                                                dominantBaseline="middle"
                                                            >
                                                                <tspan 
                                                                    x={viewBox.cx} 
                                                                    y={viewBox.cy} 
                                                                    className="fill-foreground text-3xl font-bold"
                                                                >
                                                                    {c.percent}%
                                                                </tspan>
                                                                <tspan 
                                                                    x={viewBox.cx} 
                                                                    y={(viewBox.cy || 0) + 20} 
                                                                    className="fill-muted-foreground text-xs"
                                                                >
                                                                    complete
                                                                </tspan>
                                                            </text>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </PolarRadiusAxis>
                                    </RadialBarChart>
                                </ChartContainer>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Transactions */}
                    <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm dark:text-neutral-300 tracking-wider">
                                Recent Transactions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y dark:divide-neutral-800 p-0">
                            {recentTransactions.length === 0 ? (
                                <div className="px-4 py-6 text-sm text-muted-foreground">No transactions yet.</div>
                            ) : recentTransactions.map((tx) => (
                                <div key={tx.id} className="flex items-center justify-between px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full dark:bg-neutral-800 bg-secondary shadow flex items-center justify-center">
                                            <CreditCard className="w-4 h-4 text-foreground dark:text-neutral-300" />
                                        </div>
                                        <div>
                                            <div className="text-sm dark:text-white text-foreground">
                                                {tx.title}
                                            </div>
                                            <div className="text-xs dark:text-neutral-400 text-foreground">
                                                {tx.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`text-sm font-mono ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
                                        {tx.type === "credit" ? "+" : "-"}$
                                        {Math.abs(tx.amount).toLocaleString(undefined, { 
                                            minimumFractionDigits: 2, 
                                            maximumFractionDigits: 2 
                                        })}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Latest Task */}
                    <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm dark:text-neutral-300 text-foreground tracking-wider">
                                Latest Task
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="dark:text-white text-foreground font-medium">
                                        {latestTask.title}
                                    </div>
                                    <div className="text-xs dark:text-neutral-400 text-foreground mt-1">
                                        Due {latestTask.due}
                                    </div>
                                </div>
                                <Badge className="bg-orange-500/20 text-orange-400">
                                    {latestTask.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-foreground dark:text-neutral-400 mt-3">
                                <Timer className="w-4 h-4" />
                                <span>Stay on track to keep campaigns moving.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar */}
                <div className="lg:col-span-2 flex flex-col min-h-full">
                    <div>
                        <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm dark:text-neutral-300 text-foreground tracking-wider">
                                    Calendar
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Calendar />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}



// "use client";
//
// import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ArrowDownRight, ArrowUpRight, CreditCard, Timer } from "lucide-react";
// import Calendar from "@/components/Dashboard/tasks/Calendar";
// import { ChartContainer, ChartConfig } from "@/components/ui/chart";
// import { RadialBarChart, RadialBar, PolarGrid, PolarRadiusAxis, Label } from "recharts";
//
// type Transaction = {
//     id: string;
//     title: string;
//     date: string;
//     amount: number;
//     type: "credit" | "debit";
// };
//
// export default function OverviewPage() {
//     const totalEarnings = 12850.75;
//     const totalSpending = 4230.4;
//
//     const recentTransactions: Transaction[] = [
//         { id: "t1", title: "Brand payout - Summer Launch", date: "Oct 03, 2025", amount: 1800, type: "credit" },
//         { id: "t2", title: "Ad spend - Instagram Boost", date: "Oct 02, 2025", amount: 350, type: "debit" },
//         { id: "t3", title: "Brand payout - Back to School", date: "Sep 30, 2025", amount: 950, type: "credit" },
//         { id: "t4", title: "Platform fee", date: "Sep 27, 2025", amount: 49, type: "debit" },
//         { id: "t5", title: "Brand payout - Creator Collab", date: "Sep 24, 2025", amount: 620, type: "credit" },
//     ];
//
//     const latestTask = {
//         title: "Submit final deliverables for Autumn Campaign",
//         due: "Oct 10, 2025",
//         status: "In Review",
//     };
//
//     const campaigns = [
//         { id: "c1", name: "Autumn Launch", tasks: 8, percent: 72, fill: "var(--color-primary)" },
//     ];
//
//     return (
//         <div className="p-6 space-y-6">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold dark:text-white text-foreground tracking-wider">Overview</h1>
//                     <p className="text-sm dark:text-neutral-400 text-foreground">Track your earnings, campaign performance, and activity at a glance.</p>
//                 </div>
//             </div>
//
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <Card className="dark:bg-neutral-900 bg-card dark:border-neutral-700 border flex-1">
//                         <CardContent className="p-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL EARNINGS</p>
//                                     <p className="text-2xl font-bold dark:text-white text-foreground font-mono">${totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//                                     <p className="text-xs dark:text-neutral-500 text-foreground/80 mt-1">Approved payouts from campaigns and collaborations</p>
//                                 </div>
//                                 <ArrowUpRight className="w-8 h-8 text-emerald-400" />
//                             </div>
//                         </CardContent>
//                         <CardFooter className="pt-0 px-4 pb-4">
//                             <div className="flex w-full items-center justify-between text-xs">
//                                 <span className="dark:text-neutral-400 text-foreground/80">This month</span>
//                                 <span className="text-emerald-400 font-mono">+12.4%</span>
//                             </div>
//                         </CardFooter>
//                     </Card>
//
//                     <Card className="dark:bg-neutral-900 bg-card dark:border-neutral-700 border flex-1">
//                         <CardContent className="p-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL SPENDING</p>
//                                     <p className="text-2xl font-bold dark:text-white text-foreground font-mono">${totalSpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
//                                     <p className="text-xs dark:text-neutral-500 text-foreground/80 mt-1">Ad spend, service fees, and creator payments</p>
//                                 </div>
//                                 <ArrowDownRight className="w-8 h-8 text-rose-400" />
//                             </div>
//                         </CardContent>
//                         <CardFooter className="pt-0 px-4 pb-4">
//                             <div className="flex w-full items-center justify-between text-xs">
//                                 <span className="dark:text-neutral-400 text-foreground/80">This month</span>
//                                 <span className="text-rose-400 font-mono">-4.1%</span>
//                             </div>
//                         </CardFooter>
//                     </Card>
//
//                     <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 flex-1">
//                         <CardContent className="p-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL PROPOSALS</p>
//                                     <p className="text-2xl font-bold dark:text-white text-foreground/80 font-mono">20</p>
//                                     <p className="text-xs dark:text-neutral-500 text-foreground/80 mt-1">Proposals received</p>
//                                 </div>
//                                 <ArrowDownRight className="w-8 h-8 text-rose-400" />
//                             </div>
//                         </CardContent>
//                         <CardFooter className="pt-0 px-4 pb-4">
//                             <div className="flex w-full items-center justify-between text-xs">
//                                 <span className="dark:text-neutral-400 text-foreground/80">This month</span>
//                                 <span className="text-rose-400 font-mono">+12.4%</span>
//                             </div>
//                         </CardFooter>
//                     </Card>
//
//
//                     <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 flex-1">
//                         <CardContent className="p-4">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-xs dark:text-neutral-400 text-foreground tracking-wider">TOTAL JOBS</p>
//                                     <p className="text-2xl font-bold dark:text-white text-foreground font-mono">20</p>
//                                     <p className="text-xs dark:text-neutral-500 text-foreground mt-1">Jobs posted</p>
//                                 </div>
//                                 <ArrowUpRight className="w-8 h-8 text-emerald-400" />
//                             </div>
//                         </CardContent>
//                         <CardFooter className="pt-0 px-4 pb-4">
//                             <div className="flex w-full items-center justify-between text-xs">
//                                 <span className="dark:text-neutral-400 text-foreground">This month</span>
//                                 <span className="text-emerald-400 font-mono">+5%</span>
//                             </div>
//                         </CardFooter>
//                     </Card>
//
//                 </div>
//
//                 {/* Single campaign card aligned with top metrics */}
//                 <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 flex-1 flex flex-col">
//                     <CardHeader className="pb-0">
//                         <div className="flex items-center justify-between">
//                             <CardTitle className="text-sm text-white">{campaigns[0].name}</CardTitle>
//                             <Badge className="bg-white/10 text-neutral-200">{campaigns[0].tasks} tasks</Badge>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="flex-1">
//                         {(() => {
//                             const c = campaigns[0];
//                             const chartData = [{ key: "progress", value: c.percent, fill: c.fill }];
//                             const chartConfig: ChartConfig = { progress: { label: "Progress", color: "hsl(var(--chart-2))" } };
//                             return (
//                                 <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[220px]">
//                                     <RadialBarChart data={chartData} startAngle={90} endAngle={450} innerRadius={80} outerRadius={110}>
//                                         <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" polarRadius={[86, 74]} />
//                                         <RadialBar dataKey="value" background cornerRadius={10} />
//                                         <PolarRadiusAxis domain={[0, 100]} tick={false} tickLine={false} axisLine={false}>
//                                             <Label
//                                                 content={({ viewBox }) => {
//                                                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                                                         return (
//                                                             <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
//                                                                 <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
//                                                                     {c.percent}%
//                                                                 </tspan>
//                                                                 <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-xs">
//                                                                     complete
//                                                                 </tspan>
//                                                             </text>
//                                                         );
//                                                     }
//                                                     return null;
//                                                 }}
//                                             />
//                                         </PolarRadiusAxis>
//                                     </RadialBarChart>
//                                 </ChartContainer>
//                             );
//                         })()}
//                     </CardContent>
//                 </Card>
//             </div>
//
//
//
//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//                 <div className="lg:col-span-2 space-y-6">
//                     <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700">
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-sm dark:text-neutral-300 tracking-wider">Recent Transactions</CardTitle>
//                         </CardHeader>
//                         <CardContent className="divide-y dark:divide-neutral-800 p-0">
//                             {recentTransactions.map((tx) => (
//                                 <div key={tx.id} className="flex items-center justify-between px-4 py-3">
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-9 h-9 rounded-full dark:bg-neutral-800 bg-secondary shadow flex items-center justify-center">
//                                             <CreditCard className="w-4 h-4 text-foreground dark:text-neutral-300" />
//                                         </div>
//                                         <div>
//                                             <div className="text-sm dark:text-white text-foreground">{tx.title}</div>
//                                             <div className="text-xs dark:text-neutral-400 text-foreground">{tx.date}</div>
//                                         </div>
//                                     </div>
//                                     <div className={`text-sm font-mono ${tx.type === "credit" ? "text-emerald-400" : "text-rose-400"}`}>
//                                         {tx.type === "credit" ? "+" : "-"}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                     </div>
//                                 </div>
//                             ))}
//                         </CardContent>
//                     </Card>
//
//                     <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700">
//                         <CardHeader className="pb-2">
//                             <CardTitle className="text-sm dark:text-neutral-300 text-foreground tracking-wider">Latest Task</CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="flex items-start justify-between">
//                                 <div>
//                                     <div className="dark:text-white text-foreground font-medium">{latestTask.title}</div>
//                                     <div className="text-xs dark:text-neutral-400 text-foreground mt-1">Due {latestTask.due}</div>
//                                 </div>
//                                 <Badge className="bg-orange-500/20 text-orange-400">{latestTask.status}</Badge>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs text-foreground dark:text-neutral-400 mt-3">
//                                 <Timer className="w-4 h-4" />
//                                 <span>Stay on track to keep campaigns moving.</span>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//
//                 <div className="lg:col-span-2 flex flex-col min-h-full">
//                     <div>
//                         <Card className="dark:bg-neutral-900 bg-card border dark:border-neutral-700 overflow-hidden">
//                             <CardHeader className="pb-2">
//                                 <CardTitle className="text-sm dark:text-neutral-300 text-foreground tracking-wider">Calendar</CardTitle>
//                             </CardHeader>
//                             <CardContent>
//                                 <Calendar />
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
//
//
