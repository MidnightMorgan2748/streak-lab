import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Roadmap() {
  const steps = [
    {
      version: "v1.0 (Stable)",
      status: "Released",
      completed: true,
      items: [
        "Offline-First Desktop App Core",
        "SQLite Relational DB Schemas",
        "Spreadsheet Grid Habits Log",
        "Streak Calculator Engine",
        "Light & Slate Dark Mode",
        "Workspace Sharing Files (JSON)",
      ],
    },
    {
      version: "v1.1 (Planned)",
      status: "In Development",
      completed: false,
      items: [
        "Interactive Progress Heatmaps",
        "Workspace Sorting & Archiving",
        "Better Local Database Optimizations",
      ],
    },
    {
      version: "v2.0 (Future)",
      status: "Backlog",
      completed: false,
      items: [
        "AI Consistency Suggestions",
        "Encrypted Cloud Backup Options",
        "Shared Workspace Multi-User Sync",
      ],
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-900/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 uppercase">
          Product Roadmap
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Tracking our progress and future targets for the StreakLab ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            key={idx}
            className="border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-4 text-left hover:border-neutral-800 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <span className="text-sm font-bold text-neutral-100 font-sans">
                {step.version}
              </span>
              <span
                className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 ${
                  step.completed
                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    : "bg-neutral-900 text-neutral-500 border border-neutral-800"
                }`}
              >
                {step.status}
              </span>
            </div>

            <ul className="flex flex-col gap-2.5 text-xs text-neutral-400">
              {step.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="mt-1 flex-shrink-0">
                    {step.completed ? (
                      <Check className="w-3.5 h-3.5 text-amber-500" />
                    ) : (
                      <span className="w-1.5 h-1.5 bg-neutral-700 block rounded-none ml-1 mt-1" />
                    )}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
