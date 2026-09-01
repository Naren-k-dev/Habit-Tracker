import {
  useEffect,
  useMemo,
  useState,
} from "react";


import {
  createTrackingPeriod,
  getMyTrackingPeriods,
  updateTrackingPeriod,
  updateTrackingPeriodStatus,
} from "../services/trackingPeriodService";


import type {
  TrackingPeriod as TrackingPeriodType,
} from "../types/trackingPeriod";


function TrackingPeriod() {

  // ==========================================
  // TRACKING PERIODS
  // ==========================================

  const [periods, setPeriods] =
    useState<TrackingPeriodType[]>([]);


  // ==========================================
  // LOADING / ERROR
  // ==========================================

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // EDIT STATE
  // ==========================================

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  // ==========================================
  // CREATE STATE
  // ==========================================

  const [creating, setCreating] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);


  // ==========================================
  // FORM
  // ==========================================

  const [form, setForm] =
    useState({
      name: "",
      start_date: "",
      end_date: "",
    });


  // ==========================================
  // CREATE FORM
  // ==========================================

  const [createForm, setCreateForm] =
    useState({
      name: "",
      start_date: "",
      end_date: "",
    });


  const [createError, setCreateError] =
    useState("");


  // ==========================================
  // LOAD TRACKING PERIODS
  // ==========================================

  async function loadPeriods() {

    try {

      setLoading(true);
      setError("");


      const data =
        await getMyTrackingPeriods();


      setPeriods(data);

    } catch (err) {

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          "Failed to load tracking periods"
        );

      }

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // INITIAL LOAD
  // ==========================================

useEffect(() => {
  async function loadInitialPeriods() {
    await loadPeriods();
  }

  void loadInitialPeriods();
}, []);

  // ==========================================
  // ACTIVE PERIOD
  // ==========================================

  const activePeriod =
    periods.find(
      (period) =>
        period.is_active
    ) ?? null;


  // ==========================================
  // CURRENT PERIOD
  // ==========================================

  /*
   * If an active period exists,
   * use it.
   *
   * Otherwise use the most recent
   * period so inactive history can
   * still be viewed.
   */

  const currentPeriod =
    activePeriod ??
    periods[0] ??
    null;


  // ==========================================
  // PERIOD CALCULATIONS
  // ==========================================

  const periodStats =
    useMemo(() => {

      if (!currentPeriod) {

        return {
          totalDays: 0,
          currentDay: 0,
          daysRemaining: 0,
          progressPercentage: 0,
        };

      }


      const start =
        new Date(
          `${currentPeriod.start_date}T00:00:00`
        );


      const end =
        new Date(
          `${currentPeriod.end_date}T00:00:00`
        );


      const today =
        new Date();


      const millisecondsPerDay =
        1000 *
        60 *
        60 *
        24;


      const totalDays =
        Math.max(
          1,

          Math.floor(
            (
              end.getTime() -
              start.getTime()
            ) /
            millisecondsPerDay
          ) + 1
        );

        const currentDay =
  today < start
    ? 0
    : today > end
      ? totalDays
      : Math.floor(
          (
            today.getTime() -
            start.getTime()
          ) /
          millisecondsPerDay
        ) + 1;


      const daysRemaining =
        Math.max(
          0,
          totalDays -
            currentDay
        );


      const progressPercentage =
        Math.min(
          100,

          Math.max(
            0,

            (
              currentDay /
              totalDays
            ) * 100
          )
        );


      return {

        totalDays,

        currentDay,

        daysRemaining,

        progressPercentage,

      };

    }, [currentPeriod]);


  // ==========================================
  // DATE FORMATTER
  // ==========================================

  function formatDate(
    value: string
  ): string {

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
  // OPEN CREATE MODAL
  // ==========================================

  function openCreateModal() {

    setCreateForm({

      name: "",

      start_date: "",

      end_date: "",

    });


    setCreateError("");

    setError("");

    setShowCreateModal(true);

  }


  // ==========================================
  // CLOSE CREATE MODAL
  // ==========================================

  function closeCreateModal() {

    if (creating) {
      return;
    }


    setShowCreateModal(false);

    setCreateError("");

  }


  // ==========================================
  // CREATE FORM INPUT
  // ==========================================

  function handleCreateInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const {
      name,
      value,
    } = event.target;


    setCreateForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  }


  // ==========================================
  // CREATE TRACKING PERIOD
  // ==========================================

  async function handleCreate() {

    setCreateError("");


    // ----------------------------------------
    // NAME
    // ----------------------------------------

    if (!createForm.name.trim()) {

      setCreateError(
        "Period name is required."
      );

      return;

    }


    // ----------------------------------------
    // START DATE
    // ----------------------------------------

    if (!createForm.start_date) {

      setCreateError(
        "Start date is required."
      );

      return;

    }


    // ----------------------------------------
    // END DATE
    // ----------------------------------------

    if (!createForm.end_date) {

      setCreateError(
        "End date is required."
      );

      return;

    }


    // ----------------------------------------
    // DATE VALIDATION
    // ----------------------------------------

    if (
      createForm.start_date >=
      createForm.end_date
    ) {

      setCreateError(
        "Start date must be before end date."
      );

      return;

    }


    // ----------------------------------------
    // CREATE
    // ----------------------------------------

    try {

      setCreating(true);


      await createTrackingPeriod({

        name:
          createForm.name.trim(),

        start_date:
          createForm.start_date,

        end_date:
          createForm.end_date,

      });


      // --------------------------------------
      // CLOSE MODAL
      // --------------------------------------

      setShowCreateModal(false);


      // --------------------------------------
      // RESET FORM
      // --------------------------------------

      setCreateForm({

        name: "",

        start_date: "",

        end_date: "",

      });


      setCreateError("");


      // --------------------------------------
      // RELOAD
      // --------------------------------------

      await loadPeriods();


    } catch (err) {

      if (err instanceof Error) {

        setCreateError(
          err.message
        );

      } else {

        setCreateError(
          "Failed to create tracking period."
        );

      }

    } finally {

      setCreating(false);

    }

  }


  // ==========================================
  // OPEN EDIT
  // ==========================================

  function openEdit() {

    if (!currentPeriod) {
      return;
    }


    setForm({

      name:
        currentPeriod.name,

      start_date:
        currentPeriod.start_date,

      end_date:
        currentPeriod.end_date,

    });


    setEditing(true);

    setError("");

  }


  // ==========================================
  // CLOSE EDIT
  // ==========================================

  function closeEdit() {

    if (saving) {
      return;
    }


    setEditing(false);

  }


  // ==========================================
  // EDIT INPUT
  // ==========================================

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {

    const {
      name,
      value,
    } = event.target;


    setForm(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

  }


  // ==========================================
  // SAVE EDIT
  // ==========================================

  async function handleSave() {

    if (!currentPeriod) {
      return;
    }


    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!form.name.trim()) {

      setError(
        "Period name cannot be empty"
      );

      return;

    }


    if (
      !form.start_date ||
      !form.end_date
    ) {

      setError(
        "Start date and end date are required"
      );

      return;

    }


    if (
      form.start_date >=
      form.end_date
    ) {

      setError(
        "Start date must be before end date"
      );

      return;

    }


    // ----------------------------------------
    // SAVE
    // ----------------------------------------

    try {

      setSaving(true);

      setError("");


      await updateTrackingPeriod(

        currentPeriod.id,

        {

          name:
            form.name.trim(),

          start_date:
            form.start_date,

          end_date:
            form.end_date,

        }

      );


      await loadPeriods();


      setEditing(false);


    } catch (err) {

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          "Failed to update tracking period"
        );

      }

    } finally {

      setSaving(false);

    }

  }


  // ==========================================
  // ACTIVATE / DEACTIVATE
  // ==========================================

  async function handleStatusChange(
    period: TrackingPeriodType
  ) {

    try {

      setError("");


      await updateTrackingPeriodStatus(

        period.id,

        !period.is_active

      );


      await loadPeriods();


    } catch (err) {

      if (err instanceof Error) {

        setError(
          err.message
        );

      } else {

        setError(
          "Failed to update tracking period status"
        );

      }

    }

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="page">

        <header className="page-header">

          <div>

            <p className="eyebrow">
              TRACKING PERIOD
            </p>

            <h2>
              Tracking Period
            </h2>

            <p className="page-subtitle">
              Loading your tracking periods...
            </p>

          </div>

        </header>


        <div className="empty-panel">

          <div className="empty-icon">
            ◷
          </div>

          <h3>
            Loading...
          </h3>

          <p>
            Fetching your tracking period.
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // NO TRACKING PERIOD
  // ==========================================

  if (!currentPeriod) {

    return (

      <div className="page">

        <header className="page-header">

          <div>

            <p className="eyebrow">
              TRACKING PERIOD
            </p>

            <h2>
              Tracking Period
            </h2>

            <p className="page-subtitle">
              Create a period to begin tracking your journey.
            </p>

          </div>


          <button
            type="button"
            className="primary-button"
            onClick={openCreateModal}
          >
            + Create Tracking Period
          </button>

        </header>


        {error && (

          <div className="tracking-period-error">
            {error}
          </div>

        )}


        <div className="empty-panel">

          <div className="empty-icon">
            ◷
          </div>

          <h3>
            No tracking period
          </h3>

          <p>
            Create a tracking period to start
            your journey.
          </p>


          <button
            type="button"
            className="primary-button"
            onClick={openCreateModal}
          >
            + Create Tracking Period
          </button>

        </div>


        {/* ====================================
            CREATE MODAL
        ==================================== */}

        {showCreateModal && (

          <div
            className="modal-overlay"
            onClick={closeCreateModal}
          >

            <div
              className="tracking-period-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <div className="tracking-period-modal-header">

                <div>

                  <p className="eyebrow">
                    GET STARTED
                  </p>

                  <h3>
                    Create tracking period
                  </h3>

                </div>


                <button
                  type="button"
                  className="modal-close"
                  onClick={closeCreateModal}
                  disabled={creating}
                >
                  ×
                </button>

              </div>


              <div className="tracking-period-form">


                {/* NAME */}

                <div className="form-group">

                  <label htmlFor="create-period-name">
                    Period name
                  </label>

                  <input
                    id="create-period-name"
                    name="name"
                    type="text"
                    value={createForm.name}
                    onChange={
                      handleCreateInputChange
                    }
                    placeholder="e.g. Winter Arc"
                    maxLength={100}
                    disabled={creating}
                  />

                </div>


                {/* DATES */}

                <div className="tracking-period-form-row">


                  <div className="form-group">

                    <label htmlFor="create-period-start">
                      Start date
                    </label>

                    <input
                      id="create-period-start"
                      name="start_date"
                      type="date"
                      value={
                        createForm.start_date
                      }
                      onChange={
                        handleCreateInputChange
                      }
                      disabled={creating}
                    />

                  </div>


                  <div className="form-group">

                    <label htmlFor="create-period-end">
                      End date
                    </label>

                    <input
                      id="create-period-end"
                      name="end_date"
                      type="date"
                      value={
                        createForm.end_date
                      }
                      min={
                        createForm.start_date ||
                        undefined
                      }
                      onChange={
                        handleCreateInputChange
                      }
                      disabled={creating}
                    />

                  </div>

                </div>


                {/* HINT */}

                <p className="form-hint">

                  Your new tracking period will
                  become active automatically.

                </p>


                {/* ERROR */}

                {createError && (

                  <div className="form-error">
                    {createError}
                  </div>

                )}


                {/* ACTIONS */}

                <div className="tracking-period-modal-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closeCreateModal}
                    disabled={creating}
                  >
                    Cancel
                  </button>


                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleCreate}
                    disabled={creating}
                  >

                    {creating
                      ? "Creating..."
                      : "Create Tracking Period"}

                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="page tracking-period-page">


      {/* ======================================
          HEADER
      ====================================== */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            TRACKING PERIOD
          </p>


          <h2>
            {currentPeriod.name}
          </h2>


          <p className="page-subtitle">

            {formatDate(
              currentPeriod.start_date
            )}

            {" — "}

            {formatDate(
              currentPeriod.end_date
            )}

          </p>

        </div>


        <div className="tracking-period-actions">


          {/* CREATE BUTTON */}

          {!activePeriod && (

            <button
              type="button"
              className="primary-button"
              onClick={openCreateModal}
            >
              + Create Tracking Period
            </button>

          )}


          {/* EDIT */}

          <button
            type="button"
            className="secondary-button"
            onClick={openEdit}
          >
            Edit Period
          </button>


          {/* STATUS */}

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              handleStatusChange(
                currentPeriod
              )
            }
          >

            {currentPeriod.is_active
              ? "Deactivate"
              : "Activate"}

          </button>

        </div>

      </header>


      {/* ======================================
          ERROR
      ====================================== */}

      {error && (

        <div className="tracking-period-error">
          {error}
        </div>

      )}


      {/* ======================================
          PERIOD SUMMARY
      ====================================== */}

      <div className="tracking-period-summary">


        {/* STATUS */}

        <div className="summary-card">

          <span>
            STATUS
          </span>


          <strong className="tracking-period-status">

            {currentPeriod.is_active
              ? "Active"
              : "Inactive"}

          </strong>


          <p>
            Current tracking period
          </p>

        </div>


        {/* CURRENT DAY */}

        <div className="summary-card">

          <span>
            CURRENT DAY
          </span>


          <strong>

            {periodStats.currentDay}

            <small>

              {" / "}

              {periodStats.totalDays}

            </small>

          </strong>


          <p>
            Day of your tracking period
          </p>

        </div>


        {/* DAYS REMAINING */}

        <div className="summary-card">

          <span>
            DAYS REMAINING
          </span>


          <strong>
            {periodStats.daysRemaining}
          </strong>


          <p>
            Days left in this period
          </p>

        </div>

      </div>


      {/* ======================================
          PERIOD PROGRESS
      ====================================== */}

      <div className="tracking-period-progress">


        <div className="tracking-period-progress-header">

          <div>

            <span className="tracking-period-progress-label">
              PERIOD PROGRESS
            </span>


            <h3>

              {periodStats.progressPercentage.toFixed(
                1
              )}

              %

            </h3>

          </div>


          <p>

            {periodStats.currentDay}

            {" of "}

            {periodStats.totalDays}

            {" days"}

          </p>

        </div>


        <div className="progress-bar-container">

          <div
            className="progress-bar-fill"
            style={{
              width:
                `${periodStats.progressPercentage}%`,
            }}
          />

        </div>

      </div>


      {/* ======================================
          TRACKING HISTORY
      ====================================== */}

      {periods.length > 1 && (

        <div className="tracking-history">


          <div className="section-header">

            <div>

              <h3>
                Tracking History
              </h3>

              <p>
                Your previous tracking periods.
              </p>

            </div>

          </div>


          <div className="tracking-history-list">

            {periods.map(
              (period) => (

                <div
                  key={period.id}
                  className="tracking-history-item"
                >


                  {/* INFO */}

                  <div className="tracking-history-info">

                    <strong>
                      {period.name}
                    </strong>


                    <p>

                      {formatDate(
                        period.start_date
                      )}

                      {" — "}

                      {formatDate(
                        period.end_date
                      )}

                    </p>

                  </div>


                  {/* META */}

                  <div className="tracking-history-meta">

                    <span
                      className={
                        `tracking-history-status ${
                          period.is_active
                            ? "active"
                            : "inactive"
                        }`
                      }
                    >

                      {period.is_active
                        ? "ACTIVE"
                        : "INACTIVE"}

                    </span>


                    {!period.is_active && (

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                          handleStatusChange(
                            period
                          )
                        }
                      >
                        Activate
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      )}


      {/* ======================================
          EDIT MODAL
      ====================================== */}

      {editing && (

        <div
          className="modal-overlay"
          onClick={closeEdit}
        >

          <div
            className="tracking-period-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* HEADER */}

            <div className="tracking-period-modal-header">

              <div>

                <p className="eyebrow">
                  EDIT PERIOD
                </p>

                <h3>
                  Update tracking period
                </h3>

              </div>


              <button
                type="button"
                className="modal-close"
                onClick={closeEdit}
                disabled={saving}
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <div className="tracking-period-form">


              {/* NAME */}

              <div className="form-group">

                <label htmlFor="edit-period-name">
                  Period name
                </label>


                <input
                  id="edit-period-name"
                  name="name"
                  value={form.name}
                  onChange={
                    handleInputChange
                  }
                  maxLength={100}
                  disabled={saving}
                />

              </div>


              {/* DATES */}

              <div className="tracking-period-form-row">


                <div className="form-group">

                  <label htmlFor="edit-period-start">
                    Start date
                  </label>


                  <input
                    id="edit-period-start"
                    type="date"
                    name="start_date"
                    value={
                      form.start_date
                    }
                    onChange={
                      handleInputChange
                    }
                    disabled={saving}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="edit-period-end">
                    End date
                  </label>


                  <input
                    id="edit-period-end"
                    type="date"
                    name="end_date"
                    value={
                      form.end_date
                    }
                    onChange={
                      handleInputChange
                    }
                    min={
                      form.start_date ||
                      undefined
                    }
                    disabled={saving}
                  />

                </div>

              </div>


              {/* ERROR */}

              {error && (

                <div className="form-error">
                  {error}
                </div>

              )}


              {/* ACTIONS */}

              <div className="tracking-period-modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="primary-button"
                  onClick={handleSave}
                  disabled={saving}
                >

                  {saving
                    ? "Saving..."
                    : "Save Changes"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


export default TrackingPeriod;