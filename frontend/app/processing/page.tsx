import type { Metadata } from "next";
import { ProcessingScreen } from "@/components/processing/ProcessingScreen";

export const metadata: Metadata = {
  title: "Processing Data | Kinetic Migrator",
  description: "Refining legacy data before migration pipeline results.",
};

export default function ProcessingPage() {
  return <ProcessingScreen />;
}
