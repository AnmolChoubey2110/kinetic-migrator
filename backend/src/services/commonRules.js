/**
 * Application-defined common rules for every uploaded field.
 * Always applied — independent of AI output.
 * Canonical shape uses ruleName + source = "PREDEFINED".
 */

export const RULE_SOURCE = {
  PREDEFINED: "PREDEFINED",
  AI: "AI",
};

export const COMMON_RULE_IDS = {
  TRIM: "COMMON-TRIM",
  NULL_EMPTY: "COMMON-NULL-EMPTY",
  DUPLICATE: "COMMON-DUPLICATE",
};

function isKeyField(field) {
  return String(field?.key ?? "").toUpperCase() === "X";
}

export function buildPredefinedRulesForField(field) {
  const key = isKeyField(field);

  return [
    {
      ruleName: "Trim Whitespace",
      source: RULE_SOURCE.PREDEFINED,
      ruleId: COMMON_RULE_IDS.TRIM,
      type: "transformation",
      description: "Remove leading and trailing spaces from the field value.",
      severity: "warning",
    },
    {
      ruleName: "Null/Empty Value Check",
      source: RULE_SOURCE.PREDEFINED,
      ruleId: COMMON_RULE_IDS.NULL_EMPTY,
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
      ruleId: COMMON_RULE_IDS.DUPLICATE,
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

/** @deprecated use buildPredefinedRulesForField */
export const buildCommonRulesForField = buildPredefinedRulesForField;
