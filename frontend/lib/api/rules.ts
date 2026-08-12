import { API_BASE } from "./config";
import { authHeaders, parseJson, readApiError } from "./http";
import type { FieldMetadata, FieldRule } from "@/lib/rules/commonRules";

export const BUSINESS_OBJECTS = ["MM", "PO", "GL Account", "BP"] as const;
export type BusinessObject = (typeof BUSINESS_OBJECTS)[number];

export type SourceFieldsJson = Record<
  string,
  { fields: FieldMetadata[] } | FieldMetadata[]
>;

export type FieldRulesBundle = {
  fieldName: string;
  metadata: FieldMetadata;
  rules: FieldRule[];
  /** @deprecated legacy */
  commonRules?: FieldRule[];
  /** @deprecated legacy */
  aiRules?: FieldRule[];
};

export type GeneratedRules = {
  businessObject: string;
  fields: FieldRulesBundle[];
};

export type GenerateRulesResponse = {
  businessObject: BusinessObject;
  sourceFields: SourceFieldsJson;
  rules: GeneratedRules;
  persisted: boolean;
  message?: string;
};

export type SavedRuleSet = {
  id: string;
  business_object: string;
  rules: GeneratedRules | Record<string, unknown>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export function getFieldsFromSource(
  businessObject: string,
  sourceFields: SourceFieldsJson,
): FieldMetadata[] {
  const block = sourceFields?.[businessObject];
  if (Array.isArray(block)) return block;
  if (block && Array.isArray(block.fields)) return block.fields;
  return [];
}

export async function generateRules(businessObject: BusinessObject, file: File) {
  const body = new FormData();
  body.append("businessObject", businessObject);
  body.append("file", file);

  const response = await fetch(`${API_BASE}/api/rules/generate`, {
    method: "POST",
    headers: authHeaders(),
    body,
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<GenerateRulesResponse>(response);
}

export async function saveRules(payload: {
  businessObject: BusinessObject;
  rules: GeneratedRules;
}) {
  const response = await fetch(`${API_BASE}/api/rules/save`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      businessObject: payload.businessObject,
      rules: payload.rules,
    }),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<{ message: string; ruleSet: SavedRuleSet }>(response);
}

export async function listSavedRules(businessObject?: BusinessObject) {
  const query = businessObject
    ? `?businessObject=${encodeURIComponent(businessObject)}`
    : "";
  const response = await fetch(`${API_BASE}/api/rules${query}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readApiError(response));
  }

  return parseJson<{ rules: SavedRuleSet[] }>(response);
}
