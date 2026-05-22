'use client';

import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Pill, UtensilsCrossed, CircleCheckBig, Check, Clock, Repeat, Flag, BellRing, Trash2 } from 'lucide-react';
import { formatReminderTime } from '@/utils/formatTime';
import { useReminderStore } from '@/store/reminderStore';
import { useSettingsStore } from '@/store/settingsStore';
import { playDeepClick, triggerHaptic } from '@/utils/sounds';

const categoryConfig = {
  medicine: { icon: Pill, color: '#ff3b30', bg: 'rgba(255,59,48,0.12)', glow: 'rgba(255,59,48,0.2)' },
  meal: { icon: UtensilsCrossed, color: '#ff9500', bg: 'rgba(255,149,0,0.12)', glow: 'rgba(255,149,0,0.2)' },
  task: { icon: CircleCheckBig, color: '#0a84ff', bg: 'rgba(10,132,255,0.12)', glow: 'rgba(10,132,255,0.2)' },
};

export function ReminderCard({ reminder, onClick }) {
  const completeReminder = useReminderStore((s) => s.completeReminder);
  const uncompleteReminder = useReminderStore((s) => s.uncompleteReminder);
  const deleteReminder = useReminderStore((s) => s.deleteReminder);
  const snoozeReminder = useReminderStore((s) => s.snoozeReminder);

  const { theme } = useSettingsStore();



  const config = categoryConfig[reminder.category] || categoryConfig.task;
  const IconComponent = config.icon;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (reminder.isCompleted) {
      uncompleteReminder(reminder.id);
    } else {
      playDeepClick();
      triggerHaptic('default');
      completeReminder(reminder.id);
    }
  };


  const handleDelete = (e) => {
    e.stopPropagation();
    deleteReminder(reminder.id);
  };

  const handleSnooze = (e) => {
    e.stopPropagation();
    snoozeReminder(reminder.id, 15);
  };

  const isHighPriority = reminder.priority === 'high' && !reminder.isCompleted;

  const dragX = useMotionValue(0);
  const doneOpacity = useTransform(dragX, [0, 60], [0, 1]);
  const snoozeOpacity = useTransform(dragX, [-60, 0], [1, 0]);

  return (
    <div className="relative group rounded-[28px]">
      {/* Swipe reveal background */}
      <div className="absolute inset-0 flex items-center justify-between px-6 rounded-[28px] overflow-hidden pointer-events-none">
        <motion.div
          style={{
            opacity: doneOpacity,
            background: 'rgba(52,199,89,0.15)',
            color: '#34c759'
          }}
          className="flex items-center gap-2 font-bold text-[14px] px-4 py-2 rounded-full"
        >
          <Check size={16} strokeWidth={3} /> Done
        </motion.div>
        <motion.div
          style={{
            opacity: snoozeOpacity,
            background: 'rgba(255,159,10,0.15)',
            color: '#ff9f0a'
          }}
          className="flex items-center gap-2 font-bold text-[14px] px-4 py-2 rounded-full"
        >
          Snooze <BellRing size={16} strokeWidth={2.5} />
        </motion.div>
      </div>

      <motion.div
        layout
        drag="x"
        style={{ x: dragX }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.35}
        onDragEnd={(e, info) => {
          if (info.offset.x > 90) handleToggle(e);
          else if (info.offset.x < -90) handleSnooze(e);
        }}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -12, transition: { duration: 0.25 } }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        whileHover={{ y: -2 }}
        className={`relative card-glass rounded-[28px] p-6 cursor-pointer select-none ${
          isHighPriority
            ? 'border-[1.5px] border-danger/40 shadow-[0_0_24px_rgba(255,59,48,0.12)]'
            : ''
        } ${reminder.isCompleted ? 'opacity-50 grayscale-[0.4]' : ''}`}
        onClick={() => onClick?.(reminder)}
      >
        {/* Top color accent bar */}
        <div
          className="absolute top-0 left-8 right-8 h-[3px] rounded-b-full opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }}
        />

        {/* Icon + toggle */}
        <div className="flex items-start justify-between mb-5 pointer-events-none">
          <motion.div
            whileHover={{ scale: 1.12, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center pointer-events-auto"
            style={{ backgroundColor: config.bg, color: config.color }}
          >
            <IconComponent size={22} strokeWidth={2} />
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={handleToggle}
            className={`w-7 h-7 rounded-full border-[2px] flex items-center justify-center transition-all duration-300 pointer-events-auto ${
              reminder.isCompleted
                ? 'border-transparent text-white'
                : 'border-border hover:border-primary'
            }`}
            style={reminder.isCompleted ? { backgroundColor: config.color } : {}}
          >
            <AnimatePresence>
              {reminder.isCompleted && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Check size={13} strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Title */}
        <h3 className={`font-display text-[20px] font-semibold tracking-tight text-ink mb-3 leading-snug pointer-events-none ${
          reminder.isCompleted ? 'line-through opacity-60' : ''
        }`}>
          {reminder.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold liquid-glass text-ink">
            <Clock size={12} className="text-muted" />
            {formatReminderTime(reminder.scheduledTime)}
          </div>

          {reminder.recurrence && reminder.recurrence !== 'none' && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium liquid-glass text-muted">
              <Repeat size={11} />
              <span className="capitalize">{reminder.recurrence}</span>
            </div>
          )}

          {reminder.priority && reminder.priority !== 'medium' && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${
                reminder.priority === 'high'
                  ? 'bg-danger/10 text-danger border-danger/25'
                  : 'bg-parchment text-muted border-border'
              }`}
            >
              <Flag size={11} />
              <span className="capitalize">{reminder.priority}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {reminder.notes && (
          <p className="text-[14px] text-muted line-clamp-2 leading-relaxed mt-4 pointer-events-none">
            {reminder.notes}
          </p>
        )}

        {/* Hover action buttons */}
        <div className="absolute top-5 right-5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          {!reminder.isCompleted && (
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleSnooze}
              title="Snooze 15m"
              className="w-8 h-8 liquid-glass rounded-full flex items-center justify-center text-muted hover:text-primary transition-colors pointer-events-auto"
            >
              <BellRing size={13} strokeWidth={2.5} />
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleDelete}
            title="Delete"
            className="w-8 h-8 liquid-glass rounded-full flex items-center justify-center text-muted hover:text-danger transition-colors pointer-events-auto"
          >
            <Trash2 size={13} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
