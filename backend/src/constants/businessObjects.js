export const BUSINESS_OBJECTS = ["MM", "PO", "GL Account", "BP"];

export function isBusinessObject(value) {
  return BUSINESS_OBJECTS.includes(value);
}
