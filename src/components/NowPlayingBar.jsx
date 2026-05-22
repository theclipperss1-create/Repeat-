'use client';

import { motion } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NowPlayingBar({ reminder, onExpand, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-24 sm:bottom-[120px] left-4 right-4 z-[8500] max-w-[500px] mx-auto"
    >
      <div 
        onClick={onExpand}
        className="w-full liquid-glass rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:border-primary/30 transition-colors"
      >
        {/* Progress Bar (Spotify style) underneath */}
        <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-border rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: isPlaying ? '100%' : 'auto' }}
            transition={{ duration: 60, ease: "linear" }}
          />
        </div>

        <div className="flex flex-col ml-2 truncate pr-4">
          <span className="font-semibold text-[15px] text-ink leading-tight truncate">
            {reminder.title}
          </span>
          <span className="text-[13px] text-muted font-medium mt-0.5">
            Focusing • {formatTime(secondsElapsed)}
          </span>
        </div>

        <div className="flex items-center gap-3 pr-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
