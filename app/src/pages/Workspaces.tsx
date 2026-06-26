export default function Workspaces() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Workspaces</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your streak notebooks and custom spreadsheets here.
        </p>
      </div>

      {/* Placeholder Slate */}
      <div className="flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-3xl p-16 text-center bg-[#0d1321]/30 backdrop-blur-sm min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-200">No Workspaces Found</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">
          Workspaces contain habit sheets, streaks, logs, and graphs. Create your first workspace to get started.
        </p>
        <button className="mt-6 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer">
          Create Workspace
        </button>
      </div>
    </div>
  );
}
