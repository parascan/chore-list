# Roadmap: Chore Tracker

## Milestones

- ✅ **v1.0 Baseline** - Phase 0 (shipped 2026-03-24)
- 🚧 **v1.1 Polish & Power** - Phases 1-4 (in progress)

## Phases

<details>
<summary>✅ v1.0 Baseline (Phase 0) - SHIPPED 2026-03-24</summary>

### Phase 0: Baseline
**Goal**: Working chore tracker in production
**Plans**: Initial build (pre-planning)

Shipped:
- [x] Core chore tracking with frequency-based due logic
- [x] Add / edit / delete chores with notes
- [x] Mark complete (resets due timer)
- [x] Filter tabs: Due / All / Done
- [x] Real-time Firestore sync with anonymous auth
- [x] Mobile-first UI with sticky header, FAB, bottom-sheet modal
- [x] Default chores seeded on first load
- [x] GitHub Actions deploy pipeline

</details>

### 🚧 v1.1 Polish & Power (In Progress)

**Milestone Goal:** Make the app feel polished and powerful — better visuals, native-feeling touch interactions, completion history with streaks, and tools for finding and managing chores quickly.

## Phase Details

### Phase 1: Visual Foundation
**Goal**: The app looks modern and respects the user's OS appearance preference
**Depends on**: Nothing (first phase)
**Requirements**: VISUAL-01, VISUAL-02
**Success Criteria** (what must be TRUE):
  1. Chore cards have improved typography, spacing, and clear visual hierarchy
  2. App automatically switches to dark mode when the OS is set to dark
  3. App automatically switches back to light mode when the OS is set to light
  4. Visual design is consistent across all views (list, modal, filter tabs)
**Plans**: TBD

### Phase 2: Touch UX
**Goal**: Users on touch devices can interact with chores naturally, without hover-only buttons or browser popups
**Depends on**: Phase 1
**Requirements**: TOUCH-01, TOUCH-02, TOUCH-03, TOUCH-04
**Success Criteria** (what must be TRUE):
  1. User can swipe right on a chore card to mark it complete
  2. User can swipe left on a chore card to reveal and trigger delete
  3. Edit and delete buttons are always visible on touch devices (not hidden until hover)
  4. Delete confirmation appears as an in-app dialog, not a browser confirm() popup
  5. Touch interactions do not interfere with normal scroll behavior
**Plans**: TBD

### Phase 3: History & Streaks
**Goal**: Users can see their completion track record and review past activity per chore
**Depends on**: Phase 2
**Requirements**: HIST-01, HIST-02
**Success Criteria** (what must be TRUE):
  1. Each chore card displays a streak counter showing consecutive on-time completions
  2. Streak resets to zero when a chore is completed late or missed
  3. User can tap a chore card to open a completion history log for that chore
  4. Completion history log shows dates and on-time/late status for past completions
**Plans**: TBD

### Phase 4: Utility Features
**Goal**: Users can find, defer, and organize chores quickly
**Depends on**: Phase 3
**Requirements**: SNOOZE-01, SEARCH-01, SORT-01
**Success Criteria** (what must be TRUE):
  1. User can snooze a chore by 1 day, pushing the due date forward without recording a completion
  2. Snoozed chore does not increment the streak counter
  3. User can type a keyword to filter the visible chore list in real time
  4. User can sort chores by name or by due date, in addition to the default frequency grouping
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3 → 4

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 0. Baseline | v1.0 | —/— | Complete | 2026-03-24 |
| 1. Visual Foundation | v1.1 | 0/? | Not started | - |
| 2. Touch UX | v1.1 | 0/? | Not started | - |
| 3. History & Streaks | v1.1 | 0/? | Not started | - |
| 4. Utility Features | v1.1 | 0/? | Not started | - |
