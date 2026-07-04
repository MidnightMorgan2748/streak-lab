import { create } from "zustand";
import { dbService } from "../database/db";

export interface Task {
  id: number;
  workspace_id: number;
  name: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  frequency_config: string | null;
  created_at: string;
  updated_at: string;
}

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (workspaceId: number) => Promise<void>;
  createTask: (workspaceId: number, name: string, frequency: string, frequencyConfig?: string) => Promise<void>;
  deleteTask: (workspaceId: number, id: number) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (workspaceId: number) => {
    set({ isLoading: true, error: null });
    try {
      const results = await dbService.select<Task[]>(
        "SELECT * FROM tasks WHERE workspace_id = $1 ORDER BY id ASC",
        [workspaceId]
      );
      set({ tasks: results, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },

  createTask: async (workspaceId: number, name: string, frequency: string, frequencyConfig: string = "") => {
    set({ isLoading: true, error: null });
    try {
      await dbService.execute(
        "INSERT INTO tasks (workspace_id, name, frequency, frequency_config) VALUES ($1, $2, $3, $4)",
        [workspaceId, name, frequency, frequencyConfig]
      );
      await get().fetchTasks(workspaceId);
    } catch (err: any) {
      console.error("Failed to create task:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },

  deleteTask: async (workspaceId: number, id: number) => {
    set({ isLoading: true, error: null });
    try {
      await dbService.execute("DELETE FROM tasks WHERE id = $1", [id]);
      await get().fetchTasks(workspaceId);
    } catch (err: any) {
      console.error("Failed to delete task:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },
}));
