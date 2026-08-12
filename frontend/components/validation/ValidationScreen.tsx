"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { ActiveRulesetCard } from "@/components/validation/ActiveRulesetCard";
import { AiAssistantPanel } from "@/components/validation/AiAssistantPanel";
import { CleaningReport } from "@/components/validation/CleaningReport";
import { ExecuteCleaningButton } from "@/components/validation/ExecuteCleaningButton";
import { SourceDataUpload } from "@/components/validation/SourceDataUpload";
import { ValidationPageHeader } from "@/components/validation/ValidationPageHeader";

export function ValidationScreen() {
  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface antialiased">
      <SideNav activeKey="validate" />
      <TopAppBar variant="validation" assistantOpen={assistantOpen} />
      <AiAssistantPanel
        open={assistantOpen}
        onClose={() => setAssistantOpen(false)}
      />

      <main
        className={`min-h-screen w-full overflow-y-auto pt-16 pl-sidebar-width transition-[padding] duration-300 ${
          assistantOpen ? "xl:pr-assistant-panel-width" : "pr-0"
        }`}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-section-padding md:p-8">
          <ValidationPageHeader />

          <div className="grid grid-cols-12 gap-4">
            <SourceDataUpload />
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
              <ActiveRulesetCard />
              <ExecuteCleaningButton />
            </div>
          </div>

          <CleaningReport onSuggestAi={() => setAssistantOpen(true)} />
        </div>
      </main>
    </div>
  );
}
