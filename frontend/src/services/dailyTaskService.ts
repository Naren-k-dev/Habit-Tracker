import { apiRequest } from "./api";

import type {
  DailyTask,
  DailyTaskCreate,
  DailyTaskUpdate,
} from "../types/dailyTask";


// ==========================================
// GET TASKS FOR A DATE
// ==========================================

export async function getDailyTasks(
  taskDate: string
): Promise<DailyTask[]> {

  return apiRequest<DailyTask[]>(
    `/api/tasks?task_date=${taskDate}`
  );
}


// ==========================================
// GET SINGLE TASK
// ==========================================

export async function getDailyTask(
  taskId: number
): Promise<DailyTask> {

  return apiRequest<DailyTask>(
    `/api/tasks/${taskId}`
  );
}


// ==========================================
// CREATE TASK
// ==========================================

export async function createDailyTask(
  taskData: DailyTaskCreate
): Promise<DailyTask> {

  return apiRequest<DailyTask>(
    "/api/tasks",
    {
      method: "POST",

      body: JSON.stringify(
        taskData
      ),
    }
  );
}


// ==========================================
// UPDATE TASK
// ==========================================

export async function updateDailyTask(
  taskId: number,
  taskData: DailyTaskUpdate
): Promise<DailyTask> {

  return apiRequest<DailyTask>(
    `/api/tasks/${taskId}`,
    {
      method: "PATCH",

      body: JSON.stringify(
        taskData
      ),
    }
  );
}


// ==========================================
// COMPLETE TASK
// ==========================================

export async function completeDailyTask(
  taskId: number
): Promise<DailyTask> {

  return apiRequest<DailyTask>(
    `/api/tasks/${taskId}/complete`,
    {
      method: "POST",
    }
  );
}


// ==========================================
// DELETE TASK
// ==========================================

export async function deleteDailyTask(
  taskId: number
): Promise<void> {

  await apiRequest<void>(
    `/api/tasks/${taskId}`,
    {
      method: "DELETE",
    }
  );
}