export type PlasticType = "PET" | "HDPE" | "LDPE" | "PP" | "mixed";

export interface RecyclingDelivery {
  id: string;
  studentEmail: string;
  weightGrams: number;
  plasticType: PlasticType;
  greenPointsAwarded: number;
  registeredAt: { seconds: number } | null;
}
