import { apiRequest } from "./api";

import type {
  Habit,
  HabitCreate,
} from "../types/habit";

export type HabitUpdate = {
  tracking_period_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
};


export async function getMyHabits(): Promise<Habit[]> {
  return apiRequest<Habit[]>(
    "/api/habits/me"
  );
}


export async function createHabit(
  habitData: HabitCreate
): Promise<Habit> {

  return apiRequest<Habit>(
    "/api/habits",
    {
      method: "POST",

      body: JSON.stringify(
        habitData
      ),
    }
  );
}


export async function updateHabit(
  habitId: number,
  habitData: HabitUpdate
): Promise<Habit> {

  return apiRequest<Habit>(
    `/api/habits/${habitId}`,
    {
      method: "PATCH",

      body: JSON.stringify(
        habitData
      ),
    }
  );
}


export async function toggleHabitActive(
  habit: Habit
): Promise<Habit> {

  return updateHabit(
    habit.id,
    {
      tracking_period_id:
        habit.tracking_period_id,

      name:
        habit.name,

      description:
        habit.description || "",

      start_date:
        habit.start_date,

      end_date:
        habit.end_date || undefined,

      is_active:
        !habit.is_active,
    }
  );
}