'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/store/settingsStore';
import { useReminderStore } from '@/store/reminderStore';
import { GlobalNav } from '@/components/GlobalNav';
import { 
  Moon, Sun, PaintBucket, Settings, Sparkles, Check
} from 'lucide-react';
import { requestNotificationPermission } from '@/utils/notifications';
import { playDeepClick, triggerHaptic } from '@/utils/sounds';

const themes = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' }
];

const accents = [
  { id: 'ink', color: '#ffffff', label: 'Ink' }, // white icon/accent indicator for settings
  { id: 'blue', color: '#0066cc', label: 'Blue' },
  { id: 'orange', color: '#ff9500', label: 'Orange' },
  { id: 'green', color: '#34c759', label: 'Green' }
];

const accentHexMap = {
  ink: '#ffffff',
  blue: '#0066cc',
  orange: '#ff9500',
  green: '#34c759',
};

export default function SettingsPage() {
  const {
    theme, setTheme,
    accentColor, setAccentColor,
    layoutDensity, setLayoutDensity,
    timeFormat, setTimeFormat,
    autoCategorization, setAutoCategorization,
    predictiveSuggestions, setPredictiveSuggestions,
    userName, setUserName
  } = useSettingsStore();

  const reminders = useReminderStore((s) => s.reminders);

  const [notifPermission, setNotifPermission] = useState('default');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingName, setEditingName] = useState(userName || 'Alex');

  // Force dark background on settings page
  useEffect(() => {
    const origBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#0c0c0e';
    return () => {
      document.body.style.backgroundColor = origBg;
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const handleRequestNotif = async () => {
    playDeepClick();
    const granted = await requestNotificationPermission();
    setNotifPermission(granted ? 'granted' : 'denied');
  };

  const saveUserName = () => {
    setUserName(editingName.trim() || 'Alex');
    setShowProfileModal(false);
    playDeepClick();
    triggerHaptic('subtle');
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f4f5] pb-32 pt-28 selection:bg-white/20 selection:text-white" style={{
      '--color-parchment': '#0c0c0e',
      '--color-canvas': '#18181b',
      '--color-canvas-glass': 'rgba(24, 24, 27, 0.8)',
      '--color-ink-base': '#f4f4f5',
      '--color-muted-base': '#a1a1aa',
      '--color-border-base': 'rgba(255, 255, 255, 0.08)',
      '--color-border-hover': 'rgba(255, 255, 255, 0.16)',
    }}>
      <GlobalNav onProfileClick={() => {
        playDeepClick();
        setShowProfileModal(true);
      }} />

      <main className="max-w-[640px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col items-center text-center mt-6 mb-12">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
              <Settings className="text-[#a1a1aa] animate-pulse" size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-white">Settings</h1>
            <p className="text-[14px] text-[#71717a] mt-1 font-medium">Configure Repeat premium features</p>
          </div>

          <div className="space-y-10">

            {/* Section 1: Appearance & Design */}
            <section className="space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#71717a] px-1 flex items-center gap-1.5">
                <PaintBucket size={13} /> Appearance & Design
              </h2>
              
              <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {/* Theme mode */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block font-medium text-[15px] text-white">Global Theme</span>
                    <span className="text-[13px] text-[#71717a]">Affects the main workspace.</span>
                  </div>
                  <div className="flex bg-black/40 rounded-full p-0.5 border border-white/5 w-full sm:w-[180px]">
                    {themes.map((t) => {
                      const Icon = t.icon;
                      const active = theme === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id);
                            playDeepClick();
                            triggerHaptic('subtle');
                          }}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                            active ? 'bg-white/10 shadow-lg text-white' : 'text-[#71717a] hover:text-white'
                          }`}
                        >
                          <Icon size={14} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Accent Colors */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block font-medium text-[15px] text-white">Accent Color</span>
                    <span className="text-[13px] text-[#71717a]">Choose your visual energy level.</span>
                  </div>
                  <div className="flex gap-2.5">
                    {accents.map((a) => {
                      const active = accentColor === a.id;
                      return (
                        <button
                          key={a.id}
                          onClick={() => {
                            setAccentColor(a.id);
                            playDeepClick();
                            triggerHaptic('subtle');
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            active ? 'scale-110 ring-2 ring-offset-2 ring-white ring-offset-[#1c1c1e]' : 'opacity-80 hover:opacity-100 hover:scale-105'
                          }`}
                          style={{ backgroundColor: a.id === 'ink' ? '#ffffff' : a.color }}
                        >
                          {active && <Check size={14} className={a.id === 'ink' ? 'text-black' : 'text-white'} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Layout Density */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block font-medium text-[15px] text-white">Layout Density</span>
                    <span className="text-[13px] text-[#71717a]">Grid scaling for cards on Home.</span>
                  </div>
                  <div className="flex bg-black/40 rounded-full p-0.5 border border-white/5 w-full sm:w-[180px]">
                    <button 
                      onClick={() => {
                        setLayoutDensity('compact');
                        playDeepClick();
                        triggerHaptic('subtle');
                      }}
                      className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all ${layoutDensity === 'compact' ? 'bg-white/10 text-white shadow-sm' : 'text-[#71717a]'}`}
                    >Compact</button>
                    <button 
                      onClick={() => {
                        setLayoutDensity('spacious');
                        playDeepClick();
                        triggerHaptic('subtle');
                      }}
                      className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all ${layoutDensity === 'spacious' ? 'bg-white/10 text-white shadow-sm' : 'text-[#71717a]'}`}
                    >Spacious</button>
                  </div>
                </div>

                {/* Time Format */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block font-medium text-[15px] text-white">Time Format</span>
                    <span className="text-[13px] text-[#71717a]">12-hour or 24-hour display.</span>
                  </div>
                  <div className="flex bg-black/40 rounded-full p-0.5 border border-white/5 w-full sm:w-[140px]">
                    <button 
                      onClick={() => {
                        setTimeFormat('12h');
                        playDeepClick();
                        triggerHaptic('subtle');
                      }}
                      className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all ${timeFormat === '12h' ? 'bg-white/10 text-white shadow-sm' : 'text-[#71717a]'}`}
                    >12h</button>
                    <button 
                      onClick={() => {
                        setTimeFormat('24h');
                        playDeepClick();
                        triggerHaptic('subtle');
                      }}
                      className={`flex-1 py-1.5 rounded-full text-[13px] font-medium transition-all ${timeFormat === '24h' ? 'bg-white/10 text-white shadow-sm' : 'text-[#71717a]'}`}
                    >24h</button>
                  </div>
                </div>
              </div>
            </section>



            {/* Section 3: AI & System Behavior */}
            <section className="space-y-3">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[#71717a] px-1 flex items-center gap-1.5">
                <Sparkles size={13} /> AI Omni-Pill Settings
              </h2>
              
              <div className="bg-[#1c1c1e] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                {/* Auto Categorization */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="block font-medium text-[15px] text-white">Auto-Categorization</span>
                    <span className="text-[13px] text-[#71717a]">Auto-detect medicine and meal cards via keyword parsing.</span>
                  </div>
                  <button
                    onClick={() => {
                      setAutoCategorization(!autoCategorization);
                      playDeepClick();
                      triggerHaptic('subtle');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${autoCategorization ? 'bg-green-500' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      className="w-5 h-5 bg-white rounded-full absolute left-0.5"
                      animate={{ x: autoCategorization ? 20 : 0 }}
                    />
                  </button>
                </div>

                {/* Predictive Suggestion Chips */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <span className="block font-medium text-[15px] text-white">Predictive Suggestions</span>
                    <span className="text-[13px] text-[#71717a]">Float habit suggestions based on timing & daily routines.</span>
                  </div>
                  <button
                    onClick={() => {
                      setPredictiveSuggestions(!predictiveSuggestions);
                      playDeepClick();
                      triggerHaptic('subtle');
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${predictiveSuggestions ? 'bg-green-500' : 'bg-white/10'}`}
                  >
                    <motion.div 
                      className="w-5 h-5 bg-white rounded-full absolute left-0.5"
                      animate={{ x: predictiveSuggestions ? 20 : 0 }}
                    />
                  </button>
                </div>
              </div>
            </section>


          </div>
        </motion.div>
      </main>

      {/* Profile Edit Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white mb-4">Edit Profile Name</h3>
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] outline-none focus:border-white/20 mb-6 font-medium"
                placeholder="Enter profile name"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#a1a1aa] hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={saveUserName}
                  className="px-5 py-2 rounded-full text-[13px] font-semibold bg-white text-black hover:bg-white/90 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
