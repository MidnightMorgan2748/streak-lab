import { useEffect, useState } from "react";
import { useTestStore } from "../stores/useTestStore";
import { dbService } from "../database/db";

export default function Dashboard() {
  const { count, increment } = useTestStore();
  const [dbStatus, setDbStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbLogs, setDbLogs] = useState<string[]>([]);

  useEffect(() => {
    async function initDb() {
      try {
        setDbLogs((prev) => [...prev, "Loading SQLite dbService..."]);
        await dbService.getDb();
        setDbLogs((prev) => [...prev, "dbService connected successfully."]);

        await dbService.execute(
          "CREATE TABLE IF NOT EXISTS connection_test (id INTEGER PRIMARY KEY AUTOINCREMENT, test_val TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
        );

        // Fetch logs
        const results = await dbService.select<{ id: number; test_val: string; created_at: string }[]>(
          "SELECT * FROM connection_test ORDER BY id DESC LIMIT 5"
        );

        setDbLogs((prev) => [
          ...prev,
          `SQLite connection active. ${results.length} boot rows logged in database.`,
          ...results.map((r) => `[Row ${r.id}] ${r.test_val} (${r.created_at})`),
        ]);

        setDbStatus("connected");
      } catch (err: any) {
        console.error("SQLite Connection Error:", err);
        setDbStatus("error");
        setDbError(err?.message || String(err));
        setDbLogs((prev) => [...prev, `Error: ${err?.message || String(err)}`]);
      }
    }
    initDb();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">
          Welcome to StreakLab. Review system diagnostics, database connections, and state counters below.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Technologies */}
        <section className="bg-[#0d1321]/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl hover:border-gray-700/50 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800/60 pb-2">
            System Environment
          </h2>
          <ul className="flex flex-col gap-3 text-sm text-gray-400">
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>React v19 (Frontend)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>TypeScript v5 (Types)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>Vite v7 (Build Tool)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>Tauri v2 (Native Bridge)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span>Tailwind CSS v4 (Styles)</span>
            </li>
          </ul>
        </section>

        {/* Zustand State */}
        <section className="bg-[#0d1321]/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl hover:border-gray-700/50 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800/60 pb-2">
            State Management
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Verify global state updates and reactivity using our Zustand state store.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <div className="bg-[#0b0f19]/80 border border-gray-800 rounded-xl p-3 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">COUNT_VALUE</span>
              <span className="text-2xl font-bold font-mono text-indigo-400">{count}</span>
            </div>
            <button
              onClick={increment}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              Increment Count
            </button>
          </div>
        </section>

        {/* SQLite Database */}
        <section className="bg-[#0d1321]/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl hover:border-gray-700/50 transition-colors duration-300">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800/60 pb-2">
            SQLite Database
          </h2>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${
              dbStatus === "connected" ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
              dbStatus === "error" ? "bg-rose-500 shadow-[0_0_8px_#f43f5e]" :
              "bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]"
            }`} />
            <span className="text-sm font-medium capitalize text-gray-300">
              {dbStatus === "connected" ? "Connected" : dbStatus === "error" ? "Connection Failed" : "Connecting..."}
            </span>
          </div>
          {dbStatus === "error" && (
            <div className="text-xs text-rose-400 bg-rose-950/20 border border-rose-900/30 rounded-xl p-3 font-mono break-words">
              {dbError}
            </div>
          )}
          <div className="bg-[#0b0f19]/80 border border-gray-800 rounded-xl p-3 flex flex-col gap-1.5 flex-1 min-h-[90px] max-h-[140px] overflow-y-auto font-mono text-[10px] text-gray-500 scrollbar-thin">
            {dbLogs.map((log, idx) => (
              <div key={idx} className="whitespace-pre-wrap leading-relaxed">
                &gt; {log}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
