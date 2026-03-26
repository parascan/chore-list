import { useState, useEffect } from 'react';
import type { Chore } from './types';
import { FREQUENCY_ORDER, FREQUENCY_LABELS, FREQUENCY_COLORS } from './types';
import { subscribeChores, saveChore, removeChore, isDue, dueOffset } from './storage';
import ChoreCard from './components/ChoreCard';
import AddChoreModal from './components/AddChoreModal';
import ConfirmDialog from './components/ConfirmDialog';
import ChoreHistoryModal from './components/ChoreHistoryModal';
import './App.css';

type Filter = 'due' | 'all' | 'done';
type Sort = 'default' | 'name' | 'due';

export default function App() {
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('due');
  const [showAdd, setShowAdd] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [historyChore, setHistoryChore] = useState<Chore | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState<Sort>('default');

  useEffect(() => {
    const unsub = subscribeChores(
      data => { setChores(data); setLoading(false); },
      seeded => { setChores(seeded); setLoading(false); },
    );
    return unsub;
  }, []);

  async function handleComplete(id: string, done: boolean) {
    const chore = chores.find(c => c.id === id);
    if (!chore) return;
    const now = new Date().toISOString();
    const completionHistory = done
      ? [...(chore.completionHistory ?? []), { date: now, onTime: dueOffset(chore) <= 0 }]
      : chore.completionHistory;
    await saveChore({
      ...chore,
      lastCompleted: done ? now : undefined,
      completionHistory,
      snoozedUntil: undefined,
    });
  }

  async function handleSnooze(id: string) {
    const chore = chores.find(c => c.id === id);
    if (!chore) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    await saveChore({ ...chore, snoozedUntil: tomorrow.toISOString() });
  }

  function handleDelete(id: string) {
    setConfirmDeleteId(id);
  }

  async function handleConfirmDelete() {
    if (confirmDeleteId) await removeChore(confirmDeleteId);
    setConfirmDeleteId(null);
  }

  async function handleSave(chore: Chore) {
    await saveChore(chore);
    setShowAdd(false);
    setEditingChore(null);
  }

  function handleEdit(chore: Chore) {
    setEditingChore(chore);
    setShowAdd(true);
  }

  function handleCloseModal() {
    setShowAdd(false);
    setEditingChore(null);
  }

  const filtered = chores.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filter === 'due') return isDue(c);
    if (filter === 'done') return !isDue(c);
    return true;
  });

  const dueCount = chores.filter(isDue).length;

  const grouped = FREQUENCY_ORDER.map(freq => {
    const group = filtered.filter(c => c.frequency === freq);
    const totalInFreq = chores.filter(c => c.frequency === freq);
    const doneInFreq = totalInFreq.filter(c => !isDue(c)).length;
    return { freq, chores: group, total: totalInFreq.length, done: doneInFreq };
  }).filter(g => g.chores.length > 0);

  const sortedFlat = sort !== 'default' ? [...filtered].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    const ao = !a.lastCompleted ? 9999 : dueOffset(a);
    const bo = !b.lastCompleted ? 9999 : dueOffset(b);
    return bo - ao;
  }) : [];

  const isEmpty = sort === 'default' ? grouped.length === 0 : filtered.length === 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  if (loading) {
    return (
      <div className="ch-app">
        <div className="ch-loading">
          <div className="ch-spinner" />
          <p>Loading chores…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ch-app">
      <header className="ch-header">
        <div className="ch-header-content">
          <div>
            <h1 className="ch-title">Chore Tracker</h1>
            <p className="ch-subtitle">{today}</p>
          </div>
          {dueCount > 0 && (
            <div className="ch-due-badge">{dueCount} due</div>
          )}
          {dueCount === 0 && chores.length > 0 && (
            <div className="ch-done-badge">All done!</div>
          )}
        </div>
        <div className="ch-filters">
          <button
            className={`ch-filter-btn${filter === 'due' ? ' active' : ''}`}
            onClick={() => setFilter('due')}
          >
            Due{dueCount > 0 ? ` (${dueCount})` : ''}
          </button>
          <button
            className={`ch-filter-btn${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`ch-filter-btn${filter === 'done' ? ' active' : ''}`}
            onClick={() => setFilter('done')}
          >
            Done
          </button>
        </div>
      </header>

      <main className="ch-main">
        <div className="ch-toolbar">
          <input
            className="ch-search"
            type="search"
            placeholder="Search chores…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <div className="ch-sort-row">
            <span className="ch-sort-label">Sort:</span>
            {(['default', 'name', 'due'] as Sort[]).map(s => (
              <button
                key={s}
                className={`ch-sort-btn${sort === s ? ' active' : ''}`}
                onClick={() => setSort(s)}
              >
                {s === 'default' ? 'Grouped' : s === 'name' ? 'A–Z' : 'By Due'}
              </button>
            ))}
          </div>
        </div>

        {isEmpty ? (
          <div className="ch-empty">
            {searchQuery ? (
              <>
                <span className="ch-empty-icon">🔍</span>
                <p>No chores match "{searchQuery}"</p>
              </>
            ) : (
              <>
                {filter === 'due' && <span className="ch-empty-icon">🎉</span>}
                {filter === 'done' && <span className="ch-empty-icon">📋</span>}
                {filter === 'all' && <span className="ch-empty-icon">✨</span>}
                <p>
                  {filter === 'due'
                    ? 'All chores are done!'
                    : filter === 'done'
                    ? 'No completed chores yet'
                    : 'No chores yet. Tap + to add one.'}
                </p>
              </>
            )}
          </div>
        ) : sort !== 'default' ? (
          <div className="ch-group-list" style={{ padding: '0 12px' }}>
            {sortedFlat.map(chore => (
              <ChoreCard
                key={chore.id}
                chore={chore}
                onComplete={handleComplete}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSnooze={handleSnooze}
                onViewHistory={setHistoryChore}
              />
            ))}
          </div>
        ) : (
          grouped.map(({ freq, chores: groupChores, total, done }) => (
            <section key={freq} className="ch-group">
              <div
                className="ch-group-header"
                style={{ '--freq-color': FREQUENCY_COLORS[freq] } as React.CSSProperties}
              >
                <span className="ch-group-label">{FREQUENCY_LABELS[freq]}</span>
                <div className="ch-group-line" />
                {filter === 'all' && total > 0 && (
                  <span className="ch-group-progress">{done}/{total}</span>
                )}
                {filter !== 'all' && (
                  <span className="ch-group-count">{groupChores.length}</span>
                )}
              </div>
              <div className="ch-group-list">
                {groupChores.map(chore => (
                  <ChoreCard
                    key={chore.id}
                    chore={chore}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSnooze={handleSnooze}
                    onViewHistory={setHistoryChore}
                  />
                ))}
              </div>
            </section>
          ))
        )}
        <div className="ch-bottom-spacer" />
      </main>

      <button
        className="ch-fab"
        onClick={() => { setEditingChore(null); setShowAdd(true); }}
        aria-label="Add chore"
      >
        +
      </button>

      {showAdd && (
        <AddChoreModal
          initial={editingChore}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}

      {historyChore && (
        <ChoreHistoryModal
          chore={historyChore}
          onClose={() => setHistoryChore(null)}
        />
      )}

      {confirmDeleteId && (
        <ConfirmDialog
          message={`Delete "${chores.find(c => c.id === confirmDeleteId)?.name ?? 'this chore'}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDeleteId(null)}
        />
      )}
    </div>
  );
}
