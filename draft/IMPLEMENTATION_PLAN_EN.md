# Dynamic, User-Customizable School Schedule App

## 1) Objective
Transform the current static single-file schedule page into a dynamic, user-customizable application where each local user can manage their own schedule, preferences, and visual settings.

## 2) Current State Analysis
The current app is a single HTML file with embedded CSS and JavaScript.

Key observations:
- Data is hardcoded in a single in-memory object.
- No persistent user data model.
- No create/edit/delete operations for sessions.
- No user-level customization storage.
- Timezone toggle exists, but logic is simplistic.
- UI structure is strong and can be reused as design reference.

## 3) Target Scope (MVP)
Build a local-first MVP with Vue 3 + TypeScript + Composition API.

In scope:
- Per-user local profile (local identity only, no real auth).
- Full session CRUD (create, update, delete).
- User preferences:
  - Default timezone.
  - Theme and accent color.
  - Visible days.
  - Session-type templates.
- Persistent local storage with schema versioning and safe hydration.
- RTL Arabic-friendly responsive UI.

Out of scope (for this MVP):
- Cloud sync and multi-device data sharing.
- Real authentication (email/OAuth).
- Backend API.

## 4) Architecture
### Frontend stack
- Vite
- Vue 3
- TypeScript
- Composition API with script setup

### Project structure (suggested)
- src/main.ts
- src/App.vue
- src/types/schedule.ts
- src/composables/useScheduleData.ts
- src/composables/useUserPreferences.ts
- src/composables/useTimezone.ts
- src/composables/useLocalPersistence.ts
- src/repositories/scheduleRepository.ts
- src/repositories/localScheduleRepository.ts
- src/components/shell/HeaderBar.vue
- src/components/schedule/DaysGrid.vue
- src/components/schedule/DayCard.vue
- src/components/schedule/DayDetails.vue
- src/components/schedule/SessionList.vue
- src/components/schedule/SessionEditor.vue
- src/components/preferences/PreferencesPanel.vue

### Design principles
- Keep source state minimal; derive view state with computed.
- Keep component responsibilities focused.
- Move business logic and side effects into composables.
- Keep the app backend-ready via repository abstraction.

## 5) Data Model
## 5.1 Core types
- UserProfile
  - userId: string
  - displayName: string
  - createdAt: ISO string
  - updatedAt: ISO string

- UserPreferences
  - timezone: "EGYPT" | "KSA"
  - themeMode: "light" | "dark" | "system"
  - accentColor: string
  - visibleDayKeys: string[]
  - defaultSessionType: string

- SessionItem
  - id: string
  - dayKey: string
  - startTime: string (HH:mm)
  - durationMinutes: number
  - studentName: string
  - subtitle: string
  - type: string
  - notes?: string

- ScheduleDay
  - key: string
  - titleAr: string
  - icon: string
  - colorToken: string
  - sessions: SessionItem[]

- AppDataEnvelope
  - schemaVersion: number
  - profile: UserProfile
  - preferences: UserPreferences
  - days: ScheduleDay[]

## 5.2 Validation rules
- studentName: required, 2-80 chars
- startTime: required, valid HH:mm
- durationMinutes: 15-240
- type: required, must exist in templates or user-defined set
- dayKey: must match configured day list

## 6) Persistence Strategy
- Use namespaced localStorage key pattern:
  - schedule-app:v1:user:{userId}
- Store full AppDataEnvelope.
- Include schemaVersion for migrations.
- On app start:
  - Attempt hydrate.
  - Validate shape.
  - If invalid/corrupt, recover with defaults and keep a backup key.
- Autosave on data mutations with debounce.

## 7) Timezone Strategy
Current behavior adds +1 hour for KSA. MVP can keep that policy but make implementation testable and replaceable.

Plan:
- Store times in canonical local schedule format (HH:mm base zone).
- Convert display based on user timezone preference.
- Keep conversion utility isolated in useTimezone.
- Add utility tests for edge cases around 12-hour display formatting.

## 8) UI/UX Feature Plan
### Home view
- Day cards with session counts.
- Respect visibleDayKeys preference.
- Empty-state cards for days with no sessions.

### Day details view
- List sessions sorted by time.
- Session actions: edit/delete.
- Add new session button.

### Session editor
- Form fields for name, subtitle, type, start time, duration, notes.
- Client-side validation with clear Arabic error labels.

### Preferences panel
- Timezone default.
- Theme mode and accent color.
- Visible days selector.
- Session type templates manager.

## 9) Delivery Phases
## Phase 1: Baseline migration
- Create Vue + TS project.
- Port current static data and base screens.
- Reproduce existing navigation and timezone toggle behavior.

Done criteria:
- Existing UX is functionally available in Vue app.

## Phase 2: Data contracts and composables
- Implement types and repository interfaces.
- Implement composables for schedule, preferences, timezone.

Done criteria:
- State and side-effects are moved out of UI components.

## Phase 3: Persistence and resilience
- Add localStorage adapter and hydration.
- Implement schemaVersion handling and fallback recovery.

Done criteria:
- App state persists across reloads and handles corrupt storage.

## Phase 4: User customization features
- Build session CRUD UI and logic.
- Build preferences panel (timezone/theme/visible days/templates).

Done criteria:
- A local user can fully customize their schedule and preferences.

## Phase 5: Quality hardening
- Improve accessibility, keyboard flow, and RTL polish.
- Add basic tests (type checks + critical utility/component tests).
- Refactor hotspots and finalize documentation.

Done criteria:
- Stable MVP with clear documentation and predictable behavior.

## 10) Testing and Verification Checklist
- Type checks pass via vue-tsc.
- Build passes via vite build.
- Session CRUD works end-to-end.
- Preferences persist after reload.
- Timezone display updates correctly in all views.
- Corrupt localStorage recovery works.
- Responsive layout tested on mobile and desktop.
- RTL text and alignment remain correct.

## 11) Risks and Mitigations
- Risk: Growing complexity in single components.
  - Mitigation: strict component boundaries + composables.

- Risk: Data corruption in localStorage.
  - Mitigation: schema validation + backup + safe defaults.

- Risk: Future backend migration friction.
  - Mitigation: repository abstraction from day one.

## 12) Future Upgrade Path (Post-MVP)
- Add real auth (Supabase/Firebase/custom backend).
- Add remote repository implementation.
- Add optional sync/merge strategy for multi-device usage.
- Add reminders and notifications.
