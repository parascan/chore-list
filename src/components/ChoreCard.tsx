import { useState, useRef } from 'react';
import type { Chore } from '../types';
import { FREQUENCY_DAYS } from '../types';
import { daysBetween, dueOffset, computeStreak, isDue } from '../storage';

interface Props {
  chore: Chore;
  onComplete: (id: string, done: boolean) => void;
  onEdit: (chore: Chore) => void;
  onDelete: (id: string) => void;
  onSnooze: (id: string) => void;
  onViewHistory: (chore: Chore) => void;
}

type StatusType = 'overdue' | 'due' | 'upcoming' | 'done-status' | 'never';

function getStatus(chore: Chore): { text: string; type: StatusType } {
  if (!chore.lastCompleted) return { text: 'Never done', type: 'never' };
  if (chore.frequency === 'once') return { text: 'Done', type: 'done-status' };

  const offset = dueOffset(chore);

  if (offset > 1) return { text: `${offset}d overdue`, type: 'overdue' };
  if (offset === 1) return { text: '1d overdue', type: 'overdue' };
  if (offset === 0) return { text: 'Due today', type: 'due' };

  const daysLeft = Math.abs(offset);
  if (daysLeft === 1) return { text: 'Due tomorrow', type: 'upcoming' };
  return { text: `Due in ${daysLeft}d`, type: 'upcoming' };
}

function getLastDoneText(chore: Chore): string | null {
  if (!chore.lastCompleted) return null;
  if (chore.frequency === 'once') return null;

  const days = daysBetween(new Date(chore.lastCompleted), new Date());
  if (days === 0) return 'Done today';
  if (days === 1) return 'Done yesterday';
  return `Done ${days}d ago`;
}

function isDoneToday(chore: Chore): boolean {
  if (!chore.lastCompleted) return false;
  const days = daysBetween(new Date(chore.lastCompleted), new Date());
  return days === 0;
}

function isCompleted(chore: Chore): boolean {
  if (!chore.lastCompleted) return false;
  if (chore.frequency === 'once') return true;
  const days = daysBetween(new Date(chore.lastCompleted), new Date());
  return days < FREQUENCY_DAYS[chore.frequency];
}

const SWIPE_THRESHOLD = 72;

export default function ChoreCard({ chore, onComplete, onEdit, onDelete, onSnooze, onViewHistory }: Props) {
  const done = isCompleted(chore);
  const doneToday = isDoneToday(chore);
  const status = getStatus(chore);
  const lastDoneText = getLastDoneText(chore);
  const streak = computeStreak(chore);
  const canSnooze = isDue(chore) && chore.frequency !== 'once';

  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHorizSwipe = useRef<boolean | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizSwipe.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (isHorizSwipe.current === null) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        isHorizSwipe.current = Math.abs(dx) > Math.abs(dy);
      }
    }
    if (!isHorizSwipe.current) return;

    setSwipeX(Math.max(-120, Math.min(120, dx)));
  }

  function handleTouchEnd() {
    if (swipeX > SWIPE_THRESHOLD) {
      onComplete(chore.id, !doneToday);
    } else if (swipeX < -SWIPE_THRESHOLD) {
      onDelete(chore.id);
    }
    setSwipeX(0);
  }

  const hintOpacity = Math.min(1, Math.abs(swipeX) / SWIPE_THRESHOLD);
  const showComplete = swipeX > 0;
  const showDelete = swipeX < 0;

  return (
    <div className="ch-swipe-wrapper">
      {showComplete && (
        <div className="ch-swipe-hint ch-swipe-hint--complete" style={{ opacity: hintOpacity }}>
          ✓ Done
        </div>
      )}
      {showDelete && (
        <div className="ch-swipe-hint ch-swipe-hint--delete" style={{ opacity: hintOpacity }}>
          Delete 🗑
        </div>
      )}
      <div
        className={`ch-card ch-card--${status.type}${done ? ' is-done' : ''}`}
        style={{
          transform: `translateX(${swipeX}px)`,
          transition: swipeX === 0 ? 'transform 0.25s ease' : 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="ch-check"
          onClick={() => onComplete(chore.id, !doneToday)}
          aria-label={done ? 'Mark not done' : 'Mark done'}
          title={done ? 'Mark not done' : 'Mark done'}
        >
          {done && '✓'}
        </button>

        <div className="ch-card-body" onClick={() => onViewHistory(chore)}>
          <p className="ch-card-name">{chore.name}</p>
          <div className="ch-card-meta">
            <span className={`ch-status ${status.type}`}>{status.text}</span>
            {lastDoneText && lastDoneText !== status.text && (
              <span className="ch-last-done">{lastDoneText}</span>
            )}
            {streak >= 1 && chore.frequency !== 'once' && (
              <span className="ch-streak">🔥 {streak}</span>
            )}
          </div>
          {chore.notes && <p className="ch-card-notes">{chore.notes}</p>}
        </div>

        <div className="ch-card-actions">
          {canSnooze && (
            <button
              className="ch-icon-btn snooze"
              onClick={() => onSnooze(chore.id)}
              aria-label="Snooze 1 day"
              title="Snooze 1 day"
            >
              ⏸
            </button>
          )}
          <button
            className="ch-icon-btn"
            onClick={() => onEdit(chore)}
            aria-label="Edit chore"
            title="Edit"
          >
            ✏️
          </button>
          <button
            className="ch-icon-btn delete"
            onClick={() => onDelete(chore.id)}
            aria-label="Delete chore"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
