"use client";

import { useState } from "react";
import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { PreviewActionBar } from "@/components/preview/PreviewActionBar";
import { PreviewControls } from "@/components/preview/PreviewControls";
import { PreviewTablePane } from "@/components/preview/PreviewTablePane";
import { previewPanes, type PreviewPane } from "@/lib/mock/preview";

export function PreviewScreen() {
  const [activePaneId, setActivePaneId] =
    useState<PreviewPane["id"]>("preload");

  return (
    <div className="overflow-hidden bg-background text-on-surface antialiased">
      <SideNav activeKey="display" />
      <TopAppBar variant="preview" />

      <main className="ml-0 flex h-screen flex-col overflow-y-auto px-section-padding pt-[88px] pb-container-margin md:ml-sidebar-width md:px-container-margin">
        <PreviewActionBar
          panes={previewPanes}
          activePaneId={activePaneId}
          onTabChange={setActivePaneId}
        />
        <PreviewControls />
        <div className="relative min-h-0 flex-1">
          {previewPanes.map((pane) => (
            <PreviewTablePane
              key={pane.id}
              pane={pane}
              visible={pane.id === activePaneId}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
