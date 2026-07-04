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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-[#d0d7de] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-950">Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">
          Welcome to StreakLab. Review system diagnostics, database connections, and state counters below.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Technologies */}
        <section className="bg-[#f6f8fa] border border-[#d0d7de] p-5 flex flex-col gap-4 rounded-none shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 border-b border-[#d0d7de] pb-2">
            System Environment
          </h2>
          <ul className="flex flex-col gap-3 text-xs text-gray-600">
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-emerald-600" />
              <span>React v19 (Frontend)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-emerald-600" />
              <span>TypeScript v5 (Types)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-emerald-600" />
              <span>Vite v7 (Build Tool)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-emerald-600" />
              <span>Tauri v2 (Native Bridge)</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="w-2 h-2 bg-emerald-600" />
              <span>Tailwind CSS v4 (Styles)</span>
            </li>
          </ul>
        </section>

        {/* Zustand State */}
        <section className="bg-[#f6f8fa] border border-[#d0d7de] p-5 flex flex-col gap-4 rounded-none shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 border-b border-[#d0d7de] pb-2">
            State Management
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Verify global state updates and reactivity using our Zustand state store.
          </p>
          <div className="mt-auto flex flex-col gap-3">
            <div className="bg-white border border-[#d0d7de] rounded-none p-3 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">COUNT_VALUE</span>
              <span className="text-xl font-bold font-mono text-gray-950">{count}</span>
            </div>
            <button
              onClick={increment}
              className="w-full py-2 bg-gray-950 hover:bg-gray-800 active:scale-[0.98] text-white text-xs font-semibold rounded-none cursor-pointer transition-colors"
            >
              Increment Count
            </button>
          </div>
        </section>

        {/* SQLite Database */}
        <section className="bg-[#f6f8fa] border border-[#d0d7de] p-5 flex flex-col gap-4 rounded-none shadow-sm">
          <h2 className="text-xs font-bold text-gray-900 border-b border-[#d0d7de] pb-2">
            SQLite Database
          </h2>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 ${
              dbStatus === "connected" ? "bg-emerald-600" :
              dbStatus === "error" ? "bg-rose-600" :
              "bg-amber-500 animate-pulse"
            }`} />
            <span className="text-xs font-medium capitalize text-gray-800">
              {dbStatus === "connected" ? "Connected" : dbStatus === "error" ? "Connection Failed" : "Connecting..."}
            </span>
          </div>
          {dbStatus === "error" && (
            <div className="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 rounded-none p-3 font-mono break-words">
              {dbError}
            </div>
          )}
          <div className="bg-white border border-[#d0d7de] rounded-none p-3 flex flex-col gap-1.5 flex-1 min-h-[90px] max-h-[140px] overflow-y-auto font-mono text-[10px] text-gray-600">
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
