"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  pipelineCopy,
  pipelineIssues,
  pipelineSeverityStyles,
  type PipelineIssue,
  type PipelineIssueStatus,
} from "@/lib/mock/pipeline";

function StatusCell({ status }: { status: PipelineIssueStatus }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-tertiary-container">
        <span className="h-1.5 w-1.5 rounded-full bg-tertiary-container" />
        Pending
      </span>
    );
  }

  if (status === "investigating") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-primary">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        Investigating
      </span>
    );
  }

  if (status === "resolved") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-on-surface">
        <Icon name="check" className="text-[14px]" />
        Resolved
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-medium text-on-surface">
      <Icon name="schedule" className="text-[14px]" />
      Ignored
    </span>
  );
}

function IssueRow({ issue }: { issue: PipelineIssue }) {
  const severity = pipelineSeverityStyles[issue.severity];

  return (
    <tr className="group transition-colors hover:bg-surface-container-highest">
      <td className="p-4">
        <span
          className={`inline-flex items-center justify-center rounded border px-2 py-1 font-label-caps text-label-caps font-bold ${severity.className}`}
        >
          {severity.label}
        </span>
      </td>
      <td className="p-4 font-medium text-white">{issue.category}</td>
      <td className="p-4 text-on-surface">{issue.description}</td>
      <td className="p-4 text-right font-mono-data text-mono-data font-bold text-white">
        {issue.affectedRecords}
      </td>
      <td className="p-4 text-center">
        <StatusCell status={issue.status} />
      </td>
      <td className="p-4 text-right">
        <button
          type="button"
          className="text-on-surface opacity-0 transition-colors group-hover:opacity-100 hover:text-white"
          aria-label={`Open ${issue.category}`}
        >
          <Icon name="chevron_right" className="text-[20px]" />
        </button>
      </td>
    </tr>
  );
}

export function PipelineIssuesTable() {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const rows = criticalOnly
    ? pipelineIssues.filter((issue) => issue.severity === "critical")
    : pipelineIssues;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container">
      <div className="flex flex-col gap-4 border-b border-outline-variant bg-surface-container-high p-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-headline-sm text-headline-sm font-bold text-white">
          {pipelineCopy.issuesTitle}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCriticalOnly(false)}
            className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-highest px-3 py-1.5 font-label-caps text-label-caps text-white transition-colors hover:bg-surface-bright"
          >
            <Icon name="filter_list" className="text-[14px]" />
            {pipelineCopy.filterAllLabel}
          </button>
          <button
            type="button"
            onClick={() => setCriticalOnly(true)}
            className="flex items-center gap-1 rounded-full border border-error bg-surface-container-highest px-3 py-1.5 font-label-caps text-label-caps text-error transition-colors hover:bg-surface-bright"
          >
            {pipelineCopy.filterCriticalLabel}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-container-high">
              <th className="w-24 whitespace-nowrap p-4 font-label-caps text-label-caps font-semibold tracking-wider text-on-surface uppercase">
                Severity
              </th>
              <th className="whitespace-nowrap p-4 font-label-caps text-label-caps font-semibold tracking-wider text-on-surface uppercase">
                Category
              </th>
              <th className="w-1/3 p-4 font-label-caps text-label-caps font-semibold tracking-wider text-on-surface uppercase">
                Issue Description
              </th>
              <th className="whitespace-nowrap p-4 text-right font-label-caps text-label-caps font-semibold tracking-wider text-on-surface uppercase">
                Affected Records
              </th>
              <th className="whitespace-nowrap p-4 text-center font-label-caps text-label-caps font-semibold tracking-wider text-on-surface uppercase">
                Status
              </th>
              <th className="w-12 p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface-container font-body-md text-body-md">
            {rows.map((issue) => (
              <IssueRow key={issue.id} issue={issue} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-high p-4">
        <span className="font-body-sm text-body-sm text-on-surface">
          {criticalOnly
            ? `Showing 1-${rows.length} of ${rows.length} issues`
            : pipelineCopy.paginationLabel}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="rounded p-1 text-on-surface hover:bg-surface-container-highest disabled:opacity-50"
            aria-label="Previous page"
          >
            <Icon name="chevron_left" />
          </button>
          <button
            type="button"
            className="rounded p-1 text-white hover:bg-surface-container-highest"
            aria-label="Next page"
          >
            <Icon name="chevron_right" />
          </button>
        </div>
      </div>
    </div>
  );
}
