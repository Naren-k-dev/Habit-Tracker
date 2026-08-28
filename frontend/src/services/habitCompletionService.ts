import { apiRequest } from "./api";

import type {
  HabitCompletion,
  HabitCompletionCreate,
} from "../types/habitCompletion";

export async function createOrUpdateCompletion(
  completionData: HabitCompletionCreate
): Promise<HabitCompletion> {
  return apiRequest<HabitCompletion>(
    "/api/habit-completions",
    {
      method: "POST",
      body: JSON.stringify(completionData),
    }
  );
}

export async function getCompletionsByDate(
  date: string
): Promise<HabitCompletion[]> {
  return apiRequest<HabitCompletion[]>(
    `/api/habit-completions/date/${date}`
  );
}

export async function getHabitCompletions(
  habitId: number
): Promise<HabitCompletion[]> {
  return apiRequest<HabitCompletion[]>(
    `/api/habit-completions/habit/${habitId}`
  );
}

export async function getPeriodCompletions(
  trackingPeriodId: number
): Promise<HabitCompletion[]> {
  return apiRequest<HabitCompletion[]>(
    `/api/habit-completions/period/${trackingPeriodId}`
  );
}