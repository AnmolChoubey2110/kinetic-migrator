import type { Metadata } from "next";
import { StagingScreen } from "@/components/staging/StagingScreen";

export const metadata: Metadata = {
  title: "Data Staging Center | Kinetic Migrator",
  description:
    "Stage legacy source data alongside target structures for AI-assisted mapping and validation.",
};

export default function StagingPage() {
  return <StagingScreen />;
}
