import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardData,
  getTodayCompletions,
  updateHabitCompletion,
  getDashboardSummary,
} from "../services/dashboardService";

import type { Habit } from "../types/habit";
import type { HabitCompletion } from "../types/habitCompletion";
import type { TrackingPeriod } from "../types/trackingPeriod";

import {
  getCurrentUser,
  type CurrentUser,
} from "../services/authService";


function Dashboard() {

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigate = useNavigate();


  // ==========================================
  // STATE
  // ==========================================

  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [periods, setPeriods] =
    useState<TrackingPeriod[]>([]);

  const [completions, setCompletions] =
    useState<HabitCompletion[]>([]);

  const [currentStreak, setCurrentStreak] =
    useState(0);

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updatingHabitId, setUpdatingHabitId] =
    useState<number | null>(null);

  const [error, setError] =
    useState<string | null>(null);


  // ==========================================
  // TODAY
  // ==========================================

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    async function loadInitialData() {

      try {

        setLoading(true);
        setError(null);


        // --------------------------------------
        // Get dashboard data
        // --------------------------------------

        const dashboardData =
          await getDashboardData();

        setHabits(
          dashboardData.habits
        );

        setPeriods(
          dashboardData.periods
        );


        // --------------------------------------
        // Get today's completions
        // --------------------------------------

        const todayCompletions =
          await getTodayCompletions(today);

        setCompletions(
          todayCompletions
        );


        // --------------------------------------
        // Get current streak
        // --------------------------------------

        const summary =
          await getDashboardSummary();

        setCurrentStreak(
          summary.current_streak
        );


        // --------------------------------------
        // Get current user
        // --------------------------------------

        const currentUser =
          await getCurrentUser();

        setUser(currentUser);


      } catch (err) {

        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    }


    void loadInitialData();

  }, [today]);


  // ==========================================
  // COMPLETE / UNCOMPLETE HABIT
  // ==========================================

  async function handleToggleHabit(
    habitId: number
  ) {

    try {

      setUpdatingHabitId(
        habitId
      );


      const existingCompletion =
        completions.find(
          (completion) =>
            completion.habit_id === habitId &&
            completion.completion_date === today
        );


      const newCompleted =
        !existingCompletion?.completed;


      const updatedCompletion =
        await updateHabitCompletion(
          habitId,
          today,
          newCompleted
        );


      // ----------------------------------------
      // Update local completion state
      // ----------------------------------------

      setCompletions((current) => {

        const exists =
          current.some(
            (completion) =>
              completion.habit_id === habitId &&
              completion.completion_date === today
          );


        if (exists) {

          return current.map(
            (completion) =>
              completion.habit_id === habitId &&
              completion.completion_date === today
                ? updatedCompletion
                : completion
          );

        }


        return [
          ...current,
          updatedCompletion,
        ];

      });


      // ----------------------------------------
      // Refresh streak
      // ----------------------------------------

      const summary =
        await getDashboardSummary();

      setCurrentStreak(
        summary.current_streak
      );


    } catch (err) {

      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update habit"
      );

    } finally {

      setUpdatingHabitId(
        null
      );

    }

  }


  // ==========================================
  // ACTIVE HABITS FOR TODAY
  // ==========================================

  const todayHabits =
    habits.filter(
      (habit) => {

        const startsTodayOrEarlier =
          habit.start_date <= today;


        const endsTodayOrLater =
          !habit.end_date ||
          habit.end_date >= today;


        return (
          habit.is_active &&
          startsTodayOrEarlier &&
          endsTodayOrLater
        );

      }
    );


  // ==========================================
  // TODAY COMPLETION COUNT
  // ==========================================

  const completedCount =
    todayHabits.filter(
      (habit) =>
        completions.some(
          (completion) =>
            completion.habit_id === habit.id &&
            completion.completion_date === today &&
            completion.completed
        )
    ).length;


  const totalToday =
    todayHabits.length;


  const progressPercentage =
    totalToday > 0
      ? Math.round(
          (completedCount /
            totalToday) *
            100
        )
      : 0;


  // ==========================================
  // ACTIVE TRACKING PERIOD
  // ==========================================

  const activePeriod =
    periods.find(
      (period) =>
        period.is_active &&
        period.start_date <= today &&
        period.end_date >= today
    ) ?? null;


  // ==========================================
  // PERIOD PROGRESS
  // ==========================================

  let currentDay = 0;

  let totalDays = 0;


  if (activePeriod) {

    const start =
      new Date(
        `${activePeriod.start_date}T00:00:00`
      );


    const end =
      new Date(
        `${activePeriod.end_date}T00:00:00`
      );


    const current =
      new Date(
        `${today}T00:00:00`
      );


    totalDays =
      Math.floor(
        (
          end.getTime() -
          start.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      ) + 1;


    currentDay =
      Math.floor(
        (
          current.getTime() -
          start.getTime()
        ) /
        (1000 * 60 * 60 * 24)
      ) + 1;


    currentDay =
      Math.max(
        0,
        Math.min(
          currentDay,
          totalDays
        )
      );

  }


  // ==========================================
  // DATE DISPLAY
  // ==========================================

  const todayDate =
    new Date(
      `${today}T00:00:00`
    );


  const formattedDate =
    todayDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );


  const formattedUpperDate =
    todayDate
      .toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        }
      )
      .toUpperCase();


  // ==========================================
  // GREETING
  // ==========================================

  const displayName =
    user?.name ?? "there";


  const currentHour =
    new Date().getHours();


  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="page">

        <p>
          Loading dashboard...
        </p>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="page">


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            {formattedUpperDate}
          </p>


          <h2>
            {greeting}, {displayName} 👋
          </h2>


          <p className="page-subtitle">
            Stay consistent. Small actions compound.
          </p>

        </div>


        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate("/habits")
          }
        >
          + Add Habit
        </button>

      </header>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="error-message">

          {error}

        </div>

      )}


      {/* ======================================
          STATS
      ====================================== */}

      <section className="stats-grid">


        {/* TODAY'S PROGRESS */}

        <div className="stat-card">

          <span className="stat-label">
            TODAY'S PROGRESS
          </span>


          <div className="stat-value">
            {progressPercentage}%
          </div>


          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width:
                  `${progressPercentage}%`,
              }}
            />

          </div>


          <span className="stat-description">

            {completedCount} of{" "}
            {totalToday} habits completed

          </span>

        </div>


        {/* COMPLETED TODAY */}

        <div className="stat-card">

          <span className="stat-label">
            COMPLETED TODAY
          </span>


          <div className="stat-value">
            {completedCount}
          </div>


          <span className="stat-description">

            {totalToday === 0
              ? "No habits scheduled today"
              : completedCount === totalToday
              ? "All habits completed"
              : "Keep the momentum going"}

          </span>

        </div>


        {/* CURRENT STREAK */}

        <div className="stat-card">

          <span className="stat-label">
            CURRENT STREAK
          </span>


          <div className="stat-value">

            {currentStreak}

            <span className="stat-unit">
              {" "}days
            </span>

          </div>


          <span className="stat-description">

            {currentStreak > 0
              ? "Keep the streak alive"
              : "Complete all habits to start"}

          </span>

        </div>

      </section>


      {/* ======================================
          DASHBOARD GRID
      ====================================== */}

      <section className="dashboard-grid">


        {/* ====================================
            TODAY'S HABITS
        ==================================== */}

        <div className="panel habits-panel">

          <div className="panel-header">

            <div>

              <h3>
                Today's Habits
              </h3>

              <p>
                {formattedDate}
              </p>

            </div>


            <button
              type="button"
              className="text-button"
              onClick={() =>
                navigate("/habits")
              }
            >
              View all →
            </button>

          </div>


          <div className="habit-list">

            {todayHabits.length === 0 ? (

              <div className="empty-state">

                <h3>
                  No habits for today
                </h3>

                <p>
                  You don't have any active
                  habits scheduled for today.
                </p>

              </div>

            ) : (

              todayHabits.map(
                (habit) => {

                  const completion =
                    completions.find(
                      (item) =>
                        item.habit_id === habit.id &&
                        item.completion_date === today
                    );


                  const completed =
                    completion?.completed === true;


                  const updating =
                    updatingHabitId === habit.id;


                  return (

                    <div
                      key={habit.id}
                      className={
                        `habit-row ${
                          completed
                            ? "completed"
                            : ""
                        }`
                      }
                    >


                      {/* CHECK */}

                      <button
                        type="button"
                        className="habit-check"
                        onClick={() =>
                          handleToggleHabit(
                            habit.id
                          )
                        }
                        disabled={updating}
                        aria-label={
                          completed
                            ? "Mark incomplete"
                            : "Mark complete"
                        }
                      >

                        {completed
                          ? "✓"
                          : ""}

                      </button>


                      {/* CONTENT */}

                      <div className="habit-content">

                        <strong>
                          {habit.name}
                        </strong>

                        <span>
                          {habit.description ||
                            "No description"}
                        </span>

                      </div>


                      {/* STATUS */}

                      {completed ? (

                        <span className="habit-status">
                          Completed
                        </span>

                      ) : (

                        <button
                          type="button"
                          className="complete-button"
                          onClick={() =>
                            handleToggleHabit(
                              habit.id
                            )
                          }
                          disabled={updating}
                        >

                          {updating
                            ? "Updating..."
                            : "Complete"}

                        </button>

                      )}

                    </div>

                  );

                }
              )

            )}

          </div>

        </div>


        {/* ====================================
            TRACKING PERIOD
        ==================================== */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                {activePeriod
                  ? activePeriod.name
                  : "No tracking period"}
              </h3>


              <p>

                {activePeriod
                  ? `${activePeriod.start_date} — ${activePeriod.end_date}`
                  : "Create a tracking period to start your journey."}

              </p>

            </div>

          </div>


          {activePeriod ? (

            <>
              {/* PERIOD EXISTS */}

              <div className="period-progress">

                <div className="period-circle">

                  <strong>
                    {currentDay}
                  </strong>

                  <span>
                    day
                  </span>

                </div>


                <div className="period-info">

                  <strong>
                    Day {currentDay} of {totalDays}
                  </strong>

                  <span>

                    {currentDay > 0
                      ? "Your journey is in progress."
                      : "Your journey has not started."}

                  </span>

                </div>

              </div>


              <div className="period-footer">

                <span>
                  {todayHabits.length} active habits
                </span>

                <span>
                  {totalDays} days
                </span>

              </div>

            </>

          ) : (

            <>
              {/* NO TRACKING PERIOD */}

              <div className="empty-state">

                <h3>
                  No tracking period
                </h3>

                <p>
                  You haven't created a tracking
                  period yet. Create one to start
                  tracking your progress.
                </p>

              </div>

            </>

          )}

        </div>

      </section>

    </div>

  );

}


export default Dashboard;