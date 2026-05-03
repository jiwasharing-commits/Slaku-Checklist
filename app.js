const STORAGE_KEY = 'slaku_simple_checklist_v3';
const BACKUP_APP = 'Slaku Checklist';
const BACKUP_VERSION = '1.1';
const WA_NUMBER = '6287865706644';

const categories = {
  'DAIRY (SUSU & TURUNAN)': ['Susu Cair','Susu SKM','Whipping Cream','Susu AP','Creamcheese U Tart','Cream Cheese Asin','Yogurt','Susu Evaporate','Fiber Creme'],
  'SWEETENER (GULA)': ['Gula Pasir','Gula Halus','Brown Sugar','Gula Aren Cair'],
  'FAT (LEMAK)': ['Butter Unsalted Primary','Butter Unsalt Secondary'],
  'DRY INGREDIENT': ['Tepung Terigu','Maizena','Ragi','Regal Primary','Regal Secondary','Biscoff'],
  'FLAVORING & ADDITIVE': ['Xantan Gum','Seasalt Bubuk Minuman','Vanili','Garam'], COFFEE: ['Kopi Dryed CF09S Maxfood','Kopi Susu Blend'],
  TEA: ['Matcha Homelab / Noomi','Daun Teh Kering Hijau','Daun Teh Kering Hitam'], COKLAT: ['Coklat Bubuk','Coklat Batang','Choco Chip'],
  'PACKAGING – BOX & CONTAINER': ['Box Ivory 20 x 20 x 5','Box Ivory 18 x 18 x 5','Box Ivory 12 x 12 x 5','Box Ivory 10 x 10 x 5','Box Plastik Cup 10 cm','Korean Box Slice'],
  'PACKAGING – PAPER & BASE': ['Tatakan Kue 20 cm','Tatakan Kue 18 cm','Tatakan Kue Kertas 12 cm','Tatakan Kue 10 cm','Kertas Minyak Bulat 20','Kertas Minyak Bulat 18'],
  'PACKAGING – SUPPORT & AKSESORIS': ['Sendok Kayu','Plastik Transparan','Kabel Ties','Pita'],
  'PACKAGING – STICKER': ['Sticker Slaku 4 cm','Sticker Tq 4 cm','Sticker Slaku 6 cm','Sticker Tq 6 cm','Solatip Sticker Bulat']
};

const baseItems = Object.entries(categories).flatMap(([category, names]) =>
  names.map((name, i) => ({ id: `${category}-${i}-${name}`, category, name, checked: false, currentStock: 0, minStock: 0, buyQty: 0 })),
);

let items = load();
const list = document.getElementById('list');
const recapList = document.getElementById('recapList');
const summary = document.getElementById('summary');
const searchInput = document.getElementById('searchInput');
const importInput = document.getElementById('importInput');

document.getElementById('startBtn').onclick = () => window.scrollTo({ top: 260, behavior: 'smooth' });
document.getElementById('toRecapBtn').onclick = () => document.getElementById('recapCard').scrollIntoView({ behavior: 'smooth' });
document.getElementById('resetBtn').onclick = () => { if (confirm('Reset semua checklist?')) { items = items.map(x => ({ ...x, checked: false })); save(); render(); } };
document.getElementById('waBtn').onclick = sendWhatsApp;
document.getElementById('printBtn').onclick = printRecap;
document.getElementById('csvBtn').onclick = exportCsv;
document.getElementById('backupBtn').onclick = backupJson;
document.getElementById('importBtn').onclick = () => importInput.click();
importInput.addEventListener('change', importJson);
searchInput.addEventListener('input', render);

function needsBuy(item) { return Number(item.currentStock) < Number(item.minStock); }
function normalize(item) {
  const currentStock = Number(item.currentStock) || 0;
  const minStock = Number(item.minStock) || 0;
  const defaultBuy = Math.max(minStock - currentStock, 0);
  return { ...item, currentStock, minStock, buyQty: Number(item.buyQty) || defaultBuy, checked: item.checked || currentStock < minStock };
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return structuredClone(baseItems);
    const map = new Map(saved.map(x => [x.id, x]));
    return baseItems.map(x => normalize({ ...x, ...(map.get(x.id) || {}) }));
  } catch { return structuredClone(baseItems); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render() {
  renderSummary();
  const q = searchInput.value.trim().toLowerCase();
  const grouped = {};
  items.filter(i => i.name.toLowerCase().includes(q)).forEach(i => ((grouped[i.category] ||= []).push(i)));
  list.innerHTML = Object.entries(grouped).map(([category, arr]) => `<details open><summary>${esc(category)} (${arr.length})</summary>${arr.map(renderRow).join('')}</details>`).join('') || '<p>Tidak ada item.</p>';
  bindRowEvents();
  renderRecap();
}

function renderRow(item) {
  return `<div class="item"><label><input type="checkbox" data-id="${esc(item.id)}" class="check" ${item.checked ? 'checked' : ''}/><span>${esc(item.name)}</span></label>
  <div class="mini"><label>Stok Saat Ini<input type="number" class="current" data-id="${esc(item.id)}" value="${item.currentStock}"/></label><label>Stok Minimal<input type="number" class="min" data-id="${esc(item.id)}" value="${item.minStock}"/></label><label>Jumlah Dibeli<input type="number" class="buy" data-id="${esc(item.id)}" value="${item.buyQty}"/></label></div></div>`;
}

function bindRowEvents() {
  list.querySelectorAll('.check').forEach(el => el.addEventListener('change', e => updateItem(e.target.dataset.id, { checked: e.target.checked })));
  list.querySelectorAll('.current').forEach(el => el.addEventListener('input', e => updateStock(e.target.dataset.id, 'currentStock', e.target.value)));
  list.querySelectorAll('.min').forEach(el => el.addEventListener('input', e => updateStock(e.target.dataset.id, 'minStock', e.target.value)));
  list.querySelectorAll('.buy').forEach(el => el.addEventListener('input', e => updateItem(e.target.dataset.id, { buyQty: Number(e.target.value) || 0 })));
}

function updateItem(id, patch) {
  items = items.map(i => i.id === id ? normalize({ ...i, ...patch }) : i);
  save(); render();
}
function updateStock(id, key, value) {
  items = items.map(i => {
    if (i.id !== id) return i;
    const next = { ...i, [key]: Number(value) || 0 };
    const autoBuy = Math.max(next.minStock - next.currentStock, 0);
    next.buyQty = autoBuy;
    next.checked = next.checked || needsBuy(next);
    if (!needsBuy(next) && next.buyQty === 0) next.checked = false;
    return normalize(next);
  });
  save(); render();
}

function renderSummary() {
  const perlu = items.filter(i => i.checked).length;
  summary.innerHTML = [['Total Item', items.length], ['Perlu Dibeli', perlu], ['Belum Perlu Dibeli', items.length - perlu]].map(([t, v]) => `<article class="card sum-card"><p>${t}</p><strong>${v}</strong></article>`).join('');
}

function getCheckedItems() { return items.filter(i => i.checked); }

function renderRecap() {
  const checked = getCheckedItems();
  if (!checked.length) { recapList.innerHTML = '<p>Belum ada item yang perlu dibeli.</p>'; return; }
  const grouped = {};
  checked.forEach(i => ((grouped[i.category] ||= []).push(i)));
  recapList.innerHTML = Object.entries(grouped).map(([cat, list]) => `<details open><summary>${esc(cat)} (${list.length})</summary><ul>${list.map(i => `<li>${esc(i.name)} | Stok: ${i.currentStock} | Minimal: ${i.minStock} | Beli: ${i.buyQty}</li>`).join('')}</ul></details>`).join('');
}

function sendWhatsApp() {
  const checked = getCheckedItems(); if (!checked.length) return alert('Belum ada item yang perlu dibeli.');
  const text = ['Halo, rekap belanja Slaku:','',...checked.map((i, n) => `${n + 1}. ${i.category} - ${i.name} (stok:${i.currentStock}, minimal:${i.minStock}, beli:${i.buyQty})`)].join('\n');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
}

function printRecap() {
  const checked = getCheckedItems();
  const body = checked.length ? `<h2>Daftar Belanja Slaku</h2><ul>${checked.map(i => `<li>${esc(i.category)} - ${esc(i.name)} | Stok: ${i.currentStock} | Minimal: ${i.minStock} | Beli: ${i.buyQty}</li>`).join('')}</ul>` : '<p>Belum ada item yang perlu dibeli.</p>';
  const w = window.open('', '_blank');
  w.document.write(`<html><body>${body}</body></html>`); w.document.close(); w.print();
}

function exportCsv() {
  const rows = [['Category', 'Item Name', 'Current Stock', 'Minimum Stock', 'Qty to Buy'], ...getCheckedItems().map(i => [i.category, i.name, i.currentStock, i.minStock, i.buyQty])];
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  downloadFile(csv, 'slaku-daftar-belanja.csv', 'text/csv');
}

function backupJson() {
  const payload = { appName: BACKUP_APP, backupVersion: BACKUP_VERSION, backupDate: new Date().toISOString(), categories, items };
  downloadFile(JSON.stringify(payload, null, 2), `slaku-checklist-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json');
}

function importJson(e) {
  const file = e.target.files?.[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!parsed || parsed.appName !== BACKUP_APP || !Array.isArray(parsed.items)) throw new Error('invalid');
      const map = new Map(parsed.items.map(x => [x.id, x]));
      items = baseItems.map(x => normalize({ ...x, ...(map.get(x.id) || {}) }));
      save(); render(); alert('Data berhasil diimport.');
    } catch { alert('File backup tidak valid.'); }
    e.target.value = '';
  };
  reader.readAsText(file);
}

function downloadFile(content, filename, type) { const blob = new Blob([content], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); }
function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
render();
