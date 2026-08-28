export interface Habit {
  id: number;
  user_id: number;
  tracking_period_id: number;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface HabitCreate {
  tracking_period_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
}