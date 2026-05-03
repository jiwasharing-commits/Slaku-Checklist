const STORAGE_KEY = 'slaku_stock_opname_data_v1';

const initialData = {
  meta: { date: new Date().toISOString().slice(0, 10), staffName: '' },
  items: createInitialItems(),
};

function createInitialItems() {
  const categories = {
    'DAIRY (SUSU & TURUNAN)': ['Susu Cair','Susu SKM','Whipping Cream','Susu AP','Creamcheese U Tart','Cream Cheese Asin','Yogurt','Susu Evaporate','Fiber Creme'],
    'SWEETENER (GULA)': ['Gula Pasir','Gula Halus','Brown Sugar','Gula Aren Cair'],
    'FAT (LEMAK)': ['Butter Unsalted Primary','Butter Unsalt Secondary'],
    'DRY INGREDIENT': ['Tepung Terigu','Maizena','Ragi','Regal Primary','Regal Secondary','Biscoff'],
    'FLAVORING & ADDITIVE': ['Xantan Gum','Seasalt Bubuk Minuman','Vanili','Garam'],
    'COFFEE': ['Kopi Dryed CF09S Maxfood','Kopi Susu Blend'],
    'TEA': ['Matcha Homelab / Noomi','Daun Teh Kering Hijau','Daun Teh Kering Hitam'],
    'COKLAT': ['Coklat Bubuk','Coklat Batang','Choco Chip'],
    'PACKAGING – BOX & CONTAINER': ['Box Ivory 20 x 20 x 5','Box Ivory 18 x 18 x 5','Box Ivory 12 x 12 x 5','Box Ivory 10 x 10 x 5','Box Plastik Cup 10 cm','Korean Box Slice'],
    'PACKAGING – PAPER & BASE': ['Tatakan Kue 20 cm','Tatakan Kue 18 cm','Tatakan Kue Kertas 12 cm','Tatakan Kue 10 cm','Kertas Minyak Bulat 20','Kertas Minyak Bulat 18'],
    'PACKAGING – SUPPORT & AKSESORIS': ['Sendok Kayu','Plastik Transparan','Kabel Ties','Pita'],
    'PACKAGING – STICKER': ['Sticker Slaku 4 cm','Sticker Tq 4 cm','Sticker Slaku 6 cm','Sticker Tq 6 cm','Solatip Sticker Bulat']
  };
  const items = [];
  Object.entries(categories).forEach(([category, names]) => {
    names.forEach((name, idx) => items.push({
      id: `${category}-${name}-${idx}`,
      name, category, unit: 'pcs', systemStock: 0, physicalStock: 0, notes: '', checked: false
    }));
  });
  return items;
}

function calculateVariance(item) { return Number(item.physicalStock) - Number(item.systemStock); }
function calculateStatus(item) {
  const variance = calculateVariance(item);
  if (Number(item.physicalStock) === 0) return 'Habis';
  if (Number(item.physicalStock) > 0 && Number(item.physicalStock) <= 3) return 'Kurang';
  if (variance !== 0) return 'Perlu Cek';
  return 'Aman';
}

let state = loadState();
const el = {
  summaryCards: document.getElementById('summaryCards'),
  inventoryList: document.getElementById('inventoryList'),
  checklistSection: document.getElementById('checklistSection'),
  searchInput: document.getElementById('searchInput'),
  categoryFilter: document.getElementById('categoryFilter'),
  checkedFilter: document.getElementById('checkedFilter'),
  statusFilter: document.getElementById('statusFilter'),
  opnameDate: document.getElementById('opnameDate'),
  staffName: document.getElementById('staffName'),
  startTodayTop: document.getElementById('startTodayTop'),
  startTodayInfo: document.getElementById('startTodayInfo'),
  seeChecklist: document.getElementById('seeChecklist'),
  addItemBtn: document.getElementById('addItemBtn'),
  exportCsvBtn: document.getElementById('exportCsvBtn'),
  printBtn: document.getElementById('printBtn'),
  backupJsonBtn: document.getElementById('backupJsonBtn'),
  importJsonInput: document.getElementById('importJsonInput'),
  resetDailyBtn: document.getElementById('resetDailyBtn'),
  resetFullBtn: document.getElementById('resetFullBtn'),
};

init();
function init() {
  bindEvents();
  render();
}
function bindEvents() {
  el.searchInput.addEventListener('input', render);
  el.categoryFilter.addEventListener('change', render);
  el.checkedFilter.addEventListener('change', render);
  el.statusFilter.addEventListener('change', render);
  el.opnameDate.addEventListener('change', () => { state.meta.date = el.opnameDate.value; saveState(); render(); });
  el.staffName.addEventListener('input', () => { state.meta.staffName = el.staffName.value; saveState(); });
  [el.startTodayTop, el.startTodayInfo].forEach((btn) => btn.addEventListener('click', () => {
    state.meta.date = new Date().toISOString().slice(0, 10);
    saveState(); render();
  }));
  el.seeChecklist.addEventListener('click', () => el.checklistSection.scrollIntoView({behavior: 'smooth'}));
  el.addItemBtn.addEventListener('click', addItem);
  el.exportCsvBtn.addEventListener('click', exportCsv);
  el.printBtn.addEventListener('click', () => window.print());
  el.backupJsonBtn.addEventListener('click', backupJson);
  el.importJsonInput.addEventListener('change', importJson);
  el.resetDailyBtn.addEventListener('click', resetDaily);
  el.resetFullBtn.addEventListener('click', resetFull);
}
function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(initialData); }
  catch { return structuredClone(initialData); }
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function filteredItems() {
  const q = el.searchInput.value.trim().toLowerCase();
  const cat = el.categoryFilter.value || 'all';
  const chk = el.checkedFilter.value || 'all';
  const status = el.statusFilter.value || 'all';
  return state.items.filter((item) => {
    if (q && !item.name.toLowerCase().includes(q)) return false;
    if (cat !== 'all' && item.category !== cat) return false;
    if (chk === 'checked' && !item.checked) return false;
    if (chk === 'unchecked' && item.checked) return false;
    if (status !== 'all' && calculateStatus(item) !== status) return false;
    return true;
  });
}

function render() {
  el.opnameDate.value = state.meta.date;
  el.staffName.value = state.meta.staffName;
  renderCategoryFilter();
  renderSummary();
  renderChecklist();
}

function renderCategoryFilter() {
  const current = el.categoryFilter.value || 'all';
  const cats = [...new Set(state.items.map((i) => i.category))];
  el.categoryFilter.innerHTML = `<option value="all">Semua Kategori</option>${cats.map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}`;
  el.categoryFilter.value = cats.includes(current) ? current : 'all';
}

function renderSummary() {
  const total = state.items.length;
  const checked = state.items.filter((i) => i.checked).length;
  const lowOut = state.items.filter((i) => ['Kurang','Habis'].includes(calculateStatus(i))).length;
  const variance = state.items.filter((i) => calculateVariance(i) !== 0).length;
  const cards = [
    ['Total Item', total], ['Sudah Dicek', checked], ['Belum Dicek', total - checked], ['Item Kurang / Habis', lowOut], ['Selisih Stok', variance],
  ];
  el.summaryCards.innerHTML = cards.map(([t, v]) => `<article class="card summary-card"><p>${t}</p><strong>${v}</strong></article>`).join('');
}

function renderChecklist() {
  const grouped = {};
  filteredItems().forEach((item) => ((grouped[item.category] ||= []).push(item)));
  el.inventoryList.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <details open>
      <summary>${escapeHtml(category)} (${items.length})</summary>
      ${items.map(renderItem).join('')}
    </details>
  `).join('') || '<p class="muted">Tidak ada item sesuai filter.</p>';

  el.inventoryList.querySelectorAll('[data-id]').forEach((node) => {
    const id = node.getAttribute('data-id');
    const item = state.items.find((x) => x.id === id);
    if (!item) return;
    node.querySelector('.check').addEventListener('change', (e) => { item.checked = e.target.checked; saveState(); render(); });
    node.querySelector('.unit').addEventListener('input', (e) => { item.unit = e.target.value; saveState(); });
    node.querySelector('.sys').addEventListener('input', (e) => { item.systemStock = Number(e.target.value || 0); saveState(); render(); });
    node.querySelector('.phy').addEventListener('input', (e) => { item.physicalStock = Number(e.target.value || 0); saveState(); render(); });
    node.querySelector('.notes').addEventListener('input', (e) => { item.notes = e.target.value; saveState(); });
    node.querySelector('.delete').addEventListener('click', () => {
      if (!confirm('Hapus item ini?')) return;
      state.items = state.items.filter((x) => x.id !== item.id); saveState(); render();
    });
  });
}

function renderItem(item) {
  const status = calculateStatus(item);
  const varian = calculateVariance(item);
  const statusClass = status === 'Aman' ? 'status-aman' : status === 'Perlu Cek' ? 'status-perlu' : status === 'Kurang' ? 'status-kurang' : 'status-habis';
  return `<article class="item" data-id="${escapeHtml(item.id)}">
    <div class="item-top"><label><input class="check" type="checkbox" ${item.checked ? 'checked' : ''}/> Dicek</label><span class="status ${statusClass}">${status}</span></div>
    <div class="item-top"><strong>${escapeHtml(item.name)}</strong><button class="btn danger delete">Delete</button></div>
    <div class="muted">${escapeHtml(item.category)}</div>
    <div class="item-grid">
      <label>Unit<input class="unit" value="${escapeHtml(item.unit)}" /></label>
      <label>System<input class="sys" type="number" value="${item.systemStock}" /></label>
      <label>Physical<input class="phy" type="number" value="${item.physicalStock}" /></label>
      <label>Variance<input value="${varian}" disabled /></label>
      <label class="full">Catatan<input class="notes" value="${escapeHtml(item.notes)}" /></label>
    </div>
  </article>`;
}

function addItem() {
  const name = prompt('Nama item baru:'); if (!name) return;
  const category = prompt('Kategori:', 'LAINNYA') || 'LAINNYA';
  state.items.unshift({ id: crypto.randomUUID(), name, category, unit: 'pcs', systemStock: 0, physicalStock: 0, notes: '', checked: false });
  saveState(); render();
}

function exportCsv() {
  const header = ['Date','Staff','Checked','Item Name','Category','Unit','System Stock','Physical Stock','Variance','Notes','Status'];
  const rows = state.items.map((i) => [state.meta.date,state.meta.staffName,i.checked?'Yes':'No',i.name,i.category,i.unit,i.systemStock,i.physicalStock,calculateVariance(i),i.notes,calculateStatus(i)]);
  const csv = [header, ...rows].map((row) => row.map((x) => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
  downloadFile(csv, `slaku-opname-${state.meta.date}.csv`, 'text/csv');
}
function backupJson() { downloadFile(JSON.stringify(state, null, 2), `slaku-backup-${state.meta.date}.json`, 'application/json'); }
function importJson(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.items || !parsed.meta) throw new Error('invalid');
      state = parsed; saveState(); render();
      alert('Import berhasil.');
    } catch { alert('File JSON tidak valid.'); }
  };
  reader.readAsText(file);
}
function resetDaily() {
  if (!confirm('Reset Checklist Harian? (hapus centang & catatan)')) return;
  state.items = state.items.map((i) => ({ ...i, checked: false, notes: '' }));
  saveState(); render();
}
function resetFull() {
  if (!confirm('Reset Penuh? (kembali ke data awal)')) return;
  state = structuredClone(initialData);
  saveState(); render();
}
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  URL.revokeObjectURL(a.href);
}
function escapeHtml(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
