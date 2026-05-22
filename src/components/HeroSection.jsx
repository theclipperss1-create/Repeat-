'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGreeting, getFormattedDate } from '@/utils/formatTime';
import { useReminderStore } from '@/store/reminderStore';
import { useSettingsStore } from '@/store/settingsStore';
import { playDeepClick, triggerHaptic } from '@/utils/sounds';

const suggestions = [
  { title: "Minum Vitamin", category: "medicine" },
  { title: "Jalan Kaki 10m", category: "task" },
  { title: "Minum Kopi Sore", category: "meal" },
  { title: "Baca Buku", category: "task" }
];

export function HeroSection({ onSuggestionSelect }) {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [date, setDate] = useState('');

  const { predictiveSuggestions } = useSettingsStore();

  useEffect(() => {
    setMounted(true);
    setGreeting(getGreeting());
    setDate(getFormattedDate());


    // Update greeting & date every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      setDate(getFormattedDate());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const getTodayReminders = useReminderStore((s) => s.getTodayReminders);
  const todayReminders = mounted ? getTodayReminders() : [];
  const pendingCount = todayReminders.filter((r) => !r.isCompleted).length;
  const completedCount = todayReminders.filter((r) => r.isCompleted).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="pb-14 pt-6 text-center sm:text-left"
    >
      {/* Date pill */}
      <motion.div variants={itemVariants} className="inline-flex items-center mb-5">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-muted px-4 py-1.5 rounded-full liquid-glass">
          {mounted ? date : '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'}
        </span>
      </motion.div>

      {/* Main heading with gradient shimmer */}
      <motion.h1 variants={itemVariants} className="heading-hero mb-5">
        <AnimatePresence mode="wait">
          <motion.span
            key={greeting}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {mounted ? greeting : '\u00a0'}
          </motion.span>
        </AnimatePresence>
      </motion.h1>

      {/* Sub heading */}
      <motion.p variants={itemVariants} className="text-[18px] sm:text-[22px] font-medium text-muted tracking-tight leading-relaxed mb-6">
        <AnimatePresence mode="wait">
          <motion.span
            key={pendingCount}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {!mounted
              ? 'Loading your schedule\u2026'
              : pendingCount === 0 && completedCount === 0
                ? 'Your schedule is clear. Relax and enjoy.'
                : pendingCount === 0
                  ? `All ${completedCount} task${completedCount !== 1 ? 's' : ''} done. Great work!`
                  : `You have ${pendingCount} task${pendingCount !== 1 ? 's' : ''} demanding attention.`}
          </motion.span>
        </AnimatePresence>
      </motion.p>

      {/* Predictive Suggestion Chips */}
      {mounted && predictiveSuggestions && (
        <motion.div 
          variants={itemVariants} 
          className="mt-2 mb-6"
        >
          <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted mb-2.5 text-center sm:text-left">
            Rekomendasi
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {suggestions.map((sug) => (
              <motion.button
                key={sug.title}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playDeepClick();
                  triggerHaptic('subtle');
                  onSuggestionSelect?.(sug);
                }}
                className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-canvas-glass text-ink border border-border hover:border-primary/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>{sug.title}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Progress dots */}
      {mounted && todayReminders.length > 0 && (
        <motion.div variants={itemVariants} className="flex items-center gap-2 justify-center sm:justify-start">
          {todayReminders.slice(0, 8).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 400, damping: 20 }}
              className={`rounded-full transition-all duration-500 ${
                r.isCompleted
                  ? 'w-2 h-2 bg-primary opacity-60'
                  : 'w-3 h-3 bg-primary'
              }`}
            />
          ))}
          {todayReminders.length > 8 && (
            <span className="text-[12px] text-muted font-medium">+{todayReminders.length - 8}</span>
          )}
        </motion.div>
      )}
    </motion.section>
  );
}
