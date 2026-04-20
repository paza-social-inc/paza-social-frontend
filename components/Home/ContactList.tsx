"use client";

import { cn } from "@/lib/utils";

type ContactItem = { title: string; value: string };

const hoverStyles =
  "relative overflow-hidden group py-4 px-3 sm:py-5 sm:px-4 rounded-lg transition-colors duration-300";

export function ContactList({
  items,
  className,
}: {
  items: ContactItem[];
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            hoverStyles,
            "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 cursor-pointer"
          )}
        >
          <span className="absolute inset-0 bg-primary/5 dark:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
          <span className="text-base sm:text-xl font-medium text-white z-10">
            {item.title}
          </span>
          <span className="text-sm sm:text-base text-zinc-400 z-10">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
