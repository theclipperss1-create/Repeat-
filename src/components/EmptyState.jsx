'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function EmptyState({ onAdd }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-32 px-6"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-ink/5 rounded-full blur-2xl animate-pulse" />
        <div className="w-24 h-24 bg-canvas border border-black/5 dark:border-white/10 shadow-xl rounded-full flex items-center justify-center relative z-10">
          <Sparkles size={40} className="text-ink" strokeWidth={1.5} />
        </div>
      </div>
      
      <h2 className="heading-section text-ink mb-3 text-center">A blank canvas.</h2>
      <p className="text-subtle text-center max-w-sm mb-10 leading-relaxed">
        You have no reminders. Create a new one to start organizing your beautiful day.
      </p>

      {onAdd && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className="bg-ink text-canvas px-8 py-4 rounded-full font-semibold text-[17px] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          Create New Reminder
        </motion.button>
      )}
    </motion.div>
  );
}
