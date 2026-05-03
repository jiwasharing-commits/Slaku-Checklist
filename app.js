const STORAGE_KEY = 'slaku_simple_checklist_v2';
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
const baseItems = Object.entries(categories).flatMap(([category, names]) => names.map((name, i) => ({ id: `${category}-${i}-${name}`, category, name, checked: false })));
let items = load();

const list = document.getElementById('list');
const recapList = document.getElementById('recapList');
const summary = document.getElementById('summary');
const searchInput = document.getElementById('searchInput');

document.getElementById('startBtn').onclick = () => window.scrollTo({ top: 260, behavior: 'smooth' });
document.getElementById('toRecapBtn').onclick = () => document.getElementById('recapCard').scrollIntoView({ behavior: 'smooth' });
document.getElementById('resetBtn').onclick = () => { if(confirm('Reset semua checklist?')) { items = baseItems.map(x=>({...x,checked:false})); save(); render(); } };
document.getElementById('waBtn').onclick = sendWhatsApp;
document.getElementById('printBtn').onclick = printRecap;
searchInput.addEventListener('input', render);

function load(){
  try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)); if(!Array.isArray(saved)) return structuredClone(baseItems); const map=new Map(saved.map(x=>[x.id,!!x.checked])); return baseItems.map(x=>({...x,checked:map.get(x.id)||false}));}
  catch{return structuredClone(baseItems);} }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render(){
  renderSummary();
  const q = searchInput.value.trim().toLowerCase();
  const grouped={};
  items.filter(i=>i.name.toLowerCase().includes(q)).forEach(i=>((grouped[i.category] ||= []).push(i)));
  list.innerHTML = Object.entries(grouped).map(([category, arr]) => `<details open><summary>${esc(category)} (${arr.length})</summary>${arr.map(item => `<label class="item"><input type="checkbox" data-id="${esc(item.id)}" ${item.checked?'checked':''}/><span>${esc(item.name)}</span></label>`).join('')}</details>`).join('') || '<p>Tidak ada item.</p>';
  list.querySelectorAll('input[type="checkbox"]').forEach(box => box.addEventListener('change', e => { const id=e.target.dataset.id; const it=items.find(x=>x.id===id); if(!it) return; it.checked=e.target.checked; save(); renderSummary(); renderRecap(); }));
  renderRecap();
}

function renderSummary(){
  const perlu = items.filter(i=>i.checked).length;
  summary.innerHTML = [['Total Item',items.length],['Perlu Dibeli',perlu],['Belum Perlu Dibeli',items.length-perlu]].map(([t,v])=>`<article class="card sum-card"><p>${t}</p><strong>${v}</strong></article>`).join('');
}

function renderRecap(){
  const checked = items.filter(i=>i.checked);
  if(!checked.length){ recapList.innerHTML = '<p>Belum ada item yang perlu dibeli.</p>'; return; }
  const grouped={}; checked.forEach(i=>((grouped[i.category] ||= []).push(i.name)));
  recapList.innerHTML = Object.entries(grouped).map(([cat,names])=>`<details open><summary>${esc(cat)} (${names.length})</summary><ul>${names.map(n=>`<li>${esc(n)}</li>`).join('')}</ul></details>`).join('');
}

function sendWhatsApp(){
  const checked = items.filter(i=>i.checked);
  if(!checked.length){ alert('Belum ada item yang perlu dibeli.'); return; }
  const text = ['Halo, berikut rekap bahan perlu dibeli:','',...checked.map((i,n)=>`${n+1}. ${i.category} - ${i.name}`)].join('\n');
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,'_blank');
}

function printRecap(){
  const checked = items.filter(i=>i.checked);
  const body = checked.length ? `<h2>Daftar Belanja Slaku</h2><ul>${checked.map(i=>`<li>${esc(i.category)} - ${esc(i.name)}</li>`).join('')}</ul>` : '<p>Belum ada item yang perlu dibeli.</p>';
  const w = window.open('', '_blank');
  w.document.write(`<html><head><title>Print Daftar Belanja</title></head><body>${body}</body></html>`);
  w.document.close(); w.print();
}

function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
render();
