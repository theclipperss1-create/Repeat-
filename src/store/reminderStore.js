import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).substr(2);

export const useReminderStore = create(
  persist(
    (set, get) => ({
      reminders: [],
      customCategories: [],

      addCustomCategory: (categoryLabel) => {
        set((state) => {
          // Check if it already exists (case-insensitive)
          const exists = state.customCategories.some(
            (c) => c.label.toLowerCase() === categoryLabel.toLowerCase()
          );
          if (exists) return state;

          const newCategory = {
            value: categoryLabel.toLowerCase().replace(/\s+/g, '-'),
            label: categoryLabel,
          };
          return { customCategories: [...state.customCategories, newCategory] };
        });
      },

      addReminder: (input) => {
        const newReminder = {
          id: generateId(),
          title: input.title,
          category: input.category,
          scheduledTime: input.scheduledTime,
          notes: input.notes || '',
          sound: input.sound || 'default',
          priority: input.priority || 'medium', // 'low', 'medium', 'high'
          recurrence: input.recurrence || 'none', // 'none', 'daily', 'weekly'
          isCompleted: false,
          completedAt: null,
          snoozeCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          reminders: [...state.reminders, newReminder],
        }));
        return newReminder;
      },

      completeReminder: (id) => {
        set((state) => {
          const updatedReminders = state.reminders.map((r) => {
            if (r.id === id) {
              const baseUpdate = { ...r, isCompleted: true, completedAt: new Date().toISOString() };
              return baseUpdate;
            }
            return r;
          });
          
          // Handle Recurrence (Create next instance)
          const target = state.reminders.find(r => r.id === id);
          if (target && target.recurrence !== 'none') {
             const nextTime = new Date(target.scheduledTime);
             if (target.recurrence === 'daily') nextTime.setDate(nextTime.getDate() + 1);
             if (target.recurrence === 'weekly') nextTime.setDate(nextTime.getDate() + 7);
             
             updatedReminders.push({
               ...target,
               id: generateId(),
               scheduledTime: nextTime.toISOString(),
               isCompleted: false,
               completedAt: null,
               snoozeCount: 0,
               createdAt: new Date().toISOString(),
             });
          }

          return { reminders: updatedReminders };
        });
      },

      uncompleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id
              ? { ...r, isCompleted: false, completedAt: null }
              : r
          ),
        }));
      },

      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },

      snoozeReminder: (id, minutes = 15) => {
        set((state) => ({
          reminders: state.reminders.map((r) => {
            if (r.id === id) {
              const newTime = new Date(r.scheduledTime);
              newTime.setMinutes(newTime.getMinutes() + minutes);
              return { 
                ...r, 
                scheduledTime: newTime.toISOString(),
                snoozeCount: (r.snoozeCount || 0) + 1
              };
            }
            return r;
          })
        }));
      },

      getTodayReminders: () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return get()
          .reminders.filter((r) => {
            const time = new Date(r.scheduledTime);
            return time >= today && time < tomorrow;
          })
          .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
      },

      getAllReminders: () => {
        return get().reminders.sort(
          (a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime)
        );
      },
    }),
    { name: 'repeat-reminders' }
  )
);
