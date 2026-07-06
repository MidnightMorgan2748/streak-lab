import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { DOWNLOAD_LINKS } from "../constants/config";

export default function Hero() {
  return (
    <section className="relative pt-24 pb-16 px-4 max-w-7xl mx-auto flex flex-col items-center text-center overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-4 max-w-3xl"
      >
        <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase border border-amber-500/30 px-3 py-1 bg-amber-500/5 select-none">
          StreakLab v1.0 Stable Out Now
        </span>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-100 font-sans leading-[1.1] mt-2">
          Master Consistency. <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
            Track Habits Locally.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-neutral-400 max-w-xl mt-2 leading-relaxed">
          An offline-first habit notebook for developers and builders. Designed with spreadsheet simplicity, local SQLite privacy, and clean Notion aesthetics.
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center"
      >
        <a
          href={DOWNLOAD_LINKS.exe}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors select-none"
        >
          <Download className="w-4 h-4" />
          Download for Windows
        </a>
        <a
          href={DOWNLOAD_LINKS.githubRepo}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors select-none"
        >
          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View GitHub
          </a>
      </motion.div>

      {/* Realistic Application Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full max-w-5xl mt-16 border border-neutral-800 bg-neutral-950/80 backdrop-blur-md p-2 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2 text-[10px] text-neutral-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          </div>
          <span>StreakLab - Workspace: Daily Routine</span>
          <span className="opacity-0">mock</span>
        </div>

        {/* Mock App Body */}
        <div className="flex h-[400px] overflow-hidden select-none">
          {/* Sidebar */}
          <div className="w-44 border-r border-neutral-800 bg-[#07080a] p-3 hidden sm:flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2 font-bold text-[10px] uppercase text-neutral-400 tracking-wider">
              <span className="w-4 h-4 bg-neutral-100 flex items-center justify-center text-[9px] text-neutral-950 font-black">⚡</span>
              StreakLab
            </div>
            <div className="flex flex-col gap-1 text-[11px] text-neutral-400 font-mono">
              <div className="px-2 py-1.5 bg-neutral-900 border-l-2 border-neutral-100 text-neutral-100 font-bold">Dashboard</div>
              <div className="px-2 py-1.5 hover:bg-neutral-900/40">Workspaces</div>
              <div className="px-2 py-1.5 hover:bg-neutral-900/40">Settings</div>
            </div>
            <div className="mt-auto text-[9px] text-neutral-600 font-mono border-t border-neutral-900 pt-2">v1.0.0 Stable</div>
          </div>

          {/* Main workspace container */}
          <div className="flex-1 bg-[#090a0f] p-4 text-left overflow-auto font-sans flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
              <div>
                <h3 className="text-sm font-bold text-neutral-100 font-sans">Fitness Routine</h3>
                <span className="text-[10px] text-neutral-500">Track and build physical habits locally</span>
              </div>
              <div className="flex gap-1.5 border border-neutral-800 bg-neutral-950 p-0.5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                <span className="bg-neutral-800 text-neutral-200 px-2.5 py-1">Spreadsheet</span>
                <span className="px-2.5 py-1">Analytics</span>
              </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-3 gap-3 text-left">
              <div className="border border-neutral-900 bg-[#0c0d13] p-2.5 flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Current Streak</span>
                <span className="text-base font-bold text-neutral-100 font-mono mt-0.5 flex items-center gap-1">5 🔥</span>
              </div>
              <div className="border border-neutral-900 bg-[#0c0d13] p-2.5 flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Longest Streak</span>
                <span className="text-base font-bold text-neutral-100 font-mono mt-0.5">14</span>
              </div>
              <div className="border border-neutral-900 bg-[#0c0d13] p-2.5 flex flex-col">
                <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Consistency</span>
                <span className="text-base font-bold text-neutral-100 font-mono mt-0.5">85%</span>
              </div>
            </div>

            {/* Grid Sheet */}
            <div className="flex-1 border border-neutral-900 bg-neutral-950/60 overflow-hidden relative">
              <table className="w-full text-[10px] font-mono text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-900/30 border-b border-neutral-900">
                    <th className="p-2 border-r border-neutral-900 text-neutral-400 min-w-[100px] font-bold uppercase text-[9px]">Habit</th>
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                      <th key={d} className="p-2 border-r border-neutral-900 text-center text-neutral-500 font-bold">0{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Morning Cardio", checks: [true, true, true, false, true, true, true] },
                    { name: "Strength Training", checks: [true, false, true, false, true, false, true] },
                    { name: "Daily Hydration", checks: [true, true, true, true, true, true, true] }
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-neutral-900/50">
                      <td className="p-2 border-r border-neutral-900 text-neutral-200 font-bold">{row.name}</td>
                      {row.checks.map((c, i) => (
                        <td key={i} className="p-2 border-r border-neutral-900 text-center">
                          <input type="checkbox" checked={c} readOnly className="w-3.5 h-3.5 border-neutral-800 text-amber-500 accent-amber-500" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
