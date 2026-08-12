/**
 * Frontend helpers for predefined rules + canonical field rule shape.
 */

export const RULE_SOURCE = {
  PREDEFINED: "PREDEFINED",
  AI: "AI",
} as const;

export type RuleSource = (typeof RULE_SOURCE)[keyof typeof RULE_SOURCE];

export type FieldMetadata = {
  key?: string;
  fieldName: string;
  dataType: string;
  length?: string | number | null;
  defaultValue?: string | null;
};

export type FieldRule = {
  ruleName: string;
  source: RuleSource | string;
  ruleId?: string;
  type?: string;
  description?: string;
  constraint?: string;
  severity?: string;
  keyEnforced?: boolean;
};

function isKeyField(field: FieldMetadata) {
  return String(field?.key ?? "").toUpperCase() === "X";
}

export function buildPredefinedRulesForField(field: FieldMetadata): FieldRule[] {
  const key = isKeyField(field);

  return [
    {
      ruleName: "Trim Whitespace",
      source: RULE_SOURCE.PREDEFINED,
      ruleId: "COMMON-TRIM",
      type: "transformation",
      description: "Remove leading and trailing spaces from the field value.",
      severity: "warning",
    },
    {
      ruleName: "Null/Empty Value Check",
      source: RULE_SOURCE.PREDEFINED,
      ruleId: "COMMON-NULL-EMPTY",
      type: "validation",
      description: key
        ? "Key field must not contain null or empty values."
        : "Validate null or empty values for this field.",
      constraint: key ? "NOT_NULL_OR_EMPTY" : "FLAG_NULL_OR_EMPTY",
      keyEnforced: key,
      severity: key ? "error" : "warning",
    },
    {
      ruleName: "Duplicate Check",
      source: RULE_SOURCE.PREDEFINED,
      ruleId: "COMMON-DUPLICATE",
      type: "validation",
      description: key
        ? "Key field must not contain duplicate values across the uploaded file."
        : "Check duplicate values across the complete uploaded file.",
      constraint: key ? "UNIQUE_REQUIRED" : "FLAG_DUPLICATES",
      keyEnforced: key,
      severity: key ? "error" : "warning",
    },
  ];
}

export function ensureFieldRulesCanonical(
  fields: Array<{
    fieldName: string;
    metadata?: FieldMetadata;
    rules?: FieldRule[];
    commonRules?: Array<Record<string, unknown>>;
    aiRules?: Array<Record<string, unknown>>;
  }>,
) {
  return fields.map((entry) => {
    const metadata =
      entry.metadata ||
      ({ fieldName: entry.fieldName, dataType: "" } as FieldMetadata);

    if (Array.isArray(entry.rules) && entry.rules.length > 0) {
      const hasPredefined = entry.rules.some(
        (r) => String(r.source).toUpperCase() === RULE_SOURCE.PREDEFINED,
      );
      if (hasPredefined) {
        return {
          fieldName: entry.fieldName,
          metadata,
          rules: entry.rules,
        };
      }
      return {
        fieldName: entry.fieldName,
        metadata,
        rules: [...buildPredefinedRulesForField(metadata), ...entry.rules],
      };
    }

    const predefined = buildPredefinedRulesForField(metadata);
    const fromCommon = (entry.commonRules || []).map((rule, index) => ({
      ruleName: String(rule.ruleName || rule.rule || `Predefined ${index + 1}`),
      source: RULE_SOURCE.PREDEFINED,
      ...rule,
    }));
    const fromAi = (entry.aiRules || []).map((rule, index) => ({
      ruleName: String(rule.ruleName || rule.rule || `AI Rule ${index + 1}`),
      source: RULE_SOURCE.AI,
      ...rule,
    }));

    return {
      fieldName: entry.fieldName,
      metadata,
      rules:
        fromCommon.length || fromAi.length
          ? [...(fromCommon.length ? fromCommon : predefined), ...fromAi]
          : predefined,
    };
  });
}

export function splitRulesBySource(rules: FieldRule[] = []) {
  return {
    predefined: rules.filter(
      (r) => String(r.source).toUpperCase() === RULE_SOURCE.PREDEFINED,
    ),
    ai: rules.filter((r) => String(r.source).toUpperCase() === RULE_SOURCE.AI),
  };
}
