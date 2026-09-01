import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import {
  createDailyTask,
  deleteDailyTask,
  getDailyTasks,
  updateDailyTask,
  completeDailyTask,
} from "../services/dailyTaskService";

import { getMyTrackingPeriods } from "../services/trackingPeriodService";

import type {
  DailyTask,
  DailyTaskCreate,
  DailyTaskUpdate,
  TaskCategory,
  TaskPriority,
} from "../types/dailyTask";

import type { TrackingPeriod } from "../types/trackingPeriod";


// =========================================================
// CONSTANTS
// =========================================================

const CATEGORIES: TaskCategory[] = [
  "AI / ML",
  "DSA",
  "College",
  "Personal",
  "Fitness",
  "Project",
  "Other",
];


// =========================================================
// TASKS PAGE
// =========================================================

function Tasks() {

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [tasks, setTasks] = useState<DailyTask[]>([]);

  const [period, setPeriod] =
    useState<TrackingPeriod | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingTask, setEditingTask] =
    useState<DailyTask | null>(null);


  // =======================================================
  // LOAD TRACKING PERIOD
  // =======================================================

  async function loadPeriod() {

    try {

      setError("");

      const periods = await getMyTrackingPeriods();

      const activePeriod =
        periods.find(
          (item) => item.is_active
        ) ?? null;

      setPeriod(activePeriod);


      if (!activePeriod) {
        return;
      }


      const today =
        new Date()
          .toISOString()
          .split("T")[0];


      /*
       * If today is before the tracking period,
       * start at the period's start date.
       *
       * If today is inside the period,
       * use today.
       *
       * If today is after the period,
       * use the period's end date.
       */

      if (
        today <
        activePeriod.start_date
      ) {

        setSelectedDate(
          activePeriod.start_date
        );

      } else if (
        today >
        activePeriod.end_date
      ) {

        setSelectedDate(
          activePeriod.end_date
        );

      } else {

        setSelectedDate(today);

      }

    } catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Failed to load tracking period."
        );

      }

    }

  }


  // =======================================================
  // LOAD TASKS
  // =======================================================

  async function loadTasks(
    date: string
  ) {

    if (!date) {
      return;
    }

    try {

      setLoading(true);
      setError("");

      const data =
        await getDailyTasks(date);

      setTasks(data);

    } catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Failed to load tasks."
        );

      }

    } finally {

      setLoading(false);

    }

  }


  // =======================================================
  // INITIAL LOAD
  // =======================================================

useEffect(() => {
  async function loadInitialPeriod() {
    await loadPeriod();
  }

  void loadInitialPeriod();
}, []);


  // =======================================================
  // LOAD TASKS WHEN DATE CHANGES
  // =======================================================

useEffect(() => {
  if (!selectedDate) {
    return;
  }

  async function loadSelectedTasks() {
    await loadTasks(selectedDate);
  }

  void loadSelectedTasks();
}, [selectedDate]);


  // =======================================================
  // TASK COUNTS
  // =======================================================

  const completedCount =
    useMemo(
      () =>
        tasks.filter(
          (task) =>
            task.completed
        ).length,
      [tasks]
    );


  const pendingCount =
    tasks.length - completedCount;


  // =======================================================
  // DATE NAVIGATION
  // =======================================================

  function changeDate(
    days: number
  ) {

    if (
      !period ||
      !selectedDate
    ) {
      return;
    }


    const currentDate =
      new Date(
        `${selectedDate}T00:00:00`
      );


    currentDate.setDate(
      currentDate.getDate() + days
    );


    const newDate =
      currentDate
        .toISOString()
        .split("T")[0];


    // Don't leave tracking period

    if (
      newDate <
        period.start_date ||
      newDate >
        period.end_date
    ) {

      return;

    }


    setSelectedDate(newDate);

  }


  const canGoPrevious =
    period
      ? selectedDate >
        period.start_date
      : false;


  const canGoNext =
    period
      ? selectedDate <
        period.end_date
      : false;


  // =======================================================
  // COMPLETE / UNCOMPLETE
  // =======================================================

  async function handleComplete(
    task: DailyTask
  ) {

    try {

      setError("");

      let updatedTask: DailyTask;


      if (!task.completed) {

        updatedTask =
          await completeDailyTask(
            task.id
          );

      } else {

        updatedTask =
          await updateDailyTask(
            task.id,
            {
              completed: false,
            }
          );

      }


      setTasks(
        (currentTasks) =>
          currentTasks.map(
            (item) =>
              item.id ===
              updatedTask.id
                ? updatedTask
                : item
          )
      );

    } catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Failed to update task."
        );

      }

    }

  }


  // =======================================================
  // DELETE TASK
  // =======================================================

  async function handleDelete(
    taskId: number
  ) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this task?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");

      await deleteDailyTask(taskId);


      setTasks(
        (currentTasks) =>
          currentTasks.filter(
            (task) =>
              task.id !== taskId
          )
      );

    } catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          "Failed to delete task."
        );

      }

    }

  }


  // =======================================================
  // OPEN CREATE MODAL
  // =======================================================

  function handleCreateTask() {

    if (!period) {

      setError(
        "No active tracking period found."
      );

      return;

    }


    setEditingTask(null);
    setError("");
    setShowModal(true);

  }


  // =======================================================
  // OPEN EDIT MODAL
  // =======================================================

  function handleEditTask(
    task: DailyTask
  ) {

    setEditingTask(task);
    setError("");
    setShowModal(true);

  }


  // =======================================================
  // CLOSE MODAL
  // =======================================================

  function handleCloseModal() {

    setShowModal(false);
    setEditingTask(null);

  }


  // =======================================================
  // SAVE TASK
  // =======================================================

  async function handleSaveTask(
    taskData:
      | DailyTaskCreate
      | DailyTaskUpdate
  ) {

    try {

      setError("");


      // =================================================
      // EDIT
      // =================================================

      if (editingTask) {

        const updatedTask =
          await updateDailyTask(
            editingTask.id,
            taskData as DailyTaskUpdate
          );


        /*
         * Normally task_date cannot change from
         * the Edit form.
         *
         * If backend returns a different date,
         * remove it from the current list.
         */

        if (
          updatedTask.task_date ===
          selectedDate
        ) {

          setTasks(
            (currentTasks) =>
              currentTasks.map(
                (task) =>
                  task.id ===
                  updatedTask.id
                    ? updatedTask
                    : task
              )
          );

        } else {

          setTasks(
            (currentTasks) =>
              currentTasks.filter(
                (task) =>
                  task.id !==
                  updatedTask.id
              )
          );

        }

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        const createdTask =
          await createDailyTask(
            taskData as DailyTaskCreate
          );


        /*
         * The selected day is automatically
         * sent as task_date.
         */

        if (
          createdTask.task_date ===
          selectedDate
        ) {

          setTasks(
            (currentTasks) => [
              ...currentTasks,
              createdTask,
            ]
          );

        }

      }


      handleCloseModal();

    } catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      } else {

        setError(
          editingTask
            ? "Failed to update task."
            : "Failed to create task."
        );

      }

    }

  }


  // =======================================================
  // DISPLAY DATE
  // =======================================================

  const displayDate =
    selectedDate
      ? new Date(
          `${selectedDate}T00:00:00`
        ).toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          }
        )
      : "Loading...";


  // =======================================================
  // PAGE
  // =======================================================

  return (

    <div className="page tasks-page">

      {/* =================================================
          HEADER
          ================================================= */}

      <header className="page-header">

        <div>

          <p className="eyebrow">
            DAILY TASKS
          </p>

          <h2>
            Tasks
          </h2>

          <p className="page-subtitle">
            Focus on what needs to get done.
          </p>

        </div>


        <button
          className="primary-button"
          onClick={handleCreateTask}
          disabled={!period}
        >
          + Add Task
        </button>

      </header>


      {/* =================================================
          DATE NAVIGATION
          ================================================= */}

      <div className="tasks-date-bar">

        <button
          className="secondary-button"
          onClick={() =>
            changeDate(-1)
          }
          disabled={!canGoPrevious}
        >
          ←
        </button>


        <div>

          <p className="eyebrow">
            SELECTED DAY
          </p>

          <strong>
            {displayDate}
          </strong>

        </div>


        <button
          className="secondary-button"
          onClick={() =>
            changeDate(1)
          }
          disabled={!canGoNext}
        >
          →
        </button>

      </div>


      {/* =================================================
          SUMMARY
          ================================================= */}

      <div className="tasks-summary">

        <div className="summary-card">

          <span>
            TOTAL TASKS
          </span>

          <strong>
            {tasks.length}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            COMPLETED
          </span>

          <strong>
            {completedCount}
          </strong>

        </div>


        <div className="summary-card">

          <span>
            PENDING
          </span>

          <strong>
            {pendingCount}
          </strong>

        </div>

      </div>


      {/* =================================================
          ERROR
          ================================================= */}

      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {/* =================================================
          TASK LIST
          ================================================= */}

      <section className="tasks-panel">

        <div className="tasks-panel-header">

          <div>

            <p className="eyebrow">
              TASK LIST
            </p>

            <h3>
              Today's Tasks
            </h3>

          </div>


          <span>

            {tasks.length}{" "}

            {tasks.length === 1
              ? "task"
              : "tasks"}

          </span>

        </div>


        {loading ? (

          <div className="tasks-empty">

            Loading tasks...

          </div>

        ) : tasks.length === 0 ? (

          <div className="tasks-empty">

            <div className="empty-icon">
              ✓
            </div>

            <h3>
              No tasks for this day
            </h3>

            <p>
              Add a task to start planning
              your day.
            </p>

          </div>

        ) : (

          <div className="task-list">

            {tasks.map(
              (task) => (

                <TaskRow
                  key={task.id}
                  task={task}
                  onComplete={
                    handleComplete
                  }
                  onEdit={
                    handleEditTask
                  }
                  onDelete={
                    handleDelete
                  }
                />

              )
            )}

          </div>

        )}

      </section>


      {/* =================================================
          CREATE / EDIT MODAL
          ================================================= */}

      {showModal && period && (

        <TaskModal
          period={period}
          selectedDate={selectedDate}
          task={editingTask}
          onClose={
            handleCloseModal
          }
          onSave={
            handleSaveTask
          }
        />

      )}

    </div>

  );

}


// =========================================================
// TASK ROW PROPS
// =========================================================

interface TaskRowProps {

  task: DailyTask;

  onComplete: (
    task: DailyTask
  ) => void;

  onEdit: (
    task: DailyTask
  ) => void;

  onDelete: (
    taskId: number
  ) => void;

}


// =========================================================
// TASK ROW
// =========================================================

function TaskRow({
  task,
  onComplete,
  onEdit,
  onDelete,
}: TaskRowProps) {

  return (

    <article
      className={
        task.completed
          ? "task-row completed"
          : "task-row"
      }
    >

      {/* =================================================
          CHECKBOX
          ================================================= */}

      <button
        type="button"
        className="task-checkbox"
        onClick={() =>
          onComplete(task)
        }
        aria-label={
          task.completed
            ? "Mark task incomplete"
            : "Complete task"
        }
      >

        {task.completed
          ? "✓"
          : ""}

      </button>


      {/* =================================================
          TASK CONTENT
          ================================================= */}

      <div className="task-main">

        <div className="task-title-row">

          <h4>
            {task.title}
          </h4>


          <span
            className={
              `task-priority ${task.priority}`
            }
          >
            {task.priority}
          </span>

        </div>


        {task.description && (

          <p className="task-description">
            {task.description}
          </p>

        )}


        <div className="task-meta">

          <span>
            {task.category}
          </span>


          {task.due_date && (

            <span>

              Due{" "}

              {new Date(
                `${task.due_date}T00:00:00`
              ).toLocaleDateString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                }
              )}

            </span>

          )}

        </div>

      </div>


      {/* =================================================
          ACTIONS
          ================================================= */}

      <div className="task-actions">

        <button
          type="button"
          className="task-edit-button"
          onClick={() =>
            onEdit(task)
          }
          aria-label={`Edit ${task.title}`}
        >
          Edit
        </button>


        <button
          type="button"
          className="task-delete-button"
          onClick={() =>
            onDelete(task.id)
          }
          aria-label={`Delete ${task.title}`}
        >
          ×
        </button>

      </div>

    </article>

  );

}


// =========================================================
// TASK MODAL PROPS
// =========================================================

interface TaskModalProps {

  period: TrackingPeriod;

  selectedDate: string;

  task: DailyTask | null;

  onClose: () => void;

  onSave: (
    task:
      | DailyTaskCreate
      | DailyTaskUpdate
  ) => void;

}


// =========================================================
// TASK MODAL
// =========================================================

function TaskModal({
  period,
  selectedDate,
  task,
  onClose,
  onSave,
}: TaskModalProps) {

  const isEditing =
    task !== null;


  // =======================================================
  // FORM STATE
  // =======================================================

  const [title, setTitle] =
    useState(
      task?.title ?? ""
    );


  const [description, setDescription] =
    useState(
      task?.description ?? ""
    );


  const [priority, setPriority] =
    useState<TaskPriority>(
      task?.priority ?? "medium"
    );


  const [category, setCategory] =
    useState<TaskCategory>(
      task?.category ?? "Other"
    );


  const [dueDate, setDueDate] =
    useState(
      task?.due_date ?? ""
    );


  const [formError, setFormError] =
    useState("");


  // =======================================================
  // SUBMIT
  // =======================================================

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setFormError("");


    const cleanTitle =
      title.trim();


    const cleanDescription =
      description.trim();


    // =================================================
    // VALIDATE TITLE
    // =================================================

    if (!cleanTitle) {

      setFormError(
        "Task title is required."
      );

      return;

    }


    // =================================================
    // VALIDATE DUE DATE
    // =================================================

    if (
      dueDate &&
      dueDate < selectedDate
    ) {

      setFormError(
        "Due date cannot be before the task date."
      );

      return;

    }


    if (
      dueDate &&
      dueDate > period.end_date
    ) {

      setFormError(
        "Due date cannot be after the tracking period."
      );

      return;

    }


    // =================================================
    // EDIT
    // =================================================

    if (isEditing) {

      /*
       * IMPORTANT:
       *
       * task_date is intentionally NOT included.
       *
       * The task remains on the selected day.
       */

      onSave({

        title:
          cleanTitle,

        description:
          cleanDescription || null,

        due_date:
          dueDate || null,

        priority,

        category,

      });

      return;

    }


    // =================================================
    // CREATE
    // =================================================

    onSave({

      tracking_period_id:
        period.id,

      title:
        cleanTitle,

      description:
        cleanDescription || null,

      /*
       * Automatically use the selected day.
       */

      task_date:
        selectedDate,

      due_date:
        dueDate || null,

      priority,

      category,

    });

  }


  // =======================================================
  // MODAL
  // =======================================================

  return (

    <div
      className="task-modal-overlay"
      onMouseDown={(event) => {

        if (
          event.target ===
          event.currentTarget
        ) {

          onClose();

        }

      }}
    >

      <div className="task-modal">

        {/* =================================================
            HEADER
            ================================================= */}

        <div className="task-modal-header">

          <div>

            <p className="eyebrow">

              {isEditing
                ? "EDIT TASK"
                : "NEW TASK"}

            </p>


            <h3>

              {isEditing
                ? "Edit Task"
                : "Add Task"}

            </h3>

          </div>


          <button
            type="button"
            className="task-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

        </div>


        {/* =================================================
            FORM
            ================================================= */}

        <form
          className="task-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="form-field">

            <label htmlFor="task-title">
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="What needs to get done?"
              maxLength={200}
              autoFocus
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-field">

            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Add some context..."
              maxLength={500}
              rows={3}
            />

          </div>


          {/* PRIORITY + CATEGORY */}

          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value as TaskPriority
                  )
                }
              >

                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>

            </div>


            <div className="form-field">

              <label htmlFor="task-category">
                Category
              </label>

              <select
                id="task-category"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value as TaskCategory
                  )
                }
              >

                {CATEGORIES.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>

            </div>

          </div>


          {/* DUE DATE */}

          <div className="form-field">

            <label htmlFor="task-due-date">
              Due date
            </label>

            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              min={selectedDate}
              max={period.end_date}
              onChange={(event) =>
                setDueDate(
                  event.target.value
                )
              }
            />

            <small className="form-hint">

              Optional. This task will be
              added to{" "}

              {new Date(
                `${selectedDate}T00:00:00`
              ).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}

              .

            </small>

          </div>


          {/* FORM ERROR */}

          {formError && (

            <div className="form-error">
              {formError}
            </div>

          )}


          {/* ACTIONS */}

          <div className="task-modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="primary-button"
            >

              {isEditing
                ? "Save Changes"
                : "Create Task"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}


export default Tasks;