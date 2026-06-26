import { useEffect, useState } from "react";
import Database from "@tauri-apps/plugin-sql";
import { useTestStore } from "./stores/useTestStore";

function App() {
  const { count, increment } = useTestStore();
  const [dbStatus, setDbStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [dbError, setDbError] = useState<string | null>(null);
  const [dbLogs, setDbLogs] = useState<string[]>([]);

  useEffect(() => {
    async function initDb() {
      try {
        setDbLogs((prev) => [...prev, "Loading SQLite plugin..."]);
        // Load or create SQLite database relative to app data directory
        const db = await Database.load("sqlite:streaklab.db");
        setDbLogs((prev) => [...prev, "sqlite:streaklab.db loaded successfully."]);

        // Test table creation
        setDbLogs((prev) => [...prev, "Checking connection_test table..."]);
        await db.execute(
          "CREATE TABLE IF NOT EXISTS connection_test (id INTEGER PRIMARY KEY AUTOINCREMENT, test_val TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
        );

        // Insert dummy log
        await db.execute(
          "INSERT INTO connection_test (test_val) VALUES ($1)",
          [`StreakLab bootstrap - count: ${count}`]
        );

        // Fetch logs
        const results = await db.select<{ id: number; test_val: string; created_at: string }[]>(
          "SELECT * FROM connection_test ORDER BY id DESC LIMIT 3"
        );

        setDbLogs((prev) => [
          ...prev,
          `SQLite query test passed! Fetch results: ${results.length} rows found.`,
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
    <div className="min-h-screen bg-[#0b0f19] text-[#f3f4f6] flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Decorative background grids & glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <main className="w-full max-w-4xl z-10 flex flex-col gap-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold px-3 py-1 rounded-full bg-indigo-500/10 w-fit mx-auto border border-indigo-500/20 backdrop-blur-sm">
            Phase 1 Core Bootstrap
          </span>
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-sm py-1">
            StreakLab
          </h1>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            A native desktop habit tracker powered by React 19, Tailwind CSS v4, Rust, and SQLite.
          </p>
        </div>

        {/* Dashboard Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Core Technologies */}
          <section className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl hover:border-gray-700/50 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800 pb-2">
              System Environment
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span>React v19 (Frontend)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span>TypeScript v5 (Types)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span>Vite v7 (Build Tool)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span>Tauri v2 (Native Bridge)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span>Tailwind CSS v4 (Styles)</span>
              </li>
            </ul>
          </section>

          {/* Card 2: Zustand State Store */}
          <section className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl hover:border-gray-700/50 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800 pb-2">
              State (Zustand)
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Verify global state updates and persistence inside the React application container.
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

          {/* Card 3: SQLite Database Status */}
          <section className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md shadow-xl hover:border-gray-700/50 transition-colors duration-300">
            <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800 pb-2">
              SQLite (Native)
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

        {/* Footer info */}
        <footer className="text-center text-xs text-gray-600 mt-4 flex items-center justify-center gap-4">
          <span>StreakLab Desktop Client</span>
          <span>•</span>
          <span>SQLite Mode: Embedded</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
