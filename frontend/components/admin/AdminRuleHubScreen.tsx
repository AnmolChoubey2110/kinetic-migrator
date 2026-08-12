"use client";

import { useState } from "react";
import { AdminAiAssistantPanel } from "@/components/admin/AdminAiAssistantPanel";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSideNav } from "@/components/admin/AdminSideNav";
import { BusinessObjectCard } from "@/components/admin/BusinessObjectCard";
import { SourceDataRulesCard } from "@/components/admin/SourceDataRulesCard";
import { ValidationSelectionCard } from "@/components/admin/ValidationSelectionCard";
import { TopAppBar } from "@/components/layout/TopAppBar";

export function AdminRuleHubScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased selection:bg-primary selection:text-on-primary">
      <AdminSideNav activeKey="admin" />
      <TopAppBar variant="admin" assistantOpen={assistantOpen} />
      <AdminAiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <main
        className={`relative flex min-h-screen flex-col pt-16 transition-[padding] duration-300 md:ml-sidebar-width ${
          assistantOpen ? "xl:pr-assistant-panel-width" : "pr-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] space-y-6 p-section-padding">
          <AdminPageHeader />

          <div className="grid grid-cols-12 gap-grid-gutter">
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <SourceDataRulesCard />
            </div>
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-6">
              <BusinessObjectCard />
            </div>
            <div className="col-span-12">
              <ValidationSelectionCard
                onSuggestAi={() => setAssistantOpen(true)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
