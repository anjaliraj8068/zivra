/**
 * Zivra Home Dashboard Interactions
 * 
 * Includes:
 * 1. User details initialization (LocalStorage check & default fallback)
 * 2. Dropdown Panel Toggles (Notifications & Profile)
 * 3. Quick Action click handlers
 * 4. Recommended category tab switching
 * 5. Interactive details view modal for products
 * 6. Conversational AI Stylist chat widget simulator
 * 7. Simulated search filter dropdown
 */

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  initDropdownPanels();
  initQuickActions();
  initRecommendationTabs();
  initDetailsModal();
  initStylistWidget();
  initDashboardSearch();
});

/**
 * 1. User Profile Setup
 * Reads zivra_user_profile if it exists (from register / profile setup steps)
 */
function initUserProfile() {
  const defaultProfile = {
    fullname: 'Charlotte Vane',
    username: 'charlotte_v',
    gender: 'female',
    body_shape: 'rectangle',
    skin_tone: 'light',
    face_shape: 'oval',
    hair_type: 'wavy',
    fashion_style: 'minimalist'
  };

  let profile = defaultProfile;
  const savedProfile = localStorage.getItem('zivra_user_profile');
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile);
      if (parsed.fullname) {
        profile = { ...defaultProfile, ...parsed };
      }
    } catch (e) {
      console.error('Error parsing user profile:', e);
    }
  }

  // Update greeting and avatar name labels in DOM
  const nameLabelEl = document.getElementById('user-display-name');
  if (nameLabelEl) nameLabelEl.textContent = profile.fullname;
}

/**
 * 2. Dropdown Panel Toggles
 */
function initDropdownPanels() {
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  // Toggle Notifications
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = notifDropdown.style.display === 'block';
      closeAllDropdowns();
      if (!isOpen) {
        notifDropdown.style.display = 'block';
        notifBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Toggle Profile Dropdown
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = profileDropdown.style.display === 'block';
      closeAllDropdowns();
      if (!isOpen) {
        profileDropdown.style.display = 'block';
        profileBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  // Clear Notifications action
  const clearNotifBtn = document.querySelector('.btn-clear-notifications');
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener('click', () => {
      document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
      });
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.style.display = 'none';
      alert('Notifications marked as read.');
    });
  }

  // Close dropdowns on clicking outside
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });
}

function closeAllDropdowns() {
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (notifDropdown) notifDropdown.style.display = 'none';
  if (profileDropdown) profileDropdown.style.display = 'none';
  if (notifBtn) notifBtn.setAttribute('aria-expanded', 'false');
  if (profileBtn) profileBtn.setAttribute('aria-expanded', 'false');
}

/**
 * 3. Quick Action handlers
 */
function initQuickActions() {
  const btnAnalyze = document.getElementById('qa-analyze');
  const btnWardrobe = document.getElementById('qa-wardrobe');
  const btnGrooming = document.getElementById('qa-grooming');
  const btnChat = document.getElementById('qa-chat');

  if (btnAnalyze) {
    btnAnalyze.addEventListener('click', () => {
      alert('Opening AI Outfit Scanner... Redirecting to Outfit Review page.');
      window.location.href = '#ai-review';
    });
  }

  if (btnWardrobe) {
    btnWardrobe.addEventListener('click', () => {
      alert('Opening your Digital Closet... Redirecting to Virtual Wardrobe page.');
      window.location.href = '#wardrobe';
    });
  }

  if (btnGrooming) {
    btnGrooming.addEventListener('click', () => {
      alert('Opening Grooming Center... Redirecting to Hairstyles & Skincare Recommendations.');
      window.location.href = '#grooming';
    });
  }

  if (btnChat) {
    btnChat.addEventListener('click', () => {
      openChatWidget();
    });
  }
}

/**
 * 4. Recommended category tab switching
 */
function initRecommendationTabs() {
  const tabs = document.querySelectorAll('.rec-tab-btn');
  const panes = document.querySelectorAll('.rec-tab-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      // Sync active state on buttons
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Sync active state on panels
      panes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === `pane-${targetTab}`) {
          pane.classList.add('active');
        }
      });
    });
  });

  // Simple save hearts toggler
  document.querySelectorAll('.btn-product-save').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('saved');
      if (btn.classList.contains('saved')) {
        alert('Look saved to your dashboard catalog.');
      }
    });
  });
}

/**
 * 5. Interactive Details Modal
 */
const mockProductDatabase = {
  'cloth-1': {
    title: 'Drapes Cashmere Overcoat',
    brand: 'ZARA HOME COLLECTION',
    price: '$380.00',
    match: '98% Fit Match',
    img: 'assets/images/recommendation_outfit.jpg',
    desc: 'Woven from Mongolian cashmere blended with wool for optimal thermal weight and drape lines. Designed with clean drop-shoulders to balance rectangular body frame shapes, creating elegant vertical alignment.',
    specs: ['Material: 70% Wool, 30% Cashmere', 'Fit: Oversized drape', 'Closure: Double breasted buttons', 'Season: Fall / Winter']
  },
  'cloth-2': {
    title: 'Merino Wool Charcoal Turtleneck',
    brand: 'UNIQLO U LUXURY',
    price: '$120.00',
    match: '94% Fit Match',
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300&auto=format&fit=crop',
    desc: 'Fine rib-knitted turtleneck in a soft charcoal shade. Highly breathable layer that serves as the perfect base layer. Contrasts beautifully with warm neutrals like camel, beige, and sage colors.',
    specs: ['Material: 100% Merino Wool', 'Knit: Fine-gauge structure', 'Care: Hand wash cold', 'Weight: Mid-weight layer']
  },
  'cloth-3': {
    title: 'Slim Cropped Pleated Trousers',
    brand: 'Sandro Paris',
    price: '$145.00',
    match: '90% Fit Match',
    img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=300&auto=format&fit=crop',
    desc: 'Tailored trousers featuring deep pleats and a cropped hem. Fits snugly through the hip and tapers slightly to accentuate leg length on rectangular physiques. Excellent office-formal choice.',
    specs: ['Material: 98% Wool, 2% Elastane', 'Hem: Cropped turn-up', 'Pleats: Double reverse', 'Origin: Made in Portugal']
  },
  'shoe-1': {
    title: 'Black Suede Chelsea Boots',
    brand: 'Saint Laurent Paris',
    price: '$260.00',
    match: '96% Fit Match',
    img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=300&auto=format&fit=crop',
    desc: 'Sleek Chelsea profile styled in premium calfskin suede. Finished with elasticated side panels and a pull tab for entry comfort. An classic shoe that adds instant editorial weight to trench coat lines.',
    specs: ['Material: Calfskin Suede', 'Sole: Stacked leather heel', 'Height: 30mm heel lift', 'Lining: Soft leather']
  },
  'shoe-2': {
    title: 'Warm Beige Suede Loafers',
    brand: 'Loro Piana',
    price: '$210.00',
    match: '92% Fit Match',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=300&auto=format&fit=crop',
    desc: 'Water-repellent suede loafers featuring raw linen elements and white rubber soles. Styled in warm sand beige. Perfect for smart-casual summer layering, pairing smoothly with cropped linen trousers.',
    specs: ['Material: Waterproof Suede', 'Soles: Non-slip rubber', 'Structure: Unlined moccasin', 'Accents: Silver charms']
  },
  'acc-1': {
    title: 'Classic Aviator Acetate Sunglasses',
    brand: 'Oliver Peoples',
    price: '$185.00',
    match: '95% Face Match',
    img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300&auto=format&fit=crop',
    desc: 'Acetate frame aviators featuring polarised glass lenses and gold-toned metallic hardware accents. Tailored template curves complement oval and soft square face shape keypoints beautifully.',
    specs: ['Frame: Acetate tortoise shell', 'Lenses: Polarised green', 'Protection: 100% UV400', 'Fit: Medium-wide frame']
  },
  'acc-2': {
    title: 'Silver Mesh Chronograph Watch',
    brand: 'Daniel Wellington',
    price: '$320.00',
    match: '89% Match',
    img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=300&auto=format&fit=crop',
    desc: 'Minimalist watch styled with a textured metallic mesh strap and a white chronograph face. Provides a clean, modern accessory addition that aligns with your preferred minimalist fashion direction.',
    specs: ['Movement: Japanese Quartz', 'Case: 316L Stainless Steel', 'Diameter: 38mm', 'Water: 3ATM splashproof']
  },
  'hair-1': {
    title: 'Modern Textured Crop',
    brand: 'Salon Curation Suggestion',
    price: 'Booking details',
    match: '99% Shape Match',
    img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=300&auto=format&fit=crop',
    desc: 'Highly recommended cut matching your oval face shape metrics. Styled with faded side contours and textured volume on top to balance facial heights and contour lines. Best maintained with matte dry clays.',
    specs: ['Hair type: Straight to Wavy', 'Top length: 3 inches', 'Sides fade: High skin taper', 'Style hold: Low-shine matte clay']
  },
  'hair-2': {
    title: 'Low Fade Pompadour',
    brand: 'Barber Calibration Suggestion',
    price: 'Booking details',
    match: '93% Shape Match',
    img: 'https://images.unsplash.com/photo-1605497746444-052d5b50e27a?q=80&w=300&auto=format&fit=crop',
    desc: 'An classic sweep pompadour styled with a subtle low fade outline. Designed for thick hair types looking to structure height profile metrics without accentuating roundness.',
    specs: ['Hair type: Thick / Coarse', 'Top length: 4 inches', 'Sides fade: Low drop taper', 'Style hold: Mid-shine styling pomade']
  }
};

function initDetailsModal() {
  console.log("Community initDetailsModal");
  const modal = document.getElementById('product-modal');
  const modalContent = document.getElementById('modal-content-area');
  const closeBtn = document.getElementById('close-modal-btn');

  if (!modal || !modalContent) return;

  // Event delegation for View Details buttons
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-product-details')) {
      const productId = e.target.getAttribute('data-product-id');
      const product = mockProductDatabase[productId];
      
      if (product) {
        renderModalContent(product);
        modal.style.display = 'flex';
      }
    }
  });

  // Close modal events
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function renderModalContent(product) {
  const contentArea = document.getElementById('modal-content-area');
  if (!contentArea) return;

  // Build specifications list elements HTML
  let specsHTML = '';
  product.specs.forEach(spec => {
    const parts = spec.split(':');
    if (parts.length > 1) {
      specsHTML += `<li><strong>${parts[0]}:</strong> ${parts[1]}</li>`;
    } else {
      specsHTML += `<li>${spec}</li>`;
    }
  });

  contentArea.innerHTML = `
    <div class="modal-img-box">
      <img src="${product.img}" alt="${product.title}">
    </div>
    <div class="modal-info-box">
      <span class="modal-match-tag">${product.match}</span>
      <h2 class="modal-title">${product.title}</h2>
      <p class="modal-brand">${product.brand}</p>
      <p class="modal-price">${product.price}</p>
      <p class="modal-desc">${product.desc}</p>
      
      <ul class="modal-specs-list">
        ${specsHTML}
      </ul>
      
      <div class="modal-actions-row">
        <button class="btn-primary" style="flex-grow: 1;" onclick="alert('Proceeding to partner store checkout...')">Shop Item</button>
        <button class="btn-secondary" onclick="alert('Added combination to try-on board.')">Try On Virtual Twin</button>
      </div>
    </div>
  `;
}

/**
 * 6. AI Stylist Collapsible Widget Logic
 */
function initStylistWidget() {
  const widget = document.getElementById('stylist-widget');
  const toggleBtn = document.getElementById('stylist-toggle-btn');
  const chatWindow = document.getElementById('stylist-chat-window');
  const minimizeBtn = document.getElementById('chat-minimize-btn');
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-message-input');
  const chatMessages = document.getElementById('chat-messages');

  if (!toggleBtn || !chatWindow) return;

  // Open / Close chat
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.add('open');
    toggleBtn.style.transform = 'scale(0)';
  });

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
      toggleBtn.style.transform = 'scale(1)';
    });
  }

  // Handle messages submit
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      appendChatMessage(query, 'user');
      chatInput.value = '';

      // Simulated Typings delay responses
      setTimeout(() => {
        const response = generateAIStylistReply(query);
        appendChatMessage(response, 'bot');
      }, 900);
    });
  }

  // Handle chat suggestion buttons
  document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-chat-sugg')) {
      const suggText = e.target.textContent;
      appendChatMessage(suggText, 'user');
      
      // Hide suggestions list to focus chat timeline
      const suggestionsBox = document.querySelector('.chat-suggestions');
      if (suggestionsBox) suggestionsBox.style.display = 'none';

      setTimeout(() => {
        const response = generateAIStylistReply(suggText);
        appendChatMessage(response, 'bot');
      }, 900);
    }
  });
}

function openChatWidget() {
  const toggleBtn = document.getElementById('stylist-toggle-btn');
  const chatWindow = document.getElementById('stylist-chat-window');
  const chatInput = document.getElementById('chat-message-input');

  if (chatWindow && toggleBtn) {
    chatWindow.classList.add('open');
    toggleBtn.style.transform = 'scale(0)';
    if (chatInput) chatInput.focus();
  }
}

function appendChatMessage(text, sender) {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  const msgBubble = document.createElement('div');
  msgBubble.className = `chat-message ${sender}`;
  msgBubble.innerHTML = `<p>${text}</p>`;

  container.appendChild(msgBubble);
  // Scroll down chat window
  container.scrollTop = container.scrollHeight;
}

function generateAIStylistReply(query) {
  const lower = query.toLowerCase();

  if (lower.includes('dinner') || lower.includes('outfit')) {
    return 'For an upcoming dinner event, I suggest pairing your tailored cashmeres. Wear the Sand Overcoat over your Charcoal Turtleneck and Slim Trousers. This elongates your rectangular body frame elegantly while maintaining a minimalist Zara aesthetic.';
  }
  if (lower.includes('hair') || lower.includes('curly') || lower.includes('face')) {
    return 'Based on your face shape scans, you have an Oval Face contour structure. Oval shapes are highly versatile. A Textured Crop haircut complements your facial proportions perfectly. Keep sides tapered with soft layers on top.';
  }
  if (lower.includes('color') || lower.includes('rose') || lower.includes('sage')) {
    return 'Your skin tone analysis categorizes you in the Neutral-Light season. Soft dusty rose, sage green, and charcoal tones harmonize with your skin pigments, avoiding washout. Neutral grey offsets these nicely.';
  }
  if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hello! I am ready to review outfits, consult on haircuts, suggest color combinations, or calibrate styling layers. What are we styling today?';
  }

  return 'Interesting style query! Our AI algorithms recommend layering coats with slim cropped bottoms to optimize rectangular silhouettes. Would you like to review matching items in your Virtual Wardrobe?';
}

/**
 * 7. Simulated search filtration
 */
function initDashboardSearch() {
  const searchInput = document.getElementById('dashboard-search');
  const resultsDropdown = document.getElementById('search-results');

  if (!searchInput || !resultsDropdown) return;

  searchInput.addEventListener('input', () => {
    const val = searchInput.value.trim().toLowerCase();
    
    if (val.length === 0) {
      resultsDropdown.style.display = 'none';
      return;
    }

    resultsDropdown.style.display = 'block';
    
    // Simulate filtered items
    const searchableItems = [
      { name: 'Sand Trench Coat', type: 'Clothing', link: '#pane-clothing' },
      { name: 'Charcoal Turtleneck', type: 'Clothing', link: '#pane-clothing' },
      { name: 'Black Suede Chelsea Boots', type: 'Shoes', link: '#pane-shoes' },
      { name: 'Classic Acetate Sunglasses', type: 'Accessories', link: '#pane-accessories' },
      { name: 'Modern Textured Crop Cut', type: 'Hairstyles', link: '#pane-hairstyles' }
    ];

    const matches = searchableItems.filter(item => item.name.toLowerCase().includes(val));

    if (matches.length > 0) {
      let resultsHTML = '';
      matches.forEach(item => {
        resultsHTML += `
          <div class="search-result-item" onclick="document.getElementById('dashboard-search').value='${item.name}'; document.getElementById('search-results').style.display='none'; alert('Scrolling to ${item.name}...');">
            <span class="search-result-badge" style="background:var(--color-secondary-light); font-size:0.75rem; padding: 2px 8px; border-radius:10px; color:var(--color-primary); font-weight:600;">${item.type}</span>
            <span class="search-result-name">${item.name}</span>
          </div>
        `;
      });
      resultsDropdown.innerHTML = resultsHTML;
    } else {
      resultsDropdown.innerHTML = `<p class="search-no-results">No items match "${searchInput.value}". Try "Coat", "Boots", or "Sunglasses".</p>`;
    }
  });

  // Close search results dropdown clicking out
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar-container')) {
      resultsDropdown.style.display = 'none';
    }
  });
}
