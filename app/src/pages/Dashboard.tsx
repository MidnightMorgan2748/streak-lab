import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { useWorkspaceStore } from "../stores/useWorkspaceStore";
import { dbService } from "../database/db";
import { Task } from "../stores/useTaskStore";
import { getScheduledDates } from "../utils/analytics";

interface DashboardStats {
  workspacesCount: number;
  habitsCount: number;
  completedTodayCount: number;
  scheduledTodayCount: number;
  weeklyConsistency: number;
}

export default function Dashboard() {
  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const [stats, setStats] = useState<DashboardStats>({
    workspacesCount: 0,
    habitsCount: 0,
    completedTodayCount: 0,
    scheduledTodayCount: 0,
    weeklyConsistency: 0,
  });

  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [todayCompletedIds, setTodayCompletedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to determine if a task is scheduled for a date
  const isTaskScheduledForDate = (task: Task, date: Dayjs): boolean => {
    const freq = task.frequency?.toLowerCase() || "daily";
    const config = task.frequency_config;

    if (freq === "daily" || freq === "custom") return true;

    if (freq === "weekly") {
      if (!config) return true;
      const allowedDays = config.split(",").map((d) => d.trim().toLowerCase());
      const currentDayName = date.format("ddd").toLowerCase();
      return allowedDays.includes(currentDayName);
    }

    if (freq === "monthly") {
      if (!config) return true;
      return date.date() === Number(config);
    }

    return true;
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch workspaces (via Zustand)
      await fetchWorkspaces();

      // 2. Fetch all tasks
      const allTasks = await dbService.select<Task[]>("SELECT * FROM tasks");
      
      // 3. Fetch today's completions
      const todayStr = dayjs().format("YYYY-MM-DD");
      const todayCompletions = await dbService.select<{ task_id: number }[]>(
        "SELECT task_id FROM completion_entries WHERE date = $1",
        [todayStr]
      );
      const completedIds = new Set(todayCompletions.map((c) => c.task_id));
      setTodayCompletedIds(completedIds);

      // 4. Filter tasks scheduled for today
      const today = dayjs();
      const scheduledToday = allTasks.filter((task) => isTaskScheduledForDate(task, today));
      setTodayTasks(scheduledToday);

      // 5. Calculate Weekly Consistency (Last 7 days, excluding today if not completed)
      const startDate = dayjs().subtract(6, "days").startOf("day");
      const endDate = dayjs().endOf("day");
      
      let totalScheduledSlots = 0;
      let totalCompletions = 0;

      // Fetch all completions in the last 7 days
      const completionsList = await dbService.select<{ task_id: number; date: string }[]>(
        "SELECT task_id, date FROM completion_entries WHERE date >= $1",
        [startDate.format("YYYY-MM-DD")]
      );
      
      const completionsSet = new Set(
        completionsList.map((c) => `${c.task_id}:${c.date}`)
      );

      allTasks.forEach((task) => {
        const scheduledDays = getScheduledDates(task, startDate, endDate);
        
        // Exclude today if not completed yet to avoid penalizing consistency
        const countableDays = scheduledDays.filter((day) => {
          const isToday = day.isSame(dayjs(), "day");
          if (isToday) {
            return completionsSet.has(`${task.id}:${day.format("YYYY-MM-DD")}`);
          }
          return true;
        });

        totalScheduledSlots += countableDays.length;

        countableDays.forEach((day) => {
          if (completionsSet.has(`${task.id}:${day.format("YYYY-MM-DD")}`)) {
            totalCompletions++;
          }
        });
      });

      const weeklyConsistency = totalScheduledSlots > 0
        ? Math.round((totalCompletions / totalScheduledSlots) * 100)
        : 0;

      setStats({
        workspacesCount: workspaces.length,
        habitsCount: allTasks.length,
        completedTodayCount: completedIds.size,
        scheduledTodayCount: scheduledToday.length,
        weeklyConsistency,
      });

      setIsLoading(false);
    } catch (err: any) {
      console.error("Dashboard Loading Error:", err);
      setError(err?.message || String(err));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [workspaces.length]);

  const handleToggleHabit = async (taskId: number) => {
    const todayStr = dayjs().format("YYYY-MM-DD");
    const isCompleted = todayCompletedIds.has(taskId);
    
    // Optimistic UI updates
    const nextCompletedIds = new Set(todayCompletedIds);
    if (isCompleted) {
      nextCompletedIds.delete(taskId);
    } else {
      nextCompletedIds.add(taskId);
    }
    setTodayCompletedIds(nextCompletedIds);
    setStats((prev) => ({
      ...prev,
      completedTodayCount: nextCompletedIds.size,
    }));

    try {
      if (isCompleted) {
        await dbService.execute(
          "DELETE FROM completion_entries WHERE task_id = $1 AND date = $2",
          [taskId, todayStr]
        );
      } else {
        await dbService.execute(
          "INSERT INTO completion_entries (task_id, date, completed) VALUES ($1, $2, 1) ON CONFLICT(task_id, date) DO UPDATE SET completed = 1",
          [taskId, todayStr]
        );
      }
      // Re-load stats silently to calculate correct weekly consistency
      loadDashboardData();
    } catch (err: any) {
      console.error("Failed to toggle completion:", err);
      setError(err?.message || "Failed to update database.");
      // Rollback UI
      loadDashboardData();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#d0d7de] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950">Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">
          Review summary statistics and check off today's habits directly from the overview.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 text-xs text-rose-600 font-mono">
          [Error] {error}
        </div>
      )}

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-[#f6f8fa] border border-[#d0d7de] p-4 flex flex-col gap-1 rounded-none shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workspaces</span>
          <span className="text-2xl font-bold text-gray-950 mt-1">
            {isLoading ? "..." : stats.workspacesCount}
          </span>
        </div>

        <div className="bg-[#f6f8fa] border border-[#d0d7de] p-4 flex flex-col gap-1 rounded-none shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Habits</span>
          <span className="text-2xl font-bold text-gray-950 mt-1">
            {isLoading ? "..." : stats.habitsCount}
          </span>
        </div>

        <div className="bg-[#f6f8fa] border border-[#d0d7de] p-4 flex flex-col gap-1 rounded-none shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Completed Today</span>
          <span className="text-2xl font-bold text-gray-950 mt-1">
            {isLoading ? "..." : `${stats.completedTodayCount} / ${stats.scheduledTodayCount}`}
          </span>
        </div>

        <div className="bg-[#f6f8fa] border border-[#d0d7de] p-4 flex flex-col gap-1 rounded-none shadow-sm">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Weekly Consistency</span>
          <span className="text-2xl font-bold text-gray-950 mt-1">
            {isLoading ? "..." : `${stats.weeklyConsistency}%`}
          </span>
        </div>
      </div>

      {/* Today's Habits Checklist Grid */}
      <div className="grid grid-cols-1 border border-[#d0d7de] bg-[#f6f8fa]">
        <div className="h-10 flex items-center justify-between px-4 border-b border-[#d0d7de] bg-white">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#57606a]">Today's Schedule</span>
          <span className="text-[9px] font-mono text-gray-500 uppercase">
            {dayjs().format("dddd, MMM DD")}
          </span>
        </div>

        <div className="flex flex-col bg-white min-h-[200px]">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-gray-400 font-mono my-auto">
              Loading schedule...
            </div>
          ) : todayTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 font-mono my-auto max-w-sm mx-auto">
              No habits scheduled for today. 
              <div className="text-[10px] text-gray-500 mt-1">
                Go to the <Link to="/workspaces" className="text-indigo-600 hover:underline">Workspaces</Link> tab to create and configure habits.
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {todayTasks.map((task) => {
                const isCompleted = todayCompletedIds.has(task.id);
                return (
                  <div
                    key={task.id}
                    className="h-12 flex items-center justify-between px-4 border-b border-[#d0d7de] hover:bg-[#f6f8fa] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => handleToggleHabit(task.id)}
                        className="w-4 h-4 border-[#d0d7de] text-gray-900 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-gray-900 rounded-none"
                      />
                      <span className={`text-xs font-bold leading-none transition-all ${
                        isCompleted ? "line-through text-gray-400" : "text-gray-900"
                      }`}>
                        {task.name}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400">
                      {task.frequency}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
