"use client";

import { Minus } from "lucide-react";

interface TagCategoryProps {
  title: string;
  tags: string[];
  editable?: boolean;
}

export function TagCategory({ title, tags, editable = false }: TagCategoryProps) {
  return (
    <div>
      <p className="text-zinc-400 text-sm mb-2 flex justify-between items-center">
        {title}
        {editable && (
          <span className="text-orange-400 text-xs cursor-pointer hover:text-orange-300">
            Edit
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg text-orange-300 text-xs font-medium flex items-center gap-1.5"
          >
            {tag}
            {editable && (
              <button className="hover:text-orange-400 cursor-pointer ml-1">
                <Minus className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
