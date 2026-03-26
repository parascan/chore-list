import type { Chore } from '../types';
import { computeStreak } from '../storage';

interface Props {
  chore: Chore;
  onClose: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function ChoreHistoryModal({ chore, onClose }: Props) {
  const streak = computeStreak(chore);
  const history = [...(chore.completionHistory ?? [])].reverse();

  return (
    <div className="ch-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ch-modal" role="dialog" aria-modal="true">
        <div className="ch-modal-handle" />
        <div className="ch-history-header">
          <h2 className="ch-modal-title">{chore.name}</h2>
          {streak >= 1 && chore.frequency !== 'once' && (
            <span className="ch-streak ch-streak--lg">🔥 {streak} streak</span>
          )}
        </div>

        {history.length === 0 ? (
          <p className="ch-history-empty">No completions recorded yet.</p>
        ) : (
          <ul className="ch-history-list">
            {history.map((entry, i) => (
              <li key={i} className={`ch-history-entry ${entry.onTime ? 'on-time' : 'late'}`}>
                <span className="ch-history-date">{formatDate(entry.date)}</span>
                <span className="ch-history-status">
                  {entry.onTime ? '✓ On time' : '✗ Late'}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="ch-modal-actions">
          <button className="ch-btn ch-btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
