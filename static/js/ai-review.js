/**
 * Zivra AI Outfit Review Page Interactions
 * 
 * Includes:
 * 1. Global Navigation Dropdowns (Notifications & Profile)
 * 2. File Uploading & Success Panel Swap
 * 3. Image Workspace adjustments, Scanner sweeping & Fullscreen Modal
 * 4. Interactive Zivra Stylist Chat Widget (prompt chips, typing effects, scrolling)
 * 5. Dynamic Mock Data Renderer (Consolidated Cards & AI Summary Card)
 * 6. Historical Review Quick Reloader
 */

document.addEventListener('DOMContentLoaded', () => {
  initDropdownPanels();
  initUploadEngine();
  initWorkspaceControls();
  // initChatWidget();
  initPreviousReviews();
  initActionButtons();
});

/* =============================================================
   1. NAVIGATION DROPDOWNS
   ============================================================= */
function initDropdownPanels() {
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

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

  const clearNotifBtn = document.querySelector('.btn-clear-notifications');
  if (clearNotifBtn) {
    clearNotifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
      });
      const badge = document.querySelector('.notification-badge');
      if (badge) badge.style.display = 'none';
      alert('All notifications marked as read.');
    });
  }

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


/* =============================================================
   2. IMAGE UPLOAD & SUCCESS STATE ENGINE
   ============================================================= */
let currentFile = null;
let currentZoom = 1;
let currentRotation = 0;
let activeTemplateId = 'new-upload';

function initUploadEngine() {
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('file-input');
  const browseBtn = document.getElementById('browse-btn');

  const successAnalyzeBtn = document.getElementById('success-analyze-btn');
  const changeImageBtn = document.getElementById('change-image-btn');

  if (!dropzone || !fileInput) return;

  // Trigger file picker
  if (browseBtn) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag over animations
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');

    if (e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileSelection(fileInput.files[0]);
    }
  });

  // Success state buttons
  if (successAnalyzeBtn) {
    successAnalyzeBtn.addEventListener('click', () => {
      triggerAISimulation();
    });
  }

  if (changeImageBtn) {
    changeImageBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }
}

function handleFileSelection(file) {
  if (!file.type.match('image.*')) {
    alert('Please upload a valid image file (JPG, PNG, or WEBP).');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds the 10MB limit.');
    return;
  }

  currentFile = file;

  // Update success state labels
  const filenameEl = document.getElementById('success-filename');
  if (filenameEl) {
    filenameEl.textContent = file.name;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    displayImagePreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function displayImagePreview(imageSrc) {
  const initialPanel = document.getElementById('upload-initial-state');
  const successPanel = document.getElementById('upload-success-state');

  const emptyState = document.getElementById('empty-preview-state');
  const imgElement = document.getElementById('preview-img');
  const toolbar = document.getElementById('preview-toolbar');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsContainer = document.getElementById('results-container');
  const loadingCard = document.getElementById('loading-card');

  // Hide scanner overlays on new upload load
  toggleScannerOverlays(false);
  toggleScannerLine(false);

  // Clear previous transformation states
  currentZoom = 1;
  currentRotation = 0;
  applyImageTransformations();

  // Reset display layers
  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (loadingCard) loadingCard.classList.add('hidden');

  // Swap Left Sidebar Upload Panels
  if (initialPanel) initialPanel.classList.add('hidden');
  if (successPanel) successPanel.classList.remove('hidden');

  // Show Workspace Previews
  if (emptyState) emptyState.classList.add('hidden');
  if (imgElement) {
    imgElement.src = imageSrc;
    imgElement.classList.remove('hidden');
  }
  if (toolbar) toolbar.classList.remove('hidden');
  if (analyzeBtn) analyzeBtn.classList.remove('hidden');

  // Smooth scroll view into Workspace preview
  document.getElementById('preview-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
}


/* =============================================================
   3. WORKSPACE CONTROLS & FASHION SCANNER MODAL
   ============================================================= */
function initWorkspaceControls() {
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const rotateBtn = document.getElementById('rotate-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  const replaceBtn = document.getElementById('replace-image-btn');
  const analyzeBtn = document.getElementById('analyze-btn');

  // Fullscreen modal elements
  const modal = document.getElementById('fullscreen-modal');
  const modalImg = document.getElementById('modal-preview-img');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentZoom < 2.5) {
        currentZoom += 0.15;
        applyImageTransformations();
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (currentZoom > 0.5) {
        currentZoom -= 0.15;
        applyImageTransformations();
      }
    });
  }

  if (rotateBtn) {
    rotateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentRotation = (currentRotation + 90) % 360;
      applyImageTransformations();
    });
  }

  // Fullscreen triggers
  const openModal = () => {
    const mainImg = document.getElementById('preview-img');
    if (mainImg && mainImg.src && modal && modalImg) {
      modalImg.src = mainImg.src;
      modal.classList.remove('hidden');
    }
  };

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });
  }

  const mainImgEl = document.getElementById('preview-img');
  if (mainImgEl) {
    mainImgEl.addEventListener('click', () => {
      openModal();
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  if (replaceBtn) {
    replaceBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      resetWorkspace();
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      triggerAISimulation();
    });
  }
}

function applyImageTransformations() {
  const imgElement = document.getElementById('preview-img');
  if (imgElement) {
    imgElement.style.transform = `scale(${currentZoom}) rotate(${currentRotation}deg)`;
  }
}

function toggleScannerLine(show) {
  const line = document.getElementById('scanner-sweep-line');
  if (line) {
    if (show) line.classList.remove('hidden');
    else line.classList.add('hidden');
  }
}

function toggleScannerOverlays(show) {
  const tags = document.querySelectorAll('.scanner-tag');
  tags.forEach(t => {
    if (show) t.classList.remove('hidden');
    else t.classList.add('hidden');
  });
}

function resetWorkspace() {
  currentFile = null;
  currentZoom = 1;
  currentRotation = 0;

  const initialPanel = document.getElementById('upload-initial-state');
  const successPanel = document.getElementById('upload-success-state');

  const emptyState = document.getElementById('empty-preview-state');
  const imgElement = document.getElementById('preview-img');
  const toolbar = document.getElementById('preview-toolbar');
  const analyzeBtn = document.getElementById('analyze-btn');
  const resultsContainer = document.getElementById('results-container');
  const loadingCard = document.getElementById('loading-card');
  const fileInput = document.getElementById('file-input');

  toggleScannerOverlays(false);
  toggleScannerLine(false);

  if (fileInput) fileInput.value = '';
  if (imgElement) {
    imgElement.src = '';
    imgElement.classList.add('hidden');
    imgElement.style.transform = 'none';
  }

  // Swap Left Sidebar Panels Back
  if (initialPanel) initialPanel.classList.remove('hidden');
  if (successPanel) successPanel.classList.add('hidden');

  if (emptyState) emptyState.classList.remove('hidden');
  if (toolbar) toolbar.classList.add('hidden');
  if (analyzeBtn) analyzeBtn.classList.add('hidden');
  if (resultsContainer) resultsContainer.classList.add('hidden');
  if (loadingCard) loadingCard.classList.add('hidden');
}


/* =============================================================
   4. CHAT WITH ZIVRA STYLIST WIDGET
   ============================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initRealChatWidget();
});

function initRealChatWidget() {
  const chatForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-message-input');
  const chatHistory = document.getElementById('chat-history-track');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const toggleBtn = document.getElementById('stylist-toggle-btn');
  const minimizeBtn = document.getElementById('chat-minimize-btn');
  const chatWindow = document.getElementById('stylist-chat-window');

  if (!chatInput || !chatForm || !chatHistory) return;

  // Toggle Window visibility
  if (toggleBtn && chatWindow) {
    toggleBtn.addEventListener('click', () => {
      chatWindow.classList.toggle('active');
    });
  }
  if (minimizeBtn && chatWindow) {
    minimizeBtn.addEventListener('click', () => {
      chatWindow.classList.remove('active');
    });
  }

  const handleMessageSubmission = async (text) => {
    if (!text.trim()) return;

    // 1. Append User Message to UI
    appendMessageToUI(text, 'user');
    chatInput.value = '';
    scrollChatToBottom();

    // 2. Show Typing Status
    if (typingIndicator) typingIndicator.classList.remove('hidden');
    scrollChatToBottom();

    try {
      // 3. Request Advice from Django
      const response = await fetch('/ai-review/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      if (typingIndicator) typingIndicator.classList.add('hidden');

      if (response.ok && data.reply) {
        appendMessageToUI(data.reply, 'bot');
      } else {
        appendMessageToUI("My apologies, I ran into a connection error. Let's try again.", 'bot');
      }
    } catch (err) {
      console.error(err);
      if (typingIndicator) typingIndicator.classList.add('hidden');
      appendMessageToUI("Error reaching the styling engine. Please check your connection.", 'bot');
    }
    scrollChatToBottom();
  };

  // Submit Handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleMessageSubmission(chatInput.value);
  });

  // Prompt Chips Handlers
  promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question');
      handleMessageSubmission(question);
    });
  });

  function appendMessageToUI(text, sender) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = `chat-message ${sender}`;

    // Convert markdown asterisks to HTML strong tags safely
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    bubbleWrapper.innerHTML = `<p>${cleanText}</p>`;
    chatHistory.appendChild(bubbleWrapper);
  }

  function scrollChatToBottom() {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (chatMessagesContainer) {
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
  }
}

function getFormattedTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

function appendChatMessage(text, sender) {
  const chatHistory = document.getElementById('chat-history-track');
  const typingIndicator = document.getElementById('chat-typing-indicator');
  if (!chatHistory) return;

  const container = document.createElement('div');
  container.className = `chat-bubble-container ${sender === 'user' ? 'user-container' : 'bot-container'}`;

  container.innerHTML = `
    <div class="chat-bubble ${sender === 'user' ? 'user-message' : 'bot-message'}">
      <p>${text}</p>
    </div>
    <span class="chat-timestamp">${getFormattedTime()}</span>
  `;

  // Insert before typing indicator
  if (typingIndicator) {
    chatHistory.insertBefore(container, typingIndicator);
  } else {
    chatHistory.appendChild(container);
  }
}

function scrollChatBottom() {
  const chatHistory = document.getElementById('chat-history-track');
  if (chatHistory) {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }
}

function triggerBotResponse(userMsg) {
  const typingIndicator = document.getElementById('chat-typing-indicator');
  if (typingIndicator) typingIndicator.classList.remove('hidden');
  scrollChatBottom();

  const query = userMsg.toLowerCase();
  let reply = "That's an interesting fashion inquiry! Regarding your outfit review, I recommend focusing on clean layers and matching leather shoe options to keep the color palette aligned. Let me know if you would like me to curate product storefront links!";

  if (query.includes('improve')) {
    reply = "To raise your style score further, try **slightly tucking in the front waistband** of your shirt to raise your hip visual proportion. Swapping a dark base with light cream tones will also improve color contrast depth!";
  } else if (query.includes('shoes') || query.includes('footwear')) {
    reply = "I highly suggest styling this outfit with **minimalist white leather sneakers** for casual settings. For elevated occasions, a **soft camel suede Chelsea boot** grounds the vertical beige proportions gracefully.";
  } else if (query.includes('accessor') || query.includes('watch') || query.includes('jewelry')) {
    reply = "Add a **silver round dial watch** with a black leather strap. A singular thin silver chain necklace under your collar line adds a touch of high-street premium elegance without looking cluttered.";
  } else if (query.includes('interview') || query.includes('work') || query.includes('office')) {
    reply = "This structured beige-blazer look is excellent for **creative or tech interviews**. For traditional corporate interviews, simply swap the sneakers with brown leather loafers and keep the blazer buttoned.";
  } else if (query.includes('hair') || query.includes('groom')) {
    reply = "A **textured low-fade crop** or a **natural wave side part** would match this modern minimalist look. Keep it clean using water-based pomade for a refined matte texture finish.";
  } else if (query.includes('blazer') || query.includes('color blazer')) {
    reply = "For this outfit, I suggest a **beige or stone grey blazer** to maintain the soft minimalist gradient. If you want a bolder look, a **charcoal blazer** will provide beautiful contrast while keeping the palette luxury and balanced.";
  }

  // Simulate typing delay
  setTimeout(() => {
    if (typingIndicator) typingIndicator.classList.add('hidden');
    appendChatMessage(reply, 'bot');
    scrollChatBottom();
  }, 1600);
}


/* =============================================================
   5. SIMULATED AI ENGINE & MOCK DATA TEMPLATES
   ============================================================= */
const mockReviewTemplates = {
  'past-1': {
    score: 88,
    verdict: "A highly stylish combination! The earthy beige structures align well with your athletic shoulders. Contrast could be improved slightly by introducing white elements at the waist or neck layers.",
    tags: ["Earth Tone Master", "Polished Fit"],
    breakdown: [
      { name: "Fit & Silhouette", val: 86, sub: "Well proportioned structured shoulders" },
      { name: "Color Harmony", val: 92, sub: "Earthy hues match well together" },
      { name: "Style Match", val: 88, sub: "Contemporary preppy smart-casual" },
      { name: "Occasion Suitability", val: 85, sub: "Perfect for date days and cafes" },
      { name: "Accessories", val: 80, sub: "Needs a brown leather strap watch" }
    ],
    suggestions: [
      { text: "Swap darker base tee for an off-white silk shirt", icon: "shirt" },
      { text: "Add a gold-tone minimalist bracelet to match watch accents", icon: "watch" },
      { text: "Roll up blazer cuffs slightly for relaxed visual relief", icon: "adjust" }
    ],
    occasions: [
      { name: "Casual Outings", val: 95, match: "high" },
      { name: "Date Night", val: 88, match: "high" },
      { name: "Creative Office", val: 80, match: "high" },
      { name: "Vacation Resorts", val: 72, match: "medium" },
      { name: "Wedding Guest", val: 40, match: "low" }
    ],
    seasons: [
      { name: "Autumn Alignment", val: 94, active: true },
      { name: "Spring Suitability", val: 85, active: false },
      { name: "Summer Ease", val: 65, active: false },
      { name: "Winter Layering", val: 78, active: false }
    ],
    colors: {
      detected: [
        { name: "Muted Beige", hex: "#C8AD90" },
        { name: "Dull Tan", hex: "#A8896C" },
        { name: "Charcoal", hex: "#32353B" }
      ],
      comp: [
        { name: "Sage Green", hex: "#8A9A86" },
        { name: "Camel", hex: "#B88E64" },
        { name: "Soft Cream", hex: "#F3EFE9" }
      ]
    },
    bodyShape: {
      type: "Athletic / Rectangle",
      desc: "The structured crop cut of this top cuts off nicely, adding horizontal width across your chest to create visual muscle alignment."
    },
    skinTone: {
      type: "Medium Warm / Golden",
      hex: "#D8B48F",
      desc: "Gold warm undertones glow spectacularly when matched with sandy browns and dark charcoals. Avoid washed-out pastels."
    },
    // Scanner Overlays
    scannerTags: {
      top: "Top: Cropped Beige Coat (86%)",
      bottom: "Bottom: Grey Chino (89%)",
      shoes: "Shoes: Brown Chelsea Boot (91%)",
      accessories: "Accessory: Leather Dial (80%)",
      body: "Body Shape: Rectangle Athletic",
      skin: "Skin: Warm Medium",
      style: "Style: Preppy Smart-Casual"
    },
    // AI Summary
    summary: {
      strengths: [
        "Warm earth-tones flow nicely into the chocolate canvas underlay.",
        "Tailored jacket shoulder seams align perfectly with your frame.",
        "Excellent visual contrast between trouser weights."
      ],
      improve: [
        "Trouser cuffs are slightly bunched. Roll up once or tailor by 1 inch.",
        "Include a lighter cream element at the collar to break the heavy dark core."
      ],
      occasions: ["Casual Cafe", "Intimate Date", "Creative Workspace"],
      personality: ["Smart Casual", "Minimalist"],
      confidence: 88
    }
  },
  'past-2': {
    score: 94,
    verdict: "Stunning monochromatic elegance! Excellent draping and premium minimalist coordination. The contrast between texture weight is outstanding. An absolute style success.",
    tags: ["Avant Garde Minimalist", "Perfect Draping"],
    breakdown: [
      { name: "Fit & Silhouette", val: 96, sub: "Relaxed oversized cut drape is flawless" },
      { name: "Color Harmony", val: 95, sub: "High contrast monochrome color block" },
      { name: "Style Match", val: 94, sub: "Luxury high-street streetwear style" },
      { name: "Occasion Suitability", val: 90, sub: "Excellent for fashion events and gallery days" },
      { name: "Accessories", val: 88, sub: "Minimalist silver necklaces suit collar lines" }
    ],
    suggestions: [
      { text: "Keep the trousers tapered to maintain high-rise posture", icon: "check" },
      { text: "Add a structured black leather messenger bag", icon: "bag" },
      { text: "Pair with black chunky derbies to anchor oversized proportions", icon: "shoes" }
    ],
    occasions: [
      { name: "Creative Office", val: 92, match: "high" },
      { name: "Date Night", val: 95, match: "high" },
      { name: "Fashion Gala / Party", val: 96, match: "high" },
      { name: "Casual Outings", val: 88, match: "high" },
      { name: "Traditional Wedding", val: 30, match: "low" }
    ],
    seasons: [
      { name: "Winter Layering", val: 96, active: true },
      { name: "Autumn Alignment", val: 92, active: false },
      { name: "Spring Suitability", val: 70, active: false },
      { name: "Summer Ease", val: 35, active: false }
    ],
    colors: {
      detected: [
        { name: "Pure Black", hex: "#111111" },
        { name: "Asphalt Grey", hex: "#5C6067" },
        { name: "Stark White", hex: "#FDFDFD" }
      ],
      comp: [
        { name: "Cognac Leather", hex: "#8F4E24" },
        { name: "Ice Blue", hex: "#D6E5EF" },
        { name: "Slate Grey", hex: "#8A94A0" }
      ]
    },
    bodyShape: {
      type: "Inverted Triangle",
      desc: "Wide shoulder seams drop gracefully, creating a relaxed drape that balances broader upper structures seamlessly."
    },
    skinTone: {
      type: "Fair Cool / Pinkish",
      hex: "#F1D3C4",
      desc: "Stark black and white provides a high-contrast backing that brings out your natural cheek highlight tones perfectly."
    },
    // Scanner Overlays
    scannerTags: {
      top: "Top: Oversized Coat (96%)",
      bottom: "Bottom: Drape Wide Trousers (94%)",
      shoes: "Shoes: Chunky Leather Derbies (90%)",
      accessories: "Accessory: Silver Choker (88%)",
      body: "Body Shape: Inverted Triangle",
      skin: "Skin: Fair Cool",
      style: "Style: Avant-Garde Minimal"
    },
    // AI Summary
    summary: {
      strengths: [
        "Outstanding monochrome color block execution.",
        "Fabric weights create visual depth and motion while walking.",
        "High-contrast grey mid-tones tie the outfit colors together."
      ],
      improve: [
        "Avoid adding brown elements; stick to black leather for bag coordinates.",
        "Keep shirt cuffs unrolled to match the clean aesthetic sleeve drape."
      ],
      occasions: ["Art Exhibition", "Fashion Show", "Night Out", "Creative Office"],
      personality: ["Streetwear", "Avant-Garde", "Minimalist"],
      confidence: 95
    }
  },
  'past-3': {
    score: 85,
    verdict: "Great summer silhouette but is slightly color-washed. The linen shirt matches the shape nicely but the pastel wash tones dilute your skin complexion. Bold accents would elevate the style.",
    tags: ["Relaxed Summer", "Needs Accent Contrast"],
    breakdown: [
      { name: "Fit & Silhouette", val: 88, sub: "Breathable loose linen hangs gracefully" },
      { name: "Color Harmony", val: 78, sub: "Pastel palette is slightly too washed-out" },
      { name: "Style Match", val: 84, sub: "Resort casual and beach chic" },
      { name: "Occasion Suitability", val: 92, sub: "Superb for vacation and beach dining" },
      { name: "Accessories", val: 82, sub: "Straw hats and tortoise shell sunglasses suggested" }
    ],
    suggestions: [
      { text: "Roll up sleeves past elbows to expose forearms", icon: "adjust" },
      { text: "Wear a dark brown braided belt for vertical separation", icon: "check" },
      { text: "Swap white shorts for navy blue linen shorts", icon: "refresh" }
    ],
    occasions: [
      { name: "Vacation / Resort", val: 98, match: "high" },
      { name: "Beach Club Party", val: 90, match: "high" },
      { name: "Casual Outings", val: 85, match: "high" },
      { name: "Date Night", val: 70, match: "medium" },
      { name: "Formal Office", val: 20, match: "low" }
    ],
    seasons: [
      { name: "Summer Ease", val: 98, active: true },
      { name: "Spring Suitability", val: 80, active: false },
      { name: "Autumn Alignment", val: 45, active: false },
      { name: "Winter Layering", val: 10, active: false }
    ],
    colors: {
      detected: [
        { name: "Pastel Sky", hex: "#A5C6DC" },
        { name: "Sandy Ivory", hex: "#EADCC9" },
        { name: "Chalk White", hex: "#F7F5F0" }
      ],
      comp: [
        { name: "Navy Blue", hex: "#1A2E40" },
        { name: "Terracotta", hex: "#D67D65" },
        { name: "Olive Green", hex: "#556B2F" }
      ]
    },
    bodyShape: {
      type: "Oval / Round Shape",
      desc: "Vertical fold lines in linen shirts draw vertical sight lines, visually slimming and elongating center profiles."
    },
    skinTone: {
      type: "Tan / Warm Undertone",
      hex: "#C68E62",
      desc: "Tan bronze complexions require darker contrasting bases like navy or chocolate to avoid blending into sandy beige."
    },
    // Scanner Overlays
    scannerTags: {
      top: "Top: Linen Sky Shirt (88%)",
      bottom: "Bottom: Sandy Shorts (80%)",
      shoes: "Shoes: White Canvas Loafers (82%)",
      accessories: "Accessory: Woven Straw Hat (85%)",
      body: "Body Shape: Oval Profile",
      skin: "Skin: Tan Warm",
      style: "Style: Summer Resort Casual"
    },
    // AI Summary
    summary: {
      strengths: [
        "Superb choice of breathable loose-weave linen.",
        "Proportions visually elongate oval waistlines using open collar cuts.",
        "Resort casual theme aligns well with vacation settings."
      ],
      improve: [
        "Sandy ivory shorts blend too much with tan skin tones. Swap with navy blue shorts.",
        "Add tortoise shell sunglasses to pull visual focus upwards."
      ],
      occasions: ["Beach Resort", "Yacht Dining", "Tropical Cafe"],
      personality: ["Resort Casual", "Old Money"],
      confidence: 82
    }
  },
  'new-upload': {
    score: 92,
    verdict: "Excellent styling choices! This outfit complements your body proportions perfectly. The soft pink gradients and structured shapes offer a high-fashion, elegant silhouette that feels extremely premium.",
    tags: ["Zara Inspired", "Balanced Proportions", "Luxury Accent"],
    breakdown: [
      { name: "Fit & Silhouette", val: 92, sub: "Balanced shoulder-to-hip alignment" },
      { name: "Color Harmony", val: 94, sub: "Pink gradient accents pair elegantly" },
      { name: "Style Match", val: 90, sub: "Apple-like premium luxury aesthetic" },
      { name: "Occasion Suitability", val: 95, sub: "Extremely versatile across high-end events" },
      { name: "Accessories", val: 88, sub: "Silver jewelry matches neutral underlays" }
    ],
    suggestions: [
      { text: "Try white leather sneakers to anchor casual outings", icon: "shoes" },
      { text: "Add a beige relaxed blazer to elevate shoulder lines", icon: "shirt" },
      { text: "Wear a minimalist silver watch as an accent", icon: "watch" },
      { text: "Use minimal accessories to avoid cluttering", icon: "check" },
      { text: "Tuck in the inner linen tee to raise hip proportions", icon: "adjust" }
    ],
    occasions: [
      { name: "Casual Dinings", val: 98, match: "high" },
      { name: "Date Night", val: 94, match: "high" },
      { name: "High Street Fashion", val: 90, match: "high" },
      { name: "Creative Office", val: 86, match: "high" },
      { name: "Summer Wedding", val: 65, match: "medium" }
    ],
    seasons: [
      { name: "Spring Suitability", val: 95, active: true },
      { name: "Summer Ease", val: 90, active: false },
      { name: "Autumn Alignment", val: 82, active: false },
      { name: "Winter Layering", val: 70, active: false }
    ],
    colors: {
      detected: [
        { name: "Soft Pink", hex: "#FFD6E8" },
        { name: "Rose Accent", hex: "#FF4F9A" },
        { name: "Ivory Silk", hex: "#FAF9F6" }
      ],
      comp: [
        { name: "Sage Green", hex: "#8FBC8F" },
        { name: "Champagne Gold", hex: "#F7E7CE" },
        { name: "Charcoal Grey", hex: "#36454F" }
      ]
    },
    bodyShape: {
      type: "Hourglass / Rectangle",
      desc: "High waist tailoring and structured shoulder accents trace natural contours while defining core structural outlines."
    },
    skinTone: {
      type: "Medium Warm / Peach",
      hex: "#E6C29E",
      desc: "Soft rose and coral pink tones create healthy contrast overlays that illuminate warm undertones."
    },
    // Scanner Overlays
    scannerTags: {
      top: "Top: Rose Silk Knit (92%)",
      bottom: "Bottom: Structured Chino (90%)",
      shoes: "Shoes: White Leather Sneaker (94%)",
      accessories: "Accessory: Minimalist Silver Ring (88%)",
      body: "Body Shape: Hourglass / Rect",
      skin: "Skin: Warm Peach",
      style: "Style: Luxury High Street"
    },
    // AI Summary
    summary: {
      strengths: [
        "Rose accent tones add vibrant freshness that highlights warm complexions.",
        "Perfect visual weight balance between sneakers and crop top margins.",
        "Minimal accessories prevent visual crowding."
      ],
      improve: [
        "Gently fold the blazer cuffs back 1 inch to exhibit silver wrist accents.",
        "Blazer linen hem should sit exactly 2 inches below the belt line."
      ],
      occasions: ["Creative Office", "Date Night", "High-End Dinings", "Casual Cafe"],
      personality: ["Smart Casual", "Zara Inspired", "Minimalist"],
      confidence: 92
    }
  }
};

// Global state variables to hold data
let lastAnalysisData = null;
let savedReviewId = null;
let activeAnalysisPromise = null; // Holds the background network request

function triggerAISimulation() {
  const previewCard = document.getElementById('preview-card');
  const loadingCard = document.getElementById('loading-card');
  const resultsContainer = document.getElementById('results-container');
  const analyzeBtn = document.getElementById('analyze-btn');

  if (!loadingCard || !previewCard) return;

  // Swap sections visually
  if (analyzeBtn) analyzeBtn.classList.add('hidden');
  loadingCard.classList.remove('hidden');
  if (resultsContainer) resultsContainer.classList.add('hidden');

  toggleScannerLine(true);
  toggleScannerOverlays(false);

  loadingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // 1. CRITICAL OPTIMIZATION: Fire off the Gemini network request immediately in the background
  activeAnalysisPromise = fetch("/ai-review/analyze/", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "X-CSRFToken": getCookie("csrftoken")
    },
    body: new FormData(document.getElementById('upload-form') || undefined) // Adjusted for your file state
  }).then(res => {
    if (!res.ok) throw new Error("Gemini Analysis Failed");
    return res.json();
  });

  // Artificial progress steps for user perception
  const steps = [
    { id: 'load-step-1', text: 'Analyzing Silhouette & Fit...', duration: 600 },
    { id: 'load-step-2', text: 'Detecting Color Palette Harmony...', duration: 600 },
    { id: 'load-step-3', text: 'Analyzing Body Type Suitability...', duration: 600 },
    { id: 'load-step-4', text: 'Checking Current Fashion Trends...', duration: 600 },
    { id: 'load-step-5', text: 'Generating Stylist Suggestions...', duration: 600 }
  ];

  let currentStepIndex = 0;
  const statusTitle = document.getElementById('loading-status-text');

  function runNextStep() {
    if (currentStepIndex > 0) {
      const prevStep = document.getElementById(steps[currentStepIndex - 1].id);
      if (prevStep) {
        prevStep.classList.remove('active');
        prevStep.classList.add('completed');
      }
    }

    if (currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      const curStepRow = document.getElementById(step.id);
      if (curStepRow) curStepRow.classList.add('active');
      if (statusTitle) statusTitle.textContent = step.text;

      currentStepIndex++;
      setTimeout(runNextStep, step.duration);
    } else {
      // All UI steps complete, now await the background network response
      completeAnalysisSequence();
    }
  }

  // Reset UI step classes
  steps.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) el.classList.remove('active', 'completed');
  });
  
  if (document.getElementById(steps[0].id)) {
    document.getElementById(steps[0].id).classList.add('active');
  }

  setTimeout(runNextStep, 200);
}

async function completeAnalysisSequence() {
  const loadingCard = document.getElementById("loading-card");
  const resultsContainer = document.getElementById("results-container");
  const statusTitle = document.getElementById('loading-status-text');

  try {
    if (statusTitle) statusTitle.textContent = "Finalizing style diagnostics...";
    
    // Await the background network request that started at step 1
    const data = await activeAnalysisPromise;
    
    lastAnalysisData = data;

    // Remove loader, show results
    if (loadingCard) loadingCard.classList.add("hidden");
    if (resultsContainer) {
      resultsContainer.classList.remove("hidden");
      displayGeminiResult(data);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "An error occurred during verification.");
    if (loadingCard) loadingCard.classList.add("hidden");
  }
}

function getCookie(name) {
  let cookieValue = null;

  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();

      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(
          cookie.substring(name.length + 1)
        );
        break;
      }
    }
  }

  return cookieValue;
}
async function analyzeWithGemini() {
  if (!currentFile) {
    alert("Please upload an image.");
    return;
  }

  const formData = new FormData();
  formData.append("image", currentFile);

  try {
    const response = await fetch("/ai-review/analyze/", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: formData
    });

    // Convert response to JSON
    const data = await response.json();
    
    if (response.ok) {
      lastAnalysisData = data; // Captures the model response structure for saving
      displayGeminiResult(data);
    }
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || "Gemini Analysis Failed");
    }

    // --- CRITICAL FIX FOR IMMEDIATE DISPLAY ---
    // Forcefully hide the loader and reveal the results right here
    const loadingCard = document.getElementById("loading-card");
    const resultsContainer = document.getElementById("results-container");

    if (loadingCard) loadingCard.classList.add("hidden");
    if (resultsContainer) {
      resultsContainer.classList.remove("hidden");
      // Smoothly scroll the user down to view the incoming data
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Render the data fields
    // displayGeminiResult(data);

  } catch (err) {
    console.error(err);
    alert(err.message);
    // Safe fallback to restore workspace UI if it crashes
    const loadingCard = document.getElementById("loading-card");
    if (loadingCard) loadingCard.classList.add("hidden");
  }
}


/* =============================================================
   6. DATA RENDERER & SCORE ANIMATOR (Consolidated Cards)
   ============================================================= */
/* =============================================================
   6. DATA RENDERER & SCORE ANIMATOR (Consolidated Cards)
   ============================================================= */
// Define global application state variables at clean scope

function displayGeminiResult(data) {
  // Score Metric Displays
  const scoreDisplay = document.getElementById("score-number-display");
  const scoreVerdict = document.getElementById("score-verdict");
  const overallReview = document.getElementById("overall-review-text");

  if (scoreDisplay) scoreDisplay.textContent = data.style_score || data.score || 0;
  if (scoreVerdict) scoreVerdict.textContent = data.verdict || "";
  if (overallReview) overallReview.textContent = data.overall_review || data.verdict || "";

  // Style Tags Injection
  const tagContainer = document.getElementById("style-tag");
  if (tagContainer) {
    tagContainer.innerHTML = "";
    const tags = data.style_tags || data.tags || [];
    tags.forEach(tag => {
      tagContainer.innerHTML += `<span class="stylist-tag">${tag}</span>`;
    });
  }

  // Breakdown List Structure 
  const breakdown = document.getElementById("breakdown-list");
  if (breakdown) {
    breakdown.innerHTML = "";
    const breakdownArray = data.analysis_breakdown || data.breakdown || [];
    breakdownArray.forEach(item => {
      // Handle either Gemini python snake_case response syntax or static templates layout fallback
      const title = item.title || item.name || "";
      const description = item.description || item.sub || "";
      const score = item.score !== undefined ? item.score : (item.val || 0);

      breakdown.innerHTML += `
        <div class="breakdown-row">
            <div class="breakdown-header">
                <div class="breakdown-name-sub">
                    <span class="breakdown-label">${title}</span>
                    <span class="breakdown-subtext">${description}</span>
                </div>
                <span class="breakdown-score">${score}%</span>
            </div>
            <div class="progress-bar-track">
                <div class="progress-bar-fill" style="width: ${score}%"></div>
            </div>
        </div>
      `;
    });
  }

  // Recommendations Grid
  const recommendations = document.getElementById("suggestions-grid");
  if (recommendations) {
    recommendations.innerHTML = "";
    const recsArray = data.recommendations || data.suggestions || [];
    recsArray.forEach(item => {
      const textValue = typeof item === 'object' ? item.text : item;
      recommendations.innerHTML += `
        <div class="suggestion-item">
            <div class="suggestion-icon-check">✓</div>
            <div class="suggestion-content-text">${textValue}</div>
        </div>
      `;
    });
  }

  // Occasion Suitability Structure
  const occasionBox = document.getElementById("occasion-list");
  if (occasionBox) {
    occasionBox.innerHTML = "";
    const occasionsArray = data.occasion_suitability || data.occasions || [];
    occasionsArray.forEach(item => {
      const occasionName = item.occasion || item.name || "";
      const matchScore = item.match !== undefined ? (typeof item.match === 'number' ? item.match : (item.match === 'high' ? 90 : 50)) : (item.val || 0);

      let matchStatus = "low";
      if (matchScore >= 85) matchStatus = "high";
      else if (matchScore >= 60) matchStatus = "medium";

      occasionBox.innerHTML += `
        <div class="occasion-item">
            <div class="occasion-header">
                <span class="occasion-name">${occasionName}</span>
                <span class="occasion-percentage status-${matchStatus}">${matchScore}% Match</span>
            </div>
            <div class="occasion-track">
                <div class="occasion-fill status-${matchStatus}" style="width: ${matchScore}%"></div>
            </div>
        </div>
      `;
    });
  }

  // FIXED: Body Shape Metadata Normalizer
  const bodyShapeType = document.getElementById("body-shape-type");
  const bodyShapeDesc = document.getElementById("body-shape-desc");
  const bodyData = data.body_shape || data.bodyShape;
  if (bodyData) {
    if (bodyShapeType) bodyShapeType.textContent = bodyData.type || "";
    if (bodyShapeDesc) bodyShapeDesc.textContent = bodyData.description || bodyData.desc || "";
  }

  // FIXED: Skin Tone Metadata Normalizer
  const skinToneType = document.getElementById("skin-tone-type");
  const skinToneDesc = document.getElementById("skin-tone-desc");
  const skinData = data.skin_tone || data.skinTone;
  if (skinData) {
    if (skinToneType) skinToneType.textContent = skinData.type || "";
    if (skinToneDesc) skinToneDesc.textContent = skinData.description || skinData.desc || "";
  }

  // Animate Gauge if available
  const finalScore = data.style_score || data.score || 0;
  animateScoreGauge(finalScore);

  // Render extra context cards if sent down from pipeline
  if (data.summary) {
    renderAISummaryCard(data.summary);
  }
  if (data.scannerTags) {
    updateScannerOverlays(data.scannerTags);
  }

  // CRITICAL: Re-initialize the active button listeners onto the newly rendered viewport!
  initActionButtons();
}

function renderAISummaryCard(summary) {
  const strengthsList = document.getElementById('summary-strengths-list');
  const improveList = document.getElementById('summary-improve-list');
  const personaTags = document.getElementById('summary-persona-tags');
  const occasionTags = document.getElementById('summary-occasion-tags');
  const confidenceScore = document.getElementById('summary-confidence-score');
  const confidenceFill = document.getElementById('summary-confidence-fill');

  if (!summary) return;

  if (strengthsList) {
    strengthsList.innerHTML = '';
    (summary.strengths || []).forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      strengthsList.appendChild(li);
    });
  }

  if (improveList) {
    improveList.innerHTML = '';
    (summary.improve || []).forEach(i => {
      const li = document.createElement('li');
      li.textContent = i;
      improveList.appendChild(li);
    });
  }

  if (personaTags) {
    personaTags.innerHTML = '';
    (summary.personality || []).forEach((p, idx) => {
      const tag = document.createElement('span');
      tag.className = `tag-pill ${idx === 0 ? 'persona-active' : ''}`;
      tag.textContent = p;
      personaTags.appendChild(tag);
    });
  }

  if (occasionTags) {
    occasionTags.innerHTML = '';
    (summary.occasions || []).forEach(o => {
      const tag = document.createElement('span');
      tag.className = 'tag-pill';
      tag.textContent = o;
      occasionTags.appendChild(tag);
    });
  }

  if (confidenceScore) confidenceScore.textContent = `${summary.confidence || 0}%`;
  if (confidenceFill) confidenceFill.style.width = `${summary.confidence || 0}%`;
}

function updateScannerOverlays(scannerTags) {
  if (!scannerTags) return;
  const topLabel = document.querySelector('#tag-top .scanner-tag-card');
  const bottomLabel = document.querySelector('#tag-bottom .scanner-tag-card');
  const shoesLabel = document.querySelector('#tag-shoes .scanner-tag-card');
  const accLabel = document.querySelector('#tag-accessories .scanner-tag-card');
  const bodyLabel = document.querySelector('#tag-body .scanner-tag-card');
  const skinLabel = document.querySelector('#tag-skin .scanner-tag-card');
  const styleLabel = document.querySelector('#tag-style .scanner-tag-card');

  if (topLabel) topLabel.textContent = scannerTags.top || "";
  if (bottomLabel) bottomLabel.textContent = scannerTags.bottom || "";
  if (shoesLabel) shoesLabel.textContent = scannerTags.shoes || "";
  if (accLabel) accLabel.textContent = scannerTags.accessories || "";
  if (bodyLabel) bodyLabel.textContent = scannerTags.body || "";
  if (skinLabel) skinLabel.textContent = scannerTags.skin || "";
  if (styleLabel) styleLabel.textContent = scannerTags.style || "";

  toggleScannerOverlays(true);
}

function animateScoreGauge(targetScore) {
  const numberDisplay = document.getElementById('score-number-display');
  const circleProgress = document.getElementById('score-circle');
  if (!numberDisplay || !circleProgress) return;

  const circleLength = 440;
  const targetOffset = circleLength - (circleLength * targetScore) / 100;
  circleProgress.style.strokeDashoffset = targetOffset;
  numberDisplay.textContent = targetScore;
}

/* =============================================================
   7. HISTORICAL REVIEWS RELOADER
   ============================================================= */
function initPreviousReviews() {
  const historyItems = document.querySelectorAll('.history-item');
  historyItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      loadHistoryItem(item);
    });
  });
}

function loadHistoryItem(itemElement) {
  const mockId = itemElement.getAttribute('data-mock-id');
  const mockData = mockReviewTemplates[mockId];
  if (!mockData) return;

  const thumbImg = itemElement.querySelector('.history-thumb');
  if (thumbImg) {
    displayImagePreview(thumbImg.src);
    const resultsContainer = document.getElementById('results-container');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingCard = document.getElementById('loading-card');

    if (loadingCard) loadingCard.classList.add('hidden');
    if (analyzeBtn) analyzeBtn.classList.add('hidden');

    if (resultsContainer) {
      resultsContainer.classList.remove('hidden');
      displayGeminiResult(mockData);
      resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/* =============================================================
   8. CLEAN CONSOLIDATED PRODUCTION BUTTON CLICK HANDLERS
   ============================================================= */
function initActionButtons() {
  console.log("Initializing Zivra Action Buttons...");
  const saveBtn = document.getElementById('save-review-btn');
  const shareBtn = document.getElementById('share-review-btn');
  const resetBtn = document.getElementById('reset-review-btn');

  if (saveBtn) {
    // Clone node to safely remove stale/duplicate click bindings
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!lastAnalysisData) {
        alert('Please run an outfit analysis before saving.');
        return;
      }

      try {
        newSaveBtn.disabled = true;
        newSaveBtn.textContent = 'Saving...';

        const response = await fetch('/ai-review/save/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify(lastAnalysisData)
        });

        const result = await response.json();
        if (response.ok && result.success) {
          savedReviewId = result.review_id;
          alert('Success! This review has been saved to your digital Wardrobe Log.');
          newSaveBtn.textContent = '✓ Saved';
        } else {
          throw new Error(result.error || 'Failed to complete save operation.');
        }
      } catch (err) {
        console.error(err);
        alert(`Error: ${err.message}`);
        newSaveBtn.disabled = false;
        newSaveBtn.innerHTML = `Save Review`;
      }
    });
  }

  if (shareBtn) {
    const newShareBtn = shareBtn.cloneNode(true);
    shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);

    newShareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const shareUrl = savedReviewId 
        ? `${window.location.origin}/ai-review/share/${savedReviewId}/`
        : window.location.href;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => alert('Style Review link copied to clipboard!'))
          .catch(() => alert('Review link ready to share: ' + shareUrl));
      } else {
        alert('Review link ready to share: ' + shareUrl);
      }
    });
  }

  if (resetBtn) {
    const newResetBtn = resetBtn.cloneNode(true);
    resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);

    newResetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      lastAnalysisData = null;
      savedReviewId = null;
      resetWorkspace();
      document.getElementById('preview-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}