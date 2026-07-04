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
      <div className="text-center py-12 border border-[#d0d7de] bg-[#f6f8fa] max-w-md mx-auto">
        <p className="text-xs text-gray-500 font-mono">[Error] Workspace not found.</p>
        <Link to="/workspaces" className="text-xs text-gray-900 hover:underline mt-4 inline-block">
          &lt; Back to Workspaces
        </Link>
      </div>
    );
  }

  const combinedError = taskStoreError || completionError;

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto gap-6">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#d0d7de] pb-4 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/workspaces" className="text-gray-500 hover:text-gray-950 transition-colors p-1" title="Back to Workspaces">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950">{workspace?.name}</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 pl-7">
            {workspace?.description || "No description provided."}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border border-[#d0d7de] p-0.5 bg-[#f6f8fa]">
          {(["spreadsheet", "analytics", "calendar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer ${
                activeTab === tab
                  ? "bg-[#e1e4e8] text-gray-950"
                  : "text-[#57606a] hover:text-gray-950"
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
      <div className="grid grid-cols-1 md:grid-cols-4 border border-[#d0d7de] bg-[#f6f8fa]">
        {/* Left Side: Task Management Panel */}
        <div className="md:col-span-1 border-r border-[#d0d7de] flex flex-col h-[520px]">
          <div className="h-10 flex items-center justify-between px-4 border-b border-[#d0d7de] bg-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#57606a]">Tasks</span>
            {!isAddingTask && (
              <button
                onClick={() => setIsAddingTask(true)}
                className="text-xs text-gray-950 hover:text-gray-700 font-bold transition-colors cursor-pointer"
              >
                + Add
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col overflow-y-auto bg-[#f6f8fa]">
            {isAddingTask && (
              <form onSubmit={handleAddTask} className="p-4 border-b border-[#d0d7de] bg-white flex flex-col gap-3">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">New Task</span>

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
                    className="w-full bg-white border border-[#d0d7de] px-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-950 rounded-none font-sans"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <select
                    value={taskFrequency}
                    onChange={(e) => setTaskFrequency(e.target.value)}
                    className="w-full bg-white border border-[#d0d7de] px-2 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-gray-950 rounded-none"
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
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Schedule Days</span>
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
                                ? "bg-gray-950 text-white border-gray-950"
                                : "bg-white text-gray-700 border-[#d0d7de] hover:bg-[#eaeef2]"
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
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Day of Month</span>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={selectedMonthDay}
                      onChange={(e) => setSelectedMonthDay(Math.max(1, Math.min(31, Number(e.target.value))))}
                      className="w-full bg-white border border-[#d0d7de] px-2.5 py-1 text-xs text-gray-900 focus:outline-none focus:border-gray-950 rounded-none"
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
                    className="w-full py-1.5 bg-[#eaeef2] hover:bg-[#e1e4e8] text-gray-700 text-xs font-semibold rounded-none cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold rounded-none cursor-pointer transition-colors"
                  >
                    Create
                  </button>
                </div>
              </form>
            )}

            {tasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-400 font-mono my-auto">
                No tasks yet.
              </div>
            ) : (
              <div className="flex flex-col bg-white">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group h-11 flex items-center justify-between px-4 border-b border-[#d0d7de] hover:bg-[#eaeef2] transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold text-gray-900 truncate leading-normal">
                        {task.name}
                      </span>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-400">
                        {task.frequency} {task.frequency_config ? `(${task.frequency_config})` : ""}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete task "${task.name}"?`)) {
                          deleteTask(workspaceId, task.id);
                        }
                      }}
                      className="text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
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
        <div className="md:col-span-3 h-[520px] flex flex-col bg-white overflow-hidden">
          {activeTab === "spreadsheet" && (
            <div className="flex-grow flex flex-col h-full overflow-hidden">
              {/* Month Navigation Row */}
              <div className="h-10 px-4 border-b border-[#d0d7de] flex items-center justify-between bg-[#f6f8fa]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wide">
                    {currentMonth.format("MMMM YYYY")}
                  </span>
                </div>
                <div className="flex border border-[#d0d7de] bg-white p-0.5">
                  <button
                    onClick={prevMonth}
                    className="px-2 py-1 text-xs text-gray-700 hover:bg-[#eaeef2] transition-colors rounded-none cursor-pointer border-r border-[#d0d7de]"
                    title="Previous Month"
                  >
                    &lt;
                  </button>
                  <button
                    onClick={jumpToCurrentMonth}
                    className="px-2.5 py-1 text-[10px] font-bold text-gray-700 hover:bg-[#eaeef2] transition-colors rounded-none cursor-pointer uppercase border-r border-[#d0d7de]"
                  >
                    Today
                  </button>
                  <button
                    onClick={nextMonth}
                    className="px-2 py-1 text-xs text-gray-700 hover:bg-[#eaeef2] transition-colors rounded-none cursor-pointer"
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
                    <div className="w-8 h-8 bg-[#f6f8fa] border border-[#d0d7de] flex items-center justify-center text-gray-400 mb-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-gray-900">Add a task to start tracking</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Your spreadsheet checks appear once tasks are added.</span>
                  </div>
                ) : (
                  <table className="w-full border-collapse border-spacing-0 text-left text-xs font-mono">
                    <thead>
                      <tr className="bg-[#f6f8fa]">
                        {/* Sticky corner header cell */}
                        <th className="sticky left-0 top-0 bg-[#f6f8fa] z-30 border-r border-b border-[#d0d7de] p-2.5 min-w-[150px] font-bold text-[10px] uppercase text-[#57606a]">
                          Habit / Days
                        </th>
                        {daysArray.map((day) => {
                          const isToday = day.isSame(dayjs(), "day");
                          return (
                            <th
                              key={day.format("YYYY-MM-DD")}
                              className={`text-center border-b border-[#d0d7de] border-r border-[#d0d7de] p-1.5 min-w-[40px] font-bold text-[9px] ${
                                isToday ? "bg-[#e1e4e8] text-gray-900" : "text-gray-500"
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
                        <tr key={task.id} className="hover:bg-[#f6f8fa]/50 group">
                          {/* Sticky Task Name Cell */}
                          <td className="sticky left-0 bg-white group-hover:bg-[#f6f8fa] z-20 border-r border-b border-[#d0d7de] p-2.5 min-w-[150px] font-semibold text-gray-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
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

                            return (
                              <td
                                key={dateStr}
                                className={`text-center border-b border-[#d0d7de] border-r border-[#d0d7de] p-0.5 ${
                                  isToday ? "bg-[#eaeef2]/30" : ""
                                }`}
                              >
                                {isScheduled ? (
                                  <label className="block w-full h-full p-2.5 cursor-pointer hover:bg-[#eaeef2]/40 transition-colors">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => toggleCompletion(task.id, dateStr)}
                                      className="w-4 h-4 border-[#d0d7de] text-gray-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-gray-900 rounded-none"
                                    />
                                  </label>
                                ) : (
                                  <div className="w-full h-full p-2.5 bg-gray-100/50 cursor-not-allowed flex items-center justify-center" title="Not Scheduled">
                                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-none" />
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
            <div className="flex-grow flex flex-col h-full overflow-y-auto bg-white">
              <div className="h-10 px-4 border-b border-[#d0d7de] flex items-center justify-between bg-[#f6f8fa]">
                <span className="text-xs font-bold text-gray-900 uppercase font-mono tracking-wide">
                  Habit Consistency & Streaks
                </span>
              </div>
              <div className="p-4 flex-grow">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                    <span className="text-xs font-bold text-gray-900">No stats available</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Create tasks and log check-ins to build streaks.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {tasks.map((task) => {
                      const stats = calculateStreakStats(task, completions);
                      return (
                        <div key={task.id} className="border border-[#d0d7de] bg-[#f6f8fa] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-none shadow-sm animate-fade-in">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-gray-950">{task.name}</span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                              {task.frequency} {task.frequency_config ? `(${task.frequency_config})` : ""}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-6 sm:gap-12">
                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Streak</span>
                              <span className="text-lg font-bold text-gray-900 mt-0.5 flex items-center gap-1 font-mono">
                                {stats.currentStreak} <span className={stats.currentStreak > 0 ? "text-amber-600" : "text-gray-300"}>🔥</span>
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Longest Streak</span>
                              <span className="text-lg font-bold text-gray-950 mt-0.5 font-mono">
                                {stats.longestStreak}
                              </span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completion Rate</span>
                              <span className="text-lg font-bold text-gray-950 mt-0.5 font-mono">
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
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8 h-full bg-[#f6f8fa]/40">
              <div className="w-10 h-10 bg-[#f6f8fa] border border-[#d0d7de] flex items-center justify-center text-gray-500 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Calendar View</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Monthly view of completions for selected habits will render here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
