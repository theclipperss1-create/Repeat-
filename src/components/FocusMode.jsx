'use client';

import { motion } from 'framer-motion';
import { X, Pill, UtensilsCrossed, CircleCheckBig, Check, Minimize2 } from 'lucide-react';
import { formatReminderTime } from '@/utils/formatTime';
import { useReminderStore } from '@/store/reminderStore';
import { playDeepClick, triggerHaptic } from '@/utils/sounds';

const categoryConfig = {
  medicine: { icon: Pill, color: '#ff453a' },
  meal: { icon: UtensilsCrossed, color: '#ff9f0a' },
  task: { icon: CircleCheckBig, color: '#0a84ff' },
};

export function FocusMode({ reminder, onClose, onMinimize }) {
  const completeReminder = useReminderStore((s) => s.completeReminder);

  const config = categoryConfig[reminder.category] || categoryConfig.task;
  const IconComponent = config.icon;

  const handleDone = () => {
    playDeepClick();
    triggerHaptic('default');
    completeReminder(reminder.id);
    onClose();
  };


  return (
    <motion.div
      className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: config.color }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      <div className="absolute top-8 right-8 z-10 flex gap-4">
        {onMinimize && (
          <button
            onClick={onMinimize}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all duration-300 backdrop-blur-md"
            title="Minimize to Now Playing"
          >
            <Minimize2 size={20} strokeWidth={2} />
          </button>
        )}
        <button
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white/50 hover:bg-white/20 hover:text-white transition-all duration-300 backdrop-blur-md"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      <motion.div
        className="relative z-10 text-center px-6 max-w-[800px] w-full"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div 
          className="w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-10 shadow-2xl"
          style={{ backgroundColor: config.color, color: 'white' }}
        >
          <IconComponent size={36} strokeWidth={2} />
        </div>

        <h1 className="font-display text-[48px] sm:text-[72px] font-bold tracking-tighter text-white mb-6 leading-none">
          {reminder.title}
        </h1>

        <p className="font-display text-[24px] font-medium text-white/50 tracking-tight mb-16">
          {formatReminderTime(reminder.scheduledTime)}
        </p>

        <div className="flex items-center justify-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDone}
            className="flex items-center gap-2 bg-white text-black text-[18px] font-bold px-10 py-5 rounded-full hover:scale-105 transition-transform"
          >
            <Check size={20} strokeWidth={3} />
            Complete Task
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
