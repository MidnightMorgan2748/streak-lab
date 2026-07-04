import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useWorkspaceStore } from "../stores/useWorkspaceStore";
import { useTaskStore } from "../stores/useTaskStore";

export default function WorkspaceDetail() {
  const { id } = useParams();
  const workspaceId = Number(id);

  const { workspaces, fetchWorkspaces } = useWorkspaceStore();
  const { tasks, isLoading, error, fetchTasks, createTask, deleteTask } = useTaskStore();

  const [activeTab, setActiveTab] = useState<"spreadsheet" | "analytics" | "calendar">("spreadsheet");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskFrequency, setTaskFrequency] = useState("daily");
  const [taskError, setTaskError] = useState("");

  // Find current workspace
  const workspace = workspaces.find((w) => w.id === workspaceId);

  useEffect(() => {
    if (workspaces.length === 0) {
      fetchWorkspaces();
    }
    if (workspaceId) {
      fetchTasks(workspaceId);
    }
  }, [workspaceId, workspaces.length, fetchWorkspaces, fetchTasks]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setTaskError("");

    if (!taskName.trim()) {
      setTaskError("Task name is required.");
      return;
    }

    try {
      await createTask(workspaceId, taskName.trim(), taskFrequency);
      setTaskName("");
      setTaskFrequency("daily");
      setIsAddingTask(false);
    } catch (err: any) {
      setTaskError(err?.message || "Failed to create task.");
    }
  };

  if (!workspace && !isLoading) {
    return (
      <div className="text-center py-12 border border-[#d0d7de] bg-[#f6f8fa] max-w-md mx-auto">
        <p className="text-xs text-gray-500 font-mono">[Error] Workspace not found.</p>
        <Link to="/workspaces" className="text-xs text-gray-900 hover:underline mt-4 inline-block">
          &lt; Back to Workspaces
        </Link>
      </div>
    );
  }

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

        {/* Tab Selection Navigation */}
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

      {error && (
        <div className="bg-rose-50 border border-rose-200 p-4 text-xs text-rose-600 font-mono">
          [Error] {error}
        </div>
      )}

      {/* Main Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 border border-[#d0d7de] bg-[#f6f8fa]">
        {/* Left Side: Task Management Panel (1 col) */}
        <div className="md:col-span-1 border-r border-[#d0d7de] flex flex-col h-[500px]">
          {/* Panel Header */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-[#d0d7de]">
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

          {/* Task Form / List */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {isAddingTask ? (
              <form onSubmit={handleAddTask} className="p-4 border-b border-[#d0d7de] flex flex-col gap-3">
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
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingTask(false);
                      setTaskName("");
                      setTaskFrequency("daily");
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
            ) : null}

            {/* Tasks List */}
            {tasks.length === 0 ? (
              <div className="p-4 text-center text-xs text-gray-500 font-mono my-auto">
                No tasks yet.
              </div>
            ) : (
              <div className="flex flex-col">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group h-11 flex items-center justify-between px-4 border-b border-[#d0d7de] hover:bg-[#eaeef2] transition-colors"
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="text-xs font-bold text-gray-900 truncate leading-normal">
                        {task.name}
                      </span>
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500">
                        {task.frequency}
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

        {/* Right Side: Tab View Panel (3 cols) */}
        <div className="md:col-span-3 h-[500px] flex flex-col bg-white">
          {activeTab === "spreadsheet" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-10 h-10 bg-[#f6f8fa] border border-[#d0d7de] flex items-center justify-center text-gray-500 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Spreadsheet View</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                The spreadsheet check-in grid will render here, showing tasks mapped to dates.
              </p>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-10 h-10 bg-[#f6f8fa] border border-[#d0d7de] flex items-center justify-center text-gray-500 mb-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-10v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Analytics View</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Graphs and completion metrics will display here to analyze habit consistency.
              </p>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
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
