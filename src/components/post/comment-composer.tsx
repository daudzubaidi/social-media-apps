"use client";

import { useMemo, useState } from "react";
import { Smile } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS = [
  "😀",
  "😁",
  "😂",
  "😍",
  "🥳",
  "😎",
  "🤔",
  "👍",
  "👏",
  "🔥",
  "🎉",
  "❤️",
  "🙌",
  "🙏",
  "💯",
  "✨",
  "👀",
  "😅",
];

interface CommentComposerProps {
  onSubmit: (text: string) => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CommentComposer({
  onSubmit,
  isPending = false,
  disabled = false,
  className,
}: CommentComposerProps) {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const trimmedText = useMemo(() => text.trim(), [text]);
  const submitDisabled = !trimmedText || disabled || isPending;

  function handleSubmit() {
    if (submitDisabled) return;
    onSubmit(trimmedText);
    setText("");
    setShowEmojiPicker(false);
  }

  return (
    <div className={cn("relative", className)}>
      {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 z-20 w-[210px] rounded-xl border border-neutral-900 bg-neutral-950 p-4">
          <div className="grid grid-cols-6 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="rounded-md p-1 text-base transition-colors hover:bg-accent"
                onClick={() => setText((currentText) => `${currentText}${emoji}`)}
                aria-label={`Insert ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((isOpen) => !isOpen)}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border border-neutral-900 bg-neutral-950 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || isPending}
          aria-label="Toggle emoji picker"
        >
          <Smile className="size-6" />
        </button>

        <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-xl border border-neutral-900 bg-neutral-950 px-4">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Add Comment"
            disabled={disabled || isPending}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            className="h-full min-w-0 flex-1 bg-transparent text-base font-medium leading-[30px] text-foreground placeholder:text-neutral-600 focus:outline-none disabled:cursor-not-allowed"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitDisabled}
            className={cn(
              "w-[102px] shrink-0 text-right text-base font-bold leading-7 tracking-[-0.32px] transition-opacity sm:w-[172px]",
              submitDisabled ? "text-neutral-600" : "text-primary",
              "disabled:cursor-not-allowed disabled:opacity-60",
            )}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
