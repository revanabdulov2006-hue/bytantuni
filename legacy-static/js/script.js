(function(){
'use strict';

/* =========================================================
   CONSTANTS
========================================================= */
const DEFAULT_SETTINGS = {
  whatsapp1:"994705610042",
  whatsapp2:"994557610042",
  adminPassword:"tantuni2026"
};
let settings = {...DEFAULT_SETTINGS};

const CATEGORY_EMOJI = {
  "Toyuq Burger":"🍔","Tantunilər":"🌯","Ət Köftələr":"🍖","Toyuq Köftələr":"🍗",
  "Ət Burger":"🍔","Dönər":"🥙","Çiğ Köfte":"🥗","Kombo Menyu":"🍱",
  "Əlavələr":"🍟","İçkilər":"🥤"
};
const CATEGORY_DESC = {
  "Toyuq Burger":"Cızıltılı toyuq döşü, təzə tərəvəz və xüsusi souslarla hazırlanan burgerlər.",
  "Tantunilər":"Odda bişmiş, əl ilə doğranmış ət və toyuqdan hazırlanan klassik tantunilərimiz.",
  "Ət Köftələr":"Mal ətindən hazırlanan şirəli köftələr, istəyə görə kaşarlı və tabakda.",
  "Toyuq Köftələr":"Yumşaq toyuq köftələri — çörək-lavaşda və ya tabak üzərində.",
  "Ət Burger":"Şirəli mal əti burgerləri və xüsusi şaurmalarımız.",
  "Dönər":"Köz üzərində dönən toyuq dönər, çörək-lavaşda və ya plov üstündə.",
  "Çiğ Köfte":"Ədviyyatlı, vegan çiğ köftə — dürüm və ya porsion şəklində.",
  "Kombo Menyu":"Sevimli yeməyin, frinin və sərinləşdirici içkinin sərfəli birləşməsi.",
  "Əlavələr":"Frilər, nuggetslər və mərci — yeməyini tamamla.",
  "İçkilər":"Soyuq içkilər və ayranlar."
};

/* Default products. Variant groups consolidate repeated lavaş/double line items
   into a single product with selectable options, matching the design mockups. */
const DEFAULT_PRODUCTS_RAW = [
  {cat:"Toyuq Burger", name:"Chicken Burger", price:3.70, desc:"Cızıltılı toyuq filesi, təzə tərəvəzlər və xüsusi sosla."},
  {cat:"Toyuq Burger", name:"CheeseBurger", price:4.30, desc:"Bol pendir, qaynar zəfəran çörəyi və şirəli toyuq köftəsi."},
  {cat:"Toyuq Burger", name:"Apache Burger", price:6.00, desc:"Acılı özəl Apache sousu, ikiqat toyuq filesi ilə."},

  {cat:"Tantunilər", name:"Chefdən özəl acılı", price:5.00, desc:"Şefin xüsusi resepti — acılı souslarla zənginləşdirilmiş tantuni."},
  {cat:"Tantunilər", name:"Chefdən özəl toyuq acılı", price:4.20, desc:"Toyuq əti üzərində hazırlanan acılı şef tantunisi."},
  {cat:"Tantunilər", name:"Ət Tantuni", price:5.00, desc:"Gündəlik təzə kəsilmiş mal əti, özəl ədviyyatlarla qarışdırılmış lavaş arası ləzzət.",
    variants:[{name:"çift lavaş",delta:0},{name:"çörək",delta:-0.50},{name:"Double",delta:1.50}]},
  {cat:"Tantunilər", name:"Toyuq Tantuni", price:4.00, desc:"Yumşaq toyuq əti, təzə tərəvəzlərlə lavaş arasında.",
    variants:[{name:"çift lavaş",delta:0},{name:"çörək",delta:-0.40},{name:"Double",delta:1.00}]},
  {cat:"Tantunilər", name:"Qatıqtuni", price:7.90, desc:"Qatıq sousu ilə zənginləşdirilmiş, məxsusi tariflə hazırlanan tantuni."},
  {cat:"Tantunilər", name:"Kaşarlı Ət Tantuni", price:5.80, desc:"Əriyən kaşar pendiri ilə zənginləşdirilmiş ət tantunisi."},
  {cat:"Tantunilər", name:"Kaşarlı Toyuq Tantuni", price:4.60, desc:"Əriyən kaşar pendiri ilə zənginləşdirilmiş toyuq tantunisi."},
  {cat:"Tantunilər", name:"Plovüstü Tantuni ət", price:6.90, desc:"Buğlanmış plov üzərində təqdim olunan ət tantunisi."},
  {cat:"Tantunilər", name:"Plovüstü Tantuni toyuq", price:6.00, desc:"Buğlanmış plov üzərində təqdim olunan toyuq tantunisi."},
  {cat:"Tantunilər", name:"Mix Tantuni", price:6.00, desc:"Ət və toyuq qarışığından hazırlanan zəngin tantuni."},
  {cat:"Tantunilər", name:"Tantuni Ət Big Lavaş", price:6.00, desc:"Geniş lavaş içində bol ət tantunisi."},
  {cat:"Tantunilər", name:"Tantuni Toyuq Big Lavaş", price:5.00, desc:"Geniş lavaş içində bol toyuq tantunisi."},
  {cat:"Tantunilər", name:"XanTuni", price:8.90, desc:"Ən təzə ət və təzə ədviyyatlarla hazırlanmış, milli dəyər masisi butik tərzdə bişirilərək özəl və əl ilə tərtiblənmiş şəkildə hazırlanır.", featured:true, badge:"İmza Ləzzət"},

  {cat:"Ət Köftələr", name:"Ət köftə", price:3.80, desc:"Mal ətindən hazırlanan şirəli köftə, lavaş arasında.",
    variants:[{name:"çörək-lavaş",delta:0},{name:"Kaşarlı",delta:0.40},{name:"Tabak",delta:2.70},{name:"Tabak Kaşarlı",delta:3.20}]},

  {cat:"Toyuq Köftələr", name:"Toyuq köftə", price:3.00, desc:"Yumşaq toyuq köftəsi, lavaş arasında.",
    variants:[{name:"çörək-lavaş",delta:0},{name:"Kaşarlı",delta:0.50},{name:"Tabak",delta:3.00},{name:"Tabak Kaşarlı",delta:3.70}]},

  {cat:"Ət Burger", name:"Ət burger", price:4.30, desc:"Şirəli mal əti burgeri, təzə tərəvəzlərlə."},
  {cat:"Ət Burger", name:"CheeseBurger", price:4.80, desc:"Bol pendirli mal əti burgeri."},
  {cat:"Ət Burger", name:"Apache Burger", price:6.70, desc:"Acılı özəl Apache sousu, ikiqat mal əti ilə."},
  {cat:"Ət Burger", name:"Şaurma", price:3.00, note:"çörək-lavaş", desc:"Klassik şaurma, təzə tərəvəz və souslarla."},
  {cat:"Ət Burger", name:"Şaurma tombik", price:3.30, desc:"Bol içlikli, doyumlu şaurma."},
  {cat:"Ət Burger", name:"Şaurma özəl", price:4.00, desc:"Şefin xüsusi sousu ilə hazırlanan şaurma."},

  {cat:"Dönər", name:"Toyuq Dönər", price:2.50, desc:"Köz üzərində dönən toyuq əti, çörək-lavaşda.",
    variants:[{name:"çörək-lavaş",delta:0},{name:"Kaşarlı",delta:0.80},{name:"Özəl",delta:0.80},{name:"Plovüstü",delta:3.50}]},
  {cat:"Dönər", name:"Toyuq Doyumlu", price:3.50, desc:"Bol içlikli, doyumlu toyuq dönər porsiyası."},
  {cat:"Dönər", name:"Limuzin Dönər", price:5.00, desc:"Zəngin tərkibli, böyük ölçülü xüsusi dönər."},

  {cat:"Çiğ Köfte", name:"Çiğ Köfte Dürüm", price:4.50, desc:"Ədviyyatlı vegan çiğ köftə, lavaş içində dürüm formada."},
  {cat:"Çiğ Köfte", name:"Çiğ Köfte Porsion", price:5.00, desc:"Ədviyyatlı vegan çiğ köftə, porsiya şəklində təzə yaşıllıqla."},

  {cat:"Kombo Menyu", name:"Burger + Free + Cola", note:"0.3ml", price:7.80, desc:"Burger, kartof free və soyuq Cola ilə sərfəli kombo."},
  {cat:"Kombo Menyu", name:"ChickenBurger + Free + Cola", note:"0.3ml", price:7.00, desc:"Toyuq burgeri, kartof free və soyuq Cola ilə sərfəli kombo."},
  {cat:"Kombo Menyu", name:"Free + Nuggets + Cola", note:"0.3ml", price:6.90, desc:"Kartof free, nuggets və soyuq Cola."},
  {cat:"Kombo Menyu", name:"Tantuni + Free + Cola", note:"0.3ml", price:8.00, desc:"Ət tantunisi, kartof free və soyuq Cola ilə kombo."},
  {cat:"Kombo Menyu", name:"Toyuq Tantuni + Free + Cola", note:"0.3ml", price:7.00, desc:"Toyuq tantunisi, kartof free və soyuq Cola ilə kombo."},
  {cat:"Kombo Menyu", name:"Toyuq Dönər + Mərci + Cola", note:"0.3ml", price:5.30, desc:"Toyuq dönər, mərci və soyuq Cola ilə kombo."},
  {cat:"Kombo Menyu", name:"Toyuq Dönər + Free + Cola", note:"0.3ml", price:5.90, desc:"Toyuq dönər, kartof free və soyuq Cola ilə kombo."},
  {cat:"Kombo Menyu", name:"Ət köftə + Free + Cola", note:"0.3ml", price:7.30, desc:"Ət köftə, kartof free və soyuq Cola ilə kombo."},
  {cat:"Kombo Menyu", name:"Toyuq köftə + Free + Cola", note:"0.3ml", price:6.60, desc:"Toyuq köftə, kartof free və soyuq Cola ilə kombo."},

  {cat:"Əlavələr", name:"Kartof Free", price:3.00, desc:"Cızıltılı, qızılı qızardılmış kartof friləri."},
  {cat:"Əlavələr", name:"Nuggets", price:3.50, desc:"Qızarmış toyuq nuggetsləri."},
  {cat:"Əlavələr", name:"Mərci", price:2.30, desc:"İsti, ədviyyatlı mərci şorbası."},

  {cat:"İçkilər", name:"Cola", note:"0.3ml", price:1.00, desc:"Soyuq Cola."},
  {cat:"İçkilər", name:"Fanta", note:"0.3ml", price:1.00, desc:"Soyuq Fanta."},
  {cat:"İçkilər", name:"Sprite", note:"0.3ml", price:1.00, desc:"Soyuq Sprite."},
  {cat:"İçkilər", name:"Cappy", price:1.80, desc:"Təbii meyvə şirəsi."},
  {cat:"İçkilər", name:"Fuse Tea", price:1.80, desc:"Soyuq çay içkisi."},
  {cat:"İçkilər", name:"Çöplü Su", price:1.00, desc:"Soyuq mineral su."},
  {cat:"İçkilər", name:"Cola şüşə", price:2.30, desc:"Şüşə qablaşdırmada Cola."},
  {cat:"İçkilər", name:"Cola banka", price:2.30, desc:"Banka qablaşdırmada Cola."},
  {cat:"İçkilər", name:"Ayran", price:0.80, desc:"Sərinləşdirici təbii ayran."},
  {cat:"İçkilər", name:"Ayran nanəli", price:1.00, desc:"Sərinləşdirici, nanəli butik təcrübə.", featured:true, badge:"Sərinləşdirici"},
];

const DEFAULT_PRODUCTS = DEFAULT_PRODUCTS_RAW.map((p,i)=>({
  id:"p"+(i+1),
  category:p.cat,
  name:p.name,
  note:p.note||"",
  price:p.price,
  description:p.desc || `${p.name} — ${CATEGORY_DESC[p.cat]}`,
  hasImage:false,
  featured: !!p.featured,
  badge: p.badge || "",
  stock: null,
  variants: p.variants || []
}));

const HERO_IMG = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=70";

/* =========================================================
   STATE
========================================================= */
let products = [];
let imageCache = {};
let cart = [];
let favorites = [];
let orders = [];
let categories = [];
let activeCategory = "";
let editingProductId = null;
let pendingImageData = null;
let pendingVariants = [];
let adminPage = "dashboard";
let checkoutLocation = null;

const $ = (sel,root)=> (root||document).querySelector(sel);
const $$ = (sel,root)=> Array.from((root||document).querySelectorAll(sel));
const fmt = n => n.toFixed(2)+" AZN";
const esc = s => (s||"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const cartKey = (id, variantName)=> id + (variantName? "::"+variantName : "");

function slug(s){
  const map={ə:"e",ö:"o",ü:"u",ş:"s",ç:"c",ğ:"g",ı:"i",Ə:"e",Ö:"o",Ü:"u",Ş:"s",Ç:"c",Ğ:"g",İ:"i"};
  return s.split("").map(ch=>map[ch]||ch).join("").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
}
function relTime(ts){
  const diff = Math.floor((Date.now()-ts)/1000);
  if(diff<60) return "indicə";
  if(diff<3600) return Math.floor(diff/60)+" dəq əvvəl";
  if(diff<86400) return Math.floor(diff/3600)+" saat əvvəl";
  return Math.floor(diff/86400)+" gün əvvəl";
}
function showToast(msg){
  const t = $("#toast");
  $("#toast-text").textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>t.classList.remove("show"), 2400);
}

/* =========================================================
   STORAGE
========================================================= */
async function safeGet(key, shared){ try{ const r = await window.storage.get(key, shared); return r?r.value:null; }catch(e){ return null; } }
async function safeSet(key, value, shared){ try{ return await window.storage.set(key, value, shared); }catch(e){ console.error("storage set failed",key,e); return null; } }
async function safeDelete(key, shared){ try{ return await window.storage.delete(key, shared); }catch(e){ return null; } }

async function loadProducts(){
  let raw = await safeGet("bt-products-v2", true);
  if(raw){ try{ products = JSON.parse(raw); }catch(e){ products = DEFAULT_PRODUCTS.slice(); } }
  else { products = DEFAULT_PRODUCTS.slice(); await safeSet("bt-products-v2", JSON.stringify(products), true); }
  const withImg = products.filter(p=>p.hasImage);
  await Promise.all(withImg.map(async p=>{ const v = await safeGet("bt-img-"+p.id, true); if(v) imageCache[p.id]=v; }));
  categories = [...new Set(products.map(p=>p.category))];
}
async function persistProducts(){ await safeSet("bt-products-v2", JSON.stringify(products), true); }

async function loadCart(){ let raw = await safeGet("bt-cart-v2", false); if(raw){ try{ cart = JSON.parse(raw); }catch(e){ cart=[]; } } }
async function persistCart(){ await safeSet("bt-cart-v2", JSON.stringify(cart), false); }

async function loadFavorites(){ let raw = await safeGet("bt-favorites", false); if(raw){ try{ favorites = JSON.parse(raw); }catch(e){ favorites=[]; } } }
async function persistFavorites(){ await safeSet("bt-favorites", JSON.stringify(favorites), false); }

async function loadOrders(){ let raw = await safeGet("bt-orders", true); if(raw){ try{ orders = JSON.parse(raw); }catch(e){ orders=[]; } } }
async function persistOrders(){ await safeSet("bt-orders", JSON.stringify(orders), true); }

async function loadSettings(){
  let raw = await safeGet("bt-settings", true);
  if(raw){ try{ settings = {...DEFAULT_SETTINGS, ...JSON.parse(raw)}; }catch(e){ settings={...DEFAULT_SETTINGS}; } }
}
async function persistSettings(){ await safeSet("bt-settings", JSON.stringify(settings), true); }

/* =========================================================
   PRODUCT HELPERS
========================================================= */
function productMediaHTML(p){
  const img = imageCache[p.id];
  if(img) return `<img src="${img}" alt="${esc(p.name)}" loading="lazy">`;
  return `<span>${CATEGORY_EMOJI[p.category]||"🍽️"}</span>`;
}
function basePrice(p){ return p.price; }
function isOut(p){ return p.stock!==null && p.stock!==undefined && p.stock<=0; }
function isLow(p){ return p.stock!==null && p.stock!==undefined && p.stock>0 && p.stock<=5; }

/* =========================================================
   RENDER: NAV / CATEGORY / FEATURED
========================================================= */
function renderCategoryNav(){
  const nav = $("#catnav");
  nav.innerHTML = categories.map(c=>`
    <button class="cat-tab ${c===activeCategory?'active':''}" data-cat="${esc(c)}">
      <span class="cat-indicator"></span>${esc(c)}
    </button>
  `).join("");
  $$(".cat-tab", nav).forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const el = document.getElementById("sec-"+slug(btn.dataset.cat));
      if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
    });
  });
}
function setActiveCategory(cat){
  if(cat===activeCategory) return;
  activeCategory = cat;
  $$(".cat-tab").forEach(b=> b.classList.toggle("active", b.dataset.cat===cat));
  const activeTab = $(`.cat-tab[data-cat="${CSS.escape(cat)}"]`);
  if(activeTab) activeTab.scrollIntoView({behavior:"smooth", inline:"center", block:"nearest"});
}

function renderFeatured(){
  const wrap = $("#featured-wrap");
  const featured = products.filter(p=>p.featured);
  if(featured.length===0){ wrap.innerHTML=""; return; }
  wrap.innerHTML = `
    <div class="featured-head">
      <h2 class="display">Şefin Tövsiyələri</h2>
      <span>${featured.length} seçim</span>
    </div>
    <div class="featured-grid">
      ${featured.map((p,i)=>`
        <div class="feature-card ${i>0?'small':''}" data-id="${p.id}">
          ${p.badge? `<span class="feature-badge">${esc(p.badge)}</span>`:""}
          <div class="feature-emoji">${imageCache[p.id]? `<img src="${imageCache[p.id]}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;">` : (CATEGORY_EMOJI[p.category]||"🍽️")}</div>
          <div class="feature-body">
            <h3 class="display">${esc(p.name)}</h3>
            <p>${esc(p.description||"")}</p>
            <div class="feature-foot">
              <span class="feature-price">${fmt(basePrice(p))}</span>
              <button class="feature-add" data-feat-add="${p.id}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg>
                Səbətə at
              </button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
  $$(".feature-card", wrap).forEach(card=>{
    card.addEventListener("click",(e)=>{ if(e.target.closest("[data-feat-add]")) return; openProductModal(card.dataset.id); });
  });
  $$("[data-feat-add]", wrap).forEach(btn=>{
    btn.addEventListener("click",(e)=>{ e.stopPropagation(); addToCart(btn.dataset.featAdd, null, 1); flyToCart(btn); });
  });
}

/* =========================================================
   RENDER: MENU
========================================================= */
function renderMenu(){
  const main = $("#menu");
  main.innerHTML = categories.map(cat=>{
    const items = products.filter(p=>p.category===cat);
    return `
    <section class="menu-section" id="sec-${slug(cat)}">
      <div class="section-head">
        <h2 class="display">${esc(cat)}</h2>
        <span class="section-count">${items.length} məhsul</span>
      </div>
      <div class="product-grid">
        ${items.map(p=>{
          const out = isOut(p), low = isLow(p);
          return `
          <article class="product-card ${out?'out-of-stock':''}" data-id="${p.id}">
            <div class="product-media">
              ${productMediaHTML(p)}
              <button class="fav-btn ${favorites.includes(p.id)?'active':''}" data-fav="${p.id}" aria-label="Sevimlilərə əlavə et">
                <svg viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.3-9A5.4 5.4 0 0 1 12 6a5.4 5.4 0 0 1 9.3 6c-2.3 4.5-9.3 9-9.3 9Z"/></svg>
              </button>
              ${out? `<span class="stock-tag">Tükənib</span>` : (low? `<span class="stock-tag" style="color:#ffc24d;">Az qalıb</span>`:"")}
            </div>
            <div class="product-body">
              <div class="pc-toprow">
                <div class="product-name">${esc(p.name)}</div>
                <div class="product-price">${fmt(basePrice(p))}</div>
              </div>
              ${p.note? `<div class="product-note">${esc(p.note)}</div>`:""}
              <button class="add-btn-full" data-add="${p.id}" ${out?'disabled':''}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
                ${out? 'Tükənib':'Səbətə at'}
              </button>
            </div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }).join("");

  $$(".product-card", main).forEach(card=>{
    card.addEventListener("click",(e)=>{
      if(e.target.closest("[data-add]") || e.target.closest("[data-fav]")) return;
      openProductModal(card.dataset.id);
    });
  });
  $$("[data-add]", main).forEach(btn=>{
    btn.addEventListener("click",(e)=>{
      e.stopPropagation();
      const p = products.find(x=>x.id===btn.dataset.add);
      if(p.variants && p.variants.length){ openProductModal(p.id); return; }
      addToCart(btn.dataset.add, null, 1);
      flyToCart(btn);
    });
  });
  $$("[data-fav]", main).forEach(btn=>{
    btn.addEventListener("click",(e)=>{ e.stopPropagation(); toggleFavorite(btn.dataset.fav); });
  });

  observeCards();
}

let cardObserver, secObserver;
function observeCards(){
  if(cardObserver) cardObserver.disconnect();
  cardObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry,i)=>{
      if(entry.isIntersecting){ setTimeout(()=> entry.target.classList.add("in-view"), (i%6)*40); cardObserver.unobserve(entry.target); }
    });
  }, {threshold:0.1, rootMargin:"0px 0px -40px 0px"});
  $$(".product-card").forEach(c=>cardObserver.observe(c));

  if(secObserver) secObserver.disconnect();
  secObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const cat = categories.find(c=>"sec-"+slug(c)===entry.target.id);
        if(cat) setActiveCategory(cat);
      }
    });
  }, {threshold:0, rootMargin:"-120px 0px -70% 0px"});
  $$(".menu-section").forEach(s=>secObserver.observe(s));
}

function flyToCart(originEl){
  const cartBtn = window.innerWidth<=760 ? $("#tab-cart") : $("#cart-btn");
  const r1 = originEl.getBoundingClientRect();
  const r2 = cartBtn.getBoundingClientRect();
  const fly = document.createElement("div");
  fly.className = "fly-icon";
  fly.textContent = "🧺";
  fly.style.left = r1.left+"px";
  fly.style.top = r1.top+"px";
  fly.style.transition = "transform .55s cubic-bezier(0.16,1,0.3,1), opacity .55s ease";
  document.body.appendChild(fly);
  requestAnimationFrame(()=>{
    fly.style.transform = `translate(${r2.left-r1.left}px, ${r2.top-r1.top}px) scale(.3)`;
    fly.style.opacity = "0.2";
  });
  setTimeout(()=> fly.remove(), 580);
  [$("#cart-badge"), $("#tab-cart-badge")].forEach(badge=>{
    badge.classList.add("bump");
    setTimeout(()=>badge.classList.remove("bump"), 400);
  });
}

function toggleFavorite(id){
  if(favorites.includes(id)) favorites = favorites.filter(f=>f!==id);
  else favorites.push(id);
  persistFavorites();
  $$(`[data-fav="${id}"]`).forEach(btn=> btn.classList.toggle("active", favorites.includes(id)));
}

/* =========================================================
   PRODUCT MODAL
========================================================= */
function openProductModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  const overlay = $("#product-modal");
  let selectedVariant = p.variants && p.variants.length ? p.variants[0] : null;
  let qty = 1;

  const crossSell = products.filter(x=> x.id!==p.id && (x.category==="Əlavələr"||x.category==="İçkilər") && !isOut(x)).slice(0,2);

  function currentPrice(){ return p.price + (selectedVariant? selectedVariant.delta : 0); }

  function paint(){
    overlay.innerHTML = `
      <div class="modal-card">
        <button class="modal-close" id="pm-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
        <div class="modal-scroll">
          <div class="pm-media">${productMediaHTML(p)}</div>
          <div class="pm-body">
            <div class="pm-toprow">
              <h3 class="display">${esc(p.name)}</h3>
              <span class="pm-price-badge">${fmt(currentPrice())}</span>
            </div>
            ${p.note? `<div class="pm-note">${esc(p.note)}</div>`:""}
            <p class="pm-desc">${esc(p.description||"")}</p>
            ${p.variants && p.variants.length ? `
              <div class="pm-section-label">Seçimlər</div>
              <div class="variant-chips">
                ${p.variants.map(v=>`
                  <button class="variant-chip ${v.name===selectedVariant.name?'selected':''}" data-variant="${esc(v.name)}">
                    ${esc(v.name)}${v.delta!==0? `<span class="vc-delta">${v.delta>0?'+':''}${v.delta.toFixed(2)} AZN</span>`:""}
                  </button>
                `).join("")}
              </div>
            `:""}
            <div class="qty-row">
              <span class="field-label" style="margin-bottom:0;">Miqdar</span>
              <div class="qty-control"><button id="pm-minus">−</button><span id="pm-qty">${qty}</span><button id="pm-plus">+</button></div>
            </div>
            <button class="btn-block" id="pm-add" ${isOut(p)?'disabled':''}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg>
              ${isOut(p)?'Tükənib':'Səbətə at'}
            </button>
            ${crossSell.length? `
              <div class="crosssell">
                <h4>Birlikdə Yaxşı Gedər</h4>
                <div class="crosssell-grid">
                  ${crossSell.map(cs=>`
                    <div class="cs-card" data-cs="${cs.id}">
                      <div class="cs-media">${productMediaHTML(cs)}</div>
                      <div class="cs-name">${esc(cs.name)}</div>
                      <div class="cs-foot">
                        <span class="cs-price">${fmt(cs.price)}</span>
                        <button class="cs-add" data-cs-add="${cs.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M12 5v14M5 12h14"/></svg></button>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </div>
            `:""}
          </div>
        </div>
      </div>
    `;
    $("#pm-close",overlay).onclick = closeModal;
    $("#pm-minus",overlay).onclick = ()=>{ qty=Math.max(1,qty-1); $("#pm-qty",overlay).textContent=qty; };
    $("#pm-plus",overlay).onclick = ()=>{ qty=Math.min(20,qty+1); $("#pm-qty",overlay).textContent=qty; };
    $$(".variant-chip",overlay).forEach(chip=>{
      chip.onclick = ()=>{ selectedVariant = p.variants.find(v=>v.name===chip.dataset.variant); paint(); };
    });
    $("#pm-add",overlay).onclick = ()=>{
      addToCart(p.id, selectedVariant, qty);
      flyToCart($("#pm-add",overlay));
      showToast(`${p.name} səbətə əlavə olundu`);
      closeModal();
    };
    $$("[data-cs]",overlay).forEach(card=> card.onclick=(e)=>{ if(e.target.closest("[data-cs-add]")) return; openProductModal(card.dataset.cs); });
    $$("[data-cs-add]",overlay).forEach(btn=> btn.onclick=(e)=>{ e.stopPropagation(); addToCart(btn.dataset.csAdd, null, 1); flyToCart(btn); showToast("Səbətə əlavə olundu"); });
  }

  paint();
  overlay.classList.add("open");
  document.body.style.overflow="hidden";
  overlay.onclick = (e)=>{ if(e.target===overlay) closeModal(); };
  function closeModal(){ overlay.classList.remove("open"); document.body.style.overflow=""; }
}

/* =========================================================
   CART
========================================================= */
function addToCart(id, variant, qty){
  const key = cartKey(id, variant? variant.name : null);
  const existing = cart.find(c=>cartKey(c.id, c.variantName)===key);
  if(existing) existing.qty += qty;
  else cart.push({id, qty, variantName: variant?variant.name:null, variantDelta: variant?variant.delta:0});
  persistCart(); updateCartBadge(); renderCartDrawer();
}
function changeQty(key, delta){
  const item = cart.find(c=>cartKey(c.id,c.variantName)===key);
  if(!item) return;
  item.qty += delta;
  if(item.qty<=0) cart = cart.filter(c=>cartKey(c.id,c.variantName)!==key);
  persistCart(); updateCartBadge(); renderCartDrawer();
}
function removeFromCart(key){ cart = cart.filter(c=>cartKey(c.id,c.variantName)!==key); persistCart(); updateCartBadge(); renderCartDrawer(); }
function cartCount(){ return cart.reduce((s,c)=>s+c.qty,0); }
function cartUnitPrice(c){ const p = products.find(x=>x.id===c.id); return p? p.price + (c.variantDelta||0) : 0; }
function cartTotal(){ return cart.reduce((s,c)=> s + cartUnitPrice(c)*c.qty, 0); }
function updateCartBadge(){
  const n = cartCount();
  $("#cart-badge").textContent = n; $("#cart-badge").classList.toggle("show", n>0);
  $("#tab-cart-badge").textContent = n; $("#tab-cart-badge").style.display = n>0? "flex":"none";
}

function renderCartDrawer(){
  const itemsEl = $("#cart-items"), footEl = $("#cart-foot");
  if(cart.length===0){
    itemsEl.innerHTML = `<div class="cart-empty"><span class="emoji">🧺</span><div>Səbətiniz boşdur</div><div style="font-size:12px;">Ləzzətli bir şey seçin</div></div>`;
    footEl.innerHTML = "";
    return;
  }
  itemsEl.innerHTML = cart.map(c=>{
    const p = products.find(x=>x.id===c.id);
    if(!p) return "";
    const key = cartKey(c.id,c.variantName);
    return `
      <div class="cart-row">
        <div class="ci-media">${productMediaHTML(p)}</div>
        <div class="ci-info">
          <div class="ci-name">${esc(p.name)}</div>
          ${c.variantName? `<div class="ci-note">${esc(c.variantName)}</div>` : (p.note? `<div class="ci-note">${esc(p.note)}</div>`:"")}
          <div class="ci-price">${fmt(cartUnitPrice(c)*c.qty)}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
          <div class="ci-qty"><button data-minus="${esc(key)}">−</button><span>${c.qty}</span><button data-plus="${esc(key)}">+</button></div>
          <button class="ci-remove" data-remove="${esc(key)}">sil</button>
        </div>
      </div>
    `;
  }).join("");
  footEl.innerHTML = `
    <div class="cart-total-row"><span>Ümumi məbləğ</span><strong>${fmt(cartTotal())}</strong></div>
    <button class="btn-block" id="checkout-btn">
      Sifarişi Təsdiqlə
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
    </button>
  `;
  $$("[data-plus]", itemsEl).forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));
  $$("[data-minus]", itemsEl).forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));
  $$("[data-remove]", itemsEl).forEach(b=>b.onclick=()=>removeFromCart(b.dataset.remove));
  $("#checkout-btn", footEl).onclick = openCheckoutModal;
}

function openCart(){ $("#cart-overlay").classList.add("open"); document.body.style.overflow="hidden"; }
function closeCart(){ $("#cart-overlay").classList.remove("open"); document.body.style.overflow=""; }

/* =========================================================
   CHECKOUT
========================================================= */
function buildWhatsAppMessage(note){
  let lines = ["🍔 *BY TANTUNI* — Yeni Sifariş",""];
  cart.forEach(c=>{
    const p = products.find(x=>x.id===c.id);
    if(!p) return;
    lines.push(`${c.qty}x ${p.name}${c.variantName? " ("+c.variantName+")":(p.note?" ("+p.note+")":"")} — ${fmt(cartUnitPrice(c)*c.qty)}`);
  });
  lines.push("", `Ümumi: ${fmt(cartTotal())}`);
  if(note){ lines.push(""); lines.push(`Qeyd: ${note}`); }
  lines.push("");
  lines.push(checkoutLocation? `📍 Konum: https://maps.google.com/?q=${checkoutLocation.lat},${checkoutLocation.lng}` : "📍 Konum: paylaşılmadı — ünvanı yazın");
  lines.push("", "Çatdırılma: Pulsuz");
  return lines.join("\n");
}

async function logOrder(note){
  const items = cart.map(c=>{
    const p = products.find(x=>x.id===c.id);
    return {name:p?p.name:"?", variant:c.variantName, qty:c.qty, price:cartUnitPrice(c)};
  });
  orders.unshift({ id:"o"+Date.now(), items, total:cartTotal(), note, location:checkoutLocation, ts:Date.now() });
  await persistOrders();
  cart.forEach(c=>{
    const p = products.find(x=>x.id===c.id);
    if(p && p.stock!==null && p.stock!==undefined){ p.stock = Math.max(0, p.stock - c.qty); }
  });
  await persistProducts();
}

function openCheckoutModal(){
  closeCart();
  checkoutLocation = null;
  const overlay = $("#checkout-modal");
  overlay.innerHTML = `
    <div class="modal-card">
      <button class="modal-close" id="co-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="modal-scroll">
        <div class="pm-body" style="padding-top:50px;">
          <h3 class="display" style="margin-bottom:4px;">Sifarişi Təsdiqlə</h3>
          <p class="pm-desc" style="margin-bottom:18px;">Ümumi: <strong style="color:var(--accent-light);">${fmt(cartTotal())}</strong> · ${cartCount()} məhsul</p>
          <label class="field-label">Qeyd (opsional)</label>
          <textarea class="field-input" id="co-note" rows="2" placeholder="Məs: zəngi basmayın, qapıda gözləyin..."></textarea>
          <label class="field-label">Çatdırılma konumu</label>
          <div class="loc-status" id="loc-status">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            <span>Konumunuzu paylaşmaq sifarişi sürətləndirir</span>
          </div>
          <button class="btn-outline" id="co-locate">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
            Konumu Paylaş
          </button>
          <button class="btn-block btn-wa" id="co-send">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2Z"/></svg>
            WhatsApp-a Göndər
          </button>
        </div>
      </div>
    </div>
  `;
  overlay.classList.add("open");
  document.body.style.overflow="hidden";
  $("#co-close",overlay).onclick = closeCheckout;
  overlay.onclick = (e)=>{ if(e.target===overlay) closeCheckout(); };

  $("#co-locate",overlay).onclick = ()=>{
    const statusEl = $("#loc-status",overlay);
    statusEl.innerHTML = `<div class="spinner" style="border-top-color:var(--text);"></div><span>Konum sorğulanır...</span>`;
    if(!navigator.geolocation){ statusEl.innerHTML = `<span>Brauzeriniz konum xidmətini dəstəkləmir</span>`; return; }
    navigator.geolocation.getCurrentPosition(
      (pos)=>{
        checkoutLocation = {lat:pos.coords.latitude, lng:pos.coords.longitude};
        statusEl.classList.add("ok");
        statusEl.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg><span>Konum əlavə olundu</span>`;
      },
      ()=>{ statusEl.innerHTML = `<span>Konum icazəsi verilmədi — sifariş ünvansız göndəriləcək</span>`; },
      {enableHighAccuracy:true, timeout:8000}
    );
  };

  $("#co-send",overlay).onclick = async ()=>{
    const note = $("#co-note",overlay).value.trim();
    const msg = buildWhatsAppMessage(note);
    const url = `https://wa.me/${settings.whatsapp1}?text=${encodeURIComponent(msg)}`;
    await logOrder(note);
    window.open(url, "_blank");
    cart = []; persistCart(); updateCartBadge(); renderCartDrawer(); renderMenu();
    closeCheckout();
    showToast("Sifariş WhatsApp-a yönləndirildi 🎉");
  };
  function closeCheckout(){ overlay.classList.remove("open"); document.body.style.overflow=""; }
}

/* =========================================================
   SEARCH
========================================================= */
function openSearch(){
  $("#search-overlay").classList.add("open");
  $("#search-input").value = "";
  $("#search-results").innerHTML = "";
  setTimeout(()=> $("#search-input").focus(), 200);
}
function closeSearch(){ $("#search-overlay").classList.remove("open"); }
function runSearch(term){
  const t = term.trim().toLowerCase();
  const resultsEl = $("#search-results");
  if(!t){ resultsEl.innerHTML=""; return; }
  const matches = products.filter(p=>p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)).slice(0,18);
  if(matches.length===0){ resultsEl.innerHTML = `<div class="empty-state">Nəticə tapılmadı</div>`; return; }
  resultsEl.innerHTML = matches.map(p=>`
    <div class="search-result-row" data-id="${p.id}">
      <div class="sr-media">${productMediaHTML(p)}</div>
      <div class="sr-info"><div class="sr-name">${esc(p.name)}</div><div class="sr-cat">${esc(p.category)}</div></div>
      <div class="sr-price">${fmt(basePrice(p))}</div>
    </div>
  `).join("");
  $$(".search-result-row", resultsEl).forEach(row=> row.onclick = ()=>{ closeSearch(); openProductModal(row.dataset.id); });
}

/* =========================================================
   FAVORITES / PROFILE PANELS
========================================================= */
function openFavoritesPanel(){
  const overlay = $("#favorites-panel");
  const items = products.filter(p=>favorites.includes(p.id));
  overlay.innerHTML = `
    <div class="panel-card">
      <div class="panel-head"><h3>Sevimlilər</h3><button class="icon-btn" id="fav-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="panel-body">
        ${items.length===0? `<div class="empty-state">Hələ sevimli məhsulunuz yoxdur.<br>Ürək ikonuna toxunaraq əlavə edin.</div>` : `
          <div style="display:flex;flex-direction:column;gap:10px;">
            ${items.map(p=>`
              <div class="cart-row" data-id="${p.id}" style="cursor:pointer;">
                <div class="ci-media">${productMediaHTML(p)}</div>
                <div class="ci-info"><div class="ci-name">${esc(p.name)}</div><div class="ci-price">${fmt(basePrice(p))}</div></div>
                <button class="cs-add" data-fav-add="${p.id}" style="width:34px;height:34px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 5v14M5 12h14"/></svg></button>
              </div>
            `).join("")}
          </div>
        `}
      </div>
    </div>
  `;
  overlay.classList.add("open");
  $("#fav-close",overlay).onclick = ()=> overlay.classList.remove("open");
  overlay.onclick = (e)=>{ if(e.target===overlay) overlay.classList.remove("open"); };
  $$("[data-fav-add]",overlay).forEach(btn=> btn.onclick=(e)=>{ e.stopPropagation(); addToCart(btn.dataset.favAdd, null, 1); showToast("Səbətə əlavə olundu"); });
  $$(".cart-row",overlay).forEach(row=> row.onclick = ()=>{ overlay.classList.remove("open"); openProductModal(row.dataset.id); });
}

function openProfilePanel(){
  const overlay = $("#profile-panel");
  overlay.innerHTML = `
    <div class="panel-card">
      <div class="panel-head"><h3>BY TANTUNI</h3><button class="icon-btn" id="profile-close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="panel-body">
        <p style="color:var(--text-dim);font-size:13.5px;line-height:1.6;margin-top:0;">Biz tantuni sənətini butik yanaşma ilə birləşdirərək ən yüksək keyfiyyətli xidmət təklif edirik.</p>
        <ul class="footer-list" style="margin-bottom:18px;">
          <li><a href="https://wa.me/${settings.whatsapp1}" target="_blank">📱 ${formatPhone(settings.whatsapp1)}</a></li>
          <li><a href="https://wa.me/${settings.whatsapp2}" target="_blank">📱 ${formatPhone(settings.whatsapp2)}</a></li>
          <li><a href="https://instagram.com/behruz_chef" target="_blank">📷 behruz_chef</a></li>
          <li><span>📍 Xırdalan şəh., Qalubiyyə küç., Acsess bankın yanı</span></li>
          <li><span>📍 Masazır dairəsi, Embawoodun yanı</span></li>
        </ul>
        <button class="btn-block btn-wa" id="profile-wa">WhatsApp ilə Yaz</button>
      </div>
    </div>
  `;
  overlay.classList.add("open");
  $("#profile-close",overlay).onclick = ()=> overlay.classList.remove("open");
  overlay.onclick = (e)=>{ if(e.target===overlay) overlay.classList.remove("open"); };
  $("#profile-wa",overlay).onclick = ()=> window.open(`https://wa.me/${settings.whatsapp1}`,"_blank");
}
function formatPhone(n){
  return "0"+n.slice(3).replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");
}

/* =========================================================
   ADMIN
========================================================= */
function openAdminLogin(){
  const overlay = $("#admin-overlay");
  overlay.innerHTML = `
    <div class="admin-shell" style="align-items:center;justify-content:center;">
      <div class="admin-login-box">
        <h3 class="display">Admin Panel</h3>
        <p>Davam etmək üçün şifrəni daxil edin</p>
        <input type="password" class="field-input" id="admin-pass" placeholder="Şifrə">
        <button class="btn-block" id="admin-login-btn">Daxil ol</button>
        <button class="mini-btn" id="admin-cancel" style="margin-top:14px;">Bağla</button>
      </div>
    </div>
  `;
  overlay.classList.add("open");
  $("#admin-cancel",overlay).onclick = ()=> overlay.classList.remove("open");
  const tryLogin = ()=>{
    if($("#admin-pass",overlay).value === settings.adminPassword){ adminPage="dashboard"; renderAdminShell(); }
    else showToast("Şifrə yanlışdır");
  };
  $("#admin-login-btn",overlay).onclick = tryLogin;
  $("#admin-pass",overlay).addEventListener("keydown",(e)=>{ if(e.key==="Enter") tryLogin(); });
}

const ADMIN_NAV_ITEMS = [
  {id:"dashboard", label:"Dashboard", icon:`<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>`},
  {id:"products", label:"Məhsullar", icon:`<path d="M4 6h16M4 12h16M4 18h16"/>`},
  {id:"orders", label:"Sifarişlər", icon:`<path d="M5 4h14v16l-7-4-7 4Z"/>`},
  {id:"analytics", label:"Analitika", icon:`<path d="M4 20V10M11 20V4M18 20v-7"/>`},
  {id:"settings", label:"Parametrlər", icon:`<circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.97 7.97 0 0 0 0-2l2-1.5-2-3.4-2.4 1a8 8 0 0 0-1.7-1L15 3h-4l-.3 2.6a8 8 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a8 8 0 0 0 0 2l-2 1.5 2 3.4 2.4-1a8 8 0 0 0 1.7 1L11 21h4l.3-2.6a8 8 0 0 0 1.7-1l2.4 1 2-3.4Z"/>`},
];

function renderAdminShell(){
  const overlay = $("#admin-overlay");
  overlay.innerHTML = `
    <div class="admin-shell">
      <aside class="admin-sidebar">
        <div class="admin-logo display">BY<br>TANTUNI</div>
        <div class="admin-logo-sub">Admin Dashboard</div>
        <nav class="admin-nav" id="admin-nav">
          ${ADMIN_NAV_ITEMS.map(it=>`
            <button class="admin-nav-item ${adminPage===it.id?'active':''}" data-page="${it.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${it.icon}</svg>
              ${it.label}
            </button>
          `).join("")}
        </nav>
        <div class="admin-user">
          <div class="admin-avatar">👨‍🍳</div>
          <div><div class="admin-user-name">Behruz Chef</div><div class="admin-user-role">Baş İdarəçi</div></div>
        </div>
        <button class="mini-btn admin-exit-mobile" id="admin-exit">← Saytı bağla</button>
      </aside>
      <main class="admin-main" id="admin-main"></main>
    </div>
  `;
  $("#admin-exit",overlay).onclick = ()=> overlay.classList.remove("open");
  $$("[data-page]",overlay).forEach(btn=> btn.onclick = ()=>{ adminPage = btn.dataset.page; renderAdminShell(); });
  renderAdminPage();
}

function renderAdminPage(){
  const main = $("#admin-main");
  if(adminPage==="dashboard") return renderAdminDashboard(main);
  if(adminPage==="products") return renderAdminProducts(main);
  if(adminPage==="orders") return renderAdminOrders(main);
  if(adminPage==="analytics") return renderAdminAnalytics(main);
  if(adminPage==="settings") return renderAdminSettings(main);
}

function computeStats(){
  const today = new Date(); today.setHours(0,0,0,0);
  const todayOrders = orders.filter(o=>o.ts>=today.getTime());
  const todaySales = todayOrders.reduce((s,o)=>s+o.total,0);
  const totalOrders = orders.length;
  const qtyByName = {};
  orders.forEach(o=> o.items.forEach(it=>{ qtyByName[it.name] = (qtyByName[it.name]||0) + it.qty; }));
  let popular = "—", max=0;
  Object.entries(qtyByName).forEach(([name,q])=>{ if(q>max){max=q; popular=name;} });
  return {todaySales, totalOrders, todayCount:todayOrders.length, popular};
}

function renderAdminDashboard(main){
  const stats = computeStats();
  const lowStock = products.filter(p=>isLow(p)||isOut(p));
  const recent = orders.slice(0,6);
  main.innerHTML = `
    <div class="admin-page-head">
      <div><h1 class="display">Admin İdarəetmə Paneli</h1><p>Xoş gəldiniz, bugün üçün mərkəzləşdirilmiş idarəetmə.</p></div>
      <button class="btn-small-primary" id="dash-add-product">+ Yeni Məhsul Əlavə Et</button>
    </div>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-top"><div class="stat-icon">💰</div></div><div class="stat-label">Günlük Satış</div><div class="stat-value">${stats.todaySales.toFixed(2)}</div></div>
      <div class="stat-card"><div class="stat-top"><div class="stat-icon">🛍️</div></div><div class="stat-label">Ümumi Sifariş</div><div class="stat-value">${stats.totalOrders}</div></div>
      <div class="stat-card"><div class="stat-top"><div class="stat-icon">📦</div></div><div class="stat-label">Bu Gün Sifariş</div><div class="stat-value">${stats.todayCount}</div></div>
      <div class="stat-card"><div class="stat-top"><div class="stat-icon">⚡</div><span class="stat-badge">Aktual</span></div><div class="stat-label">Populyar Məhsul</div><div class="stat-value" style="font-size:16px;">${esc(stats.popular)}</div></div>
    </div>
    <div class="admin-panel">
      <div class="admin-panel-head"><h3>Məhsul Siyahısı</h3></div>
      <table class="admin-table"><thead><tr><th></th><th>Ad</th><th>Kateqoriya</th><th>Qiymət</th><th>Status</th></tr></thead>
        <tbody>${products.slice(0,6).map(p=>productRow(p,false)).join("")}</tbody>
      </table>
      <p style="text-align:right;color:var(--text-dim);font-size:12px;margin-top:10px;">Ümumi ${products.length} məhsuldan 6-sı göstərilir — hamısı üçün "Məhsullar" bölməsinə keçin</p>
    </div>
    <div class="two-col">
      <div class="admin-panel">
        <div class="admin-panel-head"><h3>⚠️ Stok Xəbərdarlıqları</h3></div>
        ${lowStock.length===0? `<div class="empty-state">Stok problemi yoxdur</div>` : lowStock.map(p=>`
          <div class="alert-row"><div><strong>${esc(p.name)}</strong><span>${isOut(p)?'Stokda yoxdur':'Yalnız '+p.stock+' ədəd qalıb'}</span></div><a href="#" data-edit-from-dash="${p.id}">Yenilə</a></div>
        `).join("")}
      </div>
      <div class="admin-panel">
        <div class="admin-panel-head"><h3>🕐 Son Sifarişlər</h3></div>
        ${recent.length===0? `<div class="empty-state">Hələ sifariş yoxdur</div>` : recent.map(o=>`
          <div class="order-row"><div class="order-dot">✓</div><div class="order-info"><strong>#${o.id.slice(-4)} Yeni Sifariş (WhatsApp)</strong><span>${o.items.length} məhsul · ${fmt(o.total)}</span></div><div class="order-time">${relTime(o.ts)}</div></div>
        `).join("")}
      </div>
    </div>
  `;
  $("#dash-add-product",main).onclick = ()=> openProductForm(null);
  $$("[data-edit-from-dash]",main).forEach(a=> a.onclick=(e)=>{ e.preventDefault(); openProductForm(a.dataset.editFromDash); });
}

function productRow(p, withActions){
  const status = isOut(p)? `<span class="status-pill out">Tükənib</span>` : isLow(p)? `<span class="status-pill low">Az qalıb</span>` : `<span class="status-pill in">Stokda</span>`;
  return `
    <tr>
      <td><div class="admin-thumb">${productMediaHTML(p)}</div></td>
      <td>${esc(p.name)}${p.note? ` <span style="color:var(--text-dim);font-size:11px;">(${esc(p.note)})</span>`:""}${p.variants&&p.variants.length? ` <span style="color:var(--text-dim);font-size:11px;">· ${p.variants.length} seçim</span>`:""}</td>
      <td style="color:var(--text-dim);">${esc(p.category)}</td>
      <td>${fmt(p.price)}</td>
      <td>${status}</td>
      ${withActions? `<td><div class="admin-actions"><button class="mini-btn" data-edit="${p.id}">Redaktə</button><button class="mini-btn danger" data-del="${p.id}">Sil</button></div></td>`:""}
    </tr>
  `;
}

let adminProductPage = 0;
const ADMIN_PAGE_SIZE = 10;
function renderAdminProducts(main, searchTerm){
  const term = (searchTerm||"").toLowerCase();
  const list = products.filter(p=> p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  const pageCount = Math.max(1, Math.ceil(list.length/ADMIN_PAGE_SIZE));
  adminProductPage = Math.min(adminProductPage, pageCount-1);
  const pageItems = list.slice(adminProductPage*ADMIN_PAGE_SIZE, adminProductPage*ADMIN_PAGE_SIZE+ADMIN_PAGE_SIZE);
  main.innerHTML = `
    <div class="admin-page-head"><div><h1 class="display">Məhsullar</h1><p>Bütün menyu məhsullarını idarə edin.</p></div><button class="btn-small-primary" id="prod-add">+ Yeni Məhsul Əlavə Et</button></div>
    <div class="admin-panel">
      <div class="admin-panel-head">
        <input class="admin-search" id="admin-search" placeholder="Məhsul axtar..." value="${esc(searchTerm||"")}">
        <span style="color:var(--text-dim);font-size:12px;">${list.length} məhsul</span>
      </div>
      <table class="admin-table"><thead><tr><th></th><th>Ad</th><th>Kateqoriya</th><th>Qiymət</th><th>Status</th><th></th></tr></thead>
        <tbody>${pageItems.map(p=>productRow(p,true)).join("")}</tbody>
      </table>
      ${list.length===0? `<div class="empty-state">Heç bir məhsul tapılmadı</div>`:""}
      <div class="pagination">
        <button class="mini-btn" id="prod-prev" ${adminProductPage===0?'disabled':''}>Əvvəlki</button>
        <span style="font-size:12px;color:var(--text-dim);align-self:center;">${adminProductPage+1} / ${pageCount}</span>
        <button class="mini-btn" id="prod-next" ${adminProductPage>=pageCount-1?'disabled':''}>Növbəti</button>
      </div>
    </div>
  `;
  $("#prod-add",main).onclick = ()=> openProductForm(null);
  $("#admin-search",main).addEventListener("input",(e)=>{ adminProductPage=0; renderAdminProducts(main, e.target.value); });
  $("#prod-prev",main).onclick = ()=>{ adminProductPage--; renderAdminProducts(main, searchTerm); };
  $("#prod-next",main).onclick = ()=>{ adminProductPage++; renderAdminProducts(main, searchTerm); };
  $$("[data-edit]",main).forEach(b=> b.onclick = ()=> openProductForm(b.dataset.edit));
  $$("[data-del]",main).forEach(b=> b.onclick = ()=> confirmDelete(b.dataset.del));
}

function renderAdminOrders(main){
  main.innerHTML = `
    <div class="admin-page-head"><div><h1 class="display">Sifarişlər</h1><p>Sifarişlər WhatsApp üzərindən təsdiqlənir — bu siyahı son fəaliyyəti göstərir.</p></div>
      ${orders.length? `<button class="mini-btn danger" id="clear-orders">Tarixçəni təmizlə</button>`:""}
    </div>
    <div class="admin-panel">
      ${orders.length===0? `<div class="empty-state">Hələ heç bir sifariş qeydə alınmayıb</div>` : orders.map(o=>`
        <div class="order-row" style="align-items:flex-start;">
          <div class="order-dot">✓</div>
          <div class="order-info">
            <strong>#${o.id.slice(-4)} · ${fmt(o.total)}</strong>
            <span>${o.items.map(it=>`${it.qty}x ${esc(it.name)}${it.variant?' ('+esc(it.variant)+')':''}`).join(", ")}</span>
            ${o.note? `<span>Qeyd: ${esc(o.note)}</span>`:""}
            ${o.location? `<span>📍 Konum paylaşılıb</span>` : `<span>📍 Konum yoxdur</span>`}
          </div>
          <div class="order-time">${relTime(o.ts)}</div>
        </div>
      `).join("")}
    </div>
  `;
  if(orders.length){
    $("#clear-orders",main).onclick = async ()=>{
      if(!confirm("Bütün sifariş tarixçəsini silmək istəyirsiniz?")) return;
      orders = []; await persistOrders(); renderAdminPage();
    };
  }
}

function renderAdminAnalytics(main){
  const qtyByName = {}, revByCat = {};
  orders.forEach(o=> o.items.forEach(it=>{ qtyByName[it.name] = (qtyByName[it.name]||0) + it.qty; }));
  products.forEach(p=>{ revByCat[p.category] = revByCat[p.category]||0; });
  orders.forEach(o=> o.items.forEach(it=>{
    const prod = products.find(p=>p.name===it.name);
    if(prod) revByCat[prod.category] = (revByCat[prod.category]||0) + it.price*it.qty;
  }));
  const topProducts = Object.entries(qtyByName).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxQty = topProducts.length? topProducts[0][1] : 1;
  const catEntries = Object.entries(revByCat).sort((a,b)=>b[1]-a[1]);
  const maxRev = catEntries.length? Math.max(...catEntries.map(c=>c[1]),0.01) : 1;
  main.innerHTML = `
    <div class="admin-page-head"><div><h1 class="display">Analitika</h1><p>Sifariş tarixçəsinə əsaslanan canlı statistika.</p></div></div>
    <div class="two-col">
      <div class="admin-panel">
        <div class="admin-panel-head"><h3>Ən çox satılan məhsullar</h3></div>
        ${topProducts.length===0? `<div class="empty-state">Hələ kifayət qədər məlumat yoxdur</div>` : topProducts.map(([name,q])=>`
          <div class="bar-row"><div class="bar-row-top"><span>${esc(name)}</span><strong>${q} ədəd</strong></div><div class="bar-track"><div class="bar-fill" style="width:${(q/maxQty*100).toFixed(0)}%"></div></div></div>
        `).join("")}
      </div>
      <div class="admin-panel">
        <div class="admin-panel-head"><h3>Kateqoriya üzrə gəlir</h3></div>
        ${catEntries.length===0? `<div class="empty-state">Hələ kifayət qədər məlumat yoxdur</div>` : catEntries.map(([cat,rev])=>`
          <div class="bar-row"><div class="bar-row-top"><span>${esc(cat)}</span><strong>${fmt(rev)}</strong></div><div class="bar-track"><div class="bar-fill" style="width:${(rev/maxRev*100).toFixed(0)}%"></div></div></div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderAdminSettings(main){
  main.innerHTML = `
    <div class="admin-page-head"><div><h1 class="display">Parametrlər</h1><p>Əlaqə nömrələri və admin girişini idarə edin.</p></div></div>
    <div class="admin-panel" style="max-width:480px;">
      <label class="field-label">Əsas WhatsApp nömrəsi (sifarişlər bura yönləndirilir)</label>
      <input class="field-input" id="set-wa1" value="${esc(settings.whatsapp1)}" placeholder="994XXXXXXXXX">
      <label class="field-label">Əlavə WhatsApp nömrəsi</label>
      <input class="field-input" id="set-wa2" value="${esc(settings.whatsapp2)}" placeholder="994XXXXXXXXX">
      <label class="field-label">Admin şifrəsi</label>
      <input class="field-input" id="set-pass" value="${esc(settings.adminPassword)}" type="text">
      <button class="btn-block" id="set-save">Yadda saxla</button>
    </div>
  `;
  $("#set-save",main).onclick = async ()=>{
    settings.whatsapp1 = $("#set-wa1",main).value.trim().replace(/\D/g,"") || DEFAULT_SETTINGS.whatsapp1;
    settings.whatsapp2 = $("#set-wa2",main).value.trim().replace(/\D/g,"") || DEFAULT_SETTINGS.whatsapp2;
    settings.adminPassword = $("#set-pass",main).value.trim() || DEFAULT_SETTINGS.adminPassword;
    await persistSettings();
    renderFooter();
    showToast("Parametrlər yadda saxlanıldı");
  };
}

async function confirmDelete(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  if(!confirm(`"${p.name}" məhsulunu silmək istədiyinizə əminsiniz?`)) return;
  products = products.filter(x=>x.id!==id);
  delete imageCache[id];
  await persistProducts();
  await safeDelete("bt-img-"+id, true);
  categories = [...new Set(products.map(p=>p.category))];
  renderAdminPage(); renderCategoryNav(); renderMenu(); renderFeatured();
  showToast("Məhsul silindi");
}

function openProductForm(id){
  editingProductId = id;
  pendingImageData = null;
  const p = id ? products.find(x=>x.id===id) : null;
  pendingVariants = p && p.variants ? JSON.parse(JSON.stringify(p.variants)) : [];
  const overlay = $("#admin-overlay");
  const existingImg = p ? imageCache[p.id] : null;
  const main = document.createElement("div");

  function paint(){
    main.innerHTML = `
      <button class="mini-btn" id="back-to-list" style="margin-bottom:18px;">← Siyahıya qayıt</button>
      <div class="form-grid">
        <div class="full">
          <label class="field-label">Şəkil</label>
          <div class="upload-zone" id="upload-zone">
            ${existingImg||pendingImageData? `<img src="${pendingImageData||existingImg}" id="upload-preview">` : `<div style="font-size:32px;">📷</div><div class="upload-hint">Şəkil yükləmək üçün klikləyin</div>`}
            <input type="file" id="img-input" accept="image/*">
          </div>
          <div class="upload-hint">Tövsiyə: kvadrat şəkil, max 8MB. Avtomatik sıxılacaq.</div>
        </div>
        <div><label class="field-label">Məhsulun adı *</label><input class="field-input" id="f-name" value="${esc(p?p.name:"")}" placeholder="Məs: Ət Tantuni"></div>
        <div><label class="field-label">Qeyd</label><input class="field-input" id="f-note" value="${esc(p?p.note:"")}" placeholder="Məs: çift lavaş"></div>
        <div><label class="field-label">Kateqoriya *</label><input class="field-input" id="f-category" list="cat-list" value="${esc(p?p.category:"")}" placeholder="Kateqoriya seçin və ya yazın"><datalist id="cat-list">${categories.map(c=>`<option value="${esc(c)}">`).join("")}</datalist></div>
        <div><label class="field-label">Əsas qiymət (₼) *</label><input class="field-input" id="f-price" type="number" step="0.01" min="0" value="${p?p.price:""}" placeholder="0.00"></div>
        <div><label class="field-label">Stok (boş = limitsiz)</label><input class="field-input" id="f-stock" type="number" min="0" value="${p&&p.stock!==null&&p.stock!==undefined?p.stock:""}" placeholder="Limitsiz"></div>
        <div class="full"><label class="field-label">Təsvir</label><textarea class="field-input" id="f-desc" rows="3" placeholder="Qısa təsvir...">${esc(p?p.description:"")}</textarea></div>
      </div>
      <div class="toggle-row"><span>⭐ Şefin Tövsiyələrində göstər</span><button class="switch ${p&&p.featured?'on':''}" id="f-featured"></button></div>
      <div id="featured-badge-wrap" style="${p&&p.featured?'':'display:none;'}margin-bottom:16px;">
        <label class="field-label">Tövsiyə nişanı (badge)</label>
        <input class="field-input" id="f-badge" value="${esc(p?p.badge:"")}" placeholder="Məs: İmza Ləzzət">
      </div>
      <div class="admin-panel" style="padding:16px;">
        <div class="admin-panel-head"><h3 style="font-size:14px;">Seçimlər (variantlar)</h3><button class="mini-btn" id="add-variant">+ Seçim əlavə et</button></div>
        <p style="font-size:11.5px;color:var(--text-dim);margin:-6px 0 12px;">Məs: "çift lavaş" / "çörək" / "Double". Qiymət fərqi əsas qiymətə əlavə olunur (mənfi də ola bilər).</p>
        <div id="variant-list"></div>
        ${pendingVariants.length===0? `<div style="font-size:12px;color:var(--text-dim);">Seçim yoxdur — məhsul tək qiymətlə satılacaq.</div>`:""}
      </div>
      <button class="btn-block" id="f-save" style="margin-top:8px;max-width:320px;">Yadda saxla</button>
    `;
    $("#back-to-list",main).onclick = ()=> renderAdminPage();
    renderVariantList();

    async function handleImageChange(e){
      const file = e.target.files[0];
      if(!file) return;
      try{
        pendingImageData = await compressImage(file);
        const zone = $("#upload-zone",main);
        zone.innerHTML = `<img src="${pendingImageData}" id="upload-preview"><input type="file" id="img-input" accept="image/*">`;
        $("#img-input",main).addEventListener("change", handleImageChange);
      }catch(err){ showToast("Şəkil yüklənmədi, yenidən cəhd edin"); }
    }
    $("#img-input",main).addEventListener("change", handleImageChange);

    $("#f-featured",main).onclick = ()=>{
      const sw = $("#f-featured",main);
      sw.classList.toggle("on");
      $("#featured-badge-wrap",main).style.display = sw.classList.contains("on") ? "" : "none";
    };
    $("#add-variant",main).onclick = ()=>{ pendingVariants.push({name:"", delta:0}); renderVariantList(); };

    $("#f-save",main).onclick = async ()=>{
      const name = $("#f-name",main).value.trim();
      const category = $("#f-category",main).value.trim();
      const note = $("#f-note",main).value.trim();
      const price = parseFloat($("#f-price",main).value);
      const description = $("#f-desc",main).value.trim();
      const stockVal = $("#f-stock",main).value.trim();
      const stock = stockVal===""? null : Math.max(0, parseInt(stockVal,10)||0);
      const featured = $("#f-featured",main).classList.contains("on");
      const badge = $("#f-badge",main).value.trim();
      const cleanVariants = pendingVariants.filter(v=>v.name.trim()).map(v=>({name:v.name.trim(), delta: parseFloat(v.delta)||0}));

      if(!name || !category || isNaN(price)){ showToast("Ad, kateqoriya və qiyməti doldurun"); return; }
      const saveBtn = $("#f-save",main);
      saveBtn.disabled = true; saveBtn.innerHTML = `<div class="spinner"></div> Saxlanılır...`;

      let prod;
      if(editingProductId){ prod = products.find(x=>x.id===editingProductId); Object.assign(prod, {name, category, note, price, description, stock, featured, badge, variants:cleanVariants}); }
      else { prod = { id:"p"+Date.now(), name, category, note, price, description, hasImage:false, stock, featured, badge, variants:cleanVariants }; products.push(prod); }

      if(pendingImageData){ prod.hasImage = true; imageCache[prod.id] = pendingImageData; await safeSet("bt-img-"+prod.id, pendingImageData, true); }

      await persistProducts();
      categories = [...new Set(products.map(p=>p.category))];
      renderCategoryNav(); renderMenu(); renderFeatured();
      showToast("Məhsul yadda saxlanıldı");
      renderAdminPage();
    };
  }

  function renderVariantList(){
    const listEl = $("#variant-list",main);
    if(!listEl) return;
    listEl.innerHTML = pendingVariants.map((v,i)=>`
      <div class="variant-editor-row">
        <input class="field-input" data-vi="${i}" data-vf="name" value="${esc(v.name)}" placeholder="Seçim adı">
        <input class="field-input" style="max-width:120px;" data-vi="${i}" data-vf="delta" type="number" step="0.01" value="${v.delta}" placeholder="+0.00">
        <button class="mini-btn danger" data-vdel="${i}">✕</button>
      </div>
    `).join("");
    $$("[data-vi]",listEl).forEach(inp=>{
      inp.addEventListener("input",()=>{ const i=+inp.dataset.vi, f=inp.dataset.vf; pendingVariants[i][f] = f==="delta"? parseFloat(inp.value)||0 : inp.value; });
    });
    $$("[data-vdel]",listEl).forEach(b=> b.onclick=()=>{ pendingVariants.splice(+b.dataset.vdel,1); renderVariantList(); });
  }

  overlay.querySelector(".admin-shell")?.remove();
  const shell = document.createElement("div");
  shell.className = "admin-shell";
  shell.innerHTML = `
    <aside class="admin-sidebar">
      <div class="admin-logo display">BY<br>TANTUNI</div>
      <div class="admin-logo-sub">${p?'Məhsulu Redaktə Et':'Yeni Məhsul'}</div>
      <button class="mini-btn admin-exit-mobile" id="admin-exit">✕ Bağla</button>
    </aside>
  `;
  main.className = "admin-main";
  shell.appendChild(main);
  overlay.innerHTML = "";
  overlay.appendChild(shell);
  $("#admin-exit",overlay).onclick = ()=> overlay.classList.remove("open");
  paint();
}

function compressImage(file){
  return new Promise((resolve, reject)=>{
    if(file.size > 9*1024*1024){ reject(new Error("too large")); return; }
    const reader = new FileReader();
    reader.onload = (e)=>{
      const img = new Image();
      img.onload = ()=>{
        const maxDim = 700;
        let w = img.width, h = img.height;
        if(w>h && w>maxDim){ h = h*(maxDim/w); w = maxDim; } else if(h>maxDim){ w = w*(maxDim/h); h = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* =========================================================
   FOOTER
========================================================= */
function renderFooter(){
  $("#footer-contact").innerHTML = `
    <li><a href="https://wa.me/${settings.whatsapp1}" target="_blank">📱 ${formatPhone(settings.whatsapp1)}</a></li>
    <li><a href="https://wa.me/${settings.whatsapp2}" target="_blank">📱 ${formatPhone(settings.whatsapp2)}</a></li>
    <li><a href="https://instagram.com/behruz_chef" target="_blank">📷 behruz_chef</a></li>
    <li><a href="https://tiktok.com/@behruz_chef" target="_blank">🎵 behruz_chef</a></li>
  `;
  $("#footer-branches").innerHTML = `
    <li><span>📍 Xırdalan şəh., Qalubiyyə küç., Acsess bankın yanı</span></li>
    <li><span>📍 Masazır dairəsi, Embawoodun yanı</span></li>
  `;
  $("#year").textContent = new Date().getFullYear();
}

/* =========================================================
   GLOBAL EVENTS
========================================================= */
function attachGlobalListeners(){
  $("#cart-btn").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  $("#cart-overlay").addEventListener("click",(e)=>{ if(e.target.id==="cart-overlay") closeCart(); });
  $("#wa-quick").addEventListener("click", ()=> window.open(`https://wa.me/${settings.whatsapp1}`, "_blank"));
  $("#admin-link").addEventListener("click",(e)=>{ e.preventDefault(); openAdminLogin(); });

  $("#search-btn").addEventListener("click", openSearch);
  $("#search-close").addEventListener("click", closeSearch);
  $("#search-overlay").addEventListener("click",(e)=>{ if(e.target.id==="search-overlay") closeSearch(); });
  $("#search-input").addEventListener("input",(e)=> runSearch(e.target.value));

  $("#tab-home").addEventListener("click", ()=>{ setBottomTab("tab-home"); window.scrollTo({top:0,behavior:"smooth"}); });
  $("#tab-fav").addEventListener("click", ()=>{ setBottomTab("tab-fav"); openFavoritesPanel(); });
  $("#tab-fab").addEventListener("click", openSearch);
  $("#tab-cart").addEventListener("click", ()=>{ setBottomTab("tab-cart"); openCart(); });
  $("#tab-profile").addEventListener("click", ()=>{ setBottomTab("tab-profile"); openProfilePanel(); });

  window.addEventListener("scroll", ()=>{ $("#topnav").classList.toggle("scrolled", window.scrollY>40); });
  document.addEventListener("keydown",(e)=>{ if(e.key==="Escape"){ closeSearch(); } });

  $("#hero-bg-img").style.backgroundImage = `url('${HERO_IMG}')`;
}
function setBottomTab(id){ $$(".tab-item").forEach(t=>t.classList.remove("active")); const el=$("#"+id); if(el) el.classList.add("active"); }

/* =========================================================
   INIT
========================================================= */
async function init(){
  await Promise.all([loadProducts(), loadCart(), loadFavorites(), loadOrders(), loadSettings()]);
  renderCategoryNav();
  renderFeatured();
  renderMenu();
  renderCartDrawer();
  updateCartBadge();
  renderFooter();
  attachGlobalListeners();
  if(categories.length) activeCategory = categories[0];
  setTimeout(()=>{ $("#loading-screen").classList.add("hide"); }, 500);
}

init();

})();
