const STORAGE_KEY = 'slaku_simple_checklist_v2';
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
const baseItems = Object.entries(categories).flatMap(([category, names]) => names.map((name, i) => ({ id: `${category}-${i}-${name}`, category, name, checked: false })));
let items = load();
const list = document.getElementById('list');
const resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', () => { if (!confirm('Reset semua checklist?')) return; items = baseItems.map(x => ({...x, checked:false})); save(); render(); });

function load(){
  try{const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if(!Array.isArray(saved)) return structuredClone(baseItems); const map=new Map(saved.map(x=>[x.id,!!x.checked])); return baseItems.map(x=>({...x,checked:map.get(x.id)||false}));}
  catch{return structuredClone(baseItems);} }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render(){
  const grouped = {};
  items.forEach(item => ((grouped[item.category] ||= []).push(item)));
  list.innerHTML = Object.entries(grouped).map(([category, arr]) => `
    <details open>
      <summary>${esc(category)}</summary>
      ${arr.map(item => `<label class="item"><input type="checkbox" data-id="${esc(item.id)}" ${item.checked?'checked':''}/><span>${esc(item.name)}</span></label>`).join('')}
    </details>
  `).join('');
  list.querySelectorAll('input[type="checkbox"]').forEach((box)=>box.addEventListener('change',(e)=>{const id=e.target.dataset.id; const found=items.find(x=>x.id===id); if(!found)return; found.checked=e.target.checked; save();}));
}
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');}
render();
