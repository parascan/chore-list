# Requirements: Chore Tracker

**Defined:** 2026-03-24
**Core Value:** The household always knows what needs doing and when — chores never fall through the cracks.

## v1.1 Requirements

### Visual

- [ ] **VISUAL-01**: App uses modernized card design with improved typography, spacing, and visual hierarchy
- [ ] **VISUAL-02**: App automatically switches to dark mode when the OS is set to dark

### Touch UX

- [ ] **TOUCH-01**: User can swipe right on a chore card to mark it complete
- [ ] **TOUCH-02**: User can swipe left on a chore card to reveal and trigger delete
- [ ] **TOUCH-03**: Chore action buttons (edit/delete) are always visible on touch devices, not hover-only
- [ ] **TOUCH-04**: Delete confirmation uses an in-app dialog instead of the browser `confirm()` popup

### History

- [ ] **HIST-01**: User sees a streak counter on each chore card showing consecutive on-time completions
- [ ] **HIST-02**: User can tap a chore card to open a completion history log

### Snooze

- [ ] **SNOOZE-01**: User can snooze a chore by 1 day — pushes the due date forward without counting as a completion

### Search & Sort

- [ ] **SEARCH-01**: User can filter the chore list by typing a keyword search
- [ ] **SORT-01**: User can sort chores by name or by due date (in addition to the default frequency grouping)

## v2 Requirements

### Notifications

- **NOTIF-01**: User receives a push notification when chores are overdue
- **NOTIF-02**: User can configure which chores trigger notifications

### Sharing

- **SHARE-01**: User can share chore list with household members
- **SHARE-02**: User can assign chores to specific household members

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / login | Anonymous auth meets current need; login adds complexity |
| Multi-user sharing | Single-household, single-device focus for this milestone |
| Manual snooze duration picker | Quick 1-day snooze covers the common case |
| Dark mode toggle | Auto-follow OS preference is simpler and sufficient |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| VISUAL-01 | — | Pending |
| VISUAL-02 | — | Pending |
| TOUCH-01 | — | Pending |
| TOUCH-02 | — | Pending |
| TOUCH-03 | — | Pending |
| TOUCH-04 | — | Pending |
| HIST-01 | — | Pending |
| HIST-02 | — | Pending |
| SNOOZE-01 | — | Pending |
| SEARCH-01 | — | Pending |
| SORT-01 | — | Pending |

**Coverage:**
- v1.1 requirements: 11 total
- Mapped to phases: 0
- Unmapped: 11 ⚠️

---
*Requirements defined: 2026-03-24*
*Last updated: 2026-03-24 after initial definition*
