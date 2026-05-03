import { useEffect, useMemo, useState } from 'react';
import { createInitialInventory } from './inventoryData';
import { calculateStatus, calculateVariance, parseBackupJson, toBackupJson, toCsv } from './helpers';
import type { InventoryItem, InventoryStatus } from './types';

const ITEMS_KEY = 'slaku_items'; const STAFF_KEY = 'slaku_staff';
const today = new Date().toISOString().slice(0,10);

export default function App() {
  const [items, setItems] = useState<InventoryItem[]>(() => JSON.parse(localStorage.getItem(ITEMS_KEY) ?? 'null') ?? createInitialInventory());
  const [staffName, setStaffName] = useState(localStorage.getItem(STAFF_KEY) ?? '');
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('All'); const [status, setStatus] = useState<'All' | InventoryStatus>('All'); const [checked, setChecked] = useState('All');

  useEffect(() => { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(STAFF_KEY, staffName); }, [staffName]);

  const categories = useMemo(() => ['All', ...Array.from(new Set(items.map(i => i.category)))], [items]);
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) && (category === 'All' || i.category === category) && (status === 'All' || calculateStatus(i) === status) && (checked === 'All' || (checked === 'Checked' ? i.checked : !i.checked)));
  const summary = { total: items.length, checked: items.filter(i => i.checked).length, low: items.filter(i => ['Low Stock','Out of Stock'].includes(calculateStatus(i))).length, variance: items.filter(i => calculateVariance(i.physicalStock, i.systemStock)!==0).length };

  const updateItem = (id: string, patch: Partial<InventoryItem>) => setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  const grouped = filtered.reduce<Record<string, InventoryItem[]>>((acc, i) => ((acc[i.category] ??= []).push(i), acc), {});

  return <div className='app'><header><h1>CHECK LIST OPNAME BARANG – SLAKU</h1><p>Checklist bahan baku, packaging, dan kebutuhan produksi Slaku.</p></header>
    <section className='toolbar'><div>{today}</div><input placeholder='Nama staff' value={staffName} onChange={e=>setStaffName(e.target.value)} /><button>Start Today’s Stock Opname</button><span>Saved automatically</span></section>
    <section className='summary'>{[['Total items',summary.total],['Checked items',summary.checked],['Unchecked items',summary.total-summary.checked],['Low/Out',summary.low],['Variance',summary.variance]].map(([k,v])=><article key={String(k)}><h4>{k}</h4><b>{v}</b></article>)}</section>
    <section className='filters'><input placeholder='Search item' value={search} onChange={e=>setSearch(e.target.value)} /><select value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={status} onChange={e=>setStatus(e.target.value as 'All'|InventoryStatus)}>{['All','Safe','Need Review','Low Stock','Out of Stock'].map(s=><option key={s}>{s}</option>)}</select><select value={checked} onChange={e=>setChecked(e.target.value)}>{['All','Checked','Unchecked'].map(s=><option key={s}>{s}</option>)}</select></section>
    <section>{Object.entries(grouped).map(([cat, arr]) => <details key={cat} open><summary>{cat} ({arr.length})</summary>{arr.map(i => <div className='item' key={i.id}><input type='checkbox' checked={i.checked} onChange={e=>updateItem(i.id,{checked:e.target.checked})}/><div><strong>{i.name}</strong><small>{calculateStatus(i)}</small></div><input value={i.unit} onChange={e=>updateItem(i.id,{unit:e.target.value})}/><input type='number' value={i.systemStock} onChange={e=>updateItem(i.id,{systemStock:Number(e.target.value)})}/><input type='number' value={i.physicalStock} onChange={e=>updateItem(i.id,{physicalStock:Number(e.target.value)})}/><span>{calculateVariance(i.physicalStock,i.systemStock)}</span><input value={i.notes} onChange={e=>updateItem(i.id,{notes:e.target.value})}/><button onClick={()=>setItems(prev=>prev.filter(x=>x.id!==i.id))}>Delete</button></div>)}</details>)}</section>
    <section className='actions'><button onClick={()=>{const name=prompt('Item name'); if(!name) return; const cat=prompt('Category')||'OTHERS'; setItems(p=>[{id:crypto.randomUUID(),name,category:cat,unit:'pcs',systemStock:0,physicalStock:0,notes:'',checked:false},...p]);}}>Add item</button>
    <button onClick={()=>{const blob=new Blob([toCsv(items,{date:today,staffName})],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`slaku-opname-${today}.csv`; a.click();}}>Export CSV</button>
    <button onClick={()=>window.print()}>Print checklist</button>
    <button onClick={()=>{const blob=new Blob([toBackupJson(items,{date:today,staffName})],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`slaku-backup-${today}.json`; a.click();}}>Backup JSON</button>
    <label className='import'>Import JSON<input type='file' hidden accept='application/json' onChange={async e=>{const f=e.target.files?.[0]; if(!f) return; const data=parseBackupJson(await f.text()); setItems(data.items); setStaffName(data.meta.staffName);}}/></label>
    <button onClick={()=>{if(confirm('Reset daily checklist?')) setItems(p=>p.map(i=>({...i,checked:false,notes:''})));}}>Reset daily checklist</button>
    <button onClick={()=>{if(confirm('Full reset all data?')) setItems(createInitialInventory());}}>Full reset</button></section>
  </div>
}
