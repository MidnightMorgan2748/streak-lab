import { create } from "zustand";
import { dbService } from "../database/db";

export interface Workspace {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  fetchWorkspaces: () => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<void>;
  deleteWorkspace: (id: number) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const results = await dbService.select<Workspace[]>(
        "SELECT * FROM workspaces ORDER BY id DESC"
      );
      set({ workspaces: results, isLoading: false });
    } catch (err: any) {
      console.error("Failed to fetch workspaces:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },

  createWorkspace: async (name: string, description: string = "") => {
    set({ isLoading: true, error: null });
    try {
      await dbService.execute(
        "INSERT INTO workspaces (name, description) VALUES ($1, $2)",
        [name, description]
      );
      await get().fetchWorkspaces();
    } catch (err: any) {
      console.error("Failed to create workspace:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },

  deleteWorkspace: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await dbService.execute("DELETE FROM workspaces WHERE id = $1", [id]);
      await get().fetchWorkspaces();
    } catch (err: any) {
      console.error("Failed to delete workspace:", err);
      set({ error: err?.message || String(err), isLoading: false });
    }
  },
}));
