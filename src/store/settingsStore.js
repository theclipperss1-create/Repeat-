import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light',
      accentColor: 'ink',
      layoutDensity: 'spacious',
      timeFormat: '12h',
      
      // Advanced AI & Ecosystem Settings
      autoCategorization: true,
      predictiveSuggestions: true,

      // Profile settings
      userName: 'Alex',
      userAvatar: null,
      
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setLayoutDensity: (layoutDensity) => set({ layoutDensity }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
      
      // AI & Ecosystem Setters
      setAutoCategorization: (val) => set({ autoCategorization: val }),
      setPredictiveSuggestions: (val) => set({ predictiveSuggestions: val }),

      // Profile Setters
      setUserName: (val) => set({ userName: val }),
      setUserAvatar: (val) => set({ userAvatar: val }),
    }),
    { name: 'repeat-settings' }
  )
);
