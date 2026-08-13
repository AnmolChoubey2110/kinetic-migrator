/**
 * Maps SAP detector labels (MATERIAL_MASTER, …) to validation_rules
 * business_object values (MM, PO, …).
 */
export const DETECTOR_TO_RULES_BO = Object.freeze({
  MATERIAL_MASTER: "MM",
  PURCHASE_ORDER: "PO",
  GL_ACCOUNT: "GL Account",
  BUSINESS_PARTNER: "BP",
});

export const RULES_BO_TO_DETECTOR = Object.freeze({
  MM: "MATERIAL_MASTER",
  PO: "PURCHASE_ORDER",
  "GL Account": "GL_ACCOUNT",
  BP: "BUSINESS_PARTNER",
});

export function mapDetectorToRulesBusinessObject(detectorLabel) {
  const key = String(detectorLabel || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");
  return DETECTOR_TO_RULES_BO[key] || null;
}
