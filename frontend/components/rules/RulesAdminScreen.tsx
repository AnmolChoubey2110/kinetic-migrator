"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthBackground } from "@/components/auth/AuthBackground";
import { FieldRulesReview } from "@/components/rules/FieldRulesReview";
import { Button } from "@/components/ui/Button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Icon } from "@/components/ui/Icon";
import { getAuthToken } from "@/lib/api/http";
import {
  BUSINESS_OBJECTS,
  generateRules,
  getFieldsFromSource,
  listSavedRules,
  saveRules,
  type BusinessObject,
  type GenerateRulesResponse,
  type SavedRuleSet,
} from "@/lib/api/rules";
import { ensureFieldRulesCanonical } from "@/lib/rules/commonRules";

export function RulesAdminScreen() {
  const router = useRouter();
  const [businessObject, setBusinessObject] = useState<BusinessObject>("MM");
  const [file, setFile] = useState<File | null>(null);
  const [draft, setDraft] = useState<GenerateRulesResponse | null>(null);
  const [saved, setSaved] = useState<SavedRuleSet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/signin");
      return;
    }

    listSavedRules()
      .then((result) => setSaved(result.rules))
      .catch(() => {
        /* list is secondary */
      });
  }, [router]);

  const reviewFields = useMemo(() => {
    if (!draft?.rules?.fields) return [];
    return ensureFieldRulesCanonical(draft.rules.fields);
  }, [draft]);

  const fieldCount = useMemo(() => {
    if (!draft) return 0;
    return getFieldsFromSource(draft.businessObject, draft.sourceFields).length;
  }, [draft]);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setStatus(null);

    if (!file) {
      setError("Upload an Excel file with field metadata");
      return;
    }

    setGenerating(true);
    try {
      const result = await generateRules(businessObject, file);
      const withCanonical: GenerateRulesResponse = {
        ...result,
        rules: {
          businessObject: result.rules?.businessObject || result.businessObject,
          fields: ensureFieldRulesCanonical(result.rules?.fields || []),
        },
      };
      setDraft(withCanonical);
      setStatus(
        withCanonical.message ||
          "Rules generated. Review by field below, then click Save to persist.",
      );
    } catch (err) {
      setDraft(null);
      setError(err instanceof Error ? err.message : "Failed to generate rules");
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!draft) return;
    setError(null);
    setStatus(null);
    setSaving(true);

    try {
      const payload = {
        businessObject: draft.businessObject,
        rules: {
          businessObject: draft.businessObject,
          fields: ensureFieldRulesCanonical(draft.rules.fields),
        },
      };
      const result = await saveRules(payload);
      setStatus(
        `Saved ${result.ruleSet.business_object}: field names + AI rules only (${result.ruleSet.id})`,
      );
      setSaved((current) => [result.ruleSet, ...current]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save rules");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-background">
      <AuthBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-section-padding py-10">
        <header className="flex flex-col gap-2">
          <p className="font-label-caps text-label-caps tracking-[0.12em] text-primary">
            Kinetic Migrator
          </p>
          <h1 className="font-display-lg text-display-lg text-on-surface">
            Validation Rule Studio
          </h1>
          <p className="max-w-2xl font-body-md text-body-md text-on-surface-variant">
            Select a Business Object, upload Excel for generation, review
            predefined + AI rules, then Save. Database stores only Business
            Object, field names, and AI rules (Excel data is not saved).
          </p>
        </header>

        <GlassPanel className="flex flex-col gap-6 p-8">
          <form className="flex flex-col gap-5" onSubmit={handleGenerate}>
            <label className="flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Business Object
              </span>
              <select
                className="rounded-lg border border-outline-variant bg-surface-container-high px-3 py-3 font-body-md text-body-md text-on-surface outline-none focus:border-primary"
                value={businessObject}
                onChange={(event) =>
                  setBusinessObject(event.target.value as BusinessObject)
                }
              >
                {BUSINESS_OBJECTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                Excel metadata file
              </span>
              <input
                type="file"
                accept=".xlsx,.xls,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                className="rounded-lg border border-dashed border-outline-variant bg-surface-container px-3 py-4 font-body-sm text-body-sm text-on-surface file:mr-4 file:rounded file:border-0 file:bg-brand-blue file:px-3 file:py-1.5 file:font-semibold file:text-white"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Columns: Field Name, Data Type, Length, Default Value, Key (X =
                key field)
              </span>
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={generating}>
                <Icon name="auto_awesome" className="text-[20px]" />
                {generating ? "Generating…" : "Generate rules"}
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={!draft || saving}
                onClick={handleSave}
              >
                <Icon name="save" className="text-[20px]" />
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>

          {error ? (
            <p className="font-body-sm text-body-sm text-error" role="alert">
              {error}
            </p>
          ) : null}
          {status ? (
            <p
              className="font-body-sm text-body-sm text-status-online"
              role="status"
            >
              {status}
            </p>
          ) : null}
        </GlassPanel>

        {draft ? (
          <GlassPanel className="flex flex-col gap-5 p-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Review rules by field
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {draft.businessObject} · {fieldCount} fields · nothing is saved
                until you click Save
              </p>
            </div>

            <FieldRulesReview fields={reviewFields} />

            <details className="rounded-lg border border-outline-variant/40 bg-surface-container/40 p-3">
              <summary className="cursor-pointer font-body-sm text-body-sm text-on-surface-variant">
                View what will be saved (Business Object + field + AI rules only)
              </summary>
              <pre className="mt-3 max-h-64 overflow-auto font-mono-data text-mono-data text-on-surface-variant">
                {JSON.stringify(
                  {
                    businessObject: draft.businessObject,
                    fields: reviewFields.map((f) => ({
                      fieldName: f.fieldName,
                      rules: (f.rules || [])
                        .filter((r) => String(r.source).toUpperCase() === "AI")
                        .map((r) => ({
                          ruleName: r.ruleName,
                          source: "AI",
                          description: r.description,
                          constraint: r.constraint,
                          severity: r.severity,
                        })),
                    })),
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </GlassPanel>
        ) : null}

        {saved.length > 0 ? (
          <GlassPanel className="flex flex-col gap-4 p-8">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Saved rule sets
            </h2>
            <ul className="flex flex-col gap-3">
              {saved.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 border-b border-outline-variant/40 pb-3"
                >
                  <div>
                    <p className="font-body-md text-body-md text-on-surface">
                      {item.business_object}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {item.id} · {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </GlassPanel>
        ) : null}
      </div>
    </div>
  );
}
