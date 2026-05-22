'use client';

import { motion } from 'framer-motion';
import { Coffee, Pill, BookOpen, Sun, Moon, Dumbbell } from 'lucide-react';

const routines = [
  { id: 'meds',      label: 'Morning Meds',  icon: Pill,      color: '#ff3b30', bg: 'rgba(255,59,48,0.12)' },
  { id: 'breakfast', label: 'Breakfast',      icon: Coffee,    color: '#ff9500', bg: 'rgba(255,149,0,0.12)' },
  { id: 'stretch',   label: 'Stretch',        icon: Dumbbell,  color: '#34c759', bg: 'rgba(52,199,89,0.12)' },
  { id: 'check',     label: 'Check Tasks',    icon: BookOpen,  color: '#0a84ff', bg: 'rgba(10,132,255,0.12)' },
  { id: 'sun',       label: 'Sunlight',       icon: Sun,       color: '#ffcc00', bg: 'rgba(255,204,0,0.12)' },
  { id: 'winddown',  label: 'Wind-down',      icon: Moon,      color: '#bf5af2', bg: 'rgba(191,90,242,0.12)' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  show: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 420, damping: 26 }
  }
};

export function RoutinesGrid({ onRoutineSelect }) {
  const handleRoutineClick = (routine) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 15);
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);

    onRoutineSelect({
      title: routine.label,
      category: routine.id === 'meds' ? 'medicine' : routine.id === 'breakfast' ? 'meal' : 'task',
      scheduledTime: local.toISOString().slice(0, 16),
      priority: 'medium',
      recurrence: 'none',
      sound: 'default',
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mb-14"
    >
      <h2 className="heading-section mb-5">Routines</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {routines.map((routine) => {
          const Icon = routine.icon;
          return (
            <motion.button
              key={routine.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRoutineClick(routine)}
              className="relative liquid-glass rounded-[20px] p-4 flex items-center gap-3 text-left overflow-hidden group transition-all duration-300"
            >
              {/* Subtle glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-[20px]"
                style={{ background: `radial-gradient(ellipse at 30% 50%, ${routine.bg} 0%, transparent 70%)` }}
              />

              <div
                className="relative w-9 h-9 rounded-[12px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: routine.bg }}
              >
                <Icon size={16} strokeWidth={2.5} style={{ color: routine.color }} />
              </div>

              <span className="relative font-semibold text-[13px] sm:text-[14px] text-ink leading-tight">
                {routine.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
