'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { parseReminderInput } from '@/utils/nlpParser';
import { useReminderStore } from '@/store/reminderStore';
import { useSettingsStore } from '@/store/settingsStore';

export function OmniPill() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [errorToast, setErrorToast] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);
  const addReminder = useReminderStore((s) => s.addReminder);

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, -5, 5, -2, 2, 0],
      transition: { duration: 0.4 }
    },
    idle: { x: 0 }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    // Simulate AI network latency (Silent Magic)
    setTimeout(() => {
      const parsed = parseReminderInput(input);
      
      if (parsed.status === 'error') {
        setIsShaking(true);
        
        // After shake animation completes (approx 450ms), transition to showing the Polite Rejection Toast
        setTimeout(() => {
          setIsShaking(false);
          setIsProcessing(false);
          setErrorToast('Maaf, aku hanya bisa membantu mengatur jadwal dan tugas.');
          setInput('');
          
          // Toast persists for 3 seconds, then fades out
          setTimeout(() => {
            setErrorToast(null);
          }, 3000);
        }, 450);
        return;
      }

      const parsedData = parsed.data;
      addReminder({
        title: parsedData.title,
        category: parsedData.category,
        scheduledTime: parsedData.scheduledTime,
        priority: 'medium',
        recurrence: 'none',
        sound: 'default'
      });

      // Show scheduling confirmation toast
      const timeString = new Date(parsedData.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSuccessToast(`${parsedData.title} dijadwalkan pukul ${timeString}`);
      
      setInput('');
      setIsProcessing(false);

      // Dismiss toast after 3 seconds
      setTimeout(() => {
        setSuccessToast(null);
      }, 3000);

    }, 800); // 800ms loading illusion
  };

  return (
    <div className="fixed bottom-6 sm:bottom-10 left-4 right-20 sm:left-0 sm:right-0 z-[8000] flex sm:justify-center sm:px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        {successToast ? (
          <motion.div
            key="success-toast"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="pointer-events-auto bg-ink/90 dark:bg-[#1C1C1E]/95 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center justify-center shadow-lg border border-border"
          >
            <span className="text-[12px] font-semibold text-canvas dark:text-ink tracking-wide">{successToast}</span>
          </motion.div>
        ) : errorToast ? (
          <motion.div
            key="error-toast"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="pointer-events-auto bg-[#f2f2f7] dark:bg-[#1c1c1e] backdrop-blur-md rounded-full px-5 py-2.5 flex items-center justify-center shadow-lg border border-border/80"
          >
            <span className="text-[12px] font-semibold text-ink dark:text-white tracking-wide">{errorToast}</span>
          </motion.div>
        ) : (
          <motion.form
            key="input"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="pointer-events-auto relative w-full sm:max-w-[500px]"
          >
            <motion.div
              variants={shakeVariants}
              animate={isShaking ? "shake" : "idle"}
              className="relative w-full"
            >
              <motion.div
                animate={{ scale: isProcessing ? 0.96 : 1, opacity: isProcessing ? 0.8 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="relative w-full"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isProcessing}
                  placeholder="Ketik apa yang perlu diingat..."
                  className="w-full liquid-glass rounded-full py-4 pl-6 pr-12 text-[15px] font-medium text-ink placeholder:text-muted/60 outline-none focus:border-primary/30 focus:shadow-[0_8px_30px_rgba(0,102,204,0.15)] transition-all duration-300 disabled:opacity-50"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary">
                  {isProcessing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Sparkles size={18} strokeWidth={2} className="opacity-70" />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
