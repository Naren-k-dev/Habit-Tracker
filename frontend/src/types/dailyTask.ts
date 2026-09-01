// ==========================================
// TASK TYPES
// ==========================================

export type TaskPriority =
  | "low"
  | "medium"
  | "high";


export type TaskCategory =
  | "AI / ML"
  | "DSA"
  | "College"
  | "Personal"
  | "Fitness"
  | "Project"
  | "Other";


// ==========================================
// DAILY TASK
// ==========================================

export interface DailyTask {

  id: number;

  user_id: number;

  tracking_period_id: number;

  title: string;

  description: string | null;

  task_date: string;

  due_date: string | null;

  priority: TaskPriority;

  category: TaskCategory;

  completed: boolean;

  completed_at: string | null;

  created_at: string;
}


// ==========================================
// CREATE TASK
// ==========================================

export interface DailyTaskCreate {

  tracking_period_id: number;

  title: string;

  description?: string | null;

  task_date: string;

  due_date?: string | null;

  priority?: TaskPriority;

  category?: TaskCategory;
}


// ==========================================
// UPDATE TASK
// ==========================================

export interface DailyTaskUpdate {

  title?: string;

  description?: string | null;

  task_date?: string;

  due_date?: string | null;

  priority?: TaskPriority;

  category?: TaskCategory;

  completed?: boolean;
}