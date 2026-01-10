# Shutdown Scheduler - Feature Roadmap

## 1. Menubar/Tray Integration

Add a persistent menubar (macOS) / system tray (Linux) presence with live countdown display.

**Reference:** Screenshot showing "30m" countdown with quick action icons

### Tasks

- [ ] Create tray icon with dynamic countdown text (e.g., "30m", "2h 15m")
- [ ] Build tray context menu with:
  - [ ] Settings gear icon
  - [ ] Quick add (+) button
  - [ ] Task list view
  - [ ] Play/pause controls for next scheduled task
  - [ ] Delete/cancel buttons
- [ ] Update countdown in real-time (every minute or configurable)
- [ ] Show different icon states (idle, active task, imminent warning)
- [ ] Click tray to open main window
- [ ] Option to hide dock icon when minimized to tray (macOS)

### Technical Notes

- Use Electron's `Tray` and `Menu` APIs
- Consider `nativeImage` for dynamic icon generation with countdown text
- May need platform-specific implementations for menubar text (macOS) vs icon-only (Linux)

---

## 2. UI Modernization

Redesign the main app interface based on `mockups/task-scheduler-pro/`.

**Reference:** `mockups/task-scheduler-pro/App.tsx`, `components/TaskCard.tsx`

### Design Changes

- [ ] Dark theme overhaul (black bg `#000`, zinc accents)
- [ ] Sticky header with app branding and version badge
- [ ] Dashboard stats section (total, upcoming, completed tasks)
- [ ] Natural language input bar at bottom (floating, glowing border effect)
- [ ] Modernized task cards with:
  - [ ] Live countdown per task
  - [ ] Color-coded action icons
  - [ ] Weekly day picker display
  - [ ] Progress bar visualization
  - [ ] Notes/context field
  - [ ] Edit and delete buttons

### Form Improvements

- [ ] Add "Title" field for custom task names
- [ ] Add "Notes" field for context
- [ ] Schedule mode toggle: Relative Delay vs Exact Time (absolute date/time picker)
- [ ] Better day-of-week picker for weekly schedules

### New Action Types

- [ ] Sleep mode support
- [ ] Meeting reminders (notification-only, no system action)
- [ ] Generic reminders (notification-only)

---

## 3. AI-Powered Natural Language Scheduling

Parse natural language input to create tasks automatically.

**Reference:** `mockups/task-scheduler-pro/services/geminiService.ts`

### Tasks

- [ ] Integrate local LLM (Ollama, llama.cpp, or similar)
- [ ] Create NLP parsing service that extracts:
  - Title
  - Action type (shutdown, restart, sleep, reminder)
  - Frequency (once, daily, weekly)
  - Schedule mode (relative vs absolute)
  - Time parameters (days, hours, minutes OR specific date/time)
  - Notes
- [ ] Add floating input bar UI component
- [ ] Show loading state during parsing
- [ ] Fallback to manual form if parsing fails
- [ ] Example prompts:
  - "Shut down in 3 hours"
  - "Restart daily at 2am"
  - "Remind me about meeting at 4pm tomorrow"

### Local Model Options

- [ ] Research: Ollama integration for local inference
- [ ] Research: Electron + llama.cpp bindings
- [ ] Consider structured output (JSON schema) for reliable parsing

---

## 4. High-Impact System Alerts

Full-screen overlay notifications before shutdown/restart with countdown timer.

**Reference:** `mockups/zennotify--high-impact-system-alerts/`, `mockups/zennotify--high-impact-system-alertsv2/`

### Alert Window

- [ ] Create new BrowserWindow for full-screen alert overlay
- [ ] Two visual styles:
  - **Classic**: Radial progress ring, structured layout, snooze options
  - **Zen**: Large typography, gradient backgrounds, minimal UI
- [ ] Live countdown timer (MM:SS format)
- [ ] Current time display in corner
- [ ] Action buttons: Primary (Restart Now / Join) and Secondary (Postpone / Dismiss)
- [ ] Snooze presets (1 min, 5 min, etc.)

### Behavior

- [ ] Trigger alert X minutes before scheduled action (configurable threshold, e.g., 5 min)
- [ ] Alert should be:
  - Full-screen but dismissible (not kiosk/locked)
  - Always on top
  - Shown on all displays (or primary only - configurable)
- [ ] Postpone/snooze functionality to delay the task
- [ ] Cancel option to abort the scheduled task entirely
- [ ] Auto-execute action when countdown reaches zero (or require confirmation)

### Optional: AI Briefing

- [ ] Show contextual AI-generated message about the event
- [ ] Could use local model to generate encouragement/context

---

## Implementation Priority

1. **Menubar/Tray** - High impact, improves daily usability
2. **High-Impact Alerts** - Critical for user awareness before shutdown
3. **UI Modernization** - Better UX, can be done incrementally
4. **AI Natural Language** - Nice-to-have, depends on local model setup

---

## Open Questions

- [ ] Local model choice: Ollama vs embedded llama.cpp?
- [ ] Alert trigger threshold: How many minutes before action?
- [ ] Should alerts be style-configurable (Classic vs Zen) in settings?
- [ ] Tray: Show countdown for nearest task only, or aggregate?
- [ ] Sleep mode: How to implement cross-platform? (macOS: `pmset`, Linux: `systemctl suspend`)
