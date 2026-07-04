import { create } from "zustand";
import { dbService } from "../database/db";

export interface CompletionEntry {
  id: number;
  task_id: number;
  date: string; // YYYY-MM-DD
  completed: number;
  created_at: string;
}

interface CompletionState {
  completions: Record<string, boolean>; // Key: "taskId:dateStr", Value: boolean
  isLoading: boolean;
  error: string | null;
  fetchCompletions: (workspaceId: number) => Promise<void>;
  toggleCompletion: (taskId: number, dateStr: string) => Promise<void>;
}

export const useCompletionStore = create<CompletionState>((set, get) => ({
  completions: {},
  isLoading: false,
  error: null,

  fetchCompletions: async (workspaceId: number) => {
    set({ isLoading: true, error: null });
    try {
      const results = await dbService.select<CompletionEntry[]>(
        `SELECT c.* FROM completion_entries c 
         INNER JOIN tasks t ON c.task_id = t.id 
         WHERE t.workspace_id = $1`,
        [workspaceId]
      );
      
      const completionsMap: Record<string, boolean> = {};
      results.forEach((entry) => {
        completionsMap[`${entry.task_id}:${entry.date}`] = entry.completed === 1;
      });

      set({ completions: completionsMap, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch completions:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },

  toggleCompletion: async (taskId: number, dateStr: string) => {
    const key = `${taskId}:${dateStr}`;
    const currentlyCompleted = !!get().completions[key];
    const nextCompleted = !currentlyCompleted;

    // Optimistic UI update
    set((state) => ({
      completions: {
        ...state.completions,
        [key]: nextCompleted,
      },
    }));

    try {
      if (nextCompleted) {
        await dbService.execute(
          "INSERT INTO completion_entries (task_id, date, completed) VALUES ($1, $2, 1) ON CONFLICT(task_id, date) DO UPDATE SET completed = 1",
          [taskId, dateStr]
        );
      } else {
        await dbService.execute(
          "DELETE FROM completion_entries WHERE task_id = $1 AND date = $2",
          [taskId, dateStr]
        );
      }
    } catch (err: any) {
      console.error("Failed to toggle completion:", err);
      // Revert state on error
      set((state) => ({
        completions: {
          ...state.completions,
          [key]: currentlyCompleted,
        },
        error: err?.message || String(err),
      }));
    }
  },
}));
