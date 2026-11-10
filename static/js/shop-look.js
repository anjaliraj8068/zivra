/* =============================================================
   Zivra — Shop the Look  |  shop-look.js
   Pure Vanilla JS — no dependencies
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   DATA — Static look definitions
   --------------------------------------------------------------- */
const LOOKS_DATA = [
  {
    id: 1,
    name: 'Elegant Wedding Guest',
    gender: 'Women',
    occasion: 'Wedding',
    season: 'Spring / Summer',
    style: 'Romantic Elegance',
    palette: ['#F5EDD6', '#D4A9C5', '#C8A97E'],
    paletteNames: ['Ivory', 'Dusty Rose', 'Champagne Gold'],
    total: '₹14,495',
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Dress', name: 'Floral Midi Wrap Dress', brand: 'Zara', price: '₹4,999', img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Heels', name: 'Block Heel Sandals', brand: 'Mango', price: '₹3,499', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Bag', name: 'Rattan Clutch Bag', brand: 'H&M', price: '₹1,799', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Earrings', name: 'Pearl Drop Earrings', brand: 'Accessorize', price: '₹799', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80' },
      { num: '05', category: 'Necklace', name: 'Delicate Gold Chain', brand: 'Voylla', price: '₹1,299', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&auto=format&fit=crop&q=80' },
      { num: '06', category: 'Sunglasses', name: 'Cat-Eye Sunnies', brand: 'Ray-Ban', price: '₹2,100', img: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 2,
    name: 'Modern Office',
    gender: 'Men',
    occasion: 'Office',
    season: 'All Season',
    style: 'Sharp Professional',
    palette: ['#2C3E50', '#FFFFFF', '#C0A06A'],
    paletteNames: ['Charcoal', 'White', 'Tan'],
    total: '₹17,196',
    img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Blazer', name: 'Tailored Slim Blazer', brand: 'Marks & Spencer', price: '₹6,499', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Shirt', name: 'White Oxford Shirt', brand: 'Arrow', price: '₹1,999', img: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Trousers', name: 'Charcoal Slim Trousers', brand: 'Van Heusen', price: '₹2,499', img: 'https://images.unsplash.com/photo-1631193816258-28b44b21e78b?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Shoes', name: 'Derby Leather Shoes', brand: 'Clarks', price: '₹5,499', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80' },
      { num: '05', category: 'Watch', name: 'Minimal Steel Watch', brand: 'Titan', price: '₹3,999', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80' },
      { num: '06', category: 'Tie', name: 'Silk Woven Tie', brand: 'Louis Philippe', price: '₹699', img: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 3,
    name: 'Casual Weekend',
    gender: 'Women',
    occasion: 'Casual',
    season: 'Spring / Summer',
    style: 'Effortless Minimal',
    palette: ['#F0EDE8', '#C2B49A', '#7A9E7E'],
    paletteNames: ['Cream', 'Camel', 'Sage Green'],
    total: '₹7,494',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Top', name: 'Ribbed Crop Tank', brand: 'H&M', price: '₹899', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Jeans', name: 'High-Waist Wide Leg Denim', brand: "Levi's", price: '₹3,499', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Sneakers', name: 'Classic White Sneakers', brand: 'Nike', price: '₹2,499', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Bag', name: 'Canvas Tote Bag', brand: 'Uniqlo', price: '₹599', img: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 4,
    name: 'Traditional Celebration',
    gender: 'Women',
    occasion: 'Traditional',
    season: 'All Season',
    style: 'Heritage Festive',
    palette: ['#A2290B', '#F5C842', '#1B4E3C'],
    paletteNames: ['Deep Red', 'Gold', 'Bottle Green'],
    total: '₹16,494',
    img: 'https://images.unsplash.com/photo-1610189352649-3ba7b2081fd0?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Saree / Lehenga', name: 'Embroidered Silk Saree', brand: 'Fabindia', price: '₹8,999', img: 'https://images.unsplash.com/photo-1610189352649-3ba7b2081fd0?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Blouse', name: 'Designer Embroidered Blouse', brand: 'Biba', price: '₹2,499', img: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Jewellery', name: 'Kundan Necklace Set', brand: 'Tanishq', price: '₹2,999', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Footwear', name: 'Embellished Juttis', brand: 'Ritu Kumar', price: '₹1,499', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&auto=format&fit=crop&q=80' },
      { num: '05', category: 'Potli Bag', name: 'Beaded Velvet Potli', brand: 'W', price: '₹499', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 5,
    name: 'Summer Vacation',
    gender: 'Women',
    occasion: 'Vacation',
    season: 'Summer',
    style: 'Breezy Boho',
    palette: ['#FCEBD3', '#E8B87D', '#4DB6AC'],
    paletteNames: ['Peach', 'Amber', 'Teal'],
    total: '₹8,794',
    img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Dress', name: 'Linen Maxi Dress', brand: 'Mango', price: '₹3,499', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Sandals', name: 'Woven Flat Sandals', brand: 'Steve Madden', price: '₹2,299', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Hat', name: 'Wide Brim Straw Hat', brand: 'Zara', price: '₹1,299', img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Sunglasses', name: 'Oversized UV400 Sunnies', brand: 'Quay', price: '₹1,699', img: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 6,
    name: 'Minimal Streetwear',
    gender: 'Men',
    occasion: 'Casual',
    season: 'All Season',
    style: 'Urban Minimal',
    palette: ['#F5F5F5', '#2D2D2D', '#A0A0A0'],
    paletteNames: ['Off White', 'Charcoal', 'Grey'],
    total: '₹9,195',
    img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'T-Shirt', name: 'Oversized Graphic Tee', brand: 'H&M', price: '₹1,299', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Joggers', name: 'Slim Jogger Trousers', brand: 'Adidas', price: '₹2,499', img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Sneakers', name: 'Retro Chunky Sneakers', brand: 'New Balance', price: '₹4,499', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Cap', name: 'Structured Logo Cap', brand: 'Nike', price: '₹899', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 7,
    name: 'College Casual',
    gender: 'Women',
    occasion: 'College',
    season: 'Spring',
    style: 'Fresh Campus',
    palette: ['#D4E6F1', '#FAD7A0', '#ABEBC6'],
    paletteNames: ['Sky Blue', 'Butter Yellow', 'Mint'],
    total: '₹6,394',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Shirt', name: 'Striped Oversized Shirt', brand: 'Forever 21', price: '₹1,299', img: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Jeans', name: 'Straight Cut Blue Jeans', brand: "Levi's", price: '₹2,799', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Sneakers', name: 'Canvas Plimsolls', brand: 'Converse', price: '₹1,999', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Backpack', name: 'Mini Canvas Backpack', brand: 'Wildcraft', price: '₹299', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 8,
    name: 'Evening Party',
    gender: 'Women',
    occasion: 'Party',
    season: 'All Season',
    style: 'Glamour & Drama',
    palette: ['#1A1A2E', '#C0A06A', '#FF6B9D'],
    paletteNames: ['Midnight', 'Gold', 'Rose'],
    total: '₹11,994',
    img: 'https://images.unsplash.com/photo-1566479179817-c72b5fd1e1e6?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Dress', name: 'Off-Shoulder Mini Dress', brand: 'Zara', price: '₹4,499', img: 'https://images.unsplash.com/photo-1566479179817-c72b5fd1e1e6?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Heels', name: 'Stiletto Ankle Strap Heels', brand: 'Aldo', price: '₹3,999', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Clutch', name: 'Metallic Evening Clutch', brand: 'Accessorize', price: '₹1,499', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Jewellery', name: 'Crystal Statement Earrings', brand: 'H&M', price: '₹999', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80' },
      { num: '05', category: 'Perfume', name: 'Floral Musk EDP', brand: 'Nykaa', price: '₹999', img: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 9,
    name: 'Reception Elegance',
    gender: 'Men',
    occasion: 'Reception',
    season: 'All Season',
    style: 'Classic Dapper',
    palette: ['#1B2631', '#F4F6F7', '#C0A06A'],
    paletteNames: ['Navy', 'White', 'Gold'],
    total: '₹22,994',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Suit', name: 'Navy 3-Piece Suit', brand: 'Raymond', price: '₹12,999', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Shirt', name: 'Pleated Formal White Shirt', brand: 'Peter England', price: '₹1,799', img: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Shoes', name: 'Patent Leather Oxfords', brand: 'Clarks', price: '₹5,999', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Watch', name: 'Chronograph Gold Watch', brand: 'Titan', price: '₹2,199', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 10,
    name: 'Winter Layering',
    gender: 'Women',
    occasion: 'Casual',
    season: 'Winter',
    style: 'Cosy Chic',
    palette: ['#D7CCC8', '#795548', '#4E342E'],
    paletteNames: ['Stone', 'Chocolate', 'Dark Walnut'],
    total: '₹10,794',
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Coat', name: 'Camel Wool Overcoat', brand: 'Zara', price: '₹5,499', img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Sweater', name: 'Ribbed Turtleneck', brand: 'H&M', price: '₹1,999', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Jeans', name: 'Dark Wash Slim Jeans', brand: "Levi's", price: '₹2,499', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Boots', name: 'Chelsea Ankle Boots', brand: 'Clarks', price: '₹3,999', img: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=200&auto=format&fit=crop&q=80' },
      { num: '05', category: 'Scarf', name: 'Cashmere Plaid Scarf', brand: 'Westside', price: '₹799', img: 'https://images.unsplash.com/photo-1617541086271-4d6d1a96a8fc?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 11,
    name: 'Festive Traditional',
    gender: 'Men',
    occasion: 'Traditional',
    season: 'All Season',
    style: 'Royal Sherwani',
    palette: ['#B7860B', '#FDEBD0', '#7B241C'],
    paletteNames: ['Gold', 'Ivory', 'Maroon'],
    total: '₹18,994',
    img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Sherwani', name: 'Embroidered Silk Sherwani', brand: 'Manyavar', price: '₹12,999', img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Churidar', name: 'Ivory Slim Churidar', brand: 'Manyavar', price: '₹1,999', img: 'https://images.unsplash.com/photo-1631193816258-28b44b21e78b?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Footwear', name: 'Royal Mojari', brand: 'Rajasthali', price: '₹2,499', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Stole', name: 'Zari Dupatta Stole', brand: 'Fabindia', price: '₹1,499', img: 'https://images.unsplash.com/photo-1617541086271-4d6d1a96a8fc?w=200&auto=format&fit=crop&q=80' },
      { num: '05', category: 'Watch', name: 'Regal Pocket Watch', brand: 'Titan', price: '₹1,999', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80' },
    ]
  },
  {
    id: 12,
    name: 'Smart Casual',
    gender: 'Men',
    occasion: 'Casual',
    season: 'All Season',
    style: 'Polished Ease',
    palette: ['#ECF0F1', '#2980B9', '#BDC3C7'],
    paletteNames: ['Light Grey', 'Steel Blue', 'Silver'],
    total: '₹11,694',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
    products: [
      { num: '01', category: 'Polo Shirt', name: 'Pique Cotton Polo', brand: 'Lacoste', price: '₹3,499', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&auto=format&fit=crop&q=80' },
      { num: '02', category: 'Chinos', name: 'Slim Fit Chinos', brand: 'Marks & Spencer', price: '₹2,499', img: 'https://images.unsplash.com/photo-1631193816258-28b44b21e78b?w=200&auto=format&fit=crop&q=80' },
      { num: '03', category: 'Shoes', name: 'Leather Loafers', brand: 'Clarks', price: '₹4,499', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80' },
      { num: '04', category: 'Belt', name: 'Reversible Leather Belt', brand: 'Tommy Hilfiger', price: '₹1,199', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80' },
    ]
  },
];

/* ---------------------------------------------------------------
   STATE
   --------------------------------------------------------------- */
const state = {
  searchQuery: '',
  activeGender: 'all',
  activeOccasion: 'all',
  activeChip: 'all',
  likedLooks: new Set(),
};

/* ---------------------------------------------------------------
   DOM REFS
   --------------------------------------------------------------- */
const $ = id => document.getElementById(id);

const searchInput      = $('outfit-search');
const searchClearBtn   = $('search-clear-btn');
const genderPills      = document.querySelectorAll('.sl-gender-pill');
const occasionSelect   = $('occasion-select');
const filterChips      = document.querySelectorAll('.filter-chip');
const looksGrid        = $('looks-grid');
const emptyState       = $('empty-state');
const resultsCount     = $('count-number');
const resetFiltersBtn  = $('reset-filters-btn');

const modalBackdrop    = $('sl-modal-backdrop');
const slModal          = $('sl-modal');
const modalClose       = $('sl-modal-close');
const modalLookImg     = $('modal-look-img');
const modalLookName    = $('modal-look-name');
const modalLookMeta    = $('modal-look-meta');
const modalProductsList= $('modal-products-list');
const modalSummaryGrid = $('modal-summary-grid');
const modalShopAll     = $('modal-shop-all');

/* ---------------------------------------------------------------
   FILTERING LOGIC
   --------------------------------------------------------------- */
function getVisibleLooks() {
  const q = state.searchQuery.toLowerCase();
  const g = state.activeGender;
  const o = state.activeOccasion;
  const chip = state.activeChip;

  return LOOKS_DATA.filter(look => {
    const genderMatch = g === 'all' || look.gender.toLowerCase() === g;
    const occasionMatch = o === 'all' || look.occasion.toLowerCase() === o;
    const chipMatch = chip === 'all'
      || look.occasion.toLowerCase().includes(chip)
      || look.gender.toLowerCase() === chip
      || look.style.toLowerCase().includes(chip)
      || look.season.toLowerCase().includes(chip);

    const searchMatch = !q || [look.name, look.occasion, look.style, look.gender, look.season]
      .some(field => field.toLowerCase().includes(q));

    return genderMatch && occasionMatch && chipMatch && searchMatch;
  });
}

function applyFilters() {
  const cards = looksGrid.querySelectorAll('.sl-look-card');
  const visible = getVisibleLooks();
  const visibleIds = new Set(visible.map(l => l.id));

  cards.forEach(card => {
    const id = parseInt(card.dataset.lookId, 10);
    if (visibleIds.has(id)) {
      card.style.display = '';
      card.style.animation = 'none';
      card.offsetHeight; // reflow
      card.style.animation = 'sl-card-appear 0.35s cubic-bezier(0.16,1,0.3,1) both';
    } else {
      card.style.display = 'none';
    }
  });

  resultsCount.textContent = visible.length;
  emptyState.style.display = visible.length === 0 ? 'flex' : 'none';
}

/* ---------------------------------------------------------------
   ADD CARD APPEAR ANIMATION
   --------------------------------------------------------------- */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes sl-card-appear {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

/* ---------------------------------------------------------------
   SEARCH
   --------------------------------------------------------------- */
searchInput.addEventListener('input', () => {
  state.searchQuery = searchInput.value.trim();
  searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
  applyFilters();
});

searchClearBtn.addEventListener('click', () => {
  searchInput.value = '';
  state.searchQuery = '';
  searchClearBtn.style.display = 'none';
  searchInput.focus();
  applyFilters();
});

/* ---------------------------------------------------------------
   GENDER PILLS
   --------------------------------------------------------------- */
genderPills.forEach(pill => {
  pill.addEventListener('click', () => {
    genderPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.activeGender = pill.dataset.gender;
    applyFilters();
  });
});

/* ---------------------------------------------------------------
   OCCASION SELECT
   --------------------------------------------------------------- */
occasionSelect.addEventListener('change', () => {
  state.activeOccasion = occasionSelect.value;
  applyFilters();
});

/* ---------------------------------------------------------------
   FILTER CHIPS
   --------------------------------------------------------------- */
filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    filterChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    state.activeChip = chip.dataset.tag;
    applyFilters();
  });
});

/* ---------------------------------------------------------------
   RESET FILTERS
   --------------------------------------------------------------- */
function resetAllFilters() {
  state.searchQuery = '';
  state.activeGender = 'all';
  state.activeOccasion = 'all';
  state.activeChip = 'all';

  searchInput.value = '';
  searchClearBtn.style.display = 'none';

  genderPills.forEach(p => p.classList.toggle('active', p.dataset.gender === 'all'));
  filterChips.forEach(c => c.classList.toggle('active', c.dataset.tag === 'all'));
  occasionSelect.value = 'all';

  applyFilters();
}

resetFiltersBtn?.addEventListener('click', resetAllFilters);

/* ---------------------------------------------------------------
   HEART / SAVE TOGGLE
   --------------------------------------------------------------- */
document.addEventListener('click', e => {
  const btn = e.target.closest('.sl-heart-btn');
  if (!btn) return;
  e.stopPropagation();

  const id = btn.dataset.id;
  if (state.likedLooks.has(id)) {
    state.likedLooks.delete(id);
    btn.classList.remove('liked');
    btn.setAttribute('aria-label', 'Save this look');
  } else {
    state.likedLooks.add(id);
    btn.classList.add('liked');
    btn.setAttribute('aria-label', 'Unsave this look');

    // Heart pulse animation
    btn.style.transform = 'scale(1.35)';
    setTimeout(() => btn.style.transform = '', 250);
  }
});

/* ---------------------------------------------------------------
   MODAL OPEN
   --------------------------------------------------------------- */
function openModal(lookId) {
  const look = LOOKS_DATA.find(l => l.id === lookId);
  if (!look) return;

  // Populate image + look info
  modalLookImg.src = look.img;
  modalLookImg.alt = look.name;
  modalLookName.textContent = look.name;

  // Meta tags
  modalLookMeta.innerHTML = [look.gender, look.occasion, look.style]
    .map(tag => `<span class="sl-meta-tag">${tag}</span>`)
    .join('');

  // Products
  modalProductsList.innerHTML = look.products.map(p => `
    <div class="sl-product-item">
      <div class="sl-product-num-img">
        <span class="sl-product-num">${p.num}</span>
        <img src="${p.img}" alt="${p.name}" class="sl-product-img" loading="lazy">
      </div>
      <div class="sl-product-details">
        <span class="sl-product-category">${p.category}</span>
        <span class="sl-product-name">${p.name}</span>
        <span class="sl-product-brand">${p.brand}</span>
        <span class="sl-product-price">${p.price}</span>
      </div>
      <div class="sl-product-action">
        <a href="#" class="sl-view-product-btn" target="_blank" rel="noopener noreferrer">
          View Product
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      </div>
    </div>
  `).join('');

  // Summary
  const colorSwatches = look.palette.map((hex, i) =>
    `<span class="sl-color-dot" style="background:${hex}" title="${look.paletteNames[i]}"></span>`
  ).join('');

  modalSummaryGrid.innerHTML = `
    <div class="sl-summary-item">
      <span class="sl-summary-item-label">Occasion</span>
      <span class="sl-summary-item-value">${look.occasion}</span>
    </div>
    <div class="sl-summary-item">
      <span class="sl-summary-item-label">Season</span>
      <span class="sl-summary-item-value">${look.season}</span>
    </div>
    <div class="sl-summary-item">
      <span class="sl-summary-item-label">Style</span>
      <span class="sl-summary-item-value">${look.style}</span>
    </div>
    <div class="sl-summary-item">
      <span class="sl-summary-item-label">Palette</span>
      <div class="sl-color-swatches">${colorSwatches}</div>
    </div>
    <div class="sl-summary-total-row">
      <span class="sl-total-label">Estimated Look</span>
      <span class="sl-total-price">${look.total}</span>
    </div>
  `;

  // Show modal
  modalBackdrop.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  slModal.classList.remove('closing');
  modalBackdrop.classList.remove('closing');

  // Focus trap: focus close button
  setTimeout(() => modalClose.focus(), 100);
}

/* ---------------------------------------------------------------
   MODAL CLOSE
   --------------------------------------------------------------- */
function closeModal() {
  slModal.classList.add('closing');
  modalBackdrop.classList.add('closing');
  setTimeout(() => {
    modalBackdrop.style.display = 'none';
    slModal.classList.remove('closing');
    modalBackdrop.classList.remove('closing');
    document.body.style.overflow = '';
  }, 250);
}

// Close button
modalClose.addEventListener('click', closeModal);

// Click outside (backdrop)
modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});

// ESC key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalBackdrop.style.display !== 'none') closeModal();
});

// Zoom button (fullscreen image)
document.addEventListener('click', e => {
  if (e.target.closest('.sl-zoom-btn')) {
    const src = modalLookImg.src;
    window.open(src, '_blank');
  }
});

// Shop All Items
modalShopAll.addEventListener('click', () => {
  // Demo action: open all products in new tabs or show a toast
  const links = modalProductsList.querySelectorAll('.sl-view-product-btn');
  if (links.length) {
    showToast('Opening all items... (demo links)');
    links.forEach((link, i) => setTimeout(() => window.open(link.href, '_blank'), i * 120));
  }
});

/* ---------------------------------------------------------------
   CLICK ON CARD or SHOP BUTTON → OPEN MODAL
   --------------------------------------------------------------- */
document.addEventListener('click', e => {
  // Shop button
  const shopBtn = e.target.closest('.sl-shop-btn');
  if (shopBtn) {
    e.stopPropagation();
    openModal(parseInt(shopBtn.dataset.lookId, 10));
    return;
  }

  // Entire card click (not heart, not shop btn)
  const card = e.target.closest('.sl-look-card');
  if (card && !e.target.closest('.sl-heart-btn')) {
    openModal(parseInt(card.dataset.lookId, 10));
  }
});

/* ---------------------------------------------------------------
   HERO BUTTONS — smooth scroll
   --------------------------------------------------------------- */
document.getElementById('btn-explore-looks')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('featured-looks')?.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('btn-browse-occasions')?.addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('filter-area')?.scrollIntoView({ behavior: 'smooth' });
});

/* ---------------------------------------------------------------
   TOAST NOTIFICATION
   --------------------------------------------------------------- */
function showToast(msg) {
  const existing = document.querySelector('.sl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'sl-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: var(--color-text-main);
    color: white;
    padding: 0.85rem 1.75rem;
    border-radius: var(--radius-pill);
    font-size: 0.88rem;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    font-family: var(--font-body, Inter, sans-serif);
    pointer-events: none;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

/* ---------------------------------------------------------------
   INIT
   --------------------------------------------------------------- */
applyFilters();
