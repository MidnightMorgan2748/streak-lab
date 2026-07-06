import { dbService } from "../database/db";

interface SharedTask {
  name: string;
  frequency: string;
  frequency_config: string | null;
  completions: string[];
}

interface SharedWorkspacePayload {
  type: string;
  version: string;
  name: string;
  description: string | null;
  tasks: SharedTask[];
}

/**
 * Queries a single workspace and compiles it along with its habits and check-in logs into a JSON file.
 * Triggers a browser download.
 */
export async function exportWorkspace(workspaceId: number): Promise<void> {
  // 1. Fetch workspace metadata
  const workspaces = await dbService.select<{ name: string; description: string | null }[]>(
    "SELECT name, description FROM workspaces WHERE id = $1",
    [workspaceId]
  );
  if (!workspaces || workspaces.length === 0) {
    throw new Error("Workspace not found.");
  }
  const workspace = workspaces[0];

  // 2. Fetch tasks
  const tasks = await dbService.select<{ id: number; name: string; frequency: string; frequency_config: string | null }[]>(
    "SELECT id, name, frequency, frequency_config FROM tasks WHERE workspace_id = $1",
    [workspaceId]
  );

  // 3. Fetch completions
  const completions = await dbService.select<{ task_id: number; date: string }[]>(
    `SELECT c.task_id, c.date FROM completion_entries c 
     INNER JOIN tasks t ON c.task_id = t.id 
     WHERE t.workspace_id = $1`,
    [workspaceId]
  );

  // Group completions by task_id
  const completionsMap: Record<number, string[]> = {};
  completions.forEach((c) => {
    if (!completionsMap[c.task_id]) {
      completionsMap[c.task_id] = [];
    }
    completionsMap[c.task_id].push(c.date);
  });

  // 4. Build JSON structure
  const payload: SharedWorkspacePayload = {
    type: "streaklab-workspace-sharing",
    version: "1.0",
    name: workspace.name,
    description: workspace.description,
    tasks: tasks.map((t) => ({
      name: t.name,
      frequency: t.frequency,
      frequency_config: t.frequency_config,
      completions: completionsMap[t.id] || [],
    })),
  };

  // 5. Trigger download
  const jsonString = JSON.stringify(payload, null, 2);
  const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(jsonString);
  const fileName = `streaklab_shared_${workspace.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.json`;

  const link = document.createElement("a");
  link.setAttribute("href", dataUri);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Parses and inserts a shared workspace payload into SQLite.
 */
export async function importWorkspace(jsonContent: string): Promise<void> {
  const data: SharedWorkspacePayload = JSON.parse(jsonContent);

  if (data.type !== "streaklab-workspace-sharing") {
    throw new Error("Invalid file type. Please upload a valid StreakLab shared workspace JSON file.");
  }

  if (!data.name || !Array.isArray(data.tasks)) {
    throw new Error("Workspace data is corrupted or incomplete.");
  }

  // 1. Insert workspace metadata
  await dbService.execute(
    "INSERT INTO workspaces (name, description) VALUES ($1, $2)",
    [data.name, data.description || null]
  );

  // Retrieve the newly inserted workspace ID
  const latestWs = await dbService.select<{ id: number }[]>(
    "SELECT id FROM workspaces ORDER BY id DESC LIMIT 1"
  );
  if (!latestWs || latestWs.length === 0) {
    throw new Error("Failed to retrieve imported workspace ID.");
  }
  const newWsId = latestWs[0].id;

  // 2. Loop over tasks and insert them along with completions
  for (const task of data.tasks) {
    await dbService.execute(
      "INSERT INTO tasks (workspace_id, name, frequency, frequency_config) VALUES ($1, $2, $3, $4)",
      [newWsId, task.name, task.frequency, task.frequency_config || null]
    );

    // Retrieve the newly inserted task ID
    const latestTask = await dbService.select<{ id: number }[]>(
      "SELECT id FROM tasks ORDER BY id DESC LIMIT 1"
    );
    if (latestTask && latestTask.length > 0) {
      const newTaskId = latestTask[0].id;

      // Insert completions
      for (const dateStr of task.completions || []) {
        await dbService.execute(
          "INSERT INTO completion_entries (task_id, date, completed) VALUES ($1, $2, 1) ON CONFLICT(task_id, date) DO NOTHING",
          [newTaskId, dateStr]
        );
      }
    }
  }
}
