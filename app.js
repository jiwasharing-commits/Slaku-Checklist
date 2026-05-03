const STORAGE_KEY = 'slaku_simple_buy_checklist_v1';

const categories = {
  'DAIRY (SUSU & TURUNAN)': ['Susu Cair','Susu SKM','Whipping Cream','Susu AP','Creamcheese U Tart','Cream Cheese Asin','Yogurt','Susu Evaporate','Fiber Creme'],
  'SWEETENER (GULA)': ['Gula Pasir','Gula Halus','Brown Sugar','Gula Aren Cair'],
  'FAT (LEMAK)': ['Butter Unsalted Primary','Butter Unsalt Secondary'],
  'DRY INGREDIENT': ['Tepung Terigu','Maizena','Ragi','Regal Primary','Regal Secondary','Biscoff'],
  'FLAVORING & ADDITIVE': ['Xantan Gum','Seasalt Bubuk Minuman','Vanili','Garam'],
  COFFEE: ['Kopi Dryed CF09S Maxfood','Kopi Susu Blend'],
  TEA: ['Matcha Homelab / Noomi','Daun Teh Kering Hijau','Daun Teh Kering Hitam'],
  COKLAT: ['Coklat Bubuk','Coklat Batang','Choco Chip'],
  'PACKAGING – BOX & CONTAINER': ['Box Ivory 20 x 20 x 5','Box Ivory 18 x 18 x 5','Box Ivory 12 x 12 x 5','Box Ivory 10 x 10 x 5','Box Plastik Cup 10 cm','Korean Box Slice'],
  'PACKAGING – PAPER & BASE': ['Tatakan Kue 20 cm','Tatakan Kue 18 cm','Tatakan Kue Kertas 12 cm','Tatakan Kue 10 cm','Kertas Minyak Bulat 20','Kertas Minyak Bulat 18'],
  'PACKAGING – SUPPORT & AKSESORIS': ['Sendok Kayu','Plastik Transparan','Kabel Ties','Pita'],
  'PACKAGING – STICKER': ['Sticker Slaku 4 cm','Sticker Tq 4 cm','Sticker Slaku 6 cm','Sticker Tq 6 cm','Solatip Sticker Bulat']
};

const defaultItems = Object.entries(categories).flatMap(([category, names]) => names.map((name, idx) => ({ id: `${category}-${idx}-${name}`, category, name, checked: false })));
let items = loadItems();

const summaryCards = document.getElementById('summaryCards');
const searchInput = document.getElementById('searchInput');
const checklist = document.getElementById('checklist');
document.getElementById('resetBtn').addEventListener('click', resetChecklist);
document.getElementById('printBtn').addEventListener('click', printChecklist);
document.getElementById('csvBtn').addEventListener('click', exportCsv);
searchInput.addEventListener('input', render);

render();

function loadItems() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return structuredClone(defaultItems);
    const map = new Map(parsed.map((x) => [x.id, !!x.checked]));
    return defaultItems.map((item) => ({ ...item, checked: map.get(item.id) ?? false }));
  } catch {
    return structuredClone(defaultItems);
  }
}
function saveItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const filtered = items.filter((item) => item.name.toLowerCase().includes(q));
  const grouped = {};
  filtered.forEach((item) => ((grouped[item.category] ||= []).push(item)));

  const perlu = items.filter((i) => i.checked).length;
  summaryCards.innerHTML = [
    ['Total Item', items.length],
    ['Perlu Dibeli', perlu],
    ['Belum Perlu Dibeli', items.length - perlu],
  ].map(([t, v]) => `<article class="card summary-card"><p>${t}</p><strong>${v}</strong></article>`).join('');

  checklist.innerHTML = Object.entries(grouped).map(([category, list]) => `
    <details open>
      <summary>${escapeHtml(category)} (${list.length})</summary>
      ${list.map((item) => `<label class="item"><input type="checkbox" data-id="${escapeHtml(item.id)}" ${item.checked ? 'checked' : ''}/><span>${escapeHtml(item.name)}</span></label>`).join('')}
    </details>
  `).join('') || '<p>Tidak ada item.</p>';

  checklist.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener('change', (e) => {
      const id = e.target.getAttribute('data-id');
      const found = items.find((i) => i.id === id);
      if (!found) return;
      found.checked = e.target.checked;
      saveItems();
      render();
    });
  });
}

function resetChecklist() {
  if (!confirm('Reset semua checklist?')) return;
  items = items.map((item) => ({ ...item, checked: false }));
  saveItems();
  render();
}

function getCheckedItems() { return items.filter((i) => i.checked); }

function printChecklist() {
  const checked = getCheckedItems();
  const content = checked.length
    ? `<h2>Daftar Belanja Slaku</h2><ul>${checked.map((i) => `<li>${escapeHtml(i.category)} - ${escapeHtml(i.name)}</li>`).join('')}</ul>`
    : '<p>Tidak ada item yang perlu dibeli.</p>';
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Print Daftar Belanja</title></head><body>${content}</body></html>`);
  w.document.close();
  w.print();
}

function exportCsv() {
  const checked = getCheckedItems();
  const rows = [['Category', 'Item Name'], ...checked.map((i) => [i.category, i.name])];
  const csv = rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'slaku-daftar-belanja.csv';
  a.click();
}

function escapeHtml(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
