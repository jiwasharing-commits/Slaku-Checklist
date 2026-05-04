const STORAGE_KEY = 'slaku_simple_checklist_v3';
const BACKUP_APP = 'Slaku Checklist';
const BACKUP_VERSION = '1.1';
const WA_NUMBER = '6287865706644';
const APP_USERNAME = 'slaku';
const APP_PASSWORD = 'Solo713188';
const LOGIN_KEY = 'slaku_logged_in';
const RECAP_UI_KEY = 'slaku_recap_ui_v1';
const defaultRecapUi = { mainOpen: true, onlineOpen: false, lotteOpen: false, tokbinOpen: false, rizaputraOpen: false };
let recapUi = loadRecapUi();

const categories = {
  'DAIRY (SUSU & TURUNAN)': ['Susu INDOMILK UHT PLAIN 950 ML','Susu Kental Manis 370 gr Kaleng','RICH GOLD WHIPPED CREAM 907 gr','Diamond All Purpose Milk UHT','ROYAL VICTORIA CREAM CHEESE 2KG','Prochiz Spready 2kg','Yogurt Heavenly Blush Greek Classic','F&N Evaporated Filled Milk 380 gr','Fiber Crème Elenka 1 kg'],
  'SWEETENER (GULA)': ['Gula Pasir Kuning 1 Kg','Gula Pasir Putih 1 Kg','Bola Deli Gula Halus 1 Kg','Light Brown Sugar Ricoman 500gram','Presso Gula Aren Cair 1 Liter'],
  'FAT (LEMAK)': ['Butter Unsalted Anchor 1 Kg Repack','Butter Unsalted Holman 1 Kg Repack'],
  'DRY INGREDIENT': ['Tepung Terigu Bogasari Cakra Kembar Emas Roti Oriental','Maizenaku 1 kg','Saf Instan Gold 500 gr','Marie Regal 1 Kg','Marie Susu 1 Kg','Biskoff lotus Crumble 750 gr/Biscoff 250 Gr'],
  'FLAVORING & ADDITIVE': ['Xantan Gum','Izy Premix Powder Sea Salt 1 kg','Red Bell Vanili 30 ml','Garam dapur halus'], COFFEE: ['Kopi Dryed CF09S Maxfood','Presso Kopi Susu Blend'],
  TEA: ['Matcha Homelab 200 gr','Thai Tea Chatramue 400 gr','Thai green Tea Chatramue 200 gr'], COKLAT: ['Coklat Bubu Bens Drop 22/24 Queen Anna','Dark Coklat Batang Tulip','Choco Chip'],
  'PACKAGING – BOX & CONTAINER': ['Box Ivory 20 x 20 x 5 isi 12','Box Ivory 18 x 18 x 5 isi 12','Box Ivory 12 x 12 x 5 isi 12','Box Ivory 10 x 10 x 5 isi 12','Box Plastik Cup 10 cm isi 12','Korean Box Slice Isi 10'],
  'PACKAGING – PAPER & BASE': ['Tatakan Kue 20 cm','Tatakan Kue 18 cm','Tatakan Kue Kertas 12 cm','Tatakan Kue 10 cm','Kertas Minyak Bulat 20','Kertas Minyak Bulat 18'],
  'PACKAGING – SUPPORT & AKSESORIS': ['Sendok Kayu','Plastik Transparan','Kabel Ties','Pita'],
  'PACKAGING – STICKER': ['Sticker Slaku 4 cm','Sticker Tq 4 cm','Sticker Slaku 6 cm','Sticker Tq 6 cm','Solatip Sticker Bulat'],
  'PACKAGING': ['Sticker botol 200 ml Matcha','Sticker botol 200 ml Kopi Susu','Sticker botol 200 ml Coklat','Sticker botol 1 liter Matcha','Sticker botol 1 liter Kopi Susu','Sticker botol 1 liter Coklat','Botol 1 liter','Botol 200 ml'],
  'PERALATAN / LAIN-LAIN': ['Torch Gun']
};

const legacyCategories = {
  'DAIRY (SUSU & TURUNAN)': ['Susu Cair','Susu SKM','Whipping Cream','Susu AP','Creamcheese U Tart','Cream Cheese Asin','Yogurt','Susu Evaporate','Fiber Creme'],
  'SWEETENER (GULA)': ['Gula Pasir','Gula Halus','Brown Sugar','Gula Aren Cair'],
  'FAT (LEMAK)': ['Butter Unsalted Primary','Butter Unsalt Secondary'],
  'DRY INGREDIENT': ['Tepung Terigu','Maizena','Ragi','Regal Primary','Regal Secondary','Biscoff'],
  'FLAVORING & ADDITIVE': ['Xantan Gum','Seasalt Bubuk Minuman','Vanili','Garam'], COFFEE: ['Kopi Dryed CF09S Maxfood','Kopi Susu Blend'],
  TEA: ['Matcha Homelab / Noomi','Daun Teh Kering Hijau','Daun Teh Kering Hitam'], COKLAT: ['Coklat Bubuk','Coklat Batang','Choco Chip'],
  'PACKAGING – BOX & CONTAINER': ['Box Ivory 20 x 20 x 5','Box Ivory 18 x 18 x 5','Box Ivory 12 x 12 x 5','Box Ivory 10 x 10 x 5','Box Plastik Cup 10 cm','Korean Box Slice'],
  'PACKAGING – PAPER & BASE': ['Tatakan Kue 20 cm','Tatakan Kue 18 cm','Tatakan Kue Kertas 12 cm','Tatakan Kue 10 cm','Kertas Minyak Bulat 20','Kertas Minyak Bulat 18'],
  'PACKAGING – SUPPORT & AKSESORIS': ['Sendok Kayu','Plastik Transparan','Kabel Ties','Pita'],
  'PACKAGING – STICKER': ['Sticker Slaku 4 cm','Sticker Tq 4 cm','Sticker Slaku 6 cm','Sticker Tq 6 cm','Solatip Sticker Bulat'],
  'PACKAGING': ['Sticker botol 200 ml Matcha','Sticker botol 200 ml Kopi Susu','Sticker botol 200 ml Coklat','Sticker botol 1 liter Matcha','Sticker botol 1 liter Kopi Susu','Sticker botol 1 liter Coklat','Botol 1 liter','Botol 200 ml'],
  'PERALATAN / LAIN-LAIN': ['Torch Gun']
};

const baseItems = Object.entries(categories).flatMap(([category, names]) => names.map((name, i) => ({ id: `${category}__${i}`, category, name, checked: false, currentStock: 0, minStock: 0, buyQty: 0, place: 'Online & Offline' })));
let items = load();

const loginPage = document.getElementById('loginPage');
const appPage = document.getElementById('appPage');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginBtn = document.getElementById('loginBtn');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

const list = document.getElementById('list');
const recapList = document.getElementById('recapList');
const summary = document.getElementById('summary');
const searchInput = document.getElementById('searchInput');
const importInput = document.getElementById('importInput');
const recapCard = document.getElementById('recapCard');
const recapHeader = document.getElementById('recapHeader');
const recapHeaderIcon = document.getElementById('recapHeaderIcon');
const recapHeaderMeta = document.getElementById('recapHeaderMeta');

function showApp() { loginPage.style.display = 'none'; appPage.style.display = ''; render(); }
function showLogin() { appPage.style.display = 'none'; loginPage.style.display = 'flex'; }
function checkAuthOnLoad() { if (localStorage.getItem(LOGIN_KEY) === '1') showApp(); else showLogin(); }

loginBtn?.addEventListener('click', () => {
  const username = (usernameInput.value || '').trim();
  const password = (passwordInput.value || '').trim();
  if (username === APP_USERNAME && password === APP_PASSWORD) {
    localStorage.setItem(LOGIN_KEY, '1');
    loginError.textContent = '';
    usernameInput.value = '';
    passwordInput.value = '';
    showApp();
  } else loginError.textContent = 'Username atau password salah.';
});
[usernameInput, passwordInput].forEach((el) => el?.addEventListener('keydown', (e) => { if (e.key === 'Enter') loginBtn.click(); }));
logoutBtn?.addEventListener('click', () => { localStorage.removeItem(LOGIN_KEY); showLogin(); });

document.getElementById('startBtn').onclick = () => window.scrollTo({ top: 260, behavior: 'smooth' });
document.getElementById('toRecapBtn').onclick = () => document.getElementById('recapCard').scrollIntoView({ behavior: 'smooth' });
document.getElementById('resetBtn').onclick = () => { if (confirm('Reset semua checklist?')) { items = items.map(x => ({ ...x, checked: false })); save(); render(); } };
document.getElementById('waBtn').onclick = () => sendWhatsAppAll();
document.getElementById('printBtn').onclick = printRecap;
document.getElementById('csvAllBtn').onclick = () => exportCsvAll();
document.getElementById('csvNeedBtn').onclick = () => exportCsvNeedBuy();
document.getElementById('backupBtn').onclick = backupJson;
document.getElementById('importBtn').onclick = () => importInput.click();
importInput.addEventListener('change', importJson);
searchInput.addEventListener('input', render);
recapHeader?.addEventListener('click', () => { recapUi.mainOpen = !recapUi.mainOpen; saveRecapUi(); renderRecap(); });
recapCard?.addEventListener('click', (e) => { const btn = e.target.closest('[data-toggle]'); if (!btn) return; const key = btn.getAttribute('data-toggle'); recapUi[key] = !recapUi[key]; saveRecapUi(); renderRecap(); });
recapCard?.addEventListener('click', (e) => { const btn = e.target.closest('[data-wa-place]'); if (!btn) return; if (btn.disabled) { if (btn.getAttribute('data-wa-place') === 'Online') alert('Tidak ada bahan Online yang perlu dibeli.'); return; } sendWhatsAppByPlace(btn.getAttribute('data-wa-place')); });

function loadRecapUi() { try { return { ...defaultRecapUi, ...(JSON.parse(localStorage.getItem(RECAP_UI_KEY)) || {}) }; } catch { return { ...defaultRecapUi }; } }
function saveRecapUi() { localStorage.setItem(RECAP_UI_KEY, JSON.stringify(recapUi)); }

function needsBuy(item) { return Number(item.currentStock) < Number(item.minStock); }
function normalize(item) { const currentStock = Number(item.currentStock) || 0; const minStock = Number(item.minStock) || 0; const defaultBuy = Math.max(minStock - currentStock, 0); return { ...item, currentStock, minStock, buyQty: Number(item.buyQty) || defaultBuy, checked: item.checked || currentStock < minStock, place: (() => { let place = item.place || 'Online'; if (place === 'Offline') place = 'Tokbin'; if (place === 'Online & Offline') place = 'Online'; if (!['Online','Lotte','Tokbin','RizaPutra'].includes(place)) place = 'Online'; return place; })() }; }
function getStockStatus(item) { const current = Number(item.currentStock) || 0; const minimum = Number(item.minStock) || 0; if (current === 0) return { key: 'kosong', icon: '⛔', label: 'KOSONG' }; if (current > 0 && current < minimum) return { key: 'kurang', icon: '⚠️', label: 'KURANG' }; return { key: 'aman', icon: '✅', label: 'AMAN' }; }
function getStockPercent(item) {
  const current = Number(item.currentStock) || 0;
  const minimum = Number(item.minStock) || 0;
  if (minimum <= 0) return 0;
  return Math.min(Math.max((current / minimum) * 100, 0), 100);
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return structuredClone(baseItems);
    const map = new Map(saved.map(x => [x.id, x]));
    return baseItems.map((x) => {
      const index = Number(x.id.split('__')[1]);
      const legacyName = legacyCategories[x.category]?.[index];
      const legacyId = legacyName ? `${x.category}-${index}-${legacyName}` : '';
      const byId = map.get(x.id) || (legacyId ? map.get(legacyId) : null);
      return normalize({ ...x, ...(byId || {}) });
    });
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
  const st = getStockStatus(item);
  const pct = getStockPercent(item);
  return `<div class="item"><label class="item-head"><input type="checkbox" data-id="${esc(item.id)}" class="check" ${item.checked ? 'checked' : ''}/><span>${esc(item.name)}</span><span class="status-badge status-${st.key}">${st.icon} ${st.label}</span></label><div class="stock-meta"><small class="stock-percent">Stok: ${Math.round(pct)}% dari minimal</small><div class="stock-bar"><div class="stock-fill stock-${st.key}" style="width:${pct}%"></div></div></div><div class="mini"><label>Stok Saat Ini<input type="number" min="0" step="1" inputmode="numeric" class="current" data-id="${esc(item.id)}" value="${item.currentStock}"/></label><label>Stok Minimal<input type="number" min="0" step="1" inputmode="numeric" class="min" data-id="${esc(item.id)}" value="${item.minStock}"/></label><label>Jumlah Dibeli<input type="number" min="0" step="1" inputmode="numeric" class="buy" data-id="${esc(item.id)}" value="${item.buyQty}"/></label><label>Tempat Beli<select class="place" data-id="${esc(item.id)}"><option ${item.place === 'Online' ? 'selected' : ''}>Online</option><option ${item.place === 'Lotte' ? 'selected' : ''}>Lotte</option><option ${item.place === 'Tokbin' ? 'selected' : ''}>Tokbin</option><option ${item.place === 'RizaPutra' ? 'selected' : ''}>RizaPutra</option></select></label></div><div class="preset-wrap"><small>Preset stok</small><div class="preset-row">${[0,25,50,75,100].map(p=>`<button type="button" class="preset-btn" data-id="${esc(item.id)}" data-preset="${p}" ${p!==0 && Number(item.minStock)<=0 ? 'disabled' : ''}>${p}%</button>`).join('')}</div></div></div>`;
}

function bindRowEvents() {
  list.querySelectorAll('.check').forEach(el => el.addEventListener('change', e => updateItem(e.target.dataset.id, { checked: e.target.checked })));
  list.querySelectorAll('.current').forEach(el => el.addEventListener('input', e => updateStockLive(e.target.dataset.id, 'currentStock', e.target.value)));
  list.querySelectorAll('.min').forEach(el => el.addEventListener('input', e => updateStockLive(e.target.dataset.id, 'minStock', e.target.value)));
  list.querySelectorAll('.buy').forEach(el => el.addEventListener('input', e => updateBuyQtyLive(e.target.dataset.id, e.target.value)));
  list.querySelectorAll('.place').forEach(el => el.addEventListener('change', e => updateItem(e.target.dataset.id, { place: e.target.value })));
  list.querySelectorAll('.preset-btn').forEach(el => el.addEventListener('click', e => applyStockPreset(e.target.dataset.id, Number(e.target.dataset.preset))));
}

function roundStock(n) { return Math.round(n); }

function applyStockPreset(id, percent) {
  items = items.map(i => {
    if (i.id !== id) return i;
    const min = Number(i.minStock) || 0;
    let current = 0;
    if (percent === 0) current = 0;
    else if (min > 0) current = roundStock((min * percent) / 100);
    const buyQty = Math.max(roundStock(min - current), 0);
    const next = { ...i, currentStock: current, buyQty };
    next.checked = next.checked || needsBuy(next);
    if (!needsBuy(next) && next.buyQty === 0) next.checked = false;
    return normalize(next);
  });
  save();
  render();
}

function updateItem(id, patch) { items = items.map(i => i.id === id ? normalize({ ...i, ...patch }) : i); save(); render(); }

function updateStockLive(id, key, rawValue) {
  items = items.map(i => {
    if (i.id !== id) return i;
    const val = rawValue === '' ? 0 : Number(rawValue);
    const next = { ...i, [key]: roundStock(Number.isNaN(val) ? 0 : val) };
    next.buyQty = Math.max(roundStock(next.minStock - next.currentStock), 0);
    next.checked = next.checked || needsBuy(next);
    if (!needsBuy(next) && next.buyQty === 0) next.checked = false;
    return normalize(next);
  });
  save();
  updateRowStatus(id);
  refreshDerivedDisplays();
}

function updateBuyQtyLive(id, rawValue) {
  const val = rawValue === '' ? 0 : Number(rawValue);
  items = items.map(i => i.id === id ? normalize({ ...i, buyQty: Number.isNaN(val) ? 0 : val }) : i);
  save();
  refreshDerivedDisplays();
}

function updateRowStatus(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  const row = list.querySelector(`input[data-id="${CSS.escape(id)}"]`)?.closest('.item');
  if (!row) return;
  const badge = row.querySelector('.status-badge');
  if (!badge) return;
  const st = getStockStatus(item);
  badge.className = `status-badge status-${st.key}`;
  badge.textContent = `${st.icon} ${st.label}`;
  const pct = Math.round(getStockPercent(item));
  const txt = row.querySelector('.stock-percent');
  if (txt) txt.textContent = `Stok: ${pct}% dari minimal`;
  const fill = row.querySelector('.stock-fill');
  if (fill) { fill.className = `stock-fill stock-${st.key}`; fill.style.width = `${pct}%`; }
}

function refreshDerivedDisplays() {
  renderSummary();
  renderRecap();
}

function renderSummary() { const perlu = items.filter(i => i.checked).length; summary.innerHTML = [['Total Item', items.length], ['Perlu Dibeli', perlu], ['Belum Perlu Dibeli', items.length - perlu]].map(([t, v]) => `<article class="card sum-card"><p>${t}</p><strong>${v}</strong></article>`).join(''); }
function getNeedBuyItems() { return items.filter(i => ['kosong', 'kurang'].includes(getStockStatus(i).key)); }

function renderRecap() {
  const needBuy = getNeedBuyItems();
  const groups = {
    Online: needBuy.filter(i => i.place === 'Online'),
    Lotte: needBuy.filter(i => i.place === 'Lotte'),
    Tokbin: needBuy.filter(i => i.place === 'Tokbin'),
    RizaPutra: needBuy.filter(i => i.place === 'RizaPutra')
  };

  recapHeaderMeta.textContent = `(${needBuy.length} item)`;
  recapHeaderIcon.textContent = recapUi.mainOpen ? '▴' : '▾';
  if (!recapUi.mainOpen) { recapList.innerHTML = ''; return; }

  const renderGroup = (arr) => {
    if (!arr.length) return '<p>Tidak ada item.</p>';
    const grouped = {};
    arr.forEach(i => ((grouped[i.category] ||= []).push(i)));
    return Object.entries(grouped).map(([cat, list]) => `<details open><summary>${esc(cat)} (${list.length})</summary><ul>${list.map(i => `<li>${getStockStatus(i).icon} ${getStockStatus(i).label} - ${esc(i.name)} | Stok: ${i.currentStock} | Minimal: ${i.minStock} | Beli: ${i.buyQty}</li>`).join('')}</ul></details>`).join('');
  };

  const entries = [
    ['Online', 'onlineOpen', 'Rekap Beli Online'],
    ['Lotte', 'lotteOpen', 'Rekap Beli Lotte'],
    ['Tokbin', 'tokbinOpen', 'Rekap Beli TokBin'],
    ['RizaPutra', 'rizaputraOpen', 'Rekap Beli RizaPutra']
  ];

  recapList.innerHTML = entries.map(([place, stateKey, title]) => `<div class="recap-block"><div class="recap-top"><button class="recap-toggle" data-toggle="${stateKey}">${title} (${groups[place].length} item) <span>${recapUi[stateKey] ? '▴' : '▾'}</span></button><button class="btn btn-soft wa-mini-btn" data-wa-place="${place}" ${groups[place].length ? '' : 'disabled'}>Kirim Rekap ke WA ${place === 'Online' ? 'Belanja Online' : (place === 'Tokbin' ? 'TokBin' : place)}</button></div><div class="recap-content ${recapUi[stateKey] ? 'open' : ''}">${renderGroup(groups[place])}${groups[place].length ? '' : '<small class="wa-empty">Tidak ada bahan yang perlu dibeli.</small>'}</div></div>`).join('');
}

function openWhatsAppMessage(message) { window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank'); }

function sendWhatsAppAll() {
  const need = getNeedBuyItems();
  if (!need.length) return openWhatsAppMessage('Semua stok Slaku aman. Tidak ada bahan yang perlu dibeli.');
  const groups = {
    Online: need.filter(i => i.place === 'Online'),
    Tokbin: need.filter(i => i.place === 'Tokbin'),
    Lotte: need.filter(i => i.place === 'Lotte'),
    RizaPutra: need.filter(i => i.place === 'RizaPutra')
  };
  const lines = ['CHECKLIST BELANJA SLAKU', ''];
  [['Online', 'REKAP BELI ONLINE'], ['Tokbin', 'REKAP BELI TOKBIN'], ['Lotte', 'REKAP BELI LOTTE'], ['RizaPutra', 'REKAP BELI RIZAPUTRA']].forEach(([key, title]) => {
    if (!groups[key].length) return;
    lines.push(title);
    groups[key].forEach(i => lines.push(`- ${i.name} | ${i.buyQty} | pcs | ${getStockStatus(i).label}`));
    lines.push('');
  });
  openWhatsAppMessage(lines.join('\n'));
}

function sendWhatsAppByPlace(place) {
  const list = getNeedBuyItems().filter(i => i.place === place);
  if (!list.length) return;
  const title = `CHECKLIST BELANJA SLAKU - ${place.toUpperCase()}`;
  const lines = [title, ...list.map(i => `- ${i.name} | ${i.buyQty} | pcs | ${getStockStatus(i).label}`)];
  openWhatsAppMessage(lines.join('\n'));
}

function printRecap() { const checked = getNeedBuyItems(); const body = checked.length ? `<h2>Daftar Belanja Slaku</h2><ul>${checked.map(i => `<li>${esc(i.category)} - ${esc(i.name)} | Stok: ${i.currentStock} | Minimal: ${i.minStock} | Beli: ${i.buyQty}</li>`).join('')}</ul>` : '<p>Belum ada item yang perlu dibeli.</p>'; const w = window.open('', '_blank'); w.document.write(`<html><body>${body}</body></html>`); w.document.close(); w.print(); }
function toCsv(rows) { return rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'); }

function exportCsvAll() {
  const rows = [['Kategori', 'Nama Bahan', 'Stok Saat Ini', 'Stok Minimal', 'Jumlah Dibeli', 'Satuan', 'Tempat Beli', 'Status'],
    ...items.map(i => [i.category, i.name, i.currentStock, i.minStock, i.buyQty, 'pcs', i.place, getStockStatus(i).label])
  ];
  downloadFile(toCsv(rows), 'checklist-stok-slaku-semua-bahan.csv', 'text/csv');
}

function exportCsvNeedBuy() {
  const need = getNeedBuyItems();
  const rows = [['Kategori', 'Nama Bahan', 'Stok Saat Ini', 'Stok Minimal', 'Jumlah Dibeli', 'Satuan', 'Tempat Beli', 'Status'],
    ...need.map(i => [i.category, i.name, i.currentStock, i.minStock, i.buyQty, 'pcs', i.place, getStockStatus(i).label])
  ];
  downloadFile(toCsv(rows), 'checklist-stok-slaku-perlu-dibeli.csv', 'text/csv');
}
function backupJson() { const payload = { appName: BACKUP_APP, backupVersion: BACKUP_VERSION, backupDate: new Date().toISOString(), categories, items }; downloadFile(JSON.stringify(payload, null, 2), `slaku-checklist-backup-${new Date().toISOString().slice(0, 10)}.json`, 'application/json'); }
function importJson(e) { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const parsed = JSON.parse(String(reader.result)); if (!parsed || parsed.appName !== BACKUP_APP || !Array.isArray(parsed.items)) throw new Error('invalid'); const map = new Map(parsed.items.map(x => [x.id, x])); items = baseItems.map(x => normalize({ ...x, ...(map.get(x.id) || {}) })); save(); render(); alert('Data berhasil diimport.'); } catch { alert('File backup tidak valid.'); } e.target.value = ''; }; reader.readAsText(file); }
function downloadFile(content, filename, type) { const blob = new Blob([content], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); }
function esc(t) { return String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }

checkAuthOnLoad();
