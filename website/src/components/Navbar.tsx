import { Download } from "lucide-react";
import { DOWNLOAD_LINKS } from "../constants/config";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md px-4">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 select-none">
          <div className="w-6 h-6 bg-neutral-100 flex items-center justify-center rounded-none font-bold text-[11px] text-neutral-950 font-sans">
            ⚡
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-100 font-sans">
            StreakLab
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={DOWNLOAD_LINKS.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-200 transition-colors p-1"
            title="GitHub Repository"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
          <a
            href={DOWNLOAD_LINKS.exe}
            className="flex items-center gap-1.5 px-4 py-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300 text-[10px] font-bold uppercase tracking-wider transition-colors select-none"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>
    </header>
  );
}
