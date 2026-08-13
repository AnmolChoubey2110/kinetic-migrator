import type { Metadata } from "next";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { PipelineResultsScreen } from "@/components/pipeline/PipelineResultsScreen";

export const metadata: Metadata = {
  title: "Migration Pipeline Results | Kinetic Migrator",
  description:
    "Review migration health metrics and identified pipeline issues.",
};

export default function ReportsPage() {
  return (
    <RequireAuth roles={["normal_user"]}>
      <PipelineResultsScreen />
    </RequireAuth>
  );
}
