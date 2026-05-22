'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReminderStore } from '@/store/reminderStore';
import { useSettingsStore } from '@/store/settingsStore';
import { ReminderCard } from './ReminderCard';
import { EmptyState } from './EmptyState';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};



export function CardGrid({ onCardClick, onAdd }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getTodayReminders = useReminderStore((s) => s.getTodayReminders);
  const { layoutDensity } = useSettingsStore();
  
  const todayReminders = mounted ? getTodayReminders() : [];
  
  const pending = todayReminders.filter((r) => !r.isCompleted);
  const completed = todayReminders.filter((r) => r.isCompleted);

  // Dynamic grid classes based on settings
  const gridClass = layoutDensity === 'compact' 
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-t-ink border-black/10 rounded-full animate-spin" />
      </div>
    );
  }

  if (todayReminders.length === 0) return <EmptyState onAdd={onAdd} />;

  return (
    <div className="space-y-16">
      {pending.length > 0 && (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center justify-between mb-8">
            <h2 className="heading-section">Today</h2>
            <div className="px-4 py-1.5 rounded-full bg-parchment border border-border text-[15px] font-semibold text-ink">
              {pending.length} pending
            </div>
          </div>
          <div className={gridClass}>
            <AnimatePresence mode="popLayout">
              {pending.map((r) => (
                <ReminderCard key={r.id} reminder={r} onClick={onCardClick} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {completed.length > 0 && (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="heading-section text-muted">Completed</h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-subtle">{completed.length} done</span>
          </div>
          <div className={`${gridClass} opacity-70 hover:opacity-100 transition-opacity duration-300`}>
            <AnimatePresence mode="popLayout">
              {completed.map((r) => (
                <ReminderCard key={r.id} reminder={r} onClick={onCardClick} />
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
