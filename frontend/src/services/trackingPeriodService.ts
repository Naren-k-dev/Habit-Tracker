import { apiRequest } from "./api";

import type {
  TrackingPeriod,
} from "../types/trackingPeriod";

export async function getMyTrackingPeriods(): Promise<
  TrackingPeriod[]
> {
  return apiRequest<TrackingPeriod[]>(
    "/api/tracking-periods"
  );
}