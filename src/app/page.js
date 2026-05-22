'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlobalNav } from '@/components/GlobalNav';
import { HeroSection } from '@/components/HeroSection';
import { CardGrid } from '@/components/CardGrid';
import { AddReminderModal } from '@/components/AddReminderModal';
import { FocusMode } from '@/components/FocusMode';
import { FloatingAddButton } from '@/components/FloatingAddButton';
import { OmniPill } from '@/components/OmniPill';
import { RoutinesGrid } from '@/components/RoutinesGrid';
import { InsightCard } from '@/components/InsightCard';
import { NowPlayingBar } from '@/components/NowPlayingBar';
import { ProductivityIDModal } from '@/components/ProductivityIDModal';
import { useReminderStore } from '@/store/reminderStore';
import { startLoopingSound, stopLoopingSound, playDeepClick, triggerHaptic } from '@/utils/sounds';
import { showNotification } from '@/utils/notifications';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialModalData, setInitialModalData] = useState(null);
  const [focusReminder, setFocusReminder] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const reminders = useReminderStore((s) => s.reminders);
  const triggeredIdsRef = useRef(new Set());

  useEffect(() => {
    if (!focusReminder && !activeTask) {
      stopLoopingSound();
    }
  }, [focusReminder, activeTask]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach((r) => {
        const scheduledTime = new Date(r.scheduledTime);
        if (scheduledTime > now) {
          triggeredIdsRef.current.delete(r.id);
        }
        if (!r.isCompleted && !triggeredIdsRef.current.has(r.id)) {
          const diffMs = now.getTime() - scheduledTime.getTime();
          if (diffMs >= 0 && diffMs < 10 * 60 * 1000) {
            triggeredIdsRef.current.add(r.id);
            startLoopingSound(r.sound);
            showNotification(r.title, `Time for ${r.title}!`);
            setFocusReminder(r);
          }
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <>
      {/* Ambient background orbs */}
      <div className="ambient-orb ambient-orb-1" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-2" aria-hidden="true" />
      <div className="ambient-orb ambient-orb-3" aria-hidden="true" />

      <GlobalNav onProfileClick={() => setIsProfileOpen(true)} />

      <main className="max-w-[1024px] mx-auto px-6 sm:px-12 pt-[130px] sm:pt-[150px] pb-44">
        <HeroSection onSuggestionSelect={(sug) => {
          setInitialModalData(sug);
          setIsModalOpen(true);
        }} />
        <RoutinesGrid onRoutineSelect={(data) => {
          setInitialModalData(data);
          setIsModalOpen(true);
        }} />
        <InsightCard />
        <CardGrid
          onCardClick={(reminder) => setFocusReminder(reminder)}
          onAdd={() => {
            setInitialModalData(null);
            setIsModalOpen(true);
          }}
        />
      </main>

      <FloatingAddButton onClick={() => {
        setInitialModalData(null);
        setIsModalOpen(true);
      }} />

      <OmniPill />

      <AddReminderModal
        isOpen={isModalOpen}
        initialData={initialModalData}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setInitialModalData(null), 300);
        }}
      />

      <AnimatePresence>
        {focusReminder && (
          <FocusMode
            reminder={focusReminder}
            onClose={() => setFocusReminder(null)}
            onMinimize={() => {
              setActiveTask(focusReminder);
              setFocusReminder(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTask && !focusReminder && (
          <NowPlayingBar 
            reminder={activeTask}
            onExpand={() => {
              setFocusReminder(activeTask);
              setActiveTask(null);
            }}
            onClose={() => setActiveTask(null)}
          />
        )}
      </AnimatePresence>

      <ProductivityIDModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />


    </>
  );
}
