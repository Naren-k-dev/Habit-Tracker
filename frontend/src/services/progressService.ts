import { apiRequest } from "./api";

export interface DailyHabitProgress {
  habit_id: number;
  habit_name: string;
  status: string;
}

export interface DailyProgress {
  date: string;
  total_habits: number;
  completed_habits: number;
  missed_habits: number;
  pending_habits: number;
  progress_percentage: number;
  habits: DailyHabitProgress[];
}

export interface WeeklyDayProgress {
  date: string;
  total_habits: number;
  completed_habits: number;
  missed_habits: number;
  pending_habits: number;
  progress_percentage: number;
}

export interface WeeklyProgress {
  week_start: string;
  week_end: string;
  total_habits: number;
  total_completed: number;
  total_missed: number;
  total_pending: number;
  progress_percentage: number;
  days: WeeklyDayProgress[];
}

// ==========================================
// MONTHLY PROGRESS TYPES
// ==========================================

export interface MonthlyDayProgress {
  date: string;
  total_habits: number;
  completed_habits: number;
  missed_habits: number;
  pending_habits: number;
  progress_percentage: number;
}

export interface MonthlyHabitProgress {
  habit_id: number;
  habit_name: string;
  total_days: number;
  completed_days: number;
  missed_days: number;
  pending_days: number;
  progress_percentage: number;
}

export interface MonthlyProgress {
  month_start: string;
  month_end: string;
  total_habits: number;
  total_completed: number;
  total_missed: number;
  total_pending: number;
  progress_percentage: number;
  days: MonthlyDayProgress[];
  habit_progress: MonthlyHabitProgress[];
}

export async function getDailyProgress(
  date: string
): Promise<DailyProgress> {
  return apiRequest<DailyProgress>(
    `/api/progress/daily/${date}`
  );
}

export async function getWeeklyProgress(
  weekStart: string
): Promise<WeeklyProgress> {
  return apiRequest<WeeklyProgress>(
    `/api/progress/weekly/${weekStart}`
  );
}

export async function getMonthlyProgress(
  monthStart: string
): Promise<MonthlyProgress> {
  return apiRequest<MonthlyProgress>(
    `/api/progress/monthly/${monthStart}`
  );
}