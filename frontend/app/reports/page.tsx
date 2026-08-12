import type { Metadata } from "next";
import { PipelineResultsScreen } from "@/components/pipeline/PipelineResultsScreen";

export const metadata: Metadata = {
  title: "Migration Pipeline Results | Kinetic Migrator",
  description:
    "Review migration health metrics and identified pipeline issues.",
};

export default function ReportsPage() {
  return <PipelineResultsScreen />;
}
