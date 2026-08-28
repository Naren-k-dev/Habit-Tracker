import { apiRequest } from "./api";

import type { Habit } from "../types/habit";
import type { HabitCompletion } from "../types/habitCompletion";
import type { TrackingPeriod } from "../types/trackingPeriod";

// ==========================================
// DASHBOARD SUMMARY TYPE
// ==========================================

export interface DashboardSummary {
  today: {
    date: string;
    total_habits: number;
    completed_habits: number;
    progress_percentage: number;
  };

  current_streak: number;

  period: {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    current_day: number;
    total_days: number;
  };
}


// ==========================================
// GET DASHBOARD DATA
// ==========================================

export async function getDashboardData(): Promise<{
  habits: Habit[];
  periods: TrackingPeriod[];
}> {
  const [habits, periods] = await Promise.all([
    apiRequest<Habit[]>(
      "/api/habits/me"
    ),

    apiRequest<TrackingPeriod[]>(
      "/api/tracking-periods"
    ),
  ]);

  return {
    habits,
    periods,
  };
}


// ==========================================
// GET TODAY COMPLETIONS
// ==========================================

export async function getTodayCompletions(
  date: string
): Promise<HabitCompletion[]> {
  return apiRequest<HabitCompletion[]>(
    `/api/habit-completions/date/${date}`
  );
}


// ==========================================
// UPDATE HABIT COMPLETION
// ==========================================

export async function updateHabitCompletion(
  habitId: number,
  date: string,
  completed: boolean
): Promise<HabitCompletion> {
  return apiRequest<HabitCompletion>(
    "/api/habit-completions",
    {
      method: "POST",

      body: JSON.stringify({
        habit_id: habitId,
        completion_date: date,
        completed,
      }),
    }
  );
}


// ==========================================
// GET DASHBOARD SUMMARY
// ==========================================

export async function getDashboardSummary(): Promise<DashboardSummary> {
  return apiRequest<DashboardSummary>(
    "/api/dashboard/summary"
  );
}