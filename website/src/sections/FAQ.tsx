import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Does StreakLab require an internet connection?",
    answer:
      "No. StreakLab is completely offline-first. It runs database migrations, reads schedules, and records checkbox check-ins locally. An internet connection is only needed if you wish to check for version updates or access GitHub.",
  },
  {
    question: "Where is my data stored on my computer?",
    answer:
      "Your workspaces, tasks, and consistency lists are stored inside a SQLite database file called 'streaklab.db' on your local hard drive. On Windows, this is located at: 'C:\\Users\\<Username>\\AppData\\Roaming\\com.streaklab.app\\streaklab.db'.",
  },
  {
    question: "Is StreakLab free and open source?",
    answer:
      "Yes. StreakLab is 100% free and released under the MIT License. The code is public, and you can inspect, modify, or compile it yourself directly from the GitHub repository.",
  },
  {
    question: "How do I share a workspace or backup my data?",
    answer:
      "Under Settings, you can download a full backup of your entire database as a JSON file. If you want to share a specific workspace (tasks and checks history) with a friend, you can click the 'Share Workspace' button next to the workspace card, which downloads a portable JSON backup they can import directly into their own client.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto border-t border-neutral-900/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 uppercase">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Everything you need to know about StreakLab's architecture and usage.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-neutral-900 bg-neutral-950 rounded-none overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(idx)}
                className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-sans font-bold text-xs uppercase tracking-wider text-neutral-200 hover:text-neutral-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-900/50 font-mono">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
