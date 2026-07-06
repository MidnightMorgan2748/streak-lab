import { motion } from "framer-motion";
import { Download, FileCode2, ArrowRight } from "lucide-react";
import { DOWNLOAD_LINKS } from "../constants/config";

export default function DownloadSection() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto border-t border-neutral-900/60 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[200px] bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4 max-w-2xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-100 uppercase">
          Get StreakLab Now
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-md leading-relaxed">
          Start tracking your consistency privately today. Download the lightweight installer and set up in seconds.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 max-w-md mx-auto"
      >
        {/* EXE Portable */}
        <a
          href={DOWNLOAD_LINKS.exe}
          className="flex items-center justify-center gap-2.5 w-full px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-colors select-none"
        >
          <Download className="w-4 h-4" />
          Setup Installer (.exe)
        </a>

        {/* MSI Installer */}
        <a
          href={DOWNLOAD_LINKS.msi}
          className="flex items-center justify-center gap-2.5 w-full px-5 py-3 border border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-neutral-300 text-xs font-bold uppercase tracking-wider transition-colors select-none"
        >
          <FileCode2 className="w-4 h-4" />
          Windows Package (.msi)
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mt-6"
      >
        <a
          href={DOWNLOAD_LINKS.latestRelease}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 hover:underline transition-all"
        >
          View Release Notes & Changelogs
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </motion.div>
    </section>
  );
}
