/* =============================================================
   Zivra — Skin & Beauty Page  |  skincare.js
   Pure Vanilla JS — static demo, no backend
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   CONCERN DATA
   --------------------------------------------------------------- */
const CONCERNS = {
  acne: {
    name: 'Acne & Breakouts',
    desc: 'Manage and reduce blemishes with consistent, gentle daily care.',
    morning: [
      'Gentle, non-comedogenic cleanser',
      'Oil-free, lightweight moisturiser',
      'Broad-spectrum SPF 30+ sunscreen',
    ],
    evening: [
      'Gentle cleanser to remove impurities',
      'Spot treatment on affected areas (if using)',
      'Light, non-comedogenic moisturiser',
    ],
    habits: [
      'Change pillowcases at least twice a week',
      'Avoid touching your face with unwashed hands',
      'Keep your phone screen clean',
      'Wash makeup brushes regularly',
      'Choose non-comedogenic products',
      'Be patient — consistency matters more than quantity',
    ],
  },
  darkcircles: {
    name: 'Dark Circles',
    desc: 'Brighten and refresh the delicate under-eye area with gentle care.',
    morning: [
      'Cool water rinse to reduce morning puffiness',
      'Eye cream applied with gentle tapping motions',
      'Light moisturiser and SPF (sun exposure worsens dark circles)',
    ],
    evening: [
      'Gentle cleansing before bed',
      'Eye cream or gel patted carefully around the orbital bone',
      'Moisturiser to maintain overall skin hydration',
    ],
    habits: [
      'Aim for 7–9 hours of quality sleep each night',
      'Stay well hydrated throughout the day',
      'Reduce screen time before sleeping',
      'Use an extra pillow to slightly elevate your head',
      'Wear UV-protective sunglasses outdoors',
    ],
  },
  puffiness: {
    name: 'Under-Eye Puffiness',
    desc: 'Reduce morning puffiness with simple cooling and soothing habits.',
    morning: [
      'Rinse with cool or cold water to constrict blood vessels',
      'Gently press a chilled spoon or ice cube (wrapped in cloth) under eyes',
      'Apply a cooling eye gel or cream with light tapping motions',
      'SPF moisturiser for the rest of the face',
    ],
    evening: [
      'Remove makeup gently — no rubbing around the eyes',
      'Cleanse thoroughly before bed',
      'Apply eye cream to keep skin hydrated overnight',
    ],
    habits: [
      'Reduce salt intake to minimise fluid retention',
      'Avoid alcohol close to bedtime',
      'Sleep on your back with your head slightly elevated',
      'Stay hydrated — dehydration can worsen puffiness',
      'Apply cold spoons or chilled cucumber slices for quick relief',
    ],
  },
  dryness: {
    name: 'Dryness',
    desc: 'Restore moisture and keep skin feeling soft and comfortable.',
    morning: [
      'Gentle, hydrating cleanser (avoid foaming/stripping formulas)',
      'Hydrating toner or facial mist (optional)',
      'Rich moisturiser while skin is slightly damp',
      'Sunscreen on top',
    ],
    evening: [
      'Gentle cleansing — avoid hot water',
      'Hydrating serum or facial oil (optional)',
      'Richer night cream or moisturiser to support repair',
    ],
    habits: [
      'Stay well hydrated — drink enough water daily',
      'Avoid excessively hot showers or baths',
      'Use a humidifier in dry or air-conditioned environments',
      'Avoid harsh soaps and alcohol-based products',
      'Pat skin dry with a soft towel — never rub',
    ],
  },
  oiliness: {
    name: 'Excess Oil',
    desc: 'Balance sebum production for a comfortable, fresh complexion.',
    morning: [
      'Gentle, water-based or gel cleanser',
      'Alcohol-free toner to balance skin',
      'Lightweight, oil-free moisturiser',
      'Matte or lightweight SPF 30+ sunscreen',
    ],
    evening: [
      'Thorough but gentle cleansing to remove excess sebum',
      'Lightweight moisturiser — even oily skin needs hydration',
    ],
    habits: [
      'Avoid over-cleansing — it strips skin and can trigger more oil',
      'Use blotting papers during the day instead of re-washing',
      'Choose non-comedogenic, oil-free products',
      'Avoid heavy, occlusive creams',
      'Maintain a consistent routine — consistency reduces excess oil over time',
    ],
  },
  uneven: {
    name: 'Uneven Skin Tone',
    desc: 'Work towards a more even, radiant-looking complexion with daily care.',
    morning: [
      'Gentle cleanser to start fresh',
      'Vitamin C serum (optional) — helps brighten over time',
      'Moisturiser',
      'SPF 30+ sunscreen — essential for preventing further unevenness',
    ],
    evening: [
      'Gentle cleansing',
      'Hydrating serum or targeted treatment (if using)',
      'Moisturiser',
    ],
    habits: [
      'Apply sunscreen every day — UV exposure is the main cause of uneven tone',
      'Be consistent — visible improvement takes weeks, not days',
      'Avoid picking or squeezing spots (causes post-inflammatory marks)',
      'Introduce any new active ingredients slowly',
      'Maintain overall skin hydration',
    ],
  },
  dull: {
    name: 'Dull-Looking Skin',
    desc: 'Revive your skin's natural radiance with hydration and gentle exfoliation.',
    morning: [
      'Gentle cleanser to remove overnight build-up',
      'Hydrating toner or mist',
      'Moisturiser for a plump, healthy look',
      'SPF 30+ — sun damage dulls skin over time',
    ],
    evening: [
      'Double cleanse to remove impurities',
      'Gentle chemical exfoliant 1–2 times per week (optional)',
      'Hydrating or brightening serum (optional)',
      'Rich moisturiser to restore overnight',
    ],
    habits: [
      'Drink sufficient water every day',
      'Get 7–9 hours of quality sleep',
      'Eat a balanced diet rich in fruits and vegetables',
      'Exfoliate gently 1–2 times per week — not more',
      'Apply sunscreen daily to prevent further dullness',
    ],
  },
  blackheads: {
    name: 'Blackheads',
    desc: 'Keep pores clean with consistent, gentle cleansing habits.',
    morning: [
      'Gentle gel or foam cleanser',
      'Oil-free, lightweight moisturiser',
      'Non-comedogenic SPF sunscreen',
    ],
    evening: [
      'Double cleanse to fully clear the skin surface',
      'Targeted pore treatment 1–2 times per week (optional)',
      'Light, non-comedogenic moisturiser',
    ],
    habits: [
      'Cleanse properly every evening — especially after wearing makeup or sunscreen',
      'Avoid squeezing blackheads with fingers (can cause scarring)',
      'Change pillowcases frequently',
      'Keep hair off your face at night',
      'Use non-comedogenic products throughout your routine',
    ],
  },
  texture: {
    name: 'Rough Texture',
    desc: 'Smooth and soften skin with consistent hydration and gentle exfoliation.',
    morning: [
      'Gentle cleanser',
      'Hydrating toner or essence (optional)',
      'Moisturiser to soften and plump skin',
      'SPF 30+ sunscreen',
    ],
    evening: [
      'Gentle cleanser',
      'Gentle exfoliant 2–3 times per week (optional) — not every night',
      'Hydrating serum',
      'Rich moisturiser to restore overnight',
    ],
    habits: [
      'Keep skin consistently hydrated — dehydration worsens texture',
      'Exfoliate gently and not too frequently',
      'Drink plenty of water',
      'Avoid harsh physical scrubs that can worsen uneven texture',
      'Use sunscreen to prevent UV-related textural changes',
    ],
  },
  lips: {
    name: 'Chapped Lips',
    desc: 'Keep your lips soft and moisturised with a simple lip care habit.',
    morning: [
      'Gently remove flaky skin with a soft damp cloth',
      'Apply a nourishing, fragrance-free lip balm',
    ],
    evening: [
      'Apply a generous layer of lip balm or lip mask before sleep',
      'Optional: use a small amount of a gentle lip scrub 1–2 times per week',
    ],
    habits: [
      'Stay hydrated — chapped lips are often a sign of dehydration',
      'Breathe through your nose when possible',
      'Avoid licking your lips (saliva dries them out further)',
      'Apply lip balm before going outdoors',
      'Choose unscented, gentle lip products to reduce irritation',
    ],
  },
  sun: {
    name: 'Sun Protection',
    desc: 'Protect your skin daily with consistent sunscreen application.',
    morning: [
      'Gentle cleanser',
      'Moisturiser',
      'Broad-spectrum SPF 30 or higher — the last step before going out',
    ],
    evening: [
      'Thorough cleansing to remove sunscreen, oil and impurities',
      'Moisturiser or targeted serum',
      'No sunscreen needed at night',
    ],
    habits: [
      'Apply SPF every single day — even indoors, even on cloudy days',
      'Reapply every 2–3 hours when outdoors',
      'Use a broad-spectrum SPF 30 or higher',
      'Wear sunglasses and a wide-brim hat for added protection',
      'Seek shade between 10am–4pm when UV is strongest',
    ],
  },
  general: {
    name: 'General Skin Health',
    desc: 'Build a balanced, consistent routine for everyday healthy-looking skin.',
    morning: [
      'Gentle cleanser',
      'Moisturiser suited to your skin type',
      'SPF 30+ sunscreen — every single morning',
    ],
    evening: [
      'Gentle cleansing to remove the day',
      'Targeted serum or treatment (optional)',
      'Moisturiser',
    ],
    habits: [
      'Keep your routine simple and consistent',
      'Stay hydrated inside and out',
      'Get adequate sleep every night',
      'Eat a varied, balanced diet',
      'Apply sunscreen daily — this single habit makes the biggest difference',
    ],
  },
};

/* ---------------------------------------------------------------
   DOM REFS
   --------------------------------------------------------------- */
const skinTypeGroup   = document.getElementById('skin-type-group');
const concernsGrid    = document.getElementById('concerns-grid');
const suggestedCare   = document.getElementById('suggested-care');
const careConernName  = document.getElementById('care-concern-name');
const careConcernDesc = document.getElementById('care-concern-desc');
const morningSteps    = document.getElementById('morning-steps');
const eveningSteps    = document.getElementById('evening-steps');
const habitsList      = document.getElementById('habits-list');

/* ---------------------------------------------------------------
   SKIN TYPE SELECTOR
   --------------------------------------------------------------- */
skinTypeGroup.addEventListener('click', e => {
  const pill = e.target.closest('.sk-type-pill');
  if (!pill) return;
  document.querySelectorAll('.sk-type-pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');
});

/* ---------------------------------------------------------------
   CONCERN CARDS — select & show care
   --------------------------------------------------------------- */
function renderCare(key) {
  const d = CONCERNS[key];
  if (!d) return;

  careConernName.textContent  = d.name;
  careConcernDesc.textContent = d.desc;

  morningSteps.innerHTML = d.morning.map(s => `<li>${s}</li>`).join('');
  eveningSteps.innerHTML = d.evening.map(s => `<li>${s}</li>`).join('');
  habitsList.innerHTML   = d.habits.map(h => `<li>${h}</li>`).join('');

  suggestedCare.style.display = 'block';
  suggestedCare.style.animation = 'none';
  suggestedCare.offsetHeight; // reflow
  suggestedCare.style.animation = '';

  suggestedCare.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

concernsGrid.addEventListener('click', e => {
  const card = e.target.closest('.sk-concern-card');
  if (!card) return;

  document.querySelectorAll('.sk-concern-card').forEach(c => c.classList.remove('active'));
  card.classList.add('active');

  renderCare(card.dataset.concern);
});

/* ---------------------------------------------------------------
   HERO CTA — smooth scroll to concerns
   --------------------------------------------------------------- */
document.getElementById('btn-explore-concerns')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('skin-concerns')?.scrollIntoView({ behavior: 'smooth' });
});

/* ---------------------------------------------------------------
   HAIRSTYLE TABS — Women / Men
   --------------------------------------------------------------- */
const hairTabs   = document.querySelectorAll('.sk-hair-tab');
const hairPanels = document.querySelectorAll('.sk-hair-panel');

hairTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.gender;

    hairTabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    hairPanels.forEach(panel => {
      const show = panel.id === `panel-${target}`;
      panel.style.display = show ? 'block' : 'none';
    });
  });
});

/* ---------------------------------------------------------------
   HAIR FAVOURITE TOGGLE
   --------------------------------------------------------------- */
const likedHair = new Set();

document.addEventListener('click', e => {
  const btn = e.target.closest('.sk-hair-fav');
  if (!btn) return;
  e.stopPropagation();

  const id = btn.dataset.id;
  if (likedHair.has(id)) {
    likedHair.delete(id);
    btn.classList.remove('liked');
    btn.setAttribute('aria-label', btn.getAttribute('aria-label').replace('Unfavourite', 'Favourite'));
  } else {
    likedHair.add(id);
    btn.classList.add('liked');

    // Heart pulse
    btn.style.transform = 'scale(1.4)';
    setTimeout(() => btn.style.transform = '', 240);
  }
});

/* ---------------------------------------------------------------
   HAIR VIEW STYLE — placeholder toast
   --------------------------------------------------------------- */
document.addEventListener('click', e => {
  if (!e.target.closest('.sk-hair-view-btn')) return;
  const card = e.target.closest('.sk-hair-card');
  const name = card?.querySelector('h3')?.textContent || 'this style';
  showToast(`Opening details for ${name}…`);
});

/* ---------------------------------------------------------------
   TOAST
   --------------------------------------------------------------- */
function showToast(msg) {
  document.querySelector('.sk-toast')?.remove();
  const t = document.createElement('div');
  t.className = 'sk-toast';
  t.textContent = msg;
  t.style.cssText = `
    position:fixed; bottom:2rem; left:50%;
    transform:translateX(-50%) translateY(20px);
    background:var(--color-text-main); color:white;
    padding:.85rem 1.75rem; border-radius:50px;
    font-size:.88rem; font-weight:500; z-index:9999;
    opacity:0; transition:all .35s cubic-bezier(.16,1,.3,1);
    box-shadow:0 10px 30px rgba(0,0,0,.2);
    font-family:var(--font-body,Inter,sans-serif);
    pointer-events:none; white-space:nowrap;`;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-50%) translateY(10px)'; setTimeout(() => t.remove(), 350); }, 2600);
}
