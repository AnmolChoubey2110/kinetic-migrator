import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { PipelineIssuesTable } from "@/components/pipeline/PipelineIssuesTable";
import { PipelineMetricsRow } from "@/components/pipeline/PipelineMetricsRow";
import { PipelineResultsHeader } from "@/components/pipeline/PipelineResultsHeader";

export function PipelineResultsScreen() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-container-lowest text-white antialiased">
      <SideNav activeKey="reports" />
      <TopAppBar variant="reports" />

      <main className="min-h-screen bg-background p-section-padding pt-[88px] transition-all duration-300 md:ml-sidebar-width">
        <div className="mx-auto max-w-[1600px]">
          <PipelineResultsHeader />
          <PipelineMetricsRow />
          <PipelineIssuesTable />
        </div>
      </main>
    </div>
  );
}
