import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  message?: string;
}

export function LoadingState({ className, message }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-8", className)}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary-300/20 blur-xl" />
        <Loader2 className="relative size-10 animate-spin text-primary-300" strokeWidth={2.5} />
      </div>
      {message && (
        <p className="text-sm font-medium text-neutral-400">{message}</p>
      )}
    </div>
  );
}
