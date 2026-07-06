import { useEffect, useState, useRef } from "react";
import { useWorkspaceStore } from "../stores/useWorkspaceStore";
import { Link } from "react-router-dom";
import { exportWorkspace, importWorkspace } from "../utils/sharing";

export default function Workspaces() {
  const { workspaces, isLoading, error, fetchWorkspaces, createWorkspace, deleteWorkspace } =
    useWorkspaceStore();

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [importError, setImportError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        await importWorkspace(content);
        await fetchWorkspaces();
      } catch (err: any) {
        console.error("Failed to import workspace:", err);
        setImportError(err?.message || "Failed to parse and import workspace file.");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // reset file input
  };

  const displayError = error || importError;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Workspaces</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your streak notebooks and recurring habit collections.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            className="hidden"
            accept=".json"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] text-xs font-semibold rounded-none cursor-pointer transition-colors"
          >
            Import Workspace
          </button>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs font-semibold rounded-none transition-colors duration-150 cursor-pointer"
            >
              New Workspace
            </button>
          )}
        </div>
      </div>

      {displayError && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-none text-xs text-rose-600 font-mono">
          [Error] {displayError}
        </div>
      )}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Workspace List Column */}
        <div className={`flex flex-col gap-4 ${isCreating ? "md:col-span-2" : "md:col-span-3"}`}>
          {isLoading && workspaces.length === 0 ? (
            <div className="text-xs text-[var(--text-muted)] font-mono py-12 text-center border border-[var(--border-color)] bg-[var(--bg-panel)]">
              Loading workspaces...
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center border border-dashed border-[var(--border-color)] p-12 text-center bg-[var(--bg-panel)]/40">
              <div className="w-10 h-10 bg-[var(--bg-app)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] mb-3 rounded-none">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-[var(--text-main)]">No workspaces found</h3>
              <p className="text-xs text-[var(--text-muted)] max-w-xs mt-1">
                Streak sheets and task grids are organized inside workspaces. Create one or import one to get started.
              </p>
              {!isCreating && (
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[var(--bg-panel)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-hover)] text-xs font-semibold rounded-none cursor-pointer"
                  >
                    Import Workspace
                  </button>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="px-3 py-1.5 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs font-semibold rounded-none cursor-pointer"
                  >
                    Create Workspace
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workspaces.map((ws) => (
                <div
                  key={ws.id}
                  className="bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 flex flex-col justify-between hover:border-[var(--text-muted)] transition-colors duration-150 rounded-none shadow-sm group"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <Link
                        to={`/workspaces/${ws.id}`}
                        className="text-base font-bold text-[var(--text-main)] hover:text-[var(--text-muted)] hover:underline transition-colors leading-tight"
                      >
                        {ws.name}
                      </Link>
                      <div className="flex items-center gap-1">
                        {/* Share Workspace Button */}
                        <button
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              await exportWorkspace(ws.id);
                            } catch (err: any) {
                              console.error("Failed to share workspace:", err);
                              setImportError(err?.message || "Failed to share workspace.");
                            }
                          }}
                          className="text-gray-400 hover:text-[var(--text-main)] opacity-0 group-hover:opacity-100 transition-all duration-150 p-1 cursor-pointer"
                          title="Share Workspace"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742a3 3 0 110 2.516m0-2.516a3 3 0 110-2.516m0 2.516l7.632 3.816m-7.632-3.816l7.632-3.816" />
                          </svg>
                        </button>
                        {/* Delete Workspace Button */}
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${ws.name}"?`)) {
                              deleteWorkspace(ws.id);
                            }
                          }}
                          className="text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-150 p-1 cursor-pointer"
                          title="Delete Workspace"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {ws.description || "No description provided."}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
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
            className="bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 flex flex-col gap-4 rounded-none shadow-sm md:col-span-1"
          >
            <h2 className="text-sm font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">
              New Workspace
            </h2>

            {formError && (
              <div className="text-[11px] text-rose-600 bg-rose-50 p-2 border border-rose-200 font-mono">
                {formError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Workspace Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Fitness, Coding Routine"
                className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] px-3 py-2 text-xs text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--btn-primary-bg)] rounded-none font-sans"
                maxLength={50}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of tasks in this workspace..."
                rows={4}
                className="w-full bg-[var(--bg-app)] border border-[var(--border-color)] px-3 py-2 text-xs text-[var(--text-main)] placeholder-gray-400 focus:outline-none focus:border-[var(--btn-primary-bg)] rounded-none font-sans resize-none"
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
                className="w-full py-2 bg-[var(--bg-hover)] hover:bg-[var(--bg-active)] text-[var(--text-main)] text-xs font-semibold rounded-none cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full py-2 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] text-xs font-semibold rounded-none cursor-pointer transition-colors"
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
