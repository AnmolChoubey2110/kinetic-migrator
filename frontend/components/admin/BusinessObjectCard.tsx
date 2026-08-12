"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  adminCopy,
  businessObjectOptions,
} from "@/lib/mock/admin";

export function BusinessObjectCard() {
  const [selectedId, setSelectedId] = useState(
    businessObjectOptions[0]?.id ?? "",
  );

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 backdrop-blur-[20px]">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {adminCopy.businessObjectTitle}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
            {adminCopy.businessObjectSubtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-auto p-4">
        {businessObjectOptions.map((option) => {
          const selected = option.id === selectedId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedId(option.id)}
              className="group w-full cursor-pointer rounded-lg border border-white/5 bg-white/5 p-4 text-left transition-all hover:border-primary/30"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
                    selected ? "border-primary" : "border-white/20"
                  }`}
                >
                  {selected ? (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                </div>
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {option.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center border-t border-white/5 bg-surface-container-lowest/50 p-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary transition-all hover:bg-primary-fixed"
        >
          <Icon name="check_circle" className="text-[18px]" />
          {adminCopy.confirmSelectionLabel}
        </button>
      </div>
    </div>
  );
}
