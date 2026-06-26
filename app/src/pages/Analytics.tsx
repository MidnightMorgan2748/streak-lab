export default function Analytics() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
        <p className="text-sm text-gray-400 mt-1">
          Deep-dive stats and visualization of your streak records.
        </p>
      </div>

      {/* Placeholder Slate */}
      <div className="flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-3xl p-16 text-center bg-[#0d1321]/30 backdrop-blur-sm min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-10v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-200">No Analytics Data</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">
          Analytics graphs will display streak durations, consistency percentages, and heatmaps once habit data is recorded.
        </p>
      </div>
    </div>
  );
}
