import {
  useEffect,
  useState,
} from "react";

import {
  getDailyProgress,
  getWeeklyProgress,
  getMonthlyProgress,
} from "../services/progressService";

import type {
  DailyProgress,
  DailyHabitProgress,
  WeeklyProgress,
  MonthlyProgress,
} from "../services/progressService";

import {
  getOverallStreak,
} from "../services/streakService";

import type {
  OverallStreak,
} from "../services/streakService";


type ViewMode =
  | "daily"
  | "weekly"
  | "monthly";


function getLocalDateString(): string {
  const date = new Date();

  const year =
    date.getFullYear();

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
    day === 0
      ? -6
      : 1 - day;

  date.setDate(
    date.getDate() + difference
  );

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const dayOfMonth = String(
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

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
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


function getMonthStart(
  dateString: string
): string {

  const date = new Date(
    `${dateString}T00:00:00`
  );

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  return `${year}-${month}-01`;
}


function getMonthName(
  dateString: string
): string {

  const date = new Date(
    `${dateString}T00:00:00`
  );

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );
}


function getCalendarDays(
  monthStart: string
): Array<string | null> {

  const date = new Date(
    `${monthStart}T00:00:00`
  );

  const year =
    date.getFullYear();

  const month =
    date.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const lastDay =
    new Date(
      year,
      month + 1,
      0
    );

  const firstWeekday =
    firstDay.getDay();

  const daysInMonth =
    lastDay.getDate();

  const result:
    Array<string | null> = [];

  /*
   * Convert Sunday-first JS calendar
   * into Monday-first calendar.
   */
  const leadingEmptyDays =
    firstWeekday === 0
      ? 6
      : firstWeekday - 1;

  for (
    let i = 0;
    i < leadingEmptyDays;
    i++
  ) {
    result.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const monthNumber =
      String(month + 1)
        .padStart(2, "0");

    const dayNumber =
      String(day)
        .padStart(2, "0");

    result.push(
      `${year}-${monthNumber}-${dayNumber}`
    );
  }

  return result;
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
  // MONTHLY DATE
  // ==========================================

  const [selectedMonthStart, setSelectedMonthStart] =
    useState<string>(() =>
      getMonthStart(
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

  const [monthlyProgress, setMonthlyProgress] =
    useState<MonthlyProgress | null>(null);

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

      const [
        progressData,
        streakData,
      ] = await Promise.all([
        getDailyProgress(date),
        getOverallStreak(date),
      ]);

      setDailyProgress(
        progressData
      );

      setStreak(
        streakData
      );

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

      setWeeklyProgress(
        data
      );

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
  // LOAD MONTHLY
  // ==========================================

  async function loadMonthlyProgress(
    monthStart: string
  ) {

    try {

      setLoading(true);
      setError("");

      const data =
        await getMonthlyProgress(
          monthStart
        );

      setMonthlyProgress(
        data
      );

    } catch (err) {

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          "Failed to load monthly progress"
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
  async function loadProgress() {
    if (viewMode === "daily") {
      await loadDailyProgress(
        selectedDate
      );

      return;
    }

    if (viewMode === "weekly") {
      await loadWeeklyProgress(
        selectedWeekStart
      );

      return;
    }

    if (viewMode === "monthly") {
      await loadMonthlyProgress(
        selectedMonthStart
      );
    }
  }

  void loadProgress();
}, [
  viewMode,
  selectedDate,
  selectedWeekStart,
  selectedMonthStart,
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
  // MONTHLY NAVIGATION
  // ==========================================

  function changeMonth(
    months: number
  ) {

    const date = new Date(
      `${selectedMonthStart}T00:00:00`
    );

    date.setMonth(
      date.getMonth() + months
    );

    setSelectedMonthStart(
      getMonthStart(
        date.toISOString()
          .slice(0, 10)
      )
    );

  }


  // ==========================================
  // STATUS ICON
  // ==========================================

  function getStatusIcon(
    status: string
  ) {

    if (
      status === "completed"
    ) {

      return "✓";

    }

    if (
      status === "missed"
    ) {

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

    if (
      status === "completed"
    ) {

      return "Completed";

    }

    if (
      status === "missed"
    ) {

      return "Missed";

    }

    return "Pending";

  }


  // ==========================================
  // MONTHLY DAY LOOKUP
  // ==========================================

  function getMonthlyDay(
    dateString: string
  ) {

    return monthlyProgress?.days.find(
      (day) =>
        day.date === dateString
    );

  }


  // ==========================================
  // MONTHLY DAY CLASS
  // ==========================================

  function getMonthlyDayClass(
    dateString: string
  ) {

    const day =
      getMonthlyDay(
        dateString
      );

    if (!day) {

      return "monthly-calendar-day inactive";

    }

    /*
     * No applicable habits.
     */
    if (
      day.total_habits === 0
    ) {

      return "monthly-calendar-day inactive";

    }

    if (
      day.progress_percentage === 100
    ) {

      return "monthly-calendar-day completed";

    }

    if (
      day.progress_percentage > 0
    ) {

      return "monthly-calendar-day partial";

    }

    /*
     * Future days with pending habits
     * should not visually appear as missed.
     */
    if (
      day.pending_habits > 0
    ) {

      return "monthly-calendar-day pending";

    }

    return "monthly-calendar-day missed";

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


        <button
          type="button"
          className={
            viewMode === "monthly"
              ? "progress-view-button active"
              : "progress-view-button"
          }
          onClick={() =>
            setViewMode("monthly")
          }
        >
          Monthly
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
                  {
                    dailyProgress
                      .progress_percentage
                  }%
                </h3>

                <p>
                  {
                    dailyProgress
                      .completed_habits
                  }
                  {" "}
                  of
                  {" "}
                  {
                    dailyProgress
                      .total_habits
                  }
                  {" "}
                  habits completed
                </p>


                <div className="progress-bar-container">

                  <div
                    className="progress-bar-fill"
                    style={{
                      width:
                        `${Math.min(
                          dailyProgress
                            .progress_percentage,
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
                      dailyProgress
                        .completed_habits
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
                      dailyProgress
                        .missed_habits
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
                      dailyProgress
                        .pending_habits
                    }
                  </strong>

                  <span className="summary-description">
                    Habits remaining
                  </span>

                </div>

              </section>


              {/* STREAK */}

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
                      {
                        streak?.current_streak
                        ?? 0
                      }
                      {" "}
                      {
                        streak?.current_streak === 1
                          ? "day"
                          : "days"
                      }
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
                    {
                      streak?.longest_streak
                      ?? 0
                    }
                    {" "}
                    {
                      streak?.longest_streak === 1
                        ? "day"
                        : "days"
                    }
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

                    {
                      dailyProgress.habits.map(
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
                      )
                    }

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

              {
                weeklyProgress
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
                    )}`
              }

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
                    weeklyProgress
                      .progress_percentage
                  }%
                </h3>

                <p>
                  {
                    weeklyProgress
                      .total_completed
                  }
                  {" "}
                  of
                  {" "}
                  {
                    weeklyProgress
                      .total_habits
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
                          weeklyProgress
                            .progress_percentage,
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
                      weeklyProgress
                        .total_completed
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
                      weeklyProgress
                        .total_missed
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
                      weeklyProgress
                        .total_pending
                    }
                  </strong>

                  <span className="summary-description">
                    Still pending
                  </span>

                </div>

              </section>


              {/* WEEKLY BREAKDOWN */}

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

                  {
                    weeklyProgress.days.map(
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
                                  : day.pending_habits > 0
                                    ? "pending"
                                    : "missed"
                            }`}
                          >
                            {
                              day.progress_percentage === 100
                                ? "✓"
                                : day.progress_percentage > 0
                                  ? "◐"
                                  : day.pending_habits > 0
                                    ? "○"
                                    : "✕"
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
                                  : day.pending_habits > 0
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
                    )
                  }

                </div>

              </section>

            </>

          )}

        </>

      )}


      {/* ======================================
          MONTHLY VIEW
      ====================================== */}

      {viewMode === "monthly" && (

        <>

          {/* MONTH NAVIGATION */}

          <div className="progress-date-navigation">

            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                changeMonth(-1)
              }
            >
              ←
            </button>


            <div className="progress-selected-date">

              {getMonthName(
                selectedMonthStart
              )}

            </div>


            <button
              type="button"
              className="date-nav-button"
              onClick={() =>
                changeMonth(1)
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
                Loading monthly progress...
              </h3>

            </div>

          )}


          {/* MONTHLY DATA */}

          {!loading &&
            monthlyProgress && (

            <>

              {/* MONTHLY MAIN CARD */}

              <section className="progress-main-card">

                <p className="eyebrow">
                  MONTHLY PROGRESS
                </p>

                <h3>
                  {
                    monthlyProgress
                      .progress_percentage
                  }%
                </h3>

                <p>
                  {
                    monthlyProgress
                      .total_completed
                  }
                  {" "}
                  of
                  {" "}
                  {
                    monthlyProgress
                      .total_habits
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
                          monthlyProgress
                            .progress_percentage,
                          100
                        )}%`,
                    }}
                  />

                </div>

              </section>


              {/* MONTHLY SUMMARY */}

              <section className="progress-summary-grid">

                <div className="progress-summary-card">

                  <span className="summary-label">
                    COMPLETED
                  </span>

                  <strong>
                    {
                      monthlyProgress
                        .total_completed
                    }
                  </strong>

                  <span className="summary-description">
                    Completed this month
                  </span>

                </div>


                <div className="progress-summary-card">

                  <span className="summary-label">
                    MISSED
                  </span>

                  <strong>
                    {
                      monthlyProgress
                        .total_missed
                    }
                  </strong>

                  <span className="summary-description">
                    Missed this month
                  </span>

                </div>


                <div className="progress-summary-card">

                  <span className="summary-label">
                    PENDING
                  </span>

                  <strong>
                    {
                      monthlyProgress
                        .total_pending
                    }
                  </strong>

                  <span className="summary-description">
                    Still pending
                  </span>

                </div>

              </section>


              {/* ==================================
                  MONTHLY HEATMAP
              ================================== */}

              <section className="progress-habits-panel monthly-heatmap-panel">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Monthly Activity
                    </h3>

                    <p>
                      Your daily consistency at a glance.
                    </p>

                  </div>

                </div>


                <div className="monthly-calendar">

                  <div className="monthly-calendar-weekdays">

                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>

                  </div>


                  <div className="monthly-calendar-grid">

                    {
                      getCalendarDays(
                        selectedMonthStart
                      ).map(
                        (
                          dateString,
                          index
                        ) => {

                          if (
                            !dateString
                          ) {

                            return (
                              <div
                                key={`empty-${index}`}
                                className="monthly-calendar-empty"
                              />
                            );

                          }

                          const day =
                            getMonthlyDay(
                              dateString
                            );

                          return (

                            <div
                              key={dateString}
                              className={
                                getMonthlyDayClass(
                                  dateString
                                )
                              }
                              title={
                                day &&
                                day.total_habits > 0
                                  ? `${formatShortDate(
                                      dateString
                                    )} · ${day.progress_percentage}%`
                                  : `${formatShortDate(
                                      dateString
                                    )} · No applicable habits`
                              }
                            >

                              <span className="monthly-calendar-date">
                                {
                                  Number(
                                    dateString.slice(
                                      8,
                                      10
                                    )
                                  )
                                }
                              </span>


                              {
                                day &&
                                day.total_habits > 0 && (

                                  <span className="monthly-calendar-percentage">
                                    {
                                      day.progress_percentage
                                    }%
                                  </span>

                                )
                              }

                            </div>

                          );

                        }
                      )
                    }

                  </div>


                  {/* LEGEND */}

                  <div className="monthly-calendar-legend">

                    <span>
                      <i className="legend-box inactive" />
                      No habits
                    </span>

                    <span>
                      <i className="legend-box missed" />
                      Missed
                    </span>

                    <span>
                      <i className="legend-box partial" />
                      Partial
                    </span>

                    <span>
                      <i className="legend-box completed" />
                      Complete
                    </span>

                  </div>

                </div>

              </section>


              {/* ==================================
                  HABIT CONSISTENCY
              ================================== */}

              <section className="progress-habits-panel">

                <div className="section-title-row">

                  <div>

                    <h3>
                      Habit Consistency
                    </h3>

                    <p>
                      See which habits you are
                      maintaining consistently.
                    </p>

                  </div>

                </div>


                {
                  monthlyProgress.habit_progress
                    .length === 0 ? (

                    <div className="empty-state">

                      <div className="empty-state-icon">
                        ○
                      </div>

                      <h3>
                        No habit data
                      </h3>

                      <p>
                        There are no habits
                        applicable to this month.
                      </p>

                    </div>

                  ) : (

                    <div className="monthly-habit-list">

                      {
                        monthlyProgress
                          .habit_progress
                          .map(
                            (habit) => (

                              <div
                                className="monthly-habit-card"
                                key={habit.habit_id}
                              >

                                <div className="monthly-habit-header">

                                  <div>

                                    <h4>
                                      {
                                        habit.habit_name
                                      }
                                    </h4>

                                    <p>
                                      {
                                        habit.completed_days
                                      }
                                      {" "}
                                      of
                                      {" "}
                                      {
                                        habit.total_days
                                      }
                                      {" "}
                                      applicable days completed
                                    </p>

                                  </div>


                                  <strong>
                                    {
                                      habit.progress_percentage
                                    }%
                                  </strong>

                                </div>


                                <div className="progress-bar-container">

                                  <div
                                    className="progress-bar-fill"
                                    style={{
                                      width:
                                        `${Math.min(
                                          habit.progress_percentage,
                                          100
                                        )}%`,
                                    }}
                                  />

                                </div>


                                <div className="monthly-habit-stats">

                                  <span>
                                    ✓{" "}
                                    {
                                      habit.completed_days
                                    }
                                  </span>

                                  <span>
                                    ✕{" "}
                                    {
                                      habit.missed_days
                                    }
                                  </span>

                                  <span>
                                    ○{" "}
                                    {
                                      habit.pending_days
                                    }
                                  </span>

                                </div>

                              </div>

                            )
                          )
                      }

                    </div>

                  )
                }

              </section>

            </>

          )}

        </>

      )}

    </div>

  );
}


export default Progress;