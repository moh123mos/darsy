You are OpenCode, a senior full-stack engineer. Execute this plan end-to-end in the current repository.

Mission:
Convert the existing static schedule page into a dynamic, user-customizable app using Vue 3 + TypeScript + Composition API, local-first MVP.

Primary requirements:
1. Keep Arabic RTL UX quality and responsive behavior.
2. Implement per-user local customization (no real auth in MVP).
3. Implement full session CRUD.
4. Implement persistent preferences:
   - timezone (EGYPT/KSA)
   - theme mode + accent color
   - visible days
   - session type templates
5. Add localStorage persistence with schemaVersion and corruption-safe fallback.
6. Keep architecture backend-ready using repository abstraction.

Execution constraints:
1. Work in strict phase-by-phase mode.
2. After each phase, provide:
   - what was implemented
   - files changed
   - verification result
   - blockers (if any)
3. For each completed phase, create exactly 5 git commits with emoji-style commit messages.
4. Do not skip tests/validation for the phase.
5. Do not rewrite everything in one giant commit.

Technical rules:
1. Use Vue 3 with script setup and TypeScript.
2. Use composables for stateful/business logic.
3. Keep components focused and small.
4. Use typed interfaces for all core data models.
5. Keep UI consistent with the existing design language, while making it more maintainable.

Required architecture output:
- src/types/schedule.ts
- src/repositories/scheduleRepository.ts
- src/repositories/localScheduleRepository.ts
- src/composables/useScheduleData.ts
- src/composables/useUserPreferences.ts
- src/composables/useTimezone.ts
- src/composables/useLocalPersistence.ts
- src/components/shell/HeaderBar.vue
- src/components/schedule/DaysGrid.vue
- src/components/schedule/DayCard.vue
- src/components/schedule/DayDetails.vue
- src/components/schedule/SessionList.vue
- src/components/schedule/SessionEditor.vue
- src/components/preferences/PreferencesPanel.vue

Phases to execute:
Phase 1: Vue migration baseline.
Phase 2: Data contracts + composables.
Phase 3: Persistence + resilience.
Phase 4: Customization features.
Phase 5: Quality hardening.

Definition of done:
1. vue-tsc passes.
2. build passes.
3. CRUD works.
4. preferences persist.
5. timezone display is consistent.
6. corrupt local storage recovery works.
7. RTL and responsive behavior are preserved.

Reporting format after every phase:
- Phase summary
- Files created/updated
- Test/validation evidence
- 5 commit hashes and messages
- Next phase plan

Start now with Phase 1 only, then pause for review before Phase 2.