import {
  useEffect,
  useState,
} from "react";

import {
  getDailyProgress,
  getWeeklyProgress,
} from "../services/progressService";

import type {
  DailyProgress,
  DailyHabitProgress,
  WeeklyProgress,
} from "../services/progressService";

import {
  getOverallStreak,
} from "../services/streakService";

import type {
  OverallStreak,
} from "../services/streakService";


type ViewMode = "daily" | "weekly";


function getLocalDateString(): string {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function getMonday(
  dateString: string
): string {

  const date = new Date(
    `${dateString}T00:00:00`
  );

  const day = date.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  date.setDate(
    date.getDate() + difference
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const dayOfMonth =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${dayOfMonth}`;
}


function addDays(
  dateString: string,
  days: number
): string {

  const date = new Date(
    `${dateString}T00:00:00`
  );

  date.setDate(
    date.getDate() + days
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


function formatDate(
  dateString: string
): string {

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );
}


function formatShortDate(
  dateString: string
): string {

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  );
}


function Progress() {

  // ==========================================
  // VIEW
  // ==========================================

  const [viewMode, setViewMode] =
    useState<ViewMode>("daily");


  // ==========================================
  // DAILY DATE
  // ==========================================

  const [selectedDate, setSelectedDate] =
    useState<string>(
      getLocalDateString()
    );


  // ==========================================
  // WEEKLY DATE
  // ==========================================

  const [selectedWeekStart, setSelectedWeekStart] =
    useState<string>(
      getMonday(
        getLocalDateString()
      )
    );


  // ==========================================
  // DATA
  // ==========================================

  const [dailyProgress, setDailyProgress] =
    useState<DailyProgress | null>(null);

  const [weeklyProgress, setWeeklyProgress] =
    useState<WeeklyProgress | null>(null);

  const [streak, setStreak] =
    useState<OverallStreak | null>(null);


  // ==========================================
  // UI STATE
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD DAILY
  // ==========================================

  async function loadDailyProgress(
  date: string
) {

  try {

    setLoading(true);
    setError("");

    const [progressData, streakData] =
      await Promise.all([
        getDailyProgress(date),
        getOverallStreak(date),
      ]);

    setDailyProgress(progressData);
    setStreak(streakData);

  } catch (err) {

    if (err instanceof Error) {

      setError(
        err.message
      );

    } else {

      setError(
        "Failed to load daily progress"
      );

    }

  } finally {

    setLoading(false);

  }

}

  // ==========================================
  // LOAD WEEKLY
  // ==========================================

  async function loadWeeklyProgress(
    weekStart: string
  ) {

    try {

      setLoading(true);
      setError("");

      const data =
        await getWeeklyProgress(
          weekStart
        );

      setWeeklyProgress(data);

    } catch (err) {

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          "Failed to load weekly progress"
        );

      }

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // LOAD BASED ON VIEW
  // ==========================================

  useEffect(() => {

    if (viewMode === "daily") {

      loadDailyProgress(
        selectedDate
      );

    } else {

      loadWeeklyProgress(
        selectedWeekStart
      );

    }

  }, [
    viewMode,
    selectedDate,
    selectedWeekStart,
  ]);


  // ==========================================
  // DAILY NAVIGATION
  // ==========================================

  function changeDailyDate(
    days: number
  ) {

    setSelectedDate(
      (currentDate) =>
        addDays(
          currentDate,
          days
        )
    );

  }


  // ==========================================
  // WEEKLY NAVIGATION
  // ==========================================

  function changeWeek(
    weeks: number
  ) {

    setSelectedWeekStart(
      (currentWeek) =>
        addDays(
          currentWeek,
          weeks * 7
        )
    );

  }


  // ==========================================
  // STATUS ICON
  // ==========================================

  function getStatusIcon(
    status: string
  ) {

    if (status === "completed") {
      return "✓";
    }

    if (status === "missed") {
      return "✕";
    }

    return "○";
  }


  // ==========================================
  // STATUS LABEL
  // ==========================================

  function getStatusLabel(
    status: string
  ) {

    if (status === "completed") {
      return "Completed";
    }

    if (status === "missed") {
      return "Missed";
    }

    return "Pending";
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="page">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            ANALYTICS
          </p>

          <h2>
            Your Progress
          </h2>

          <p className="page-subtitle">
            Understand your consistency
            over time.
          </p>

        </div>

      </header>


      {/* ======================================
          VIEW TOGGLE
      ====================================== */}

      <div className="progress-view-toggle">

        <button
          type="button"
          className={
            viewMode === "daily"
              ? "progress-view-button active"
              : "progress-view-button"
          }
          onClick={() =>
            setViewMode("daily")
          }
        >
          Daily
        </button>

        <button
          type="button"
          className={
            viewMode === "weekly"
              ? "progress-view-button active"
              : "progress-view-button"
          }
          onClick={() =>
            setViewMode("weekly")
          }
        >
          Weekly
        </button>

      </div>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* ======================================
          DAILY VIEW
      ====================================== */}

      {viewMode === "daily" && (

        <>

          {/* DATE NAVIGATION */}

          <div className="progress-date-navigation">

            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                changeDailyDate(-1)
              }
            >
              ←
            </button>


            <div className="progress-selected-date">

              {formatDate(
                selectedDate
              )}

            </div>


            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                changeDailyDate(1)
              }
            >
              →
            </button>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="empty-panel">

              <div className="empty-icon">
                ◔
              </div>

              <h3>
                Loading progress...
              </h3>

            </div>

          )}


          {/* DATA */}

          {!loading &&
            dailyProgress && (

            <>

              {/* MAIN CARD */}

              <section className="progress-main-card">

                <p className="eyebrow">
                  DAILY PROGRESS
                </p>

                <h3>
                  {dailyProgress.progress_percentage}%
                </h3>

                <p>
                  {dailyProgress.completed_habits}
                  {" "}
                  of
                  {" "}
                  {dailyProgress.total_habits}
                  {" "}
                  habits completed
                </p>


                <div className="progress-bar-container">

                  <div
                    className="progress-bar-fill"
                    style={{
                      width:
                        `${Math.min(
                          dailyProgress.progress_percentage,
                          100
                        )}%`,
                    }}
                  />

                </div>

              </section>


              {/* SUMMARY */}

              <section className="progress-summary-grid">

                <div className="progress-summary-card">

                  <span className="summary-label">
                    COMPLETED
                  </span>

                  <strong>
                    {
                      dailyProgress.completed_habits
                    }
                  </strong>

                  <span className="summary-description">
                    Habits completed
                  </span>

                </div>


                <div className="progress-summary-card">

                  <span className="summary-label">
                    MISSED
                  </span>

                  <strong>
                    {
                      dailyProgress.missed_habits
                    }
                  </strong>

                  <span className="summary-description">
                    Habits missed
                  </span>

                </div>


                <div className="progress-summary-card">

                  <span className="summary-label">
                    PENDING
                  </span>

                  <strong>
                    {
                      dailyProgress.pending_habits
                    }
                  </strong>

                  <span className="summary-description">
                    Habits remaining
                  </span>

                </div>

              </section>

              <section className="streak-card">

                <div className="streak-card-content">

                  <div className="streak-icon">
                    🔥
                  </div>

                  <div>

                    <p className="eyebrow">
                      CURRENT STREAK
                    </p>

                    <h3>
                      {streak?.current_streak ?? 0}
                      {" "}
                      {streak?.current_streak === 1
                        ? "day"
                        : "days"}
                    </h3>

                    <p>
                      Consecutive fully completed days
                    </p>

                  </div>

                </div>


                <div className="streak-best">

                  <span>
                    BEST STREAK
                  </span>

                  <strong>
                    {streak?.longest_streak ?? 0}
                    {" "}
                    {streak?.longest_streak === 1
                      ? "day"
                      : "days"}
                  </strong>

                </div>

              </section>


              {/* DAILY BREAKDOWN */}

              <section className="progress-habits-panel">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Daily Breakdown
                    </h3>

                    <p>
                      See how each habit performed.
                    </p>

                  </div>

                </div>


                {dailyProgress.habits.length === 0 ? (

                  <div className="empty-state">

                    <div className="empty-state-icon">
                      ○
                    </div>

                    <h3>
                      No habits for this day
                    </h3>

                    <p>
                      There were no active habits
                      scheduled for this date.
                    </p>

                  </div>

                ) : (

                  <div className="progress-habits-list">

                    {dailyProgress.habits.map(
                      (
                        habit: DailyHabitProgress
                      ) => (

                        <div
                          className="progress-habit-row"
                          key={habit.habit_id}
                        >

                          <div
                            className={`progress-status-icon ${habit.status}`}
                          >
                            {
                              getStatusIcon(
                                habit.status
                              )
                            }
                          </div>

                          <div className="progress-habit-info">

                            <h4>
                              {
                                habit.habit_name
                              }
                            </h4>

                          </div>

                          <span
                            className={`progress-habit-status ${habit.status}`}
                          >
                            {
                              getStatusLabel(
                                habit.status
                              )
                            }
                          </span>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            </>

          )}

        </>

      )}


      {/* ======================================
          WEEKLY VIEW
      ====================================== */}

      {viewMode === "weekly" && (

        <>

          {/* WEEK NAVIGATION */}

          <div className="progress-date-navigation">

            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                changeWeek(-1)
              }
            >
              ←
            </button>


            <div className="progress-selected-date">

              {weeklyProgress
                ? `${formatShortDate(
                    weeklyProgress.week_start
                  )} – ${formatShortDate(
                    weeklyProgress.week_end
                  )}`
                : `${formatShortDate(
                    selectedWeekStart
                  )} – ${formatShortDate(
                    addDays(
                      selectedWeekStart,
                      6
                    )
                  )}`}

            </div>


            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                changeWeek(1)
              }
            >
              →
            </button>

          </div>


          {/* LOADING */}

          {loading && (

            <div className="empty-panel">

              <div className="empty-icon">
                ◔
              </div>

              <h3>
                Loading weekly progress...
              </h3>

            </div>

          )}


          {/* WEEKLY DATA */}

          {!loading &&
            weeklyProgress && (

            <>

              {/* MAIN WEEKLY CARD */}

              <section className="progress-main-card">

                <p className="eyebrow">
                  WEEKLY PROGRESS
                </p>

                <h3>
                  {
                    weeklyProgress.progress_percentage
                  }%
                </h3>

                <p>
                  {
                    weeklyProgress.total_completed
                  }
                  {" "}
                  of
                  {" "}
                  {
                    weeklyProgress.total_habits
                  }
                  {" "}
                  habit opportunities completed
                </p>


                <div className="progress-bar-container">

                  <div
                    className="progress-bar-fill"
                    style={{
                      width:
                        `${Math.min(
                          weeklyProgress.progress_percentage,
                          100
                        )}%`,
                    }}
                  />

                </div>

              </section>


              {/* WEEKLY SUMMARY */}

              <section className="progress-summary-grid">

                <div className="progress-summary-card">

                  <span className="summary-label">
                    COMPLETED
                  </span>

                  <strong>
                    {
                      weeklyProgress.total_completed
                    }
                  </strong>

                  <span className="summary-description">
                    Completed this week
                  </span>

                </div>


                <div className="progress-summary-card">

                  <span className="summary-label">
                    MISSED
                  </span>

                  <strong>
                    {
                      weeklyProgress.total_missed
                    }
                  </strong>

                  <span className="summary-description">
                    Missed this week
                  </span>

                </div>


                <div className="progress-summary-card">

                  <span className="summary-label">
                    PENDING
                  </span>

                  <strong>
                    {
                      weeklyProgress.total_pending
                    }
                  </strong>

                  <span className="summary-description">
                    Still pending
                  </span>

                </div>

              </section>


              {/* DAILY WEEK BREAKDOWN */}

              <section className="progress-habits-panel">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Weekly Breakdown
                    </h3>

                    <p>
                      Your progress for each day.
                    </p>

                  </div>

                </div>


                <div className="progress-habits-list">

                  {weeklyProgress.days.map(
                    (day) => (

                      <div
                        className="progress-habit-row"
                        key={day.date}
                      >

                        <div
                          className={`progress-status-icon ${
                            day.progress_percentage === 100
                              ? "completed"
                              : day.progress_percentage > 0
                                ? "pending"
                                : "missed"
                          }`}
                        >
                          {
                            day.progress_percentage === 100
                              ? "✓"
                              : day.progress_percentage > 0
                                ? "◐"
                                : "○"
                          }
                        </div>


                        <div className="progress-habit-info">

                          <h4>
                            {
                              new Date(
                                `${day.date}T00:00:00`
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  weekday:
                                    "long",
                                }
                              )
                            }
                          </h4>

                          <p>
                            {
                              formatShortDate(
                                day.date
                              )
                            }
                            {" · "}
                            {
                              day.completed_habits
                            }
                            /
                            {
                              day.total_habits
                            }
                            {" completed"}
                          </p>

                        </div>


                        <span
                          className={`progress-habit-status ${
                            day.progress_percentage === 100
                              ? "completed"
                              : day.progress_percentage > 0
                                ? "pending"
                                : "missed"
                          }`}
                        >
                          {
                            day.progress_percentage
                          }%
                        </span>

                      </div>

                    )
                  )}

                </div>

              </section>

            </>

          )}

        </>

      )}

    </div>

  );
}


export default Progress;