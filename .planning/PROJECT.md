# Chore Tracker

## What This Is

A mobile-first household chore tracker that syncs in real-time via Firebase/Firestore. Users add chores with a frequency (daily through yearly), mark them complete, and see what's due at a glance. No sign-in required — anonymous auth handles persistence per device.

## Core Value

The household always knows what needs doing and when — chores never fall through the cracks.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ User can view chores grouped by frequency with due/overdue status — v1.0
- ✓ User can add, edit, and delete chores — v1.0
- ✓ User can mark chores complete (resets due timer) — v1.0
- ✓ User can filter chores by Due / All / Done — v1.0
- ✓ Chores persist in real-time via Firestore (anonymous auth) — v1.0
- ✓ App is mobile-first with a sticky header and FAB — v1.0
- ✓ App seeds sensible default chores on first load — v1.0

### Active

<!-- Current scope. Building toward these. -->

(To be defined in v1.1 milestone)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- User accounts / login — anonymous auth meets current need; login adds complexity
- Multi-user sharing — single-household focus for now

## Context

- Stack: React 18 + TypeScript + Vite + Firebase (Firestore + Auth)
- Deploy: GitHub Actions → Firebase Hosting
- The app uses anonymous Firebase auth — all data is scoped to a single anonymous UID per browser
- Default chores are seeded into Firestore on first load
- CSS uses a `ch-` prefix class naming convention throughout
- Delete uses browser `confirm()` — one known UX rough edge
- Edit/delete action buttons are hidden on hover only (not mobile-friendly)
- No dark mode currently

## Constraints

- **Tech stack**: React + TypeScript + Vite + Firebase — no framework changes
- **Auth**: Anonymous auth only — no user login system for this milestone
- **Hosting**: Firebase Hosting via GitHub Actions deploy

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Anonymous Firebase auth | No login friction for household use | ✓ Good |
| Firestore real-time sync | Live updates without polling | ✓ Good |
| Frequency-grouped chore cards | Natural mental model for recurring tasks | ✓ Good |
| CSS custom properties with `ch-` prefix | Scoped, portable styling | ✓ Good |

---
*Last updated: 2026-03-24 after initial codebase mapping*
