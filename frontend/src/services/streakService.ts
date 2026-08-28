import { apiRequest } from "./api";

export interface OverallStreak {
  current_streak: number;
  longest_streak: number;
}

export async function getOverallStreak(
  endDate: string
): Promise<OverallStreak> {
  return apiRequest<OverallStreak>(
    `/api/streaks/overall?end_date=${endDate}`
  );
}