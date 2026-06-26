import type { PlasticType, RecyclingDelivery } from "../recycling.model";

export function isPlasticType(value: unknown): value is PlasticType {
  return value === "PET" || value === "HDPE" || value === "LDPE" || value === "PP" || value === "mixed";
}

export function toRecyclingDelivery(raw: Record<string, unknown>): RecyclingDelivery | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  const studentEmail = typeof raw.studentEmail === "string" ? raw.studentEmail : "";
  const weightGrams = typeof raw.weightGrams === "number" ? raw.weightGrams : 0;
  const plasticType = isPlasticType(raw.plasticType) ? raw.plasticType : "mixed";
  const greenPointsAwarded = typeof raw.greenPointsAwarded === "number" ? raw.greenPointsAwarded : 0;

  if (!id || !studentEmail) return null;

  const registeredAtRaw = raw.registeredAt;
  const registeredAt = (
    registeredAtRaw &&
    typeof registeredAtRaw === "object" &&
    typeof (registeredAtRaw as Record<string, unknown>).seconds === "number"
      ? { seconds: (registeredAtRaw as Record<string, unknown>).seconds as number }
      : null
  );

  return {
    id,
    studentEmail,
    weightGrams,
    plasticType,
    greenPointsAwarded,
    registeredAt,
  };
}

export function parseRecyclingDeliveries(data: Record<string, unknown>[]): RecyclingDelivery[] {
  return data
    .map((item) => toRecyclingDelivery(item))
    .filter((item): item is RecyclingDelivery => item !== null);
}
