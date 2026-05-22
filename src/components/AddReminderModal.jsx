'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, UtensilsCrossed, CircleCheckBig, Volume2, Plus, Hash } from 'lucide-react';
import { useReminderStore } from '@/store/reminderStore';
import { SOUNDS, previewSound } from '@/utils/sounds';

const categories = [
  { value: 'medicine', label: 'Medicine', icon: Pill },
  { value: 'meal', label: 'Meal', icon: UtensilsCrossed },
  { value: 'task', label: 'Task', icon: CircleCheckBig },
];



function getDefaultTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30);
  now.setSeconds(0);
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function AddReminderModal({ isOpen, onClose, initialData = null }) {
  const addReminder = useReminderStore((s) => s.addReminder);
  const customCategories = useReminderStore((s) => s.customCategories);
  const addCustomCategory = useReminderStore((s) => s.addCustomCategory);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('medicine');
  const [scheduledTime, setScheduledTime] = useState(getDefaultTime());
  const [sound, setSound] = useState('default');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setCategory(initialData?.category || 'medicine');
      setScheduledTime(initialData?.scheduledTime || getDefaultTime());
      setSound(initialData?.sound || 'default');
      setIsAddingCategory(false);
      setNewCategoryName('');
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    if (!title.trim()) return;
    addReminder({
      title: title.trim(),
      category,
      scheduledTime: new Date(scheduledTime).toISOString(),
      notes: '',
      sound,
      priority: 'medium',
      recurrence: 'none',
    });
    onClose();
  };

  const handleSaveNewCategory = () => {
    if (newCategoryName.trim()) {
      addCustomCategory(newCategoryName.trim());
      setCategory(newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'));
    }
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center px-4 pb-4 sm:p-0">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          <motion.div
            className="relative w-full max-w-[600px] bg-canvas rounded-[32px] overflow-hidden shadow-2xl border border-border flex flex-col max-h-[90vh]"
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header / Title */}
            <div className="p-6 sm:p-8 pb-4 border-b border-border bg-parchment flex-shrink-0">
              <input
                className="w-full bg-transparent font-display text-[28px] sm:text-[40px] font-semibold text-ink outline-none placeholder:text-muted/40"
                placeholder="What to remember?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && title.trim() && handleSave()}
                autoFocus
              />
            </div>

            {/* Scrollable Content */}
            <div className="p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              
              <div className="flex flex-col gap-3">
                <span className="text-[13px] font-semibold uppercase tracking-widest text-muted">Category</span>
                <div className="flex gap-2 flex-wrap items-center">
                  {[...categories, ...customCategories].map((cat) => {
                    const Icon = cat.icon || Hash;
                    const selected = category === cat.value;
                    return (
                      <motion.button
                        key={cat.value}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCategory(cat.value)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-[15px] font-medium transition-all duration-200 border ${
                          selected
                            ? 'bg-primary border-primary text-canvas shadow-md'
                            : 'bg-canvas border-border text-ink hover:bg-parchment'
                        }`}
                      >
                        <Icon size={16} strokeWidth={2.5} />
                        {cat.label}
                      </motion.button>
                    );
                  })}
                  
                  {isAddingCategory ? (
                    <div className="flex items-center bg-canvas border border-primary rounded-full overflow-hidden shadow-sm h-[46px]">
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Nama kategori..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveNewCategory()}
                        onBlur={handleSaveNewCategory}
                        className="bg-transparent px-4 text-[15px] font-medium text-ink outline-none w-[140px]"
                      />
                    </div>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsAddingCategory(true)}
                      className="flex items-center gap-2 px-4 py-3 rounded-full text-[14px] font-medium transition-all duration-200 border border-dashed border-muted/50 text-muted hover:text-ink hover:border-ink hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Plus size={16} strokeWidth={2.5} />
                      Lainnya
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <span className="text-[13px] font-semibold uppercase tracking-widest text-muted">When</span>
                  <input
                    className="input-premium"
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <span className="text-[13px] font-semibold uppercase tracking-widest text-muted">Sound</span>
                  <div className="flex gap-2 flex-wrap h-full content-start">
                    {SOUNDS.map((s) => {
                      const selected = sound === s.id;
                      return (
                        <motion.button
                          key={s.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSound(s.id);
                            if (s.frequencies) previewSound(s.id);
                          }}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium transition-colors border ${
                            selected
                              ? 'bg-ink border-ink text-canvas'
                              : 'bg-transparent border-transparent text-muted hover:bg-parchment hover:text-ink'
                          }`}
                        >
                          <Volume2 size={14} strokeWidth={2.5} />
                          {s.name}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 bg-parchment border-t border-border flex justify-end gap-3 flex-shrink-0">
              <button 
                onClick={onClose}
                className="px-6 py-3 rounded-full font-semibold text-[15px] text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={!title.trim()}
                className="px-8 py-3 rounded-full font-semibold text-[15px] bg-primary text-canvas disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                Save
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
