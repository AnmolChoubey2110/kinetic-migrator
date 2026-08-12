import { Icon } from "@/components/ui/Icon";
import { adminCopy, sourceFieldRules } from "@/lib/mock/admin";

const iconToneClass = {
  primary: "text-primary",
  tertiary: "text-tertiary",
  error: "text-error",
} as const;

export function SourceDataRulesCard() {
  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-white/10 bg-surface/60 backdrop-blur-[20px]">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] p-5">
        <div>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">
            {adminCopy.sourceRulesTitle}
          </h3>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant opacity-80">
            {adminCopy.sourceRulesSubtitle}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-0">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 border-b border-white/5 bg-surface/90 backdrop-blur-md">
            <tr>
              <th className="px-5 py-3 font-label-caps text-label-caps text-on-surface-variant">
                Field Name
              </th>
              <th className="px-5 py-3 font-label-caps text-label-caps text-on-surface-variant">
                Data Type
              </th>
              <th className="px-5 py-3 text-right font-label-caps text-label-caps text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data text-on-surface">
            {sourceFieldRules.map((field) => (
              <tr
                key={field.id}
                className="group border-b border-white/5 transition-colors hover:bg-white/5"
              >
                <td className="flex items-center gap-2 px-5 py-3">
                  <Icon
                    name="data_object"
                    className={`text-sm opacity-50 ${iconToneClass[field.iconTone]}`}
                  />
                  {field.name}
                </td>
                <td className="px-5 py-3 text-primary opacity-80">
                  {field.dataType}
                </td>
                <td className="px-5 py-3 text-right">
                  <button
                    type="button"
                    className="text-on-surface-variant transition-colors group-hover:text-primary"
                    aria-label={`Edit ${field.name}`}
                  >
                    <Icon name="edit" className="text-[18px]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center border-t border-white/5 bg-surface-container-lowest/50 p-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary transition-all hover:bg-primary-fixed"
        >
          <Icon name="upload_file" className="text-[18px]" />
          {adminCopy.uploadRulesLabel}
        </button>
      </div>
    </div>
  );
}
