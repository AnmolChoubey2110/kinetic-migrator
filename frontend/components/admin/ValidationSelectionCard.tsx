"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  adminCopy,
  aiRecommendedRules,
  validationToggles as initialToggles,
} from "@/lib/mock/admin";

type ValidationSelectionCardProps = {
  onSuggestAi?: () => void;
};

export function ValidationSelectionCard({
  onSuggestAi,
}: ValidationSelectionCardProps) {
  const [toggles, setToggles] = useState(initialToggles);

  function toggleRule(id: string) {
    setToggles((current) =>
      current.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    );
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 backdrop-blur-[20px]">
      <div className="flex flex-col gap-3 border-b border-white/5 bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {adminCopy.validationTitle}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
            {adminCopy.validationSubtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onSuggestAi}
          className="flex items-center gap-2 rounded-lg border border-tertiary/30 bg-tertiary-container px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-tertiary-container transition-all hover:bg-tertiary-container/20"
        >
          <Icon name="smart_toy" className="text-[18px]" />
          {adminCopy.suggestViaAiLabel}
        </button>
      </div>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {toggles.map((toggle) => (
            <div
              key={toggle.id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4 transition-all hover:border-white/10"
            >
              <div className="flex items-center gap-2">
                <Icon name="fact_check" className="text-sm text-secondary" />
                <span className="font-body-md text-body-md font-semibold text-on-surface">
                  {toggle.label}
                </span>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={toggle.enabled}
                  onChange={() => toggleRule(toggle.id)}
                />
                <div className="peer h-5 w-9 rounded-full bg-surface-container-high after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
              </label>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4">
          <h4 className="mb-4 flex items-center gap-2 font-label-caps text-label-caps text-primary">
            <Icon name="smart_toy" className="text-sm" />
            {adminCopy.aiRulesTitle}
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {aiRecommendedRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-3 transition-all hover:border-white/10"
              >
                <div className="flex flex-col">
                  <span className="font-body-md text-body-md font-semibold text-on-surface">
                    {rule.title}
                  </span>
                  <span className="text-[10px] opacity-70">{rule.subtitle}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded bg-primary/20 p-1.5 text-primary transition-colors hover:bg-primary/30"
                    aria-label={`Accept ${rule.title}`}
                  >
                    <Icon name="check" className="text-sm" />
                  </button>
                  <button
                    type="button"
                    className="rounded bg-error/10 p-1.5 text-error transition-colors hover:bg-error/20"
                    aria-label={`Reject ${rule.title}`}
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center border-t border-white/5 bg-surface-container-lowest/50 p-3">
        <span className="font-body-sm text-body-sm text-on-surface-variant italic opacity-70">
          {adminCopy.pendingReviewLabel}
        </span>
      </div>
    </div>
  );
}
