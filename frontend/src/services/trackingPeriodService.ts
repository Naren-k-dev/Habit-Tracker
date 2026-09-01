import { apiRequest } from "./api";

import type {
  TrackingPeriod,
} from "../types/trackingPeriod";


// ==========================================
// GET MY TRACKING PERIODS
// ==========================================

export async function getMyTrackingPeriods(): Promise<
  TrackingPeriod[]
> {

  return apiRequest<TrackingPeriod[]>(
    "/api/tracking-periods"
  );

}


// ==========================================
// CREATE TRACKING PERIOD
// ==========================================

export async function createTrackingPeriod(
  data: {
    name: string;
    start_date: string;
    end_date: string;
  }
): Promise<TrackingPeriod> {

  return apiRequest<TrackingPeriod>(
    "/api/tracking-periods",
    {
      method: "POST",

      body: JSON.stringify({
        name: data.name,
        start_date: data.start_date,
        end_date: data.end_date,
      }),
    }
  );

}


// ==========================================
// UPDATE TRACKING PERIOD
// ==========================================

export async function updateTrackingPeriod(
  periodId: number,
  data: {
    name: string;
    start_date: string;
    end_date: string;
  }
): Promise<TrackingPeriod> {

  return apiRequest<TrackingPeriod>(
    `/api/tracking-periods/${periodId}`,
    {
      method: "PATCH",

      body: JSON.stringify(data),
    }
  );

}


// ==========================================
// UPDATE TRACKING PERIOD STATUS
// ==========================================

export async function updateTrackingPeriodStatus(
  periodId: number,
  isActive: boolean
): Promise<TrackingPeriod> {

  return apiRequest<TrackingPeriod>(
    `/api/tracking-periods/${periodId}/status?is_active=${isActive}`,
    {
      method: "PATCH",
    }
  );

}