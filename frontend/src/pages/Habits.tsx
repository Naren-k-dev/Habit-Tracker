import {
  useEffect,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  useNavigate,
} from "react-router-dom";

import {
  getMyHabits,
  createHabit,
  updateHabit,
  toggleHabitActive,
} from "../services/habitService";

import {
  getMyTrackingPeriods,
} from "../services/trackingPeriodService";

import type {
  Habit,
  HabitCreate,
} from "../types/habit";

import type {
  TrackingPeriod,
} from "../types/trackingPeriod";


function Habits() {

  // ==========================================
  // UI STATE
  // ==========================================

  const [showModal, setShowModal] =
    useState(false);

  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [periodsLoading, setPeriodsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const navigate = useNavigate();


  // ==========================================
  // TRACKING PERIODS
  // ==========================================

  const [trackingPeriods, setTrackingPeriods] =
    useState<TrackingPeriod[]>([]);

  const [editingHabit, setEditingHabit] =
  useState<Habit | null>(null);

  const [openMenuHabitId, setOpenMenuHabitId] =
    useState<number | null>(null);

  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] =
    useState<HabitCreate>({
      tracking_period_id: 0,
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    });


  // ==========================================
  // FETCH HABITS
  // ==========================================

  async function loadHabits() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyHabits();

      setHabits(data);

    } catch (err) {

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load habits"
        );
      }

    } finally {
      setLoading(false);
    }
  }


  // ==========================================
  // FETCH TRACKING PERIODS
  // ==========================================

  async function loadTrackingPeriods() {

    try {
      setPeriodsLoading(true);
      setError("");

      const periods =
        await getMyTrackingPeriods();

      setTrackingPeriods(periods);

      // --------------------------------------
      // Select active period automatically
      // --------------------------------------

      const activePeriod =
        periods.find(
          (period) =>
            period.is_active
        ) ?? periods[0];

      if (activePeriod) {

        setForm((previous) => ({
          ...previous,

          tracking_period_id:
            activePeriod.id,

          start_date:
            activePeriod.start_date,

          end_date:
            activePeriod.end_date,
        }));

      }

    } catch (err) {

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to load tracking periods"
        );
      }

    } finally {
      setPeriodsLoading(false);
    }
  }


  // ==========================================
  // INITIAL LOAD
  // ==========================================

useEffect(() => {
  async function loadInitialData() {
    await Promise.all([
      loadHabits(),
      loadTrackingPeriods(),
    ]);
  }

  void loadInitialData();
}, []);


  // ==========================================
  // FORM HANDLER
  // ==========================================

  function handleInputChange(
    field: keyof HabitCreate,
    value: string | number
  ) {

    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

  }


  // ==========================================
  // TRACKING PERIOD CHANGE
  // ==========================================

  function handleTrackingPeriodChange(
    periodId: number
  ) {

    const selectedPeriod =
      trackingPeriods.find(
        (period) =>
          period.id === periodId
      );

    if (!selectedPeriod) {
      return;
    }

    setForm((previous) => ({
      ...previous,

      tracking_period_id:
        selectedPeriod.id,

      start_date:
        selectedPeriod.start_date,

      end_date:
        selectedPeriod.end_date,
    }));

  }


  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  function openCreateModal() {

    setError("");

    setEditingHabit(null);

    const activePeriod =
      trackingPeriods.find(
        (period) =>
          period.is_active
      ) ?? trackingPeriods[0];

    if (activePeriod) {

      setForm({
        tracking_period_id:
          activePeriod.id,

        name: "",

        description: "",

        start_date:
          activePeriod.start_date,

        end_date:
          activePeriod.end_date,
      });

    }

    setShowModal(true);
  }


  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  function openEditModal(
    habit: Habit
  ) {

    setError("");

    setEditingHabit(habit);

    setForm({
      tracking_period_id:
        habit.tracking_period_id,

      name:
        habit.name,

      description:
        habit.description ?? "",

      start_date:
        habit.start_date,

      end_date:
        habit.end_date ?? "",
    });

    setShowModal(true);
  }

  // ==========================================
// TOGGLE HABIT ACTIVE STATUS
// ==========================================

  async function handleToggleHabit(
    habit: Habit
  ) {
    try {
      setError("");

      await toggleHabitActive(habit);

      await loadHabits();

    } catch (err) {

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Failed to update habit status"
        );
      }

    }
  }


  // ==========================================
  // CREATE / UPDATE HABIT
  // ==========================================

  async function handleCreateHabit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();


    // ----------------------------------------
    // Validation
    // ----------------------------------------

    if (!form.tracking_period_id) {

      setError(
        "Please select a tracking period"
      );

      return;
    }


    if (!form.name.trim()) {

      setError(
        "Habit name is required"
      );

      return;
    }


    if (!form.start_date) {

      setError(
        "Start date is required"
      );

      return;
    }


    // ----------------------------------------
    // Find selected period
    // ----------------------------------------

    const selectedPeriod =
      trackingPeriods.find(
        (period) =>
          period.id ===
          form.tracking_period_id
      );


    if (!selectedPeriod) {

      setError(
        "Selected tracking period not found"
      );

      return;
    }


    // ----------------------------------------
    // Date validation
    // ----------------------------------------

    if (
      form.start_date <
      selectedPeriod.start_date
    ) {

      setError(
        "Habit start date cannot be before the tracking period"
      );

      return;
    }


    if (
      form.end_date &&
      form.end_date >
        selectedPeriod.end_date
    ) {

      setError(
        "Habit end date cannot be after the tracking period"
      );

      return;
    }


    if (
      form.end_date &&
      form.start_date >=
        form.end_date
    ) {

      setError(
        "Habit start date must be before end date"
      );

      return;
    }


    // ----------------------------------------
    // CREATE / UPDATE
    // ----------------------------------------

    try {

      setCreating(true);
      setError("");


      // --------------------------------------
      // UPDATE EXISTING HABIT
      // --------------------------------------

      if (editingHabit) {

        await updateHabit(
          editingHabit.id,
          {
            tracking_period_id:
              form.tracking_period_id,

            name:
              form.name.trim(),

            description:
              form.description?.trim() || "",

            start_date:
              form.start_date,

            end_date:
              form.end_date || undefined,

            is_active:
              editingHabit.is_active,
          }
        );


      } else {

        // ------------------------------------
        // CREATE NEW HABIT
        // ------------------------------------

        await createHabit({
          tracking_period_id:
            form.tracking_period_id,

          name:
            form.name.trim(),

          description:
            form.description?.trim() || "",

          start_date:
            form.start_date,

          end_date:
            form.end_date ||
            undefined,
        });

      }


      // --------------------------------------
      // Close modal
      // --------------------------------------

      setShowModal(false);

      setEditingHabit(null);


      // --------------------------------------
      // Reset form
      // --------------------------------------

      setForm({
        tracking_period_id:
          selectedPeriod.id,

        name: "",

        description: "",

        start_date:
          selectedPeriod.start_date,

        end_date:
          selectedPeriod.end_date,
      });


      // --------------------------------------
      // Reload habits
      // --------------------------------------

      await loadHabits();


    } catch (err) {

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          editingHabit
            ? "Failed to update habit"
            : "Failed to create habit"
        );

      }


    } finally {

      setCreating(false);

    }

  }


  // ==========================================
  // CALCULATIONS
  // ==========================================

  const activeHabits =
    habits.filter(
      (habit) =>
        habit.is_active
    );


  // ==========================================
  // DATE FORMATTER
  // ==========================================

  function formatDate(
    value: string | null
  ): string {

    if (!value) {
      return "No end date";
    }

    const date =
      new Date(
        `${value}T00:00:00`
      );

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  }


  // ==========================================
  // CURRENT TRACKING PERIOD
  // ==========================================

  const currentPeriod =
    trackingPeriods.find(
      (period) =>
        period.id ===
        form.tracking_period_id
    );


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="page habits-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            WORKSPACE
          </p>

          <h2>
            Your Habits
          </h2>

          <p className="page-subtitle">
            Build the routines that shape
            your life.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={openCreateModal}
          disabled={
            periodsLoading ||
            trackingPeriods.length === 0
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
          SUMMARY
      ====================================== */}

      <section className="habit-summary">


        {/* TOTAL */}

        <div className="habit-summary-card">

          <span className="summary-label">
            TOTAL HABITS
          </span>

          <strong>
            {habits.length}
          </strong>

          <span className="summary-description">
            Your current routines
          </span>

        </div>


        {/* ACTIVE */}

        <div className="habit-summary-card">

          <span className="summary-label">
            ACTIVE
          </span>

          <strong>
            {activeHabits.length}
          </strong>

          <span className="summary-description">
            Currently being tracked
          </span>

        </div>


        {/* TRACKING PERIOD */}

        <div className="habit-summary-card">

          <span className="summary-label">
            TRACKING PERIOD
          </span>

          <strong>
            {currentPeriod?.name ??
              "No active period"}
          </strong>

          <span className="summary-description">

            {currentPeriod
              ? `${formatDate(
                  currentPeriod.start_date
                )} — ${formatDate(
                  currentPeriod.end_date
                )}`
              : "Create a tracking period"}

          </span>

        </div>

      </section>


      {/* ======================================
          HABITS SECTION
      ====================================== */}

      <section className="habits-section">


        <div className="section-title-row">

          <div>

            <h3>
              All Habits
            </h3>

            <p>
              Habits currently associated
              with your tracking period.
            </p>

          </div>


          <span className="habit-count">
            {habits.length} habits
          </span>

        </div>


        {/* ====================================
            LOADING
        ==================================== */}

        {loading && (

          <div className="empty-state">

            <p>
              Loading your habits...
            </p>

          </div>

        )}


        {/* ====================================
    EMPTY
==================================== */}

{!loading &&
  habits.length === 0 && (

    <div className="empty-state">

      <div className="empty-state-icon">
        {trackingPeriods.length === 0
          ? "◷"
          : "+"}
      </div>

      {trackingPeriods.length === 0 ? (

        <>
          <h3>
            Create a tracking period first
          </h3>

          <p>
            You need to create a tracking
            period before you can create
            a habit.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={() =>
              navigate("/tracking-period")
            }
          >
            Create Tracking Period →
          </button>
        </>

      ) : (

        <>
          <h3>
            No habits yet
          </h3>

          <p>
            Start building your routine
            by creating your first habit.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={openCreateModal}
          >
            Create your first habit
          </button>
        </>

      )}

    </div>

  )}
        {/* ====================================
            HABIT LIST
        ==================================== */}

        {!loading &&
          habits.length > 0 && (

            <div className="habits-list">

              {habits.map(
                (habit) => (

                  <div
                    className="habit-card"
                    key={habit.id}
                  >


                    {/* ICON */}

                    <div className="habit-card-icon">
                      ○
                    </div>


                    {/* CONTENT */}

                    <div className="habit-card-content">

                      <div className="habit-card-title-row">

                        <h3>
                          {habit.name}
                        </h3>

                        <span
                          className={
                            habit.is_active
                              ? "status-badge active"
                              : "status-badge inactive"
                          }
                        >
                          {habit.is_active
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </div>


                      <p>
                        {habit.description ||
                          "No description provided"}
                      </p>


                      <div className="habit-meta">

                        <span>
                          ◷{" "}
                          {formatDate(
                            habit.start_date
                          )}
                        </span>

                        <span>
                          →
                        </span>

                        <span>
                          {formatDate(
                            habit.end_date
                          )}
                        </span>

                      </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="habit-card-actions">

                      <button
                        className="edit-button"
                        type="button"
                        onClick={() =>
                          openEditModal(habit)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="more-button"
                        type="button"
                        onClick={() =>
                          setOpenMenuHabitId(
                            openMenuHabitId === habit.id
                              ? null
                              : habit.id
                          )
                        }
                      >
                        •••
                      </button>

                      {openMenuHabitId === habit.id && (
                        <div className="habit-action-menu">
                          <button
                            type="button"
                            onClick={async () => {
                              await handleToggleHabit(habit);
                              setOpenMenuHabitId(null);
                            }}
                          >
                            {habit.is_active
                              ? "Deactivate"
                              : "Reactivate"}
                          </button>
                        </div>
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </section>


      {/* ======================================
          CREATE / EDIT HABIT MODAL
      ====================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() => {

            if (!creating) {

              setShowModal(false);

              setEditingHabit(null);

            }

          }}
        >

          <div
            className="habit-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p className="eyebrow">
                  {editingHabit
                    ? "EDIT ROUTINE"
                    : "NEW ROUTINE"}
                </p>



                <h2>
                  {editingHabit
                    ? "Edit Habit"
                    : "Add New Habit"}
                </h2>

              </div>


              <button
                className="modal-close"
                type="button"
                disabled={creating}
                onClick={() => {

                  setShowModal(false);

                  setEditingHabit(null);

                }}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleCreateHabit
              }
            >


              {/* NAME */}

              <div className="form-group">

                <label>
                  Habit name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Morning Workout"
                  value={form.name}
                  onChange={(event) =>
                    handleInputChange(
                      "name",
                      event.target.value
                    )
                  }
                  required
                />

              </div>


              {/* DESCRIPTION */}

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  placeholder="What do you want to accomplish?"
                  rows={3}
                  value={
                    form.description ||
                    ""
                  }
                  onChange={(event) =>
                    handleInputChange(
                      "description",
                      event.target.value
                    )
                  }
                />

              </div>


              {/* DATES */}

              <div className="form-row">


                {/* START DATE */}

                <div className="form-group">

                  <label>
                    Start date
                  </label>

                  <input
                    type="date"
                    value={
                      form.start_date
                    }
                    min={
                      currentPeriod?.start_date
                    }
                    max={
                      currentPeriod?.end_date
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "start_date",
                        event.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* END DATE */}

                <div className="form-group">

                  <label>
                    End date
                  </label>

                  <input
                    type="date"
                    value={
                      form.end_date ||
                      ""
                    }
                    min={
                      currentPeriod?.start_date
                    }
                    max={
                      currentPeriod?.end_date
                    }
                    onChange={(event) =>
                      handleInputChange(
                        "end_date",
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              {/* TRACKING PERIOD */}

              <div className="form-group">

                <label>
                  Tracking Period
                </label>


                {periodsLoading ? (

                  <select disabled>

                    <option>
                      Loading tracking periods...
                    </option>

                  </select>


                ) : trackingPeriods.length === 0 ? (

                  <select disabled>

                    <option>
                      No tracking periods available
                    </option>

                  </select>


                ) : (

                  <select
                    value={
                      form.tracking_period_id
                    }
                    onChange={(event) =>
                      handleTrackingPeriodChange(
                        Number(
                          event.target.value
                        )
                      )
                    }
                  >

                    {trackingPeriods.map(
                      (period) => (

                        <option
                          key={period.id}
                          value={period.id}
                        >
                          {period.name}
                        </option>

                      )
                    )}

                  </select>

                )}

              </div>


              {/* ACTIONS */}

              <div className="modal-actions">


                <button
                  type="button"
                  className="secondary-button"
                  disabled={creating}
                  onClick={() => {

                    setShowModal(false);

                    setEditingHabit(null);

                  }}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="primary-button"
                  disabled={
                    creating ||
                    periodsLoading ||
                    trackingPeriods.length === 0
                  }
                >

                  {creating
                    ? editingHabit
                      ? "Saving..."
                      : "Creating..."
                    : editingHabit
                      ? "Save Changes"
                      : "Create Habit"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  );
}


export default Habits;