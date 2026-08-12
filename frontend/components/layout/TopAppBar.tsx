import Image from "next/image";
import { Icon } from "@/components/ui/Icon";
import { workspaceCopy } from "@/lib/mock/workspace";

type TopAppBarProps = {
  variant?: "staging" | "preview" | "validation" | "reports" | "admin";
  pageTitle?: string;
  assistantOpen?: boolean;
};

export function TopAppBar({
  variant = "staging",
  pageTitle,
  assistantOpen = false,
}: TopAppBarProps) {
  const isPreview = variant === "preview";
  const isValidation = variant === "validation";
  const isReports = variant === "reports";
  const isAdmin = variant === "admin";

  if (isAdmin) {
    return (
      <header
        className={`fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px] transition-[right] duration-300 md:left-sidebar-width ${
          assistantOpen ? "xl:right-assistant-panel-width" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-headline-md text-headline-md font-black tracking-tight text-primary">
            {workspaceCopy.productName}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="mr-4 hidden flex-col items-end border-r border-white/10 pr-6 xl:flex">
            <span className="flex items-center gap-1.5 font-label-caps text-label-caps text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {workspaceCopy.systemHealthy}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant opacity-70">
              {workspaceCopy.statusOnline}
            </span>
          </div>
          <button
            type="button"
            className="group relative cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full border border-surface bg-error transition-colors group-hover:border-primary" />
          </button>
          <button
            type="button"
            className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
    );
  }

  if (isReports) {
    return (
      <header className="fixed top-0 right-0 left-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-8 shadow-sm md:left-sidebar-width">
        <div className="flex flex-1 items-center gap-8">
          <Image
            src="/workspace-logo.png"
            alt={workspaceCopy.logoAlt}
            width={32}
            height={32}
            className="h-8 w-auto object-contain"
          />
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-4 lg:flex">
            <span className="flex items-center gap-2 font-mono-data text-mono-data text-tertiary">
              <span className="h-2 w-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(255,184,113,0.6)]" />
              {workspaceCopy.systemHealthy}
            </span>
            <span className="flex items-center gap-2 font-mono-data text-mono-data text-on-surface">
              <span className="h-2 w-2 rounded-full bg-on-surface" />
              {workspaceCopy.statusOnline}
            </span>
          </div>
          <div className="mx-2 hidden h-6 w-px bg-outline-variant lg:block" />
          <button
            type="button"
            className="cursor-pointer text-on-surface transition-all hover:text-white"
            aria-label="Notifications"
          >
            <Icon name="notifications" />
          </button>
          <button
            type="button"
            className="mr-4 cursor-pointer text-on-surface transition-all hover:text-white"
            aria-label="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>
    );
  }

  if (isValidation) {
    return (
      <header
        className={`fixed top-0 right-0 left-sidebar-width z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px] transition-[right] duration-300 ${
          assistantOpen ? "xl:right-assistant-panel-width" : ""
        }`}
      >
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md font-black text-primary">
            {workspaceCopy.productName}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-status-healthy" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {workspaceCopy.systemHealthy}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              {workspaceCopy.statusOnline}
            </span>
          </div>
          <div className="ml-2 flex items-center gap-3">
            <div className="ml-2 h-8 w-8 overflow-hidden rounded-full border border-white/20">
              <Image
                src="/user-avatar.png"
                alt={workspaceCopy.avatarAlt}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className={
        isPreview
          ? "fixed top-0 right-0 left-sidebar-width z-30 flex h-16 items-center justify-between border-b border-white/5 bg-surface/40 px-8 shadow-sm backdrop-blur-[40px]"
          : "fixed top-0 right-0 left-0 z-30 hidden h-16 items-center justify-between border-b border-outline-variant bg-surface px-8 shadow-sm md:left-sidebar-width md:flex"
      }
    >
      <div className="flex items-center gap-4">
        <span
          className={
            isPreview
              ? "font-headline-md text-headline-md font-black tracking-tight text-primary"
              : "font-headline-md text-headline-md font-black text-white"
          }
        >
          {workspaceCopy.productName}
        </span>
        {!isPreview && pageTitle ? (
          <>
            <div className="mx-2 h-6 w-px bg-outline-variant" />
            <h2 className="font-headline-sm text-headline-sm text-on-surface">
              {pageTitle}
            </h2>
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-6">
        <div
          className={
            isPreview
              ? "flex items-center gap-2"
              : "flex items-center gap-2 font-body-sm text-body-sm font-bold text-on-surface-variant"
          }
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span
            className={
              isPreview
                ? "font-body-sm text-body-sm text-on-surface"
                : undefined
            }
          >
            {workspaceCopy.systemHealthy}
          </span>
        </div>
        <div
          className={
            isPreview
              ? "flex items-center gap-2"
              : "flex items-center gap-2 font-body-sm text-body-sm font-bold text-on-surface-variant"
          }
        >
          <span
            className={
              isPreview
                ? "font-body-sm text-body-sm text-on-surface-variant"
                : undefined
            }
          >
            {workspaceCopy.statusOnline}
          </span>
        </div>

        {isPreview ? (
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
            </button>
            <button
              type="button"
              className="cursor-pointer text-on-surface-variant transition-all hover:text-primary"
              aria-label="Settings"
            >
              <Icon name="settings" />
            </button>
          </div>
        ) : (
          <>
            <div className="mx-2 h-6 w-px bg-outline-variant" />
            <button
              type="button"
              className="cursor-pointer text-on-surface-variant transition-all hover:text-white"
              aria-label="Notifications"
            >
              <Icon name="notifications" />
            </button>
            <button
              type="button"
              className="cursor-pointer text-on-surface-variant transition-all hover:text-white"
              aria-label="Settings"
            >
              <Icon name="settings" />
            </button>
            <div className="ml-2 h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-outline">
              <Image
                src="/user-avatar.png"
                alt={workspaceCopy.avatarAlt}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
