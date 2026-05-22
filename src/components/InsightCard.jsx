import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { useReminderStore } from '@/store/reminderStore';

export function InsightCard() {
  const [isVisible, setIsVisible] = useState(true);
  const addReminder = useReminderStore(s => s.addReminder);

  const handleAddRoutine = () => {
    // Save to routine store
    const tomorrowMorning = new Date();
    tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
    tomorrowMorning.setHours(8, 0, 0, 0);

    addReminder({
      title: 'Membaca Jurnal & Ngopi',
      category: 'task',
      scheduledTime: tomorrowMorning.toISOString(),
      priority: 'medium',
      recurrence: 'daily'
    });

    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="mt-12 mb-32 mx-4 sm:mx-0 px-6 sm:px-8 py-8 sm:py-10 bg-parchment border border-border/50 rounded-[32px] shadow-sm relative overflow-hidden"
        >
          {/* Subtle gradient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[13px] font-bold uppercase tracking-widest text-primary">Insight for you</span>
            </div>
            
            <p className="text-[26px] sm:text-[28px] font-normal text-ink leading-snug tracking-tight mb-8">
              {"\"Kamu sering menunda tugas membaca jurnal di malam hari. Pindahkan ke jam 08:00 pagi bersama jadwal ngopi?\""}
            </p>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddRoutine}
              className="flex items-center gap-2 bg-ink text-canvas px-6 py-3.5 rounded-full text-[15px] font-medium hover:bg-black/80 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <Plus size={18} strokeWidth={2.5} />
              Add to Routine
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
