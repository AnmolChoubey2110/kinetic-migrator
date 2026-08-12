import { signInCopy } from "@/lib/mock/signin";

export function SystemStatus() {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 font-mono-data text-mono-data text-on-surface-variant/60">
      <div className="h-2 w-2 animate-pulse rounded-full bg-status-online shadow-[0_0_5px_#4ade80]" />
      <span>{signInCopy.systemStatus}</span>
    </div>
  );
}
