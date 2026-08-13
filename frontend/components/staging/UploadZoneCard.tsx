"use client";

import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import type { UploadZoneConfig } from "@/lib/mock/staging";

type UploadZoneCardProps = {
  zone: UploadZoneConfig;
  fileName?: string | null;
  disabled?: boolean;
  onFileSelected?: (file: File) => void;
};

export function UploadZoneCard({
  zone,
  fileName = null,
  disabled = false,
  onFileSelected,
}: UploadZoneCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const badgeClass =
    zone.badgeTone === "secondary"
      ? "border-secondary/30 bg-secondary/20 text-secondary"
      : "border-primary/30 bg-primary/20 text-primary";
  const iconTone =
    zone.headerIconTone === "secondary" ? "text-secondary" : "text-primary";

  function openPicker() {
    if (disabled) return;
    inputRef.current?.click();
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-high">
            <Icon name={zone.headerIcon} className={iconTone} />
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-white">
              {zone.title}
            </h3>
            <p className="mt-1 font-label-caps text-label-caps font-bold uppercase text-on-surface">
              {zone.subtitle}
            </p>
          </div>
        </div>
        <span
          className={`rounded px-2 py-1 font-label-caps text-label-caps font-bold border ${badgeClass}`}
        >
          {zone.badge}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected?.(file);
        }}
      />

      <div
        className={`upload-zone relative flex flex-grow flex-col items-center justify-center overflow-hidden rounded-lg p-8 ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        }`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={zone.dropTitle}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
      >
        <Icon
          name="cloud_upload"
          className="mb-4 text-4xl text-on-surface transition-transform duration-300 group-hover:-translate-y-2"
        />
        <p className="mb-2 text-center font-headline-sm text-headline-sm text-white">
          {fileName || zone.dropTitle}
        </p>
        <p className="mb-6 text-center font-body-sm text-body-sm font-bold text-on-surface">
          {fileName ? "Click to replace file" : zone.dropHint}
        </p>
        <div className="flex gap-3">
          {zone.formats.map((format) => (
            <span
              key={format.label}
              className="flex items-center gap-1 rounded-full border border-outline-variant bg-surface-container-high px-3 py-1 font-mono-data text-mono-data font-bold text-on-surface"
            >
              <Icon name={format.icon} className="text-[14px]" />
              {format.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
