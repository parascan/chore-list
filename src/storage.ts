import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from './firebase';
import type { Chore, Frequency } from './types';
import { FREQUENCY_DAYS } from './types';

const CHORES_COL = 'chores';

// ── Default chores (seeded on first load) ───────────────────────────────────

export function getDefaultChores(): Chore[] {
  const now = new Date().toISOString();
  const items: Array<{ name: string; frequency: Frequency }> = [
    { name: 'Dishes', frequency: 'daily' },
    { name: 'Sweep upstairs', frequency: 'daily' },
    { name: 'Put away toys', frequency: 'daily' },
    { name: 'Sweep stairs/entry', frequency: 'weekly' },
    { name: 'Vacuum all carpets', frequency: 'weekly' },
    { name: 'Water plants', frequency: 'weekly' },
    { name: 'Clean stools and area', frequency: 'weekly' },
    { name: 'Mop', frequency: 'biweekly' },
    { name: 'Go through fridge', frequency: 'biweekly' },
    { name: 'Clean bathrooms', frequency: 'biweekly' },
    { name: 'Clean bathtub', frequency: 'biweekly' },
    { name: 'Clean stove', frequency: 'biweekly' },
    { name: 'Swap towels', frequency: 'biweekly' },
    { name: 'Clean cars', frequency: 'biweekly' },
    { name: 'Wipe trim boards', frequency: 'monthly' },
    { name: 'Clean windows', frequency: 'monthly' },
    { name: 'Vacuum couches', frequency: 'monthly' },
    { name: 'Wash bed sheets', frequency: 'monthly' },
    { name: 'Organize pantry', frequency: 'monthly' },
  ];
  return items.map(c => ({ ...c, id: crypto.randomUUID(), addedAt: now }));
}

// ── Auth helpers ─────────────────────────────────────────────────────────────

function ensureAuth(): Promise<void> {
  if (auth.currentUser) return Promise.resolve();
  return new Promise(resolve => {
    const unsub = onAuthStateChanged(auth, user => {
      if (user) { unsub(); resolve(); }
    });
    signInAnonymously(auth).catch(console.error);
  });
}

// ── Firestore CRUD ───────────────────────────────────────────────────────────

export function subscribeChores(
  onData: (chores: Chore[]) => void,
  onSeeded: (chores: Chore[]) => void,
): () => void {
  let unsubSnapshot: (() => void) | null = null;

  // Sign in anonymously — required by Firestore security rules
  signInAnonymously(auth).catch(console.error);

  const unsubAuth = onAuthStateChanged(auth, user => {
    if (user && !unsubSnapshot) {
      unsubSnapshot = onSnapshot(collection(db, CHORES_COL), snapshot => {
        if (snapshot.empty) {
          // First time — seed with defaults
          const defaults = getDefaultChores();
          seedChores(defaults).then(() => onSeeded(defaults));
        } else {
          const chores = snapshot.docs.map(d => d.data() as Chore);
          // Sort by addedAt ascending so order is stable
          chores.sort((a, b) => a.addedAt.localeCompare(b.addedAt));
          onData(chores);
        }
      });
    }
  });

  return () => {
    unsubAuth();
    unsubSnapshot?.();
  };
}

async function seedChores(chores: Chore[]): Promise<void> {
  const batch = writeBatch(db);
  chores.forEach(c => {
    batch.set(doc(db, CHORES_COL, c.id), c);
  });
  await batch.commit();
}

export async function saveChore(chore: Chore): Promise<void> {
  await ensureAuth();
  const data = Object.fromEntries(Object.entries(chore).filter(([, v]) => v !== undefined));
  await setDoc(doc(db, CHORES_COL, chore.id), data);
}

export async function removeChore(id: string): Promise<void> {
  await ensureAuth();
  await deleteDoc(doc(db, CHORES_COL, id));
}

// ── Due logic ────────────────────────────────────────────────────────────────

export function daysBetween(d1: Date, d2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.floor((utc2 - utc1) / msPerDay);
}

export function isDue(chore: Chore): boolean {
  if (chore.snoozedUntil) {
    if (daysBetween(new Date(), new Date(chore.snoozedUntil)) >= 0) return false;
  }
  if (!chore.lastCompleted) return true;
  if (chore.frequency === 'once') return false;
  const days = daysBetween(new Date(chore.lastCompleted), new Date());
  return days >= FREQUENCY_DAYS[chore.frequency];
}

export function dueOffset(chore: Chore): number {
  if (chore.snoozedUntil) {
    const daysLeft = daysBetween(new Date(), new Date(chore.snoozedUntil));
    if (daysLeft >= 0) return -(daysLeft + 1);
  }
  if (!chore.lastCompleted) return 0;
  if (chore.frequency === 'once') return -999;
  const days = daysBetween(new Date(chore.lastCompleted), new Date());
  return days - FREQUENCY_DAYS[chore.frequency];
}

export function computeStreak(chore: Chore): number {
  if (chore.frequency === 'once') return 0;
  const history = chore.completionHistory;
  if (!history || history.length === 0) return 0;
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].onTime) streak++;
    else break;
  }
  return streak;
}
