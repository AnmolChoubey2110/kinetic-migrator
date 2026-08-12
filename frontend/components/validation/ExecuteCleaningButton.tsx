import { Icon } from "@/components/ui/Icon";
import { validationCopy } from "@/lib/mock/validation";

export function ExecuteCleaningButton() {
  return (
    <button
      type="button"
      className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary py-4 font-headline-sm text-headline-sm text-on-primary shadow-[0_0_20px_rgba(144,205,255,0.2)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(144,205,255,0.4)]"
    >
      <div className="absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 ease-in-out group-hover:translate-y-0" />
      <Icon name="play_circle" filled className="relative z-10" />
      <span className="relative z-10">{validationCopy.executeLabel}</span>
    </button>
  );
}
