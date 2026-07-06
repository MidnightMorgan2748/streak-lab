import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useWorkspaceStore } from "../stores/useWorkspaceStore";
import { useTaskStore, Task } from "../stores/useTaskStore";
import { useCompletionStore } from "../stores/useCompletionStore";
import { calculateStreakStats } from "../utils/analytics";

export default function WorkspaceDetail() {
  const { id } = useParams();
  const workspaceId = Number(id);

  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const { tasks, isLoading: isTasksLoading, error: taskStoreError, fetchTasks, createTask, deleteTask } = useTaskStore();
  const { completions, fetchCompletions, toggleCompletion, error: completionError } = useCompletionStore();

  const [activeTab, setActiveTab] = useState<"spreadsheet" | "analytics" | "calendar">("spreadsheet");
  const [currentMonth, setCurrentMonth] = useState(() => dayjs());
  
  // New Task Form State
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskFrequency, setTaskFrequency] = useState("daily");
  
  // Weekly configuration: selected days of week
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  // Monthly configuration: day of the month (1-31)
  const [selectedMonthDay, setSelectedMonthDay] = useState(1);
  
  const [taskError, setTaskError] = useState("");

  const workspace = workspaces.find((w) => w.id === workspaceId);

  useEffect(() => {
    if (workspaces.length === 0) {
      fetchWorkspaces();
    }
    if (workspaceId) {
      fetchTasks(workspaceId);
      fetchCompletions(workspaceId);
    }
  }, [workspaceId, workspaces.length, fetchWorkspaces, fetchTasks, fetchCompletions]);

  // Calculate days for the active month view
  const daysInMonth = currentMonth.daysInMonth();
  const daysArray: Dayjs[] = Array.from({ length: daysInMonth }, (_, i) => {
    return currentMonth.date(i + 1);
  });

  const nextMonth = () => {
    setCurrentMonth((prev) => prev.add(1, "month"));
  };

  const prevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const jumpToCurrentMonth = () => {
    setCurrentMonth(dayjs());
  };

  // Helper to determine if a task is scheduled for a specific date
  const isTaskScheduledForDate = (task: Task, date: Dayjs): boolean => {
    const freq = task.frequency?.toLowerCase();
    const config = task.frequency_config;

    if (!freq || freq === "daily" || freq === "custom") {
      return true;
    }

    if (freq === "weekly") {
      if (!config) return true; // Default to all days if not specified
      const allowedDays = config.split(",").map((d) => d.trim().toLowerCase());
      const currentDayName = date.format("ddd").toLowerCase(); // "mon", "tue", etc.
      return allowedDays.includes(currentDayName);
    }

    if (freq === "monthly") {
      if (!config) return true;
      const targetDay = Number(config);
      return date.date() === targetDay;
    }

    return true;
  };

  const toggleWeekday = (day: string) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError("");

    if (!taskName.trim()) {
      setTaskError("Task name is required.");
      return;
    }

    let configStr = "";
    if (taskFrequency === "weekly") {
      if (selectedWeekdays.length === 0) {
        setTaskError("Please select at least one weekday for weekly task.");
        return;
      }
      configStr = selectedWeekdays.join(",");
    } else if (taskFrequency === "monthly") {
      configStr = String(selectedMonthDay);
    }

    try {
      await createTask(workspaceId, taskName.trim(), taskFrequency, configStr);
      setTaskName("");
      setTaskFrequency("daily");
      setSelectedWeekdays([]);
      setSelectedMonthDay(1);
      setIsAddingTask(false);
    } catch (err: any) {
      setTaskError(err?.message || "Failed to create task.");
    }
  };

  if (!workspace && !isTasksLoading) {
    return (
      <div className="text-center py-12 border border-[var(--border-color)] bg-[var(--bg-panel)] max-w-md mx-auto">
        <p className="text-xs text-[var(--text-muted)] font-mono">[Error] Workspace not found.</p>
        <Link to="/workspaces" className="text-xs text-[var(--text-main)] hover:underline mt-4 inline-block">
          &lt; Back to Workspaces
        </Link>
      </div>
    );
  }

  const combinedError = taskStoreError || completionError;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto gap-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[var(--border-color)] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/workspaces" className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1" title="Back to Workspaces">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">{workspace?.name}</h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1 pl-7">
            {workspace?.description || "No description provided."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border border-[var(--border-color)] p-0.5 bg-[var(--bg-panel)]">
          {(["spreadsheet", "analytics", "calendar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer ${
                activeTab === tab
                  ? "bg-[var(--bg-active)] text-[var(--text-main)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {combinedError && (
        <div className="bg-rose-50 border border-rose-200 p-4 text-xs text-rose-600 font-mono">
          [Error] {combinedError}
        </div>
      )}

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-[var(--border-color)] bg-[var(--bg-panel)]">
        {/* Left Side: Task Management Panel */}
        <div className="md:col-span-1 border-r border-[var(--border-color)] flex flex-col h-[520px]">
          <div className="h-10 flex items-center justify-between px-4 border-b border-[var(--border-color)] bg-[var(--bg-app)]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Tasks</span>
            {!isAddingTask && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="text-xs text-[var(--text-main)] hover:text-[var(--text-muted)] font-bold transition-colors cursor-pointer"
              >
                + Add
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto bg-[var(--bg-panel)]">
            {isAddingTask && (
              <form onSubmit={handleAddTask} className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-app)] flex flex-col gap-3">
                <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">New Task</span>

                {taskError && (
                  <div className="text-[10px] text-rose-600 bg-rose-50 p-2 border border-rose-200 font-mono">
                    {taskError}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Task Name"
                    className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] px-2.5 py-1.5 text-xs text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--btn-primary-bg)] rounded-none font-sans"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <select
                    value={taskFrequency}
                    onChange={(e) => setTaskFrequency(e.target.value)}
                    className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] px-2 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--btn-primary-bg)] rounded-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom (All Days)</option>
                  </select>
                </div>

                {/* Conditional Frequency Configurations */}
                {taskFrequency === "weekly" && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Schedule Days</span>
                    <div className="flex flex-wrap gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                        const isSelected = selectedWeekdays.includes(day);
                        return (
                          <button
                            type="button"
                            key={day}
                            onClick={() => toggleWeekday(day)}
                            className={`px-2 py-1 text-[9px] font-bold border rounded-none cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-[var(--btn-primary-bg)]"
                                : "bg-[var(--bg-app)] text-[var(--text-main)] border-[var(--border-color)] hover:bg-[var(--bg-hover)]"
                            }`}
                          >
                            {day.slice(0, 1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {taskFrequency === "monthly" && (
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Day of Month</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={selectedMonthDay}
                      onChange={(e) => setSelectedMonthDay(Math.max(1, Math.min(31, Number(e.target.value))))}
                      className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] px-2.5 py-1 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--btn-primary-bg)] rounded-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTask(false);
                      setTaskName("");
                      setTaskFrequency("daily");
                      setSelectedWeekdays([]);
                      setSelectedMonthDay(1);
                      setTaskError("");
                    }}
                    className="w-full py-1.5 bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-[var(--text-main)] text-xs font-semibold rounded-none cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs font-semibold rounded-none cursor-pointer transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {tasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-[var(--text-muted)] font-mono my-auto">
                No tasks yet.
              </div>
            ) : (
              <div className="flex flex-col bg-[var(--bg-app)]">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group h-11 flex items-center justify-between px-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold text-[var(--text-main)] truncate leading-normal">
                        {task.name}
                      </span>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[var(--text-muted)]">
                        {task.frequency} {task.frequency_config ? `(${task.frequency_config})` : ""}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete task "${task.name}"?`)) {
                          deleteTask(workspaceId, task.id);
                        }
                      }}
                      className="text-[var(--text-muted)] hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                      title="Delete Task"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Tab View Panel */}
        <div className="md:col-span-3 h-[520px] flex flex-col bg-[var(--bg-app)] overflow-hidden">
          {activeTab === "spreadsheet" && (
            <div className="flex-grow flex flex-col h-full overflow-hidden">
              {/* Month Navigation Row */}
              <div className="h-10 px-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-panel)]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-main)] uppercase font-mono tracking-wide">
                    {currentMonth.format("MMMM YYYY")}
                  </span>
                </div>
                <div className="flex border border-[var(--border-color)] bg-[var(--bg-app)] p-0.5">
                  <button
                    onClick={prevMonth}
                    className="px-2 py-1 text-xs text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors rounded-none cursor-pointer border-r border-[var(--border-color)]"
                    title="Previous Month"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={jumpToCurrentMonth}
                    className="px-2.5 py-1 text-[10px] font-bold text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors rounded-none cursor-pointer uppercase border-r border-[var(--border-color)]"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-2 py-1 text-xs text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors rounded-none cursor-pointer"
                    title="Next Month"
                  >
                    &gt;
                  </button>
                </div>
              </div>

              {/* Grid Viewport */}
              <div className="flex-1 overflow-auto relative">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-12 h-full">
                    <div className="w-8 h-8 bg-[var(--bg-panel)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] mb-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-[var(--text-main)]">Add a task to start tracking</span>
                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Your spreadsheet checks appear once tasks are added.</span>
                  </div>
                ) : (
                  <table className="w-full border-collapse border-spacing-0 text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-[var(--bg-panel)]">
                        {/* Sticky corner header cell */}
                        <th className="sticky left-0 top-0 bg-[var(--bg-panel)] z-30 border-r border-b border-[var(--border-color)] p-2.5 min-w-[150px] font-bold text-[10px] uppercase text-[var(--text-muted)]">
                          Habit / Days
                        </th>
                        {daysArray.map((day) => {
                          const isToday = day.isSame(dayjs(), "day");
                          return (
                            <th
                              key={day.format("YYYY-MM-DD")}
                              className={`text-center border-b border-[var(--border-color)] border-r border-[var(--border-color)] p-1.5 min-w-[40px] font-bold text-[9px] ${
                                isToday ? "bg-[var(--bg-active)] text-[var(--text-main)]" : "text-[var(--text-muted)]"
                              }`}
                            >
                              <div>{day.format("D")}</div>
                              <div className="text-[8px] uppercase tracking-tighter opacity-70">
                                {day.format("dd")}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-[var(--bg-hover)]/40 group">
                          {/* Sticky Task Name Cell */}
                          <td className="sticky left-0 bg-[var(--bg-app)] group-hover:bg-[var(--bg-hover)] z-20 border-r border-b border-[var(--border-color)] p-2.5 min-w-[150px] font-semibold text-[var(--text-main)] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                            <span className="block truncate font-bold" title={task.name}>
                              {task.name}
                            </span>
                          </td>
                          {daysArray.map((day) => {
                            const dateStr = day.format("YYYY-MM-DD");
                            const key = `${task.id}:${dateStr}`;
                            const isChecked = !!completions[key];
                            const isScheduled = isTaskScheduledForDate(task, day);
                            const isToday = day.isSame(dayjs(), "day");
                            const isEditable = isScheduled && isToday;

                            return (
                              <td
                                key={dateStr}
                                className={`text-center border-b border-[var(--border-color)] border-r border-[var(--border-color)] p-0.5 ${
                                  isToday ? "bg-[var(--bg-active)]/30 font-bold" : ""
                                }`}
                              >
                                {isScheduled ? (
                                  <label className={`block w-full h-full p-2.5 transition-colors ${
                                    isEditable 
                                      ? "cursor-pointer hover:bg-[var(--bg-hover)]/40" 
                                      : "cursor-not-allowed opacity-60"
                                  }`}>
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      disabled={!isEditable}
                                      onChange={() => isEditable && toggleCompletion(task.id, dateStr)}
                                      className={`w-4 h-4 border-[var(--border-color)] focus:ring-0 focus:ring-offset-0 rounded-none ${
                                        isEditable ? "cursor-pointer accent-[var(--btn-primary-bg)] text-[var(--text-main)]" : "cursor-not-allowed accent-[var(--text-muted)] text-[var(--text-muted)]"
                                      }`}
                                    />
                                  </label>
                                ) : (
                                  <div className="w-full h-full p-2.5 bg-[var(--bg-panel)]/40 cursor-not-allowed flex items-center justify-center" title="Not Scheduled">
                                    <span className="w-1.5 h-1.5 bg-[var(--border-color)] rounded-none" />
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="flex-grow flex flex-col h-full overflow-y-auto bg-[var(--bg-app)]">
              <div className="h-10 px-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-panel)]">
                <span className="text-xs font-bold text-[var(--text-main)] uppercase font-mono tracking-wide">
                  Habit Consistency & Streaks
                </span>
              </div>
              <div className="p-4 flex-grow">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <span className="text-xs font-bold text-[var(--text-main)]">No stats available</span>
                    <span className="text-[10px] text-[var(--text-muted)] mt-0.5">Create tasks and log check-ins to build streaks.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task) => {
                      const stats = calculateStreakStats(task, completions);
                      return (
                        <div key={task.id} className="border border-[var(--border-color)] bg-[var(--bg-panel)] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none shadow-sm animate-fade-in">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-[var(--text-main)]">{task.name}</span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                              {task.frequency} {task.frequency_config ? `(${task.frequency_config})` : ""}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 sm:gap-12">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Current Streak</span>
                              <span className="text-lg font-bold text-[var(--text-main)] mt-0.5 flex items-center gap-1 font-mono">
                                {stats.currentStreak} <span className={stats.currentStreak > 0 ? "text-amber-600" : "text-[var(--text-muted)] opacity-30"}>🔥</span>
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Longest Streak</span>
                              <span className="text-lg font-bold text-[var(--text-main)] mt-0.5 font-mono">
                                {stats.longestStreak}
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Completion Rate</span>
                              <span className="text-lg font-bold text-[var(--text-main)] mt-0.5 font-mono">
                                {stats.completionRate}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 h-full bg-[var(--bg-panel)]/40">
              <div className="w-10 h-10 bg-[var(--bg-panel)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-main)]">Calendar View</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xs mt-1">
                Monthly view of completions for selected habits will render here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
