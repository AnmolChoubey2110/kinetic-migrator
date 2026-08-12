import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { stagingCopy } from "@/lib/mock/staging";

export function StagingPageHeader() {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h1 className="mb-2 font-display-lg text-display-lg text-white">
          {stagingCopy.heading}
        </h1>
        <p className="max-w-2xl font-body-md text-body-md font-bold text-on-surface">
          {stagingCopy.description}
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/processing"
          className="flex items-center gap-2 rounded-DEFAULT bg-primary-container px-6 py-2 font-headline-sm text-headline-sm font-bold text-on-primary-container shadow-[0_0_20px_rgba(32,152,221,0.4)] transition-colors hover:bg-primary"
        >
          <Icon name="rocket_launch" />
          {stagingCopy.processLabel}
        </Link>
      </div>
    </div>
  );
}
