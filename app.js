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

const CATEGORY_ORDER = ['Wajib & Rutin', 'Wajib & Waktu Lama', 'Resep Baru', 'Packaging', 'Packaging Pendukung', 'Cetak'];

const ITEM_CATEGORY_MAP = {
  'Susu INDOMILK UHT PLAIN 950 ML': 'Wajib & Rutin',
  'Susu Kental Manis Kaleng Carnation 365 gr': 'Resep Baru',
  'RICH GOLD WHIPPED CREAM 907 gr': 'Wajib & Rutin',
  'Susu Diamond All Purpose Milk UHT 1 Liter': 'Wajib & Rutin',
  'ROYAL VICTORIA CREAM CHEESE 2KG': 'Wajib & Rutin',
  'Keju Prochiz Spready 2kg': 'Resep Baru',
  'Yogurt Heavenly Blush Greek Classic 200 ml': 'Wajib & Rutin',
  'F&N Evaporated Filled Milk 380 gr': 'Wajib & Rutin',
  'Fiber creme Elenka 1 kg': 'Wajib & Rutin',
  'Gula Pasir Kuning 1 Kg': 'Wajib & Rutin',
  'Gula Pasir Putih 1 Kg': 'Wajib & Rutin',
  'Gula Halus Bola Deli 1 Kg': 'Wajib & Rutin',
  'Brown Sugar Light Ricoman 500gram': 'Resep Baru',
  'Gula Aren Cair Presso 1 Liter': 'Resep Baru',
  'Butter Unsalted Anchor 1 Kg Repack': 'Wajib & Rutin',
  'Butter Unsalted Holman 1 Kg Repack': 'Wajib & Rutin',
  'Tepung Terigu Bogasari Cakra Kembar Emas Roti Oriental 1 Kg': 'Resep Baru',
  'Tepung Maizena Maizenaku 1 kg': 'Wajib & Rutin',
  'Ragi Saf Instan Gold 500 gr': 'Resep Baru',
  'Biskuit Marie Regal 1 Kg': 'Wajib & Rutin',
  'Biskuit Marie Susu 1 Kg': 'Wajib & Rutin',
  'Biskuit Biskoff lotus Crumble 750 gr': 'Wajib & Rutin',
  'Xantan Gum 100 gram': 'Wajib & Waktu Lama',
  'Sea Salt Powder - izy Premix 1 kg': 'Wajib & Waktu Lama',
  'Perisa Vanili Red bell 30 ml': 'Wajib & Rutin',
  'Garam Halus Leaf Organic 100 gram': 'Wajib & Waktu Lama',
  'Kopi Dryed CF09S Maxfood 250 gr': 'Wajib & Rutin',
  'Kopi Espresso  Kopi Susu Blend Presso 1 Liter': 'Wajib & Rutin',
  'Bubuk Matcha Homelab 200 gr': 'Wajib & Rutin',
  'Teh Tubruk Thai Tea Chatramue 400 gr': 'Resep Baru',
  'Teh Tubruk Thai green Tea Chatramue 200 gr': 'Resep Baru',
  'Coklat Bubu Bens Drop 22/24 Queen Anna 1 kg': 'Wajib & Waktu Lama',
  'Coklat Batang Dark Tulip 250 gr': 'Resep Baru',
  'Choco Chip Callebaut Dark Chocolate Callets 811 54.5%': 'Resep Baru',
  'Box Ivory 20 x 20 x 5 isi 12': 'Packaging',
  'Box Ivory 18 x 18 x 5 isi 12': 'Packaging',
  'Box Ivory 12 x 12 x 5 isi 12': 'Packaging Pendukung',
  'Box Ivory 10 x 10 x 5 isi 12': 'Packaging Pendukung',
  'Baking Paper Basque Cheesecake 4 inch 50 Lembar': 'Packaging Pendukung',
  'Alas Segitiga cake kecil 10.6x7.2 isi 100 pcs': 'Packaging Pendukung',
  'Box Plastik Cup 10 cm isi 12': 'Packaging',
  'Korean Box Slice Isi 10': 'Packaging',
  'Tatakan Kue silver bulat 20 cm - isi 12': 'Packaging',
  'Tatakan Kue silver bulat 18 cm - isi 12': 'Packaging',
  'Tatakan Kue Bulat 12 cm gold  isi 100': 'Packaging Pendukung',
  'Tatakan Kue bulat 10 cm gold isi 100': 'Packaging Pendukung',
  'Baking Paper Bulat 20 - isi 100': 'Wajib & Rutin',
  'Baking Paper Bulat 18 - isi 100': 'Wajib & Rutin',
  'Garpu Sendok Kayu 2in1 8cm isi 100': 'Packaging',
  'Plastik Transparan 25x48 200 gram': 'Packaging',
  'Plastik Transparan 30x57 200 gram': 'Packaging',
  'Keju Edam Bola Ayam Emas 100 gram': 'Resep Baru',
  'Kabel Ties 2.5 x 150 mm isi 100': 'Packaging',
  'Pita': 'Packaging',
  'Sticker box 18/10 Slaku 4 cm-Kertas A3': 'Cetak',
  'Sticker Thank for order 4 cm Transparan-Kertas A3': 'Cetak',
  'Sticker box 20 Slaku 5 cm-Kertas A3': 'Cetak',
  'Sticker Thank for order 5 cm - Transparan-Kertas A3': 'Cetak',
  'Sticker Bulat Transparan 25 mm  2.5 cm isi 1000 PCS': 'Cetak',
  'Sticker botol 200 ml Matcha 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 'Cetak',
  'Sticker botol 200 ml Kopi Susu 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 'Cetak',
  'Sticker botol 200 ml Coklat 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 'Cetak',
  'Sticker botol 1 liter Matcha-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 'Cetak',
  'Sticker botol 1 liter Kopi Susu-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 'Cetak',
  'Sticker botol 1 liter Coklat-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 'Cetak',
  'Botol 1 liter': 'Packaging',
  'Botol 200 ml': 'Packaging',
  'Gas Portable Hi-cook 230 gram': 'Wajib & Rutin'
};


const LEGACY_NAME_MAP = {
  'Diamond All Purpose Milk UHT': 'Susu Diamond All Purpose Milk UHT 1 Liter',
  'Yogurt Heavenly Blush Greek Classic': 'Yogurt Heavenly Blush Greek Classic 200 ml',
  'Fiber Crème Elenka 1 kg': 'Fiber creme Elenka 1 kg',
  'Bola Deli Gula Halus 1 Kg': 'Gula Halus Bola Deli 1 Kg',
  'Maizenaku 1 kg': 'Tepung Maizena Maizenaku 1 kg',
  'Marie Regal 1 Kg': 'Biskuit Marie Regal 1 Kg',
  'Marie Susu 1 Kg': 'Biskuit Marie Susu 1 Kg',
  'Biskoff lotus Crumble 750 gr/Biscoff 250 Gr': 'Biskuit Biskoff lotus Crumble 750 gr',
  'Red Bell Vanili 30 ml': 'Perisa Vanili Red bell 30 ml',
  'Kopi Dryed CF09S Maxfood': 'Kopi Dryed CF09S Maxfood 250 gr',
  'Presso Kopi Susu Blend': 'Kopi Espresso  Kopi Susu Blend Presso 1 Liter',
  'Matcha Homelab 200 gr': 'Bubuk Matcha Homelab 200 gr',
  'Torch Gun': 'Gas Portable Hi-cook 230 gram',
  'Xantan Gum': 'Xantan Gum 100 gram',
  'Izy Premix Powder Sea Salt 1 kg': 'Sea Salt Powder - izy Premix 1 kg',
  'Garam dapur halus': 'Garam Halus Leaf Organic 100 gram',
  'Coklat Bubu Bens Drop 22/24 Queen Anna': 'Coklat Bubu Bens Drop 22/24 Queen Anna 1 kg',
  'Susu Kental Manis 370 gr Kaleng': 'Susu Kental Manis Kaleng Carnation 365 gr',
  'Prochiz Spready 2kg': 'Keju Prochiz Spready 2kg',
  'Light Brown Sugar Ricoman 500gram': 'Brown Sugar Light Ricoman 500gram',
  'Presso Gula Aren Cair 1 Liter': 'Gula Aren Cair Presso 1 Liter',
  'Tepung Terigu Bogasari Cakra Kembar Emas Roti Oriental': 'Tepung Terigu Bogasari Cakra Kembar Emas Roti Oriental 1 Kg',
  'Saf Instan Gold 500 gr': 'Ragi Saf Instan Gold 500 gr',
  'Thai Tea Chatramue 400 gr': 'Teh Tubruk Thai Tea Chatramue 400 gr',
  'Thai green Tea Chatramue 200 gr': 'Teh Tubruk Thai green Tea Chatramue 200 gr',
  'Dark Coklat Batang Tulip': 'Coklat Batang Dark Tulip 250 gr',
  'Choco Chip': 'Choco Chip Callebaut Dark Chocolate Callets 811 54.5%',
  'Plastik Transparan': 'Plastik Transparan 25x48 200 gram',
  'Kabel Ties': 'Kabel Ties 2.5 x 150 mm isi 100',
  'Sticker Slaku 4 cm': 'Sticker box 18/10 Slaku 4 cm-Kertas A3',
  'Sticker Tq 4 cm': 'Sticker Thank for order 4 cm Transparan-Kertas A3',
  'Sticker Slaku 6 cm': 'Sticker box 20 Slaku 5 cm-Kertas A3',
  'Sticker Tq 6 cm': 'Sticker Thank for order 5 cm - Transparan-Kertas A3',
  'Sticker box 20 Slaku 6 cm-Kertas A3': 'Sticker box 20 Slaku 5 cm-Kertas A3',
  'Sticker Thank for order 6 cm - Transparan-Kertas A3': 'Sticker Thank for order 5 cm - Transparan-Kertas A3',
  'Sticker botol 200 ml Matcha': 'Sticker botol 200 ml Matcha 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting',
  'Sticker botol 200 ml Kopi Susu': 'Sticker botol 200 ml Kopi Susu 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting',
  'Sticker botol 200 ml Coklat': 'Sticker botol 200 ml Coklat 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting',
  'Sticker botol 1 liter Matcha': 'Sticker botol 1 liter Matcha-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting',
  'Sticker botol 1 liter Kopi Susu': 'Sticker botol 1 liter Kopi Susu-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting',
  'Sticker botol 1 liter Coklat': 'Sticker botol 1 liter Coklat-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting',
};

const DEFAULT_MIN_STOCK_MAP = {
  'Susu INDOMILK UHT PLAIN 950 ML': 12,
  'RICH GOLD WHIPPED CREAM 907 gr': 8,
  'Susu Diamond All Purpose Milk UHT 1 Liter': 6,
  'ROYAL VICTORIA CREAM CHEESE 2KG': 6,
  'Yogurt Heavenly Blush Greek Classic 200 ml': 12,
  'F&N Evaporated Filled Milk 380 gr': 6,
  'Fiber creme Elenka 1 kg': 4,
  'Gula Pasir Kuning 1 Kg': 2,
  'Gula Pasir Putih 1 Kg': 4,
  'Gula Halus Bola Deli 1 Kg': 2,
  'Butter Unsalted Anchor 1 Kg Repack': 4,
  'Butter Unsalted Holman 1 Kg Repack': 4,
  'Tepung Maizena Maizenaku 1 kg': 2,
  'Biskuit Marie Regal 1 Kg': 4,
  'Biskuit Marie Susu 1 Kg': 4,
  'Biskuit Biskoff lotus Crumble 750 gr': 4,
  'Perisa Vanili Red bell 30 ml': 6,
  'Kopi Dryed CF09S Maxfood 250 gr': 1,
  'Kopi Espresso  Kopi Susu Blend Presso 1 Liter': 1,
  'Bubuk Matcha Homelab 200 gr': 1,
  'Baking Paper Bulat 20 - isi 100': 5,
  'Baking Paper Bulat 18 - isi 100': 5,
  'Gas Portable Hi-cook 230 gram': 4,
  'Xantan Gum 100 gram': 1,
  'Sea Salt Powder - izy Premix 1 kg': 1,
  'Garam Halus Leaf Organic 100 gram': 1,
  'Coklat Bubu Bens Drop 22/24 Queen Anna 1 kg': 1,
  'Susu Kental Manis Kaleng Carnation 365 gr': 2,
  'Keju Prochiz Spready 2kg': 1,
  'Brown Sugar Light Ricoman 500gram': 1,
  'Gula Aren Cair Presso 1 Liter': 1,
  'Tepung Terigu Bogasari Cakra Kembar Emas Roti Oriental 1 Kg': 1,
  'Ragi Saf Instan Gold 500 gr': 1,
  'Teh Tubruk Thai Tea Chatramue 400 gr': 1,
  'Teh Tubruk Thai green Tea Chatramue 200 gr': 1,
  'Coklat Batang Dark Tulip 250 gr': 1,
  'Choco Chip Callebaut Dark Chocolate Callets 811 54.5%': 1,
  'Keju Edam Bola Ayam Emas 100 gram': 1,
  'Box Ivory 20 x 20 x 5 isi 12': 5,
  'Box Ivory 18 x 18 x 5 isi 12': 5,
  'Box Plastik Cup 10 cm isi 12': 10,
  'Korean Box Slice Isi 10': 10,
  'Tatakan Kue silver bulat 20 cm - isi 12': 50,
  'Tatakan Kue silver bulat 18 cm - isi 12': 50,
  'Garpu Sendok Kayu 2in1 8cm isi 100': 2,
  'Plastik Transparan 25x48 200 gram': 2,
  'Plastik Transparan 30x57 200 gram': 2,
  'Kabel Ties 2.5 x 150 mm isi 100': 4,
  'Pita': 1,
  'Botol 1 liter': 50,
  'Botol 200 ml': 100,
  'Box Ivory 12 x 12 x 5 isi 12': 5,
  'Box Ivory 10 x 10 x 5 isi 12': 5,
  'Baking Paper Basque Cheesecake 4 inch 50 Lembar': 5,
  'Alas Segitiga cake kecil 10.6x7.2 isi 100 pcs': 2,
  'Tatakan Kue Bulat 12 cm gold  isi 100': 5,
  'Tatakan Kue bulat 10 cm gold isi 100': 5,
  'Sticker box 18/10 Slaku 4 cm-Kertas A3': 2,
  'Sticker Thank for order 4 cm Transparan-Kertas A3': 2,
  'Sticker box 20 Slaku 5 cm-Kertas A3': 2,
  'Sticker Thank for order 5 cm - Transparan-Kertas A3': 2,
  'Sticker Bulat Transparan 25 mm  2.5 cm isi 1000 PCS': 2,
  'Sticker botol 200 ml Matcha 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 5,
  'Sticker botol 200 ml Kopi Susu 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 5,
  'Sticker botol 200 ml Coklat 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 5,
  'Sticker botol 1 liter Matcha-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 5,
  'Sticker botol 1 liter Kopi Susu-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 5,
  'Sticker botol 1 liter Coklat-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 5
};


const DEFAULT_PLACE_MAP = {
  'Susu INDOMILK UHT PLAIN 950 ML': 'Lotte',
  'RICH GOLD WHIPPED CREAM 907 gr': 'Tokbin',
  'Susu Diamond All Purpose Milk UHT 1 Liter': 'Tokbin',
  'ROYAL VICTORIA CREAM CHEESE 2KG': 'Tokbin',
  'Yogurt Heavenly Blush Greek Classic 200 ml': 'Online',
  'F&N Evaporated Filled Milk 380 gr': 'Tokbin',
  'Fiber creme Elenka 1 kg': 'Online',
  'Gula Pasir Kuning 1 Kg': 'Tokbin',
  'Gula Pasir Putih 1 Kg': 'Tokbin',
  'Gula Halus Bola Deli 1 Kg': 'Online',
  'Butter Unsalted Anchor 1 Kg Repack': 'Tokbin',
  'Butter Unsalted Holman 1 Kg Repack': 'Tokbin',
  'Tepung Maizena Maizenaku 1 kg': 'Online',
  'Biskuit Marie Regal 1 Kg': 'Online',
  'Biskuit Marie Susu 1 Kg': 'Online',
  'Biskuit Biskoff lotus Crumble 750 gr': 'Tokbin',
  'Perisa Vanili Red bell 30 ml': 'Tokbin',
  'Kopi Dryed CF09S Maxfood 250 gr': 'Online',
  'Kopi Espresso  Kopi Susu Blend Presso 1 Liter': 'Online',
  'Bubuk Matcha Homelab 200 gr': 'Online',
  'Baking Paper Bulat 20 - isi 100': 'Online',
  'Baking Paper Bulat 18 - isi 100': 'Online',
  'Gas Portable Hi-cook 230 gram': 'Online',
  'Xantan Gum 100 gram': 'Online',
  'Sea Salt Powder - izy Premix 1 kg': 'Online',
  'Garam Halus Leaf Organic 100 gram': 'Online',
  'Coklat Bubu Bens Drop 22/24 Queen Anna 1 kg': 'Online',
  'Susu Kental Manis Kaleng Carnation 365 gr': 'Online',
  'Keju Prochiz Spready 2kg': 'Online',
  'Brown Sugar Light Ricoman 500gram': 'Online',
  'Gula Aren Cair Presso 1 Liter': 'Online',
  'Tepung Terigu Bogasari Cakra Kembar Emas Roti Oriental 1 Kg': 'Online',
  'Ragi Saf Instan Gold 500 gr': 'Online',
  'Teh Tubruk Thai Tea Chatramue 400 gr': 'Online',
  'Teh Tubruk Thai green Tea Chatramue 200 gr': 'Online',
  'Coklat Batang Dark Tulip 250 gr': 'Online',
  'Choco Chip Callebaut Dark Chocolate Callets 811 54.5%': 'Online',
  'Keju Edam Bola Ayam Emas 100 gram': 'Tokbin',
  'Box Ivory 20 x 20 x 5 isi 12': 'Online',
  'Box Ivory 18 x 18 x 5 isi 12': 'Online',
  'Box Plastik Cup 10 cm isi 12': 'Online',
  'Korean Box Slice Isi 10': 'Online',
  'Tatakan Kue silver bulat 20 cm - isi 12': 'Online',
  'Tatakan Kue silver bulat 18 cm - isi 12': 'Online',
  'Garpu Sendok Kayu 2in1 8cm isi 100': 'Online',
  'Plastik Transparan 25x48 200 gram': 'Online',
  'Plastik Transparan 30x57 200 gram': 'Online',
  'Kabel Ties 2.5 x 150 mm isi 100': 'Online',
  'Pita': 'Online',
  'Botol 1 liter': 'Online',
  'Botol 200 ml': 'Online',
  'Box Ivory 12 x 12 x 5 isi 12': 'Online',
  'Box Ivory 10 x 10 x 5 isi 12': 'Online',
  'Baking Paper Basque Cheesecake 4 inch 50 Lembar': 'Online',
  'Alas Segitiga cake kecil 10.6x7.2 isi 100 pcs': 'Online',
  'Tatakan Kue Bulat 12 cm gold  isi 100': 'Online',
  'Tatakan Kue bulat 10 cm gold isi 100': 'Online',
  'Sticker box 18/10 Slaku 4 cm-Kertas A3': 'RizaPutra',
  'Sticker Thank for order 4 cm Transparan-Kertas A3': 'RizaPutra',
  'Sticker box 20 Slaku 5 cm-Kertas A3': 'RizaPutra',
  'Sticker Thank for order 5 cm - Transparan-Kertas A3': 'RizaPutra',
  'Sticker Bulat Transparan 25 mm  2.5 cm isi 1000 PCS': 'Online',
  'Sticker botol 200 ml Matcha 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 'RizaPutra',
  'Sticker botol 200 ml Kopi Susu 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 'RizaPutra',
  'Sticker botol 200 ml Coklat 5 x 8 cm A3 36/lembar Vinyl+Glossy+cutting': 'RizaPutra',
  'Sticker botol 1 liter Matcha-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 'RizaPutra',
  'Sticker botol 1 liter Kopi Susu-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 'RizaPutra',
  'Sticker botol 1 liter Coklat-16x8 cm-A3 12/lembar Vinyl+Glossy+cutting': 'RizaPutra'
};

const categories = CATEGORY_ORDER.reduce((acc, cat) => {
  acc[cat] = Object.keys(ITEM_CATEGORY_MAP)
    .filter((name) => ITEM_CATEGORY_MAP[name] === cat)
    .sort((a, b) => a.localeCompare(b, 'id'));
  return acc;
}, {});

function slugifyName(name) {
  return name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const baseItems = Object.entries(categories).flatMap(([category, names]) => names.map((name) => ({ id: `item-${slugifyName(name)}`, category, name, checked: false, currentStock: 0, minStock: DEFAULT_MIN_STOCK_MAP[name] ?? 0, buyQty: 0, place: DEFAULT_PLACE_MAP[name] || 'Online' })));

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
const placeFilter = document.getElementById('placeFilter');
const needOnlyFilter = document.getElementById('needOnlyFilter');
const resetFilterBtn = document.getElementById('resetFilterBtn');
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
document.getElementById('resetBtn').onclick = () => { if (confirm('Yakin ingin reset checklist? Data stok akan kembali ke default.')) { localStorage.removeItem(STORAGE_KEY); items = structuredClone(baseItems).map(normalize); save(); render(); } };
document.getElementById('waBtn').onclick = () => sendWhatsAppAll();
document.getElementById('printBtn').onclick = printRecap;
document.getElementById('csvAllBtn').onclick = () => exportCsvAll();
document.getElementById('csvNeedBtn').onclick = () => exportCsvNeedBuy();
document.getElementById('backupBtn').onclick = backupJson;
document.getElementById('importBtn').onclick = () => importInput.click();
importInput.addEventListener('change', importJson);
searchInput.addEventListener('input', render);
placeFilter?.addEventListener('change', render);
needOnlyFilter?.addEventListener('change', render);
resetFilterBtn?.addEventListener('click', () => {
  if (placeFilter) placeFilter.value = 'all';
  if (needOnlyFilter) needOnlyFilter.checked = false;
  if (searchInput) searchInput.value = '';
  render();
});
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
    const byName = new Map(saved.flatMap((x) => [[x.name, x], [LEGACY_NAME_MAP[x.name], x]].filter(([name]) => !!name)));
    return baseItems.map((x) => {
      const found = map.get(x.id) || byName.get(x.name) || null;
      return normalize({ ...x, ...(found || {}), category: ITEM_CATEGORY_MAP[x.name] || x.category, name: x.name });
    });
  } catch { return structuredClone(baseItems); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }

function render() {
  renderSummary();
  const q = searchInput.value.trim().toLowerCase();
  const selectedPlace = placeFilter?.value || 'all';
  const needOnly = !!needOnlyFilter?.checked;
  const grouped = {};
  items
    .filter((i) => i.name.toLowerCase().includes(q))
    .filter((i) => selectedPlace === 'all' || i.place === selectedPlace)
    .filter((i) => !needOnly || needsBuy(i))
    .forEach((i) => ((grouped[i.category] ||= []).push(i)));
  list.innerHTML = Object.entries(grouped).map(([category, arr]) => `<details open><summary>${esc(category)} (${arr.length})</summary>${arr.map(renderRow).join('')}</details>`).join('') || '<p>Tidak ada item.</p>';
  bindRowEvents();
  renderRecap();
}

function renderRow(item) {
  const st = getStockStatus(item);
  const pct = getStockPercent(item);
  return `<div class="item"><label class="item-head"><input type="checkbox" data-id="${esc(item.id)}" class="check" ${item.checked ? 'checked' : ''}/><span>${esc(item.name)}</span><span class="status-badge status-${st.key}">${st.icon} ${st.label}</span></label><div class="stock-meta"><small class="stock-percent">Stok: ${Math.round(pct)}% dari minimal</small><div class="stock-bar"><div class="stock-fill stock-${st.key}" style="width:${pct}%"></div></div></div><div class="mini-wrap"><div class="mini"><label>Saat Ini<input type="number" min="0" step="1" inputmode="numeric" class="current" data-id="${esc(item.id)}" value="${item.currentStock}"/></label><label>Minimal<input type="number" min="0" step="1" inputmode="numeric" class="min" data-id="${esc(item.id)}" value="${item.minStock}"/></label><label>Beli<input type="number" min="0" step="1" inputmode="numeric" class="buy" data-id="${esc(item.id)}" value="${item.buyQty}" readonly/></label><label>Tempat Beli<select class="place" data-id="${esc(item.id)}"><option ${item.place === 'Online' ? 'selected' : ''}>Online</option><option ${item.place === 'Lotte' ? 'selected' : ''}>Lotte</option><option ${item.place === 'Tokbin' ? 'selected' : ''}>Tokbin</option><option ${item.place === 'RizaPutra' ? 'selected' : ''}>RizaPutra</option></select></label></div></div><div class="preset-wrap"><small>Preset stok</small><div class="preset-row">${[0,25,50,75,100].map(p=>`<button type="button" class="preset-btn" data-id="${esc(item.id)}" data-preset="${p}" ${p!==0 && Number(item.minStock)<=0 ? 'disabled' : ''}>${p}%</button>`).join('')}</div></div></div>`;
}

function bindRowEvents() {
  list.querySelectorAll('.check').forEach(el => el.addEventListener('change', e => updateItem(e.target.dataset.id, { checked: e.target.checked })));
  list.querySelectorAll('.current').forEach(el => el.addEventListener('input', e => updateStockLive(e.target.dataset.id, 'currentStock', e.target.value)));
  list.querySelectorAll('.min').forEach(el => el.addEventListener('input', e => updateStockLive(e.target.dataset.id, 'minStock', e.target.value)));
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
function isRecapEligible(item) { return item.checked && Number(item.buyQty) > 0 && ['kosong', 'kurang'].includes(getStockStatus(item).key); }
function getRecapItemsByPlace(place) { return items.filter(i => i.place === place && isRecapEligible(i)); }
function getAllRecapItems() { return items.filter(isRecapEligible); }

function renderRecap() {
  const groups = {
    Online: getRecapItemsByPlace('Online'),
    Tokbin: getRecapItemsByPlace('Tokbin'),
    Lotte: getRecapItemsByPlace('Lotte'),
    RizaPutra: getRecapItemsByPlace('RizaPutra')
  };
  const totalNeed = groups.Online.length + groups.Tokbin.length + groups.Lotte.length + groups.RizaPutra.length;

  recapHeaderMeta.textContent = `(${totalNeed} item)`;
  recapHeaderIcon.textContent = recapUi.mainOpen ? '▴' : '▾';
  if (!recapUi.mainOpen) { recapList.innerHTML = ''; return; }

  const renderGroup = (arr, place) => {
    if (!arr.length) return `<p>Tidak ada bahan ${place} yang perlu dibeli.</p>`;
    const grouped = {};
    arr.forEach(i => ((grouped[i.category] ||= []).push(i)));
    return Object.entries(grouped).map(([cat, list]) => `<details open><summary>${esc(cat)} (${list.length})</summary><ul>${list.map(i => `<li>${getStockStatus(i).icon} ${getStockStatus(i).label} - ${esc(i.name)} | Stok: ${i.currentStock} | Minimal: ${i.minStock} | Beli: ${i.buyQty}</li>`).join('')}</ul></details>`).join('');
  };

  const entries = [
    ['Online', 'onlineOpen', 'Rekap Beli Online', 'Online'],
    ['Tokbin', 'tokbinOpen', 'Rekap Beli TokBin', 'TokBin'],
    ['Lotte', 'lotteOpen', 'Rekap Beli Lotte', 'Lotte'],
    ['RizaPutra', 'rizaputraOpen', 'Rekap Beli RizaPutra', 'RizaPutra']
  ];

  recapList.innerHTML = entries.map(([place, stateKey, title, placeLabel]) => {
    const count = groups[place].length;
    const content = renderGroup(groups[place], placeLabel);
    return `<div class="recap-block"><div class="recap-top"><button class="recap-toggle" data-toggle="${stateKey}">${title} (${count} item) <span>${recapUi[stateKey] ? '▴' : '▾'}</span></button><button class="btn btn-soft wa-mini-btn" data-wa-place="${place}" ${count > 0 ? '' : 'disabled'}>Kirim Rekap ke WA ${place === 'Online' ? 'Belanja Online' : placeLabel}</button></div><div class="recap-content ${recapUi[stateKey] ? 'open' : ''}">${content}</div></div>`;
  }).join('');
}

function openWhatsAppMessage(message) { window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`, '_blank'); }

function sendWhatsAppAll() {
  const need = getAllRecapItems();
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
  const list = getRecapItemsByPlace(place);
  if (!list.length) return;
  const title = `CHECKLIST BELANJA SLAKU - ${place.toUpperCase()}`;
  const lines = [title, ...list.map(i => `- ${i.name} | ${i.buyQty} | pcs | ${getStockStatus(i).label}`)];
  openWhatsAppMessage(lines.join('\n'));
}

function printRecap() { const checked = getAllRecapItems(); const body = checked.length ? `<h2>Daftar Belanja Slaku</h2><ul>${checked.map(i => `<li>${esc(i.category)} - ${esc(i.name)} | Stok: ${i.currentStock} | Minimal: ${i.minStock} | Beli: ${i.buyQty}</li>`).join('')}</ul>` : '<p>Belum ada item yang perlu dibeli.</p>'; const w = window.open('', '_blank'); w.document.write(`<html><body>${body}</body></html>`); w.document.close(); w.print(); }
function toCsv(rows) { return rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'); }

function exportCsvAll() {
  const rows = [['Kategori', 'Nama Bahan', 'Stok Saat Ini', 'Stok Minimal', 'Jumlah Dibeli', 'Satuan', 'Tempat Beli', 'Status'],
    ...items.map(i => [i.category, i.name, i.currentStock, i.minStock, i.buyQty, 'pcs', i.place, getStockStatus(i).label])
  ];
  downloadFile(toCsv(rows), 'checklist-stok-slaku-semua-bahan.csv', 'text/csv');
}

function exportCsvNeedBuy() {
  const need = getAllRecapItems();
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
