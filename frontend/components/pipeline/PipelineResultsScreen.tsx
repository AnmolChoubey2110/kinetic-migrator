"use client";

import { useEffect, useMemo, useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { PipelineIssuesTable } from "@/components/pipeline/PipelineIssuesTable";
import { PipelineMetricsRow } from "@/components/pipeline/PipelineMetricsRow";
import { PipelineResultsHeader } from "@/components/pipeline/PipelineResultsHeader";
import {
  downloadComparisonPdf,
  fetchComparisonReport,
  type ComparisonReport,
  type ComparisonSummary,
} from "@/lib/api/comparisons";
import { getActiveBatch } from "@/lib/session/batch";
import type { PipelineIssue, PipelineMetric } from "@/lib/mock/pipeline";

function count(items: unknown[] | undefined) {
  return Array.isArray(items) ? items.length : 0;
}

function buildMetrics(summary: ComparisonSummary | null): PipelineMetric[] {
  const missing = count(summary?.missingRecords);
  const mismatches = count(summary?.valueMismatches);
  const extras = count(summary?.extraRecords);
  const missingValues = count(summary?.missingValues);
  const totalIssues = missing + mismatches + extras + missingValues;
  const health = Math.max(0, Math.min(100, 100 - Math.min(totalIssues, 100)));

  return [
    {
      id: "errors",
      label: "Total Issues",
      value: String(totalIssues),
      icon: "error",
      tone: "error",
      footer: {
        kind: "trend",
        direction: "up",
        text: `${mismatches} value mismatches`,
      },
    },
    {
      id: "lost",
      label: "Missing Records",
      value: String(missing),
      icon: "warning",
      tone: "tertiary",
      footer: {
        kind: "progress",
        percentWidth: `${Math.min(missing, 100)}%`,
        label: `${missingValues} missing values`,
      },
    },
    {
      id: "schema",
      label: "Extra Records",
      value: String(extras),
      icon: "schema",
      tone: "primary",
      footer: {
        kind: "trend",
        direction: "down",
        text: `${count(summary?.duplicateRecords)} postload duplicates`,
      },
    },
    {
      id: "health",
      label: "Overall Health",
      value: String(health),
      icon: "health_and_safety",
      tone: "health",
      footer: {
        kind: "health",
        status: health >= 80 ? "Stable" : "Needs review",
        target: "Target: 99.9%",
        score: health,
      },
    },
  ];
}

function buildIssues(summary: ComparisonSummary | null): PipelineIssue[] {
  if (!summary) return [];

  const issues: PipelineIssue[] = [];

  for (const item of summary.missingRecords || []) {
    const row = item as { identifier?: Record<string, unknown> };
    issues.push({
      id: `missing-${issues.length}`,
      severity: "critical",
      category: "Missing Record",
      description: `Preload record missing in postload: ${JSON.stringify(row.identifier ?? {})}`,
      affectedRecords: "1",
      status: "pending",
    });
  }

  for (const item of summary.valueMismatches || []) {
    const row = item as {
      identifier?: Record<string, unknown>;
      field?: string;
      expectedValue?: unknown;
      actualValue?: unknown;
    };
    issues.push({
      id: `mismatch-${issues.length}`,
      severity: "high",
      category: "Value Mismatch",
      description: `Field ${row.field}: expected ${String(row.expectedValue)} vs actual ${String(row.actualValue)} (${JSON.stringify(row.identifier ?? {})})`,
      affectedRecords: "1",
      status: "investigating",
    });
  }

  for (const item of summary.extraRecords || []) {
    const row = item as { identifier?: Record<string, unknown> };
    issues.push({
      id: `extra-${issues.length}`,
      severity: "medium",
      category: "Extra Record",
      description: `Postload-only record: ${JSON.stringify(row.identifier ?? {})}`,
      affectedRecords: "1",
      status: "pending",
    });
  }

  for (const item of summary.missingValues || []) {
    const row = item as {
      identifier?: Record<string, unknown>;
      field?: string;
    };
    issues.push({
      id: `missing-value-${issues.length}`,
      severity: "low",
      category: "Missing Value",
      description: `Field ${row.field} empty in postload (${JSON.stringify(row.identifier ?? {})})`,
      affectedRecords: "1",
      status: "pending",
    });
  }

  return issues.slice(0, 50);
}

export function PipelineResultsScreen() {
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const batchId = getActiveBatch()?.batchId;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const active = getActiveBatch();
      if (!active?.batchId) {
        setError("No active batch. Upload files from Staging first.");
        setLoading(false);
        return;
      }

      try {
        const next = await fetchComparisonReport(active.batchId);
        if (!cancelled) setReport(next);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load report");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = useMemo(
    () => buildMetrics(report?.summary_json ?? null),
    [report],
  );
  const issues = useMemo(
    () => buildIssues(report?.summary_json ?? null),
    [report],
  );

  async function handleDownloadPdf() {
    const active = getActiveBatch();
    if (!active?.batchId) return;
    setDownloading(true);
    try {
      const blob = await downloadComparisonPdf(active.batchId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `comparison-report-${active.batchId}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "PDF download failed");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-container-lowest text-white antialiased">
      <SideNav activeKey="reports" />
      <TopAppBar variant="reports" />

      <main className="min-h-screen bg-background p-section-padding pt-[88px] transition-all duration-300 md:ml-sidebar-width">
        <div className="mx-auto max-w-[1600px]">
          <PipelineResultsHeader
            batchId={batchId || report?.batch_id || "—"}
            onDownloadPdf={report ? handleDownloadPdf : undefined}
            downloading={downloading}
          />

          {loading ? (
            <p className="mb-6 font-body-md text-body-md text-on-surface">
              Loading report…
            </p>
          ) : null}

          {error ? (
            <p className="mb-6 font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}

          {report?.status === "failed" ? (
            <p className="mb-6 font-body-sm text-body-sm text-error" role="alert">
              Comparison failed: {report.error_message || "Unknown error"}
            </p>
          ) : null}

          {report?.ai_report_text ? (
            <div className="mb-container-margin rounded-xl border border-outline-variant bg-surface-container p-6">
              <h3 className="mb-3 font-headline-sm text-headline-sm text-white">
                AI Summary
              </h3>
              <pre className="whitespace-pre-wrap font-body-md text-body-md text-on-surface">
                {report.ai_report_text}
              </pre>
            </div>
          ) : null}

          <PipelineMetricsRow metrics={metrics} />
          <PipelineIssuesTable issues={issues} />
        </div>
      </main>
    </div>
  );
}
