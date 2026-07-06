import { useState } from "react";
import { dbService } from "../database/db";

export default function Settings() {
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem("streaklab-theme") || "light");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleThemeChange = (newTheme: string) => {
    setActiveTheme(newTheme);
    localStorage.setItem("streaklab-theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setExportSuccess(false);
    setExportError(null);

    try {
      // Query all entities from SQLite
      const workspaces = await dbService.select("SELECT * FROM workspaces");
      const tasks = await dbService.select("SELECT * FROM tasks");
      const completions = await dbService.select("SELECT * FROM completion_entries");

      const exportPayload = {
        exportedAt: new Date().toISOString(),
        version: "1.0",
        workspaces,
        tasks,
        completion_entries: completions
      };

      // Compile to JSON file download link
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `streaklab_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportSuccess(true);
    } catch (err: any) {
      console.error("Failed to export database:", err);
      setExportError(err?.message || String(err));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[var(--border-color)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">Settings</h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Adjust preferences, themes, and backup schedules.
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Theme Settings Panel */}
        <section className="bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 flex flex-col gap-4 rounded-none shadow-sm">
          <h2 className="text-xs font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">
            Appearance Customization
          </h2>
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5">
                <h4 className="font-bold text-[var(--text-main)]">Application Theme</h4>
                <p className="text-[10px] text-[var(--text-muted)]">Toggle between high-contrast light and dark themes.</p>
              </div>
              <select
                value={activeTheme}
                onChange={(e) => handleThemeChange(e.target.value)}
                className="bg-[var(--bg-app)] border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-main)] focus:outline-none focus:border-[var(--btn-primary-bg)] rounded-none"
              >
                <option value="light">Light Mode (Notion)</option>
                <option value="dark">Dark Mode (Slate)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Database & Export Panel */}
        <section className="bg-[var(--bg-panel)] border border-[var(--border-color)] p-5 flex flex-col gap-4 rounded-none shadow-sm">
          <h2 className="text-xs font-bold text-[var(--text-main)] border-b border-[var(--border-color)] pb-2">
            Data Portability
          </h2>
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-0.5">
              <h4 className="font-bold text-[var(--text-main)]">Local Database Location</h4>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">SQLite: %APPDATA%/com.streaklab.app/streaklab.db</p>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[var(--border-color)] pt-3">
              <div className="flex flex-col gap-0.5">
                <h4 className="font-bold text-[var(--text-main)]">Export Local Backup</h4>
                <p className="text-[10px] text-[var(--text-muted)]">Download a complete JSON backup file of all workspaces, tasks, and completions.</p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="px-4 py-2 bg-[var(--btn-primary-bg)] hover:bg-[var(--btn-primary-hover)] text-[var(--btn-primary-text)] font-semibold rounded-none cursor-pointer transition-colors whitespace-nowrap"
              >
                {isExporting ? "Exporting..." : "Export JSON"}
              </button>
            </div>

            {exportSuccess && (
              <div className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 p-2 font-mono">
                [Success] Backup JSON downloaded successfully.
              </div>
            )}

            {exportError && (
              <div className="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 p-2 font-mono">
                [Error] {exportError}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
