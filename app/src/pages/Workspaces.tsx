import { useEffect, useState } from "react";
import { useWorkspaceStore } from "../stores/useWorkspaceStore";
import { Link } from "react-router-dom";

export default function Workspaces() {
  const { workspaces, isLoading, error, fetchWorkspaces, createWorkspace, deleteWorkspace } =
    useWorkspaceStore();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Workspace name is required.");
      return;
    }

    try {
      await createWorkspace(name.trim(), description.trim());
      setName("");
      setDescription("");
      setIsCreating(false);
    } catch (err: any) {
      setFormError(err?.message || "Failed to create workspace.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Workspaces</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your streak notebooks and recurring habit collections.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-semibold rounded-none transition-colors duration-150 cursor-pointer"
          >
            New Workspace
          </button>
        )}
      </div>

      {error && (
        <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-none text-xs text-rose-400 font-mono">
          [Error] {error}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Workspace List Column */}
        <div className={`flex flex-col gap-4 ${isCreating ? "md:col-span-2" : "md:col-span-3"}`}>
          {isLoading && workspaces.length === 0 ? (
            <div className="text-xs text-gray-500 font-mono py-12 text-center border border-gray-800 bg-[#0d1321]/30">
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-gray-800 p-12 text-center bg-[#0d1321]/20">
              <div className="w-10 h-10 bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 mb-3 rounded-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-200">No workspaces found</h3>
              <p className="text-xs text-gray-500 max-w-xs mt-1">
                Streak sheets and task grids are organized inside workspaces. Create one to get started.
              </p>
              {!isCreating && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="mt-4 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-none cursor-pointer"
                >
                  Create Workspace
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-[#0d1321] border border-gray-800/80 p-5 flex flex-col justify-between hover:border-gray-700 transition-colors duration-150 rounded-none shadow-md group"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <Link
                        to={`/workspaces/${ws.id}`}
                        className="text-base font-bold text-gray-200 hover:text-indigo-400 hover:underline transition-colors leading-tight"
                      >
                        {ws.name}
                      </Link>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${ws.name}"?`)) {
                            deleteWorkspace(ws.id);
                          }
                        }}
                        className="text-gray-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1 cursor-pointer"
                        title="Delete Workspace"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {ws.description || "No description provided."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-900/60 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                    <span>ID: #{ws.id}</span>
                    <span>{new Date(ws.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creation Side-Panel Form */}
        {isCreating && (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0d1321] border border-gray-800 p-5 flex flex-col gap-4 rounded-none shadow-lg md:col-span-1"
          >
            <h2 className="text-sm font-bold text-gray-200 border-b border-gray-800 pb-2">
              New Workspace
            </h2>

            {formError && (
              <div className="text-[11px] text-rose-400 bg-rose-950/20 p-2 border border-rose-900/40 font-mono">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Fitness, Coding Routine"
                className="w-full bg-[#0b0f19] border border-gray-800 px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 rounded-none font-sans"
                maxLength={50}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of tasks in this workspace..."
                rows={4}
                className="w-full bg-[#0b0f19] border border-gray-800 px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 rounded-none font-sans resize-none"
                maxLength={200}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setName("");
                  setDescription("");
                  setFormError("");
                }}
                className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-none cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-none cursor-pointer transition-colors"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
