# 🔁 Repeat- — Premium Habit & Task Management Suite

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2-black.svg?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Version](https://img.shields.io/badge/React-19.2-blue.svg?logo=react&logoColor=white)](https://react.dev)
[![Zustand Store](https://img.shields.io/badge/Zustand-5.0-orange.svg?logo=react&logoColor=white)](https://github.com/pmndrs/zustand)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.3-0055FF.svg?logo=framer&logoColor=white)](https://framer.com/motion)

**Repeat-** is a premium, high-fidelity habit-building and task management application designed to elevate productivity. Featuring a dark-mode ambient interface with smooth spring physics animations, it integrates natural language (NLP) task scheduling, customized alarm loops, focus session interfaces, and a clean user telemetry dashboard.

---

## 🎨 Premium UI/UX & Motion Design

*   **Ambient Glow Aesthetics:** Features shifting neon background orbs (`ambient-orb`) that respond to focus modes and application states.
*   **Tactile Sound & Haptic Integration:** Fluid click events, alarm loops, and interactive haptic sound triggers build physical depth.
*   **Spotify-Style "Now Playing" Bar:** Minimized active tasks slide gracefully into a bottom utility bar, allowing you to expand back into a full-screen Focus Mode at any time.
*   **Framer Motion Physics:** Smooth spring physics configuration (`stiffness: 100, damping: 20`) drives task entries, card deletions, and modal popups.

---

## ⚙️ Core Architecture & Features

### 1. Indonesian Natural Language Processing (NLP) Parser
Located in `src/utils/nlpParser.js`, the custom NLP module parses task scheduling statements directly from user inputs:
*   **Time Inferences:** Recognizes formats like *"5 menit lagi"*, *"2 jam lagi"*, and *"pukul 07.30 malam"*.
*   **Contextual Auto-Categorization:** Automatically categorizes tasks based on word heuristics (e.g. labeling *"minum paracetamol"* as `medicine`, and *"makan malam"* as `meal`).
*   **Guardrail Checks:** Filters out-of-scope inquiries (general queries, cooking recipes, weather forecasts, political talks) with strict validation errors to maintain product focus.

### 2. Isomorphic Offline State Control (Zustand v5)
Stores configured in `src/store/` utilize Zustand for fast, reactive, and memory-efficient client state:
*   **`reminderStore`**: Governs scheduling queues, active countdown states, and alarm trigger status.
*   **`settingsStore`**: Manages user profiles, productivity metrics, auto-categorization preferences, and sound volumes.

### 3. Google Services Ready
Equipped with `googleapis` and `NextAuth.js` dependencies to allow secure Google OAuth sign-in and integration with calendar workflows.

---

## 📂 Repository Structure

```
Repeat-/
├── src/
│   ├── app/
│   │   ├── globals.css         # Custom animations & tailwind directives
│   │   ├── layout.js           # Main app layout with theme wrappers
│   │   ├── page.js             # Core dashboard controller
│   │   └── settings/           # Settings subpage
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── AddReminderModal.jsx # NLP-powered reminder creation modal
│   │   ├── CardGrid.jsx        # Habit and task lists grid
│   │   ├── FocusMode.jsx       # Immersive fullscreen focus session screen
│   │   ├── GlobalNav.jsx       # Header and navigation bar
│   │   ├── NowPlayingBar.jsx   # Sticky bottom task controller bar
│   │   └── ProductivityIDModal.jsx # User credentials & stats modal
│   │
│   ├── store/                  # Zustand Store Modules
│   │   ├── reminderStore.js    # Task queue and status state
│   │   └── settingsStore.js    # User settings and flags state
│   │
│   └── utils/                  # Application Utilities
│       ├── nlpParser.js        # Natural language processing rules
│       ├── notifications.js    # Browser Web Notification handler
│       └── sounds.js           # Audio context loops and SFX trigger
```

---

## ⚡ Local Setup

### Prerequisites
*   Node.js (v18 or higher)
*   NPM / PNPM / Bun

### Installation & Run

1. Clone the repository:
   ```bash
   git clone https://github.com/theclipperss1-create/Repeat-.git
   cd Repeat-
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```
   Open **`http://localhost:3000`** in your browser.

4. Compile and verify production build:
   ```bash
   npm run build
   ```
