// Aera Pure — Script
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

modal.addEventListener('click', (e) => {
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

function closeModal(){
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

document.getElementById('year').textContent = new Date().getFullYear();

// Before/After Slider (interactive)
document.querySelectorAll(".ba-slider").forEach(slider => {
  const handle = slider.querySelector(".handle");
  const resize = slider.querySelector(".resize");
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
    e.preventDefault();
  };
  const move = (e) => {
    if(!dragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setPosition(clientX);
  };
  const end = () => dragging = false;

  handle.addEventListener("mousedown", start);
  handle.addEventListener("touchstart", start);
  slider.addEventListener("mousedown", start);
  slider.addEventListener("touchstart", start, {passive:false});
  window.addEventListener("mousemove", move);
  window.addEventListener("touchmove", move, {passive:false});
  window.addEventListener("mouseup", end);
  window.addEventListener("touchend", end);

  const init = () => {
    const rect = slider.getBoundingClientRect();
    const x = rect.width / 2;
    handle.style.left = x + "px";
    resize.style.width = x + "px";
  };
  window.addEventListener("load", init);
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
    priceHint.textContent = price ? `Tarif: ${price}` : '';
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