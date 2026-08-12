import type { Metadata } from "next";
import { ValidationScreen } from "@/components/validation/ValidationScreen";

export const metadata: Metadata = {
  title: "Data Validation Center | Kinetic Migrator",
  description:
    "Upload raw legacy data for cleaning according to validation rules.",
};

export default function ValidationPage() {
  return <ValidationScreen />;
}
