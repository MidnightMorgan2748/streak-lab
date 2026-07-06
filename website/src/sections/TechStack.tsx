import { motion } from "framer-motion";

export default function TechStack() {
  const techs = [
    { name: "React", role: "UI Library", desc: "React 19 for component structure" },
    { name: "TypeScript", role: "Language", desc: "Strong typing and compile stability" },
    { name: "Tauri", role: "Desktop App", desc: "Rust native webview interop shell" },
    { name: "SQLite", role: "Database", desc: "Local relational database storage" },
    { name: "Zustand", role: "State Store", desc: "Lightweight state subscriptions" },
    { name: "Tailwind CSS", role: "Styling", desc: "Tailwind CSS v4 variables" },
    { name: "Rust", role: "Native Core", desc: "Memory-safe database bridging" },
  ];

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-900/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 uppercase">
          Technology Stack
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Leveraging modern, lightweight, and memory-safe technologies.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
        {techs.map((t, idx) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            key={idx}
            className="border border-neutral-900 bg-neutral-950 px-5 py-4 flex flex-col items-start gap-1 w-full sm:w-[260px] text-left hover:border-neutral-800 transition-colors"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-sm font-bold text-neutral-100 font-sans">{t.name}</span>
              <span className="text-[8px] font-mono uppercase tracking-widest text-neutral-500 bg-neutral-900 px-2 py-0.5">{t.role}</span>
            </div>
            <span className="text-[11px] text-neutral-400 leading-normal mt-1">{t.desc}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
