import type { Metadata } from "next";
import { SignInScreen } from "@/components/auth/SignInScreen";

export const metadata: Metadata = {
  title: "Sign In | Kinetic Migrator",
  description: "Sign in to access the Kinetic Migrator Enterprise Console.",
};

export default function SignInPage() {
  return <SignInScreen />;
}
