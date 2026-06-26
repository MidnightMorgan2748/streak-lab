export default function Settings() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-gray-400 mt-1">
          Adjust preferences, databases, backup schedules, and UI themes.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="flex flex-col gap-6 max-w-2xl">
        <section className="bg-[#0d1321]/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800/60 pb-2">
            General Options
          </h2>
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-200">Start with OS</h4>
                <p className="text-xs text-gray-500">Automatically open StreakLab when your computer starts.</p>
              </div>
              <input type="checkbox" className="w-4 h-4 accent-indigo-600 rounded bg-[#0b0f19] border-gray-800" />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-200">Theme Preference</h4>
                <p className="text-xs text-gray-500">Select application visual appearance.</p>
              </div>
              <select className="bg-[#0b0f19] border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-indigo-500">
                <option>Deep Navy Dark (Default)</option>
                <option>Slate Dark</option>
                <option>OLED Black</option>
                <option>System Default</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-[#0d1321]/60 border border-gray-800/80 rounded-2xl p-6 flex flex-col gap-4 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-gray-200 border-b border-gray-800/60 pb-2">
            Database & Backups
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-200">Local Database Location</h4>
                <p className="text-xs text-gray-500 font-mono mt-0.5">SQLite: %APPDATA%/StreakLab/streaklab.db</p>
              </div>
              <button className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 active:scale-[0.98] text-xs font-semibold rounded-xl transition-all cursor-pointer">
                Reveal File
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
