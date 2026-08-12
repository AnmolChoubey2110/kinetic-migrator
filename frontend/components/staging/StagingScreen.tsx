import { SideNav } from "@/components/layout/SideNav";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { StagingPageHeader } from "@/components/staging/StagingPageHeader";
import { TransformationDocuments } from "@/components/staging/TransformationDocuments";
import { UploadZoneCard } from "@/components/staging/UploadZoneCard";
import { ValidationPipeline } from "@/components/staging/ValidationPipeline";
import { stagingCopy, uploadZones } from "@/lib/mock/staging";

export function StagingScreen() {
  return (
    <div className="flex min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <SideNav activeKey="upload" />
      <TopAppBar variant="staging" pageTitle={stagingCopy.pageTitle} />

      <main className="flex min-h-screen w-full flex-col bg-background pt-16 md:pl-sidebar-width">
        <div className="mx-auto flex w-full max-w-[1600px] flex-grow flex-col gap-6 p-section-padding lg:p-container-margin">
          <StagingPageHeader />

          <div className="grid min-h-[300px] grid-cols-1 gap-6 lg:grid-cols-2">
            {uploadZones.map((zone) => (
              <UploadZoneCard key={zone.id} zone={zone} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ValidationPipeline />
            <TransformationDocuments />
          </div>
        </div>
      </main>
    </div>
  );
}
