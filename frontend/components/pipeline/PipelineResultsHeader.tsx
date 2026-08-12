import { Icon } from "@/components/ui/Icon";
import { pipelineCopy } from "@/lib/mock/pipeline";

export function PipelineResultsHeader() {
  return (
    <div className="mb-container-margin flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <h2 className="mb-2 font-display-lg text-display-lg text-white">
          {pipelineCopy.pageTitle}
        </h2>
        <p className="flex flex-wrap items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
          <Icon name="check_circle" className="text-[20px] text-primary" />
          <span>{pipelineCopy.analysisPrefix}</span>
          <span className="rounded border border-outline-variant bg-surface-container-high px-2 py-1 font-mono-data text-mono-data text-primary-fixed">
            {pipelineCopy.batchId}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-4 py-2.5 font-headline-sm text-headline-sm text-white transition-colors hover:bg-surface-container-high"
        >
          <Icon name="table_view" />
          {pipelineCopy.downloadXlsLabel}
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container px-4 py-2.5 font-headline-sm text-headline-sm text-white transition-colors hover:bg-surface-container-high"
        >
          <Icon name="description" />
          {pipelineCopy.downloadWordLabel}
        </button>
      </div>
    </div>
  );
}
