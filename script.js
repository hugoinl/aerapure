// Aera Pure — Script (kept + small BA slider hardening)
const PRICES = {
  citadine: {
    label: "Citadine",
    tabs: [
      { id: "complet", label: "Intérieur + extérieur", items: [{ name: "Citadine — Complet", price: "80€ TTC" }] },
      { id: "interieur", label: "Intérieur", items: [{ name: "Citadine — Intérieur", price: "60€ TTC" }] },
      { id: "exterieur", label: "Extérieur", items: [{ name: "Citadine — Extérieur", price: "20€ TTC" }] }
    ]
  },
  suv: {
    label: "SUV / Monospace",
    tabs: [
      { id: "complet", label: "Intérieur + extérieur", items: [{ name: "SUV / Monospace — Complet", price: "120€ TTC" }] },
      { id: "interieur", label: "Intérieur", items: [{ name: "SUV / Monospace — Intérieur", price: "90€ TTC" }] },
      { id: "exterieur", label: "Extérieur", items: [{ name: "SUV / Monospace — Extérieur", price: "30€ TTC" }] }
    ]
  },
  utilitaire: {
    label: "Utilitaire",
    tabs: [
      { id: "complet-cabine", label: "Complet avec cabine", items: [{ name: "Utilitaire — Complet avec cabine", price: "130€ TTC" }] },
      { id: "sans-arriere", label: "Int./Ext. sans arrière", items: [{ name: "Utilitaire — Intérieur/Extérieur sans arrière", price: "90€ TTC" }] },
      { id: "cabine", label: "Cabine seule", items: [{ name: "Utilitaire — Intérieur cabine sans arrière", price: "40€ TTC" }] },
      { id: "exterieur", label: "Extérieur", items: [{ name: "Utilitaire — Extérieur", price: "20€ TTC" }] }
    ]
  }
};

const modal = document.getElementById('modal');
const submenu = document.getElementById('submenu');
const grid = document.getElementById('grid');
const modalTitle = document.getElementById('modal-title');

document.querySelectorAll('.show-menu').forEach(btn => {
  btn.addEventListener('click', () => openPricing(btn.dataset.category));
});

modal?.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });

function openPricing(category){
  const data = PRICES[category];
  if(!data) return;
  modalTitle.textContent = `Tarifs — ${data.label}`;
  submenu.innerHTML = '';
  data.tabs.forEach((t, i) => {
    const b = document.createElement('button');
    b.className = 'tab' + (i===0 ? ' active' : '');
    b.textContent = t.label;
    b.dataset.category = category;
    b.dataset.tab = t.id;
    b.addEventListener('click', () => switchTab(category, t.id));
    submenu.appendChild(b);
  });
  switchTab(category, data.tabs[0].id);
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function switchTab(category, tabId){
  document.querySelectorAll('.submenu .tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
  const data = PRICES[category].tabs.find(t => t.id === tabId);
  grid.innerHTML = '';
  data.items.forEach(item => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.innerHTML = `<h5>${item.name}</h5><div class="amount">${item.price}</div>`;
    grid.appendChild(tile);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();

// Before/After Slider (interactive) — hardened
document.querySelectorAll(".ba-slider").forEach(slider => {
  const handle = slider.querySelector(".handle");
  const resize = slider.querySelector(".resize");
  const topImg = resize?.querySelector("img");
  const bottomImg = slider.querySelector("img:not(.resize img)");
  // extra safety
  [topImg, bottomImg].forEach(img => {
    if(img){
      img.setAttribute('draggable','false');
      img.style.userSelect = 'none';
      img.style.webkitUserDrag = 'none';
      img.addEventListener('dragstart', e => e.preventDefault());
    }
  });

  let dragging = false;

  const setPosition = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let x = Math.max(0, Math.min((clientX - rect.left), rect.width));
    handle.style.left = x + "px";
    resize.style.width = x + "px";
  };
  const start = (e) => {
    dragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(clientX);
    if(e.cancelable) e.preventDefault();
  };
  const move = (e) => {
    if(!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(clientX);
    if(e.cancelable) e.preventDefault();
  };
  const end = () => dragging = false;

  handle.addEventListener("mousedown", start);
  handle.addEventListener("touchstart", start, {passive:false});
  slider.addEventListener("mousedown", start);
  slider.addEventListener("touchstart", start, {passive:false});
  window.addEventListener("mousemove", move, {passive:false});
  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);

  const init = () => {
    const rect = slider.getBoundingClientRect();
    const x = rect.width / 2;
    handle.style.left = x + "px";
    resize.style.width = x + "px";
  };
  window.addEventListener("load", init, {once:true});
  window.addEventListener("resize", init);
});

// ----- Contact form dependent dropdown -----
(function(){
  const form = document.querySelector('.contact-form');
  const category = document.getElementById('categorySelect');
  const prestation = document.getElementById('prestation');
  const priceHint = document.getElementById('priceHint');

  if(!form || !category || !prestation) return;

  const map = {
    "Citadine": [
      { id:"complet", label:"Intérieur + extérieur", price:"80€ TTC" },
      { id:"interieur", label:"Intérieur", price:"60€ TTC" },
      { id:"exterieur", label:"Extérieur", price:"20€ TTC" },
    ],
    "SUV / Monospace": [
      { id:"complet", label:"Intérieur + extérieur", price:"120€ TTC" },
      { id:"interieur", label:"Intérieur", price:"90€ TTC" },
      { id:"exterieur", label:"Extérieur", price:"30€ TTC" },
    ],
    "Utilitaire": [
      { id:"complet-cabine", label:"Complet avec cabine", price:"130€ TTC" },
      { id:"sans-arriere", label:"Int./Ext. sans arrière", price:"90€ TTC" },
      { id:"cabine", label:"Intérieur cabine sans arrière", price:"40€ TTC" },
      { id:"exterieur", label:"Extérieur", price:"20€ TTC" },
    ]
  };

  category.addEventListener('change', () => {
    const val = category.value;
    prestation.innerHTML = '<option value="">Choisir…</option>';
    priceHint.textContent = '';
    if(map[val]){
      map[val].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.id;
        o.textContent = opt.label;
        o.dataset.price = opt.price;
        prestation.appendChild(o);
      });
      prestation.disabled = false;
    }else{
      prestation.disabled = true;
    }
  });

  prestation.addEventListener('change', () => {
    const selected = prestation.options[prestation.selectedIndex];
    const price = selected?.dataset?.price || '';
    priceHint.textContent = price ? `Tarif: ${price}` : ''; updateTotal();
  });
})();

// === Safe opacity-only reveals ===
(function(){
  const targets = ['#hero','#services','#tarifs','#prestations','#avis','#contact','#faq']
    .map(s => document.querySelector(s)).filter(Boolean);
  targets.forEach(el => el.classList.add('reveal'));
  if(!('IntersectionObserver' in window)){
    targets.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {root:null, threshold:0.12});
  targets.forEach(el => io.observe(el));
})();

// Menu mobile (toggle)
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobileNav') || document.querySelector('.mobile-nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=> nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=> nav.classList.remove('open')));
  }
});

function openModal(category){
  const modal = document.getElementById('modal');
  if(!modal) return;
  if(modal.parentNode !== document.body){
    document.body.appendChild(modal);
  }
  if (typeof buildSubmenu === 'function') buildSubmenu(category);
  document.body.classList.add('modal-open');
  document.documentElement.classList.add('modal-open');
  modal.classList.add('show');
}
function closeModal(){
  const modal = document.getElementById('modal');
  if(!modal) return;
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  document.documentElement.classList.remove('modal-open');
}
document.addEventListener('click', (e)=>{
  if (e.target.id === 'modal' || e.target.matches('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeModal();
});


// ---- Devis: total base + suppléments ----
(function(){
  const category = document.getElementById('categorySelect');
  const prestation = document.getElementById('prestation');
  const priceHint = document.getElementById('priceHint');
  const totalEl = document.getElementById('totalPrice');
  const supplInputs = () => Array.from(document.querySelectorAll('.suppl-group input[type="checkbox"]'));

  function parseEuro(txt){
    if(!txt) return 0;
    const m = String(txt).replace(',', '.').match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? parseFloat(m[1]) : 0;
  }

  function getBasePrice(){
    const priceText = priceHint?.textContent || '';
    const cleaned = priceText.replace('Tarif:', '').trim();
    return parseEuro(cleaned);
  }

  function getSupplementsSum(){
    return supplInputs().filter(i => i.checked).reduce((s,i)=> s + parseFloat(i.dataset.price||0), 0);
  }

  function computeTotal(){
    const base = getBasePrice();
    const sup = getSupplementsSum();
    const total = base + sup;
    if(total > 0){
      totalEl.textContent = new Intl.NumberFormat('fr-FR', {style:'currency', currency:'EUR'}).format(total);
    }else{
      totalEl.textContent = '—';
    }
  }

  document.addEventListener('change', (e)=>{
    if(e.target.closest('.suppl-group')) computeTotal();
    if(e.target === prestation) computeTotal();
    if(e.target === category) { setTimeout(computeTotal, 0); }
  });

  const obs = new MutationObserver(computeTotal);
  if(priceHint) obs.observe(priceHint, {childList:true, characterData:true, subtree:true});

  computeTotal();
})();


// (WhatsApp submit removed for Formspree)

// === Formspree integration (AJAX): send via fetch & redirect locally ===
(function(){
  var form = document.getElementById('quoteForm');
  if(!form) return;

  // Ensure action & method are correct (fallback if HTML not updated)
  if(!form.getAttribute('action')) form.setAttribute('action', 'https://formspree.io/f/xpwlevav');
  form.setAttribute('method', 'POST');

  function $(id){ return document.getElementById(id); }

  function getPrestationText(){
    var sel = $('prestation');
    if(!sel) return '';
    var opt = sel.options[sel.selectedIndex];
    return opt ? (opt.textContent || '').trim() : '';
  }
  function getBasePrice(){
    var hint = $('priceHint');
    if(!hint) return '';
    var txt = (hint.textContent || '').trim();
    return txt.replace(/^\s*Tarif\s*:\s*/i,'');
  }
  function getSupplementsList(){
    var boxContainer = document.getElementById('supplementList') || document;
    var checked = Array.prototype.slice.call(boxContainer.querySelectorAll('input[type="checkbox"]:checked'));
    return checked.map(function(el){
      var label = el.closest('label');
      if(label){
        var t = (label.textContent || '').replace(/\s+/g,' ').trim();
        return t;
      }
      return el.value || el.id || 'supplément';
    }).join(', ');
  }
  function getTotal(){
    var t = $('totalPrice');
    if(!t) return '';
    return (t.textContent || '').trim();
  }

  function ensureName(id, name){
    var el = $(id);
    if(el && !el.getAttribute('name')) el.setAttribute('name', name);
  }
  ensureName('name','Nom');
  ensureName('phone','Téléphone');
  ensureName('categorySelect','Catégorie');
  ensureName('prestation','Prestation');
  ensureName('message','Message');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var map = {
      'prestationText':    getPrestationText(),
      'basePriceHidden':   getBasePrice(),
      'supplementsHidden': getSupplementsList(),
      'totalHidden':       getTotal()
    };
    Object.keys(map).forEach(function(id){
      var el = $(id);
      if(!el){
        el = document.createElement('input');
        el.type = 'hidden';
        el.id = id;
        var nameMap = {
          prestationText: 'Prestation (libellé)',
          basePriceHidden: 'Tarif de base',
          supplementsHidden: 'Suppléments (liste)',
          totalHidden: 'Total estimé TTC'
        };
        el.name = nameMap[id] || id;
        form.appendChild(el);
      }
      el.value = map[id];
    });

    var url = form.getAttribute('action') || 'https://formspree.io/f/xpwlevav';
    var fd = new FormData(form);
    fetch(url, {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    }).then(function(resp){
      if(resp.ok){
        window.location.href = './merci.html';
      }else{
        return resp.json().then(function(data){
          var msg = (data && (data.error || (data.errors && data.errors[0] && data.errors[0].message))) ? (data.error || data.errors[0].message) : 'Une erreur est survenue.';
          alert('Erreur d’envoi: ' + msg);
        }).catch(function(){
          alert('Erreur d’envoi.');
        });
      }
    }).catch(function(){
      alert('Impossible d’envoyer le formulaire (réseau).');
    });
  });
})();

// FAQ enhanced: search + animated toggle
document.addEventListener('DOMContentLoaded', function(){
  const items = Array.from(document.querySelectorAll('.faq-item'));
  document.querySelectorAll('.faq-question').forEach(btn=>{
    btn.setAttribute('aria-expanded','false');
    btn.addEventListener('click', ()=>{
      const parent = btn.parentElement;
      const open = parent.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  const search = document.getElementById('faqSearch');
  if(search){
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      items.forEach(it => {
        const text = it.textContent.toLowerCase();
        it.style.display = (!q || text.includes(q)) ? '' : 'none';
      });
    });
  }
});


// FAQ robust toggle (click handler + animated height)
document.addEventListener('click', function(e){
  var btn = e.target.closest('.faq-question');
  if(!btn) return;
  var item = btn.closest('.faq-item');
  if(!item) return;
  var ans = item.querySelector('.faq-answer');
  var open = item.classList.toggle('open');
  if(ans){
    if(open){
      ans.style.maxHeight = ans.scrollHeight + 'px';
      ans.style.opacity = '1';
    }else{
      ans.style.maxHeight = '0px';
      ans.style.opacity = '0';
    }
  }
});


// --- Total (base + suppléments) — clean module ---
(function(){
  const priceHint = document.getElementById('priceHint');
  const totalEl = document.getElementById('totalPrice');
  const prestation = document.getElementById('prestation');
  const category = document.getElementById('categorySelect');

  function parseBase(){
    const txt = (priceHint?.textContent || '').replace(/\s+/g,' ').trim(); // e.g. "Tarif: 80€ TTC"
    const m = txt.match(/(\d+)(?:[\.,](\d+))?/);
    return m ? parseFloat(m[1]) : 0;
  }
  function sumSupp(){
    let s = 0;
    document.querySelectorAll('.suppl-group input[type="checkbox"]:checked').forEach(cb => {
      const p = parseFloat(cb.getAttribute('data-price') || '0');
      if(!isNaN(p)) s += p;
    });
    return s;
  }
  function updateTotal(){
    const total = parseBase() + sumSupp();
    if(totalEl){
      totalEl.textContent = total > 0
        ? new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(total)
        : '—';
    }
  }

  document.addEventListener('change', (e)=>{
    if(e.target.closest('.suppl-group') || e.target === prestation || e.target === category){
      updateTotal();
    }
  });

  // Recompute when the hint text changes (prestation changée par le script)
  if(priceHint){
    const mo = new MutationObserver(updateTotal);
    mo.observe(priceHint, { childList:true, characterData:true, subtree:true });
  }

  window.addEventListener('DOMContentLoaded', updateTotal);
  // Export (optional)
  window.updateTotal = updateTotal;
})();
