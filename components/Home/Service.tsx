import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ServiceProps {
  index: string;
  title: string;
}

export default function Service({ index, title }: ServiceProps) {
  return (
    <li>
      <Link
        href="/services"
        className="group flex items-center gap-4 p-5 sm:p-6 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 min-h-[72px] touch-manipulation"
      >
        <span className="text-sm font-semibold text-primary tabular-nums">{index}</span>
        <span className="flex-1 text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </span>
        <span className="rounded-full p-2 bg-muted group-hover:bg-primary/20 transition-colors">
          <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
        </span>
      </Link>
    </li>
  );
}
