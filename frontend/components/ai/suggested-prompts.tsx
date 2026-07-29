"use client";

import { cn } from "@/lib/utils";

type SuggestedPromptsProps = {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
};

export function SuggestedPrompts({
  prompts,
  onSelect,
  disabled,
}: SuggestedPromptsProps) {
  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className={cn(
            "rounded-full border border-fantasy-200/15 bg-tobago-800/60 px-3 py-1.5 text-left text-xs text-fantasy-100/90 transition",
            "hover:border-rose-400/40 hover:text-rose-200 active:scale-[0.98]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
