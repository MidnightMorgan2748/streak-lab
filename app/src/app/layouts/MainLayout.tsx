import { NavLink, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-white text-[#24292e] font-sans overflow-hidden">
      {/* Sidebar - Flat off-white panel */}
      <aside className="w-60 bg-[#f6f8fa] border-r border-[#d0d7de] flex flex-col">
        {/* Brand / Logo Header */}
        <div className="h-14 flex items-center px-4 border-b border-[#d0d7de]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-950 flex items-center justify-center rounded-none font-bold text-white">
              {/* Logo SVG - Sharp lightning bolt */}
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold uppercase tracking-wider text-gray-950">
              StreakLab
            </span>
          </div>
        </div>

        {/* Navigation Links - Flat light-mode selection */}
        <nav className="flex-1 py-4 flex flex-col">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-xs font-semibold border-l-2 transition-all duration-150 group ${
                isActive
                  ? "bg-[#e1e4e8] text-gray-950 border-gray-950"
                  : "text-[#57606a] border-transparent hover:text-gray-950 hover:bg-[#eaeef2]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-[#57606a] group-hover:text-gray-950"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                </svg>
                <span>Dashboard</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/workspaces"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-xs font-semibold border-l-2 transition-all duration-150 group ${
                isActive
                  ? "bg-[#e1e4e8] text-gray-950 border-gray-950"
                  : "text-[#57606a] border-transparent hover:text-gray-950 hover:bg-[#eaeef2]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-[#57606a] group-hover:text-gray-950"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Workspaces</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-xs font-semibold border-l-2 transition-all duration-150 group ${
                isActive
                  ? "bg-[#e1e4e8] text-gray-950 border-gray-950"
                  : "text-[#57606a] border-transparent hover:text-gray-950 hover:bg-[#eaeef2]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-[#57606a] group-hover:text-gray-950"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-10v10a2 2 0 002 2h2a2 2 0 002-2V9a2 2 0 00-2-2h-2a2 2 0 00-2 2z" />
                </svg>
                <span>Analytics</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-xs font-semibold border-l-2 transition-all duration-150 group ${
                isActive
                  ? "bg-[#e1e4e8] text-gray-950 border-gray-950"
                  : "text-[#57606a] border-transparent hover:text-gray-950 hover:bg-[#eaeef2]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <svg className={`w-4 h-4 ${isActive ? "text-gray-950" : "text-[#57606a] group-hover:text-gray-950"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </>
            )}
          </NavLink>
        </nav>

        {/* Footer Info */}
        <div className="p-3 border-t border-[#d0d7de] flex items-center justify-between text-[9px] text-[#57606a] font-mono">
          <span>CLIENT: NATIVE</span>
          <span>v0.1.0</span>
        </div>
      </aside>

      {/* Main content viewport */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
