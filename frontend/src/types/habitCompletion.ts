export type HabitCompletion = {
  id: number;
  habit_id: number;
  completion_date: string;
  completed: boolean;
  completed_at: string | null;
};

export type HabitCompletionCreate = {
  habit_id: number;
  completion_date: string;
  completed: boolean;
};