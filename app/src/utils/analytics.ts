import dayjs, { Dayjs } from "dayjs";
import { Task } from "../stores/useTaskStore";

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalScheduled: number;
  totalCompleted: number;
}

// Get all dates for which a task is scheduled in a given date range
export function getScheduledDates(task: Task, start: Dayjs, end: Dayjs): Dayjs[] {
  const dates: Dayjs[] = [];
  let current = start.startOf("day");
  const limit = end.endOf("day");

  const freq = task.frequency?.toLowerCase() || "daily";
  const config = task.frequency_config;

  while (current.isBefore(limit)) {
    let isScheduled = false;

    if (freq === "daily" || freq === "custom") {
      isScheduled = true;
    } else if (freq === "weekly") {
      if (!config) {
        isScheduled = true;
      } else {
        const allowedDays = config.split(",").map((d) => d.trim().toLowerCase());
        const dayName = current.format("ddd").toLowerCase(); // "mon", "tue", etc.
        isScheduled = allowedDays.includes(dayName);
      }
    } else if (freq === "monthly") {
      if (!config) {
        isScheduled = true;
      } else {
        const targetDay = Number(config);
        isScheduled = current.date() === targetDay;
      }
    }

    if (isScheduled) {
      dates.push(current);
    }
    current = current.add(1, "day");
  }

  return dates;
}

// Calculate streak stats dynamically for a task
export function calculateStreakStats(task: Task, completions: Record<string, boolean>): StreakStats {
  // We calculate history starting from when the task was created up to today
  const start = dayjs(task.created_at || new Date()).startOf("day");
  const end = dayjs().endOf("day");

  const allScheduled = getScheduledDates(task, start, end);
  
  // Exclude future dates (just in case)
  const pastAndTodayScheduled = allScheduled.filter(
    (d) => d.isBefore(dayjs(), "day") || d.isSame(dayjs(), "day")
  );

  // Chronological order (oldest first) for longest streak
  const chronological = [...pastAndTodayScheduled].sort((a, b) => a.valueOf() - b.valueOf());

  // 1. Calculate Longest Streak
  let longestStreak = 0;
  let tempStreak = 0;

  chronological.forEach((day) => {
    const dateStr = day.format("YYYY-MM-DD");
    const isCompleted = !!completions[`${task.id}:${dateStr}`];

    if (isCompleted) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 0;
    }
  });
  longestStreak = Math.max(longestStreak, tempStreak);

  // 2. Calculate Current Streak (Newest first)
  let currentStreak = 0;
  const reverseChronological = [...pastAndTodayScheduled].sort((a, b) => b.valueOf() - a.valueOf());

  for (let i = 0; i < reverseChronological.length; i++) {
    const day = reverseChronological[i];
    const dateStr = day.format("YYYY-MM-DD");
    const isCompleted = !!completions[`${task.id}:${dateStr}`];
    const isToday = day.isSame(dayjs(), "day");

    if (isCompleted) {
      currentStreak++;
    } else {
      if (isToday) {
        // If today is not completed, we don't break the streak yet,
        // because the user still has time to complete it today.
        continue;
      } else {
        // Any missed day in the past breaks the current streak
        break;
      }
    }
  }

  // 3. Calculate Completion Rate
  // To be fair, do not count today as scheduled if today is not completed yet.
  const todayStr = dayjs().format("YYYY-MM-DD");
  const isTodayCompleted = !!completions[`${task.id}:${todayStr}`];

  const countableScheduled = pastAndTodayScheduled.filter(
    (d) => !d.isSame(dayjs(), "day") || isTodayCompleted
  );

  const completedCount = countableScheduled.filter(
    (d) => !!completions[`${task.id}:${d.format("YYYY-MM-DD")}`]
  ).length;

  const completionRate = countableScheduled.length > 0
    ? Math.round((completedCount / countableScheduled.length) * 100)
    : 0;

  return {
    currentStreak,
    longestStreak,
    completionRate,
    totalScheduled: countableScheduled.length,
    totalCompleted: completedCount,
  };
}
