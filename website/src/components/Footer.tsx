import { DOWNLOAD_LINKS, DEVELOPER_INFO } from "../constants/config";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-900 bg-[#020202] py-12 px-4 text-center">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 select-none">
          <div className="w-5 h-5 bg-neutral-100 flex items-center justify-center rounded-none font-bold text-[10px] text-neutral-950 font-sans">
            ⚡
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-100 font-sans">
            StreakLab
          </span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
          <a
            href={DOWNLOAD_LINKS.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            GitHub
          </a>
          <a
            href={DOWNLOAD_LINKS.latestRelease}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors"
          >
            Latest Release
          </a>
          <span>v1.0.0</span>
          <span className="normal-case">MIT License</span>
        </div>

        {/* Author Credit */}
        <div className="text-[10px] text-neutral-600 font-mono">
          Created by{" "}
          <a
            href={DEVELOPER_INFO.authorGithub}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-200 hover:underline transition-colors"
          >
            {DEVELOPER_INFO.author}
          </a>
        </div>
      </div>
    </footer>
  );
}
