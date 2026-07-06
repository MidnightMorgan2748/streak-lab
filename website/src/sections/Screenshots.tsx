import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor } from "lucide-react";

interface ScreenshotItem {
  id: string;
  title: string;
  description: string;
  placeholderText: string;
  imagePath: string;
}

const GALLERY: ScreenshotItem[] = [
  {
    id: "dashboard",
    title: "Dashboard Overview",
    description: "Overview statistics card row and today's schedule check-in list.",
    placeholderText: "Drop 'dashboard.png' inside public/assets/screenshots/ to replace this placeholder.",
    imagePath: "/assets/screenshots/dashboard.png",
  },
  {
    id: "grid",
    title: "Spreadsheet Grid",
    description: "31-day checks grid sheet, specific weekday scheduling filters, and date locks.",
    placeholderText: "Drop 'grid.png' inside public/assets/screenshots/ to replace this placeholder.",
    imagePath: "/assets/screenshots/grid.png",
  },
  {
    id: "analytics",
    title: "Streaks Analytics",
    description: "Chronological streak metrics calculation cards showing flame counts.",
    placeholderText: "Drop 'analytics.png' inside public/assets/screenshots/ to replace this placeholder.",
    imagePath: "/assets/screenshots/analytics.png",
  },
];

export default function Screenshots() {
  const [selectedId, setSelectedId] = useState("dashboard");
  const activeItem = GALLERY.find((item) => item.id === selectedId) || GALLERY[0];

  // We check if image exists or fails silently using standard image onerror fallback
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const hasImage = !imageErrors[activeItem.id] && activeItem.imagePath;

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto border-t border-neutral-900/60">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-100 uppercase">
          Application Screenshots
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
          Explore the minimal Notion-inspired desktop client layouts.
        </p>
      </div>

      {/* Selector Tabs */}
      <div className="flex justify-center border border-neutral-900 bg-neutral-950 p-1 max-w-lg mx-auto mb-8 rounded-none">
        {GALLERY.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer ${
              selectedId === item.id
                ? "bg-neutral-900 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {item.title.split(" ")[0]}
          </button>
        ))}
      </div>

      {/* Screen Frame Display */}
      <div className="border border-neutral-800 bg-neutral-950/80 p-2 shadow-2xl relative w-full max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-neutral-900 px-3 py-2 text-[10px] text-neutral-500 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          </div>
          <span>{activeItem.title} - {activeItem.description}</span>
          <span className="opacity-0">mock</span>
        </div>

        <div className="h-[420px] bg-[#050608] flex items-center justify-center relative overflow-hidden p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              {hasImage ? (
                <img
                  src={activeItem.imagePath}
                  alt={activeItem.title}
                  onError={() => handleImageError(activeItem.id)}
                  className="w-full h-full object-contain rounded-none select-none"
                />
              ) : (
                /* Fallback Graphic Placeholder */
                <div className="flex flex-col items-center justify-center text-center max-w-md p-6 border border-dashed border-neutral-800 bg-neutral-950/40 w-full h-full">
                  <Monitor className="w-12 h-12 text-neutral-700 mb-4 stroke-[1.5]" />
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wide">
                    {activeItem.title}
                  </span>
                  <span className="text-[10px] text-neutral-500 mt-2 font-mono leading-relaxed">
                    {activeItem.placeholderText}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
