import { motion } from "framer-motion";
import { Grid, EyeOff, ShieldCheck } from "lucide-react";

export default function WhyStreakLab() {
  const points = [
    {
      icon: <Grid className="w-5 h-5 text-amber-500" />,
      title: "Spreadsheet Workflow",
      description:
        "Ditch complex card boards and calendar grids. StreakLab provides a single, high-density spreadsheet grid to visualize and tick habits for the entire month.",
    },
    {
      icon: <EyeOff className="w-5 h-5 text-amber-500" />,
      title: "Offline-First Privacy",
      description:
        "No accounts, no email logins, and no external servers. Your habits, streaks, and data are stored locally inside a sandboxed SQLite database file on your computer.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-amber-500" />,
      title: "Bulletproof Consistency",
      description:
        "A robust streak engine calculates your current and longest streaks. Non-scheduled days are locked automatically, keeping your statistics clean and accurate.",
    },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-900/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 uppercase">
          Why StreakLab?
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          A minimalist tool designed specifically for people who value privacy, simplicity, and consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {points.map((point, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            key={idx}
            className="border border-neutral-900 bg-neutral-950 p-6 flex flex-col gap-3 text-left relative group hover:border-neutral-800 transition-colors"
          >
            <div className="w-10 h-10 border border-neutral-800 bg-[#07080a] flex items-center justify-center rounded-none mb-2">
              {point.icon}
            </div>
            <h3 className="text-base font-bold text-neutral-100 font-sans">
              {point.title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {point.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
