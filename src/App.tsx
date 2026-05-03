import { useEffect, useMemo, useRef, useState } from 'react';
import { createInitialInventory } from './inventoryData';
import { calculateStatus, calculateVariance, parseBackupJson, toBackupJson, toCsv } from './helpers';
import type { InventoryItem, InventoryStatus, OpnameMeta } from './types';

const ITEMS_KEY = 'slaku_items_v1';
const META_KEY = 'slaku_meta_v1';
const today = new Date().toISOString().slice(0, 10);

type CheckedFilter = 'All' | 'Checked' | 'Unchecked';

const defaultMeta: OpnameMeta = { date: today, staffName: '' };

export default function App() {
  const checklistRef = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState<InventoryItem[]>(() => JSON.parse(localStorage.getItem(ITEMS_KEY) ?? 'null') ?? createInitialInventory());
  const [meta, setMeta] = useState<OpnameMeta>(() => JSON.parse(localStorage.getItem(META_KEY) ?? 'null') ?? defaultMeta);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<'All' | InventoryStatus>('All');
  const [checked, setChecked] = useState<CheckedFilter>('All');

  useEffect(() => localStorage.setItem(ITEMS_KEY, JSON.stringify(items)), [items]);
  useEffect(() => localStorage.setItem(META_KEY, JSON.stringify(meta)), [meta]);

  const categories = useMemo(() => ['All', ...new Set(items.map((i) => i.category))], [items]);
  const filtered = useMemo(
    () =>
      items.filter(
        (i) =>
          i.name.toLowerCase().includes(search.toLowerCase()) &&
          (category === 'All' || i.category === category) &&
          (status === 'All' || calculateStatus(i) === status) &&
          (checked === 'All' || (checked === 'Checked' ? i.checked : !i.checked)),
      ),
    [items, search, category, status, checked],
  );

  const grouped = filtered.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  const summary = {
    total: items.length,
    checked: items.filter((i) => i.checked).length,
    lowOrOut: items.filter((i) => ['Low Stock', 'Out of Stock'].includes(calculateStatus(i))).length,
    variance: items.filter((i) => calculateVariance(i.physicalStock, i.systemStock) !== 0).length,
  };

  const updateItem = (id: string, patch: Partial<InventoryItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const startToday = () => setMeta((prev) => ({ ...prev, date: today }));

  const addItem = () => {
    const name = window.prompt('Nama item baru:');
    if (!name) return;
    const newCategory = window.prompt('Kategori item:', 'OTHERS') || 'OTHERS';
    setItems((prev) => [
      { id: crypto.randomUUID(), name, category: newCategory, unit: 'pcs', systemStock: 0, physicalStock: 0, notes: '', checked: false },
      ...prev,
    ]);
  };

  return (
    <div className="app">
      <header className="hero">
        <p className="kicker">SLAKU INTERNAL OPS</p>
        <h1>CHECK LIST OPNAME BARANG – SLAKU</h1>
        <p>Checklist bahan baku, packaging, dan kebutuhan produksi Slaku.</p>
        <small>Untuk kontrol stok harian produksi minuman, bakery, dan dessert.</small>
        <div className="hero-actions">
          <button onClick={startToday}>Mulai Opname Hari Ini</button>
          <button className="ghost" onClick={() => checklistRef.current?.scrollIntoView({ behavior: 'smooth' })}>Lihat Checklist</button>
        </div>
      </header>

      <section className="summary-grid">
        {[
          ['Total Item', summary.total],
          ['Sudah Dicek', summary.checked],
          ['Belum Dicek', summary.total - summary.checked],
          ['Item Kurang / Habis', summary.lowOrOut],
          ['Selisih Stok', summary.variance],
        ].map(([label, value]) => (
          <article key={String(label)} className="summary-card"><p>{label}</p><strong>{value}</strong></article>
        ))}
      </section>

      <section className="panel">
        <h2>Daily Stock Opname Info</h2>
        <div className="grid4">
          <label>Tanggal Opname<input type="date" value={meta.date} onChange={(e) => setMeta((m) => ({ ...m, date: e.target.value }))} /></label>
          <label>Nama Staff<input value={meta.staffName} placeholder="Isi nama staff" onChange={(e) => setMeta((m) => ({ ...m, staffName: e.target.value }))} /></label>
          <div className="autosave">Saved automatically</div>
          <button onClick={startToday}>Start Today’s Stock Opname</button>
        </div>
      </section>

      <section className="panel compact">
        <h2>Search & Filter</h2>
        <div className="grid4">
          <input placeholder="Cari nama item" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={status} onChange={(e) => setStatus(e.target.value as 'All' | InventoryStatus)}>{['All', 'Safe', 'Need Review', 'Low Stock', 'Out of Stock'].map((s) => <option key={s}>{s}</option>)}</select>
          <select value={checked} onChange={(e) => setChecked(e.target.value as CheckedFilter)}>{['All', 'Checked', 'Unchecked'].map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </section>

      <section className="panel" ref={checklistRef}>
        <h2>Inventory Checklist</h2>
        {Object.entries(grouped).map(([cat, list]) => (
          <details key={cat} open>
            <summary>{cat} ({list.length})</summary>
            {list.map((item) => {
              const variance = calculateVariance(item.physicalStock, item.systemStock);
              const itemStatus = calculateStatus(item);
              return <div className="item-card" key={item.id}>
                <div className="topline">
                  <label><input type="checkbox" checked={item.checked} onChange={(e) => updateItem(item.id, { checked: e.target.checked })} /> Dicek</label>
                  <span className={`badge ${itemStatus.replace(/ /g, '-').toLowerCase()}`}>{itemStatus}</span>
                </div>
                <div className="name-row"><strong>{item.name}</strong><button className="danger" onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}>Delete</button></div>
                <div className="fields">
                  <label>Unit<input value={item.unit} onChange={(e) => updateItem(item.id, { unit: e.target.value })} /></label>
                  <label>System<input type="number" value={item.systemStock} onChange={(e) => updateItem(item.id, { systemStock: Number(e.target.value) })} /></label>
                  <label>Physical<input type="number" value={item.physicalStock} onChange={(e) => updateItem(item.id, { physicalStock: Number(e.target.value) })} /></label>
                  <label>Variance<input value={variance} disabled /></label>
                </div>
                <label>Notes<input value={item.notes} placeholder="Catatan" onChange={(e) => updateItem(item.id, { notes: e.target.value })} /></label>
              </div>;
            })}
          </details>
        ))}
      </section>

      <footer className="sticky-actions">
        <button onClick={addItem}>Add item</button>
        <button onClick={() => { const blob = new Blob([toCsv(items, meta)], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `slaku-opname-${meta.date}.csv`; a.click(); }}>Export to CSV</button>
        <button onClick={() => window.print()}>Print checklist</button>
        <button onClick={() => { const blob = new Blob([toBackupJson(items, meta)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `slaku-backup-${meta.date}.json`; a.click(); }}>Backup as JSON</button>
        <label className="button-file">Import JSON backup<input hidden type="file" accept="application/json" onChange={async (e) => { const file = e.target.files?.[0]; if (!file) return; const data = parseBackupJson(await file.text()); setItems(data.items); setMeta(data.meta); }} /></label>
        <button onClick={() => { if (window.confirm('Reset daily checklist?')) setItems((prev) => prev.map((i) => ({ ...i, checked: false, notes: '' }))); }}>Reset daily checklist</button>
        <button className="danger" onClick={() => { if (window.confirm('Full reset to initial inventory?')) { setItems(createInitialInventory()); setMeta(defaultMeta); } }}>Full reset</button>
      </footer>
    </div>
  );
}
