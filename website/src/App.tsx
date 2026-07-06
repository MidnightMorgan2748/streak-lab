import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import WhyStreakLab from "./sections/WhyStreakLab";
import Features from "./sections/Features";
import Screenshots from "./sections/Screenshots";
import TechStack from "./sections/TechStack";
import DownloadSection from "./sections/Download";
import FAQ from "./sections/FAQ";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#030303] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-neutral-100">
      {/* Top Navigation */}
      <Navbar />

      {/* Page Sections */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <Hero />

        {/* Motivation Section */}
        <WhyStreakLab />

        {/* Feature Cards Grid */}
        <Features />

        {/* Interactive Screenshot Showcase */}
        <Screenshots />

        {/* Tech Stack List */}
        <TechStack />

        {/* Download Action Section */}
        <DownloadSection />

        {/* Accordion FAQ Grid */}
        <FAQ />
      </main>

      {/* Brand Footer */}
      <Footer />
    </div>
  );
}
