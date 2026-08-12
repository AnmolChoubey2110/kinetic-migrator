import type { FieldRulesBundle } from "@/lib/api/rules";
import {
  splitRulesBySource,
  type FieldRule,
} from "@/lib/rules/commonRules";

function RuleList({
  title,
  rules,
  emptyLabel,
}: {
  title: string;
  rules: FieldRule[];
  emptyLabel: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-label-caps text-label-caps tracking-[0.08em] text-primary">
        {title}
      </h4>
      {rules.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {emptyLabel}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rules.map((rule, index) => (
            <li
              key={`${rule.ruleName}-${rule.source}-${index}`}
              className="rounded-lg border border-outline-variant/40 bg-surface-container px-3 py-2"
            >
              <p className="font-body-md text-body-md text-on-surface">
                {rule.ruleName}
                <span className="ml-2 font-body-sm text-body-sm text-on-surface-variant">
                  [{String(rule.source)}]
                </span>
                {rule.severity ? (
                  <span className="ml-2 font-body-sm text-body-sm text-on-surface-variant">
                    ({String(rule.severity)})
                  </span>
                ) : null}
              </p>
              {rule.description ? (
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {rule.description}
                </p>
              ) : null}
              {rule.constraint ? (
                <p className="mt-1 font-mono-data text-mono-data text-on-surface-variant">
                  {rule.constraint}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function FieldRulesReview({ fields }: { fields: FieldRulesBundle[] }) {
  return (
    <div className="flex flex-col gap-4">
      {fields.map((field) => {
        const { predefined, ai } = splitRulesBySource(field.rules || []);

        return (
          <article
            key={field.fieldName}
            className="rounded-xl border border-outline-variant/50 bg-surface-container-low/60 p-4"
          >
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {field.fieldName}
                  {String(field.metadata?.key || "").toUpperCase() === "X" ? (
                    <span className="ml-2 rounded bg-brand-blue/20 px-2 py-0.5 font-body-sm text-body-sm text-primary">
                      KEY
                    </span>
                  ) : null}
                </h3>
                <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
                  {field.metadata?.dataType || "—"}
                  {field.metadata?.length !== "" && field.metadata?.length != null
                    ? ` · len ${field.metadata.length}`
                    : ""}
                  {field.metadata?.defaultValue
                    ? ` · default ${field.metadata.defaultValue}`
                    : ""}
                </p>
              </div>
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
              <RuleList
                title="Predefined rules"
                rules={predefined}
                emptyLabel="Predefined rules unavailable"
              />
              <RuleList
                title="AI-generated rules"
                rules={ai}
                emptyLabel="No additional AI rules for this field"
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
