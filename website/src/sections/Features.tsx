import { motion } from "framer-motion";
import {
  Grid,
  FolderOpen,
  Sparkles,
  Database,
  Laptop,
  Share2,
} from "lucide-react";

export default function Features() {
  const list = [
    {
      icon: <Grid className="w-5 h-5 text-neutral-300" />,
      title: "Spreadsheet Interface",
      description:
        "High-density monthly checkboxes displaying completions. Left task columns are sticky, allowing smooth horizontal navigation across days of the month.",
    },
    {
      icon: <FolderOpen className="w-5 h-5 text-neutral-300" />,
      title: "Workspace Management",
      description:
        "Organize different habit sheets inside distinct workspaces. Switch between work, wellness, or learning routines with a single click.",
    },
    {
      icon: <Sparkles className="w-5 h-5 text-neutral-300" />,
      title: "Streak Engine Analytics",
      description:
        "Calculates active consistency metrics including Current Streak, Longest Streak, and overall Completion Rate directly from SQLite query statements.",
    },
    {
      icon: <Database className="w-5 h-5 text-neutral-300" />,
      title: "Local SQLite Storage",
      description:
        "All data is saved locally on your computer inside a sandboxed SQLite database file, guaranteeing private, secure, and fast offline use.",
    },
    {
      icon: <Laptop className="w-5 h-5 text-neutral-300" />,
      title: "Native Desktop App",
      description:
        "Built with Tauri v2 and Rust, the desktop application runs as a lightweight, memory-efficient Windows client under 3.5 MB in size.",
    },
    {
      icon: <Share2 className="w-5 h-5 text-neutral-300" />,
      title: "Data Share & Backups",
      description:
        "Download full database backups or export single workspaces as JSON configuration files. Send them to friends to import workspaces instantly.",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-900/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 uppercase">
          Key Features
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          StreakLab combines the speed of native desktop apps with the simple layout of tracking sheets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {list.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.5 }}
            key={idx}
            className="border border-neutral-900 bg-neutral-950 p-5 flex flex-col gap-3 text-left hover:border-neutral-800 transition-colors"
          >
            <div className="w-9 h-9 border border-neutral-800 bg-[#07080a] flex items-center justify-center rounded-none mb-1 text-neutral-300">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-neutral-100 font-sans">
              {item.title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
