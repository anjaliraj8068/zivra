/**
 * Zivra Community Feed Interactions
 * 
 * Includes:
 * 1. Mock Data (Outfit posts, Questions, Polls, Sidebar collections)
 * 2. Masonry Feed Renderer
 * 3. Media Carousel Swiper
 * 4. Interactive Poll calculations
 * 5. Comments Modal & CRUD (create, reply, edit, delete)
 * 6. Profile Popover Hover Card
 * 7. Save to Mood Board drawer
 * 8. Search, Filters & Sorting logic
 * 9. Infinite Scroll simulation
 * 10. Post Creation workflow
 */


// Sidebar mock datasets
const trendingHashtags = [
  { tag: '#SageLayering', count: 1204 },
  { tag: '#MinimalistZara', count: 852 },
  { tag: '#ChelseaBoots', count: 642 },
  { tag: '#SummerOutfit', count: 512 }
];

// Session user settings (Charlotte Vane)
const sessionUser = {
  name: 'Charlotte Vane',
  username: '@charlotte_v',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'
};

let currentFilter = 'all';
let currentSort = 'trending';
let activePostIdForComments = null;
let savedImagesBase64 = []; // Temporary holding files preview
let activePostIdForShare = null;
let lightboxImages = [];
let currentLightboxIndex = 0;
// Modal system helpers
function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.style.display = 'flex';
  setTimeout(() => {
    modalEl.classList.add('show');
    document.body.classList.add('modal-open');
  }, 10);
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('show');
  document.body.classList.remove('modal-open');
  setTimeout(() => {
    modalEl.style.display = 'none';
  }, 300);
}

// Toast system helpers
function showToast(message, icon = '✓') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}

// Lightbox logic
function openLightbox(images, startIndex = 0) {
  lightboxImages = images;
  currentLightboxIndex = startIndex;
  
  const lightbox = document.getElementById('image-lightbox');
  const img = document.getElementById('lightbox-image');
  if (!lightbox || !img) return;

  img.src = lightboxImages[currentLightboxIndex];
  img.classList.remove('zoomed');
  
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  if (lightboxImages.length > 1) {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }

  openModal(lightbox);
}

function navigateLightbox(dir) {
  if (lightboxImages.length <= 1) return;
  
  const img = document.getElementById('lightbox-image');
  if (!img) return;
  
  img.classList.remove('zoomed');
  currentLightboxIndex = (currentLightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  img.src = lightboxImages[currentLightboxIndex];
}

function closeLightbox() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    closeModal(lightbox);
  }
}

/**
 * Main DOM Loader hooks
 */
function initUserProfile() {
  const savedProfile = localStorage.getItem('zivra_user_profile');
  if (savedProfile) {
    try {
      const parsed = JSON.parse(savedProfile);
      if (parsed.fullname) {
        sessionUser.name = parsed.fullname;
        sessionUser.username = parsed.username ? `@${parsed.username}` : '@charlotte_v';
      }
    } catch (e) {
      console.error('Error fetching dashboard user settings:', e);
    }
  }

  // Update navbar labels if present
  const userLabel = document.getElementById('user-display-name');
  if (userLabel) userLabel.textContent = sessionUser.name;
}

function initNavbarDropdowns() {
  const notifBtn = document.getElementById('notification-btn');
  const notifDropdown = document.getElementById('notification-dropdown');
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (notifBtn) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = notifDropdown.style.display === 'block';
      closeAllNavPopups();
      if (!open) notifDropdown.style.display = 'block';
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = profileDropdown.style.display === 'block';
      closeAllNavPopups();
      if (!open) profileDropdown.style.display = 'block';
    });
  }

  document.addEventListener('click', () => {
    closeAllNavPopups();
  });
}

function closeAllNavPopups() {
  const notifDropdown = document.getElementById('notification-dropdown');
  const profileDropdown = document.getElementById('profile-dropdown');
  if (notifDropdown) notifDropdown.style.display = 'none';
  if (profileDropdown) profileDropdown.style.display = 'none';
}

/**
 * Initial Render Suite
 */
function renderSidebarCollections() {
  // 1. Render creators
  const creatorsBox = document.getElementById('popular-creators-list');
  if (creatorsBox) {
    creatorsBox.innerHTML = suggestedCreators.map((cr, idx) => `
      <li class="creator-item-row" data-username="${cr.username}">
        <img src="${cr.avatar}" alt="${cr.name}" class="creator-avatar post-user-avatar">
        <div class="creator-meta">
          <span class="creator-name">${cr.name}</span>
          <span class="creator-followers">${cr.followers} followers</span>
        </div>
        <button class="btn-sidebar-follow ${cr.followed ? 'following' : ''}" onclick="toggleSidebarFollow(${idx})">
          ${cr.followed ? 'Following' : 'Follow'}
        </button>
      </li>
    `).join('');
  }

  // 2. Render hashtags
  const tagList = document.getElementById('hashtags-list');
  if (tagList) {
    tagList.innerHTML = trendingHashtags.map(th => `
      <button class="cloud-hashtag-btn" onclick="applyHashtagSearch('${th.tag}')">
        ${th.tag} (${th.count})
      </button>
    `).join('');
  }
}

function applyHashtagSearch(tag) {
  const searchInput = document.getElementById('feed-search');
  if (searchInput) {
    searchInput.value = tag;
    filterAndRenderFeed();
  }
}

function toggleSidebarFollow(idx) {
  suggestedCreators[idx].followed = !suggestedCreators[idx].followed;
  alert(suggestedCreators[idx].followed ? `Following ${suggestedCreators[idx].name}` : `Unfollowed ${suggestedCreators[idx].name}`);
  renderSidebarCollections();
}

/**
 * Masonry Feed renderer
 */
/**
 * Masonry Feed renderer
 */
function filterAndRenderFeed() {

  // Exit if this isn't the Community page
  if (typeof communityPosts === "undefined") {
    return;
  }

  const searchInput = document.getElementById('feed-search');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  // 1. Filter
  let filtered = communityPosts.filter(post => {
    // Occasion tag chip matching
    const matchesFilter =
      currentFilter === 'all' || post.tags.includes(currentFilter);

    // Keyword matching
    const matchesQuery =
      !query ||
      post.caption.toLowerCase().includes(query) ||
      post.user.name.toLowerCase().includes(query) ||
      post.user.username.toLowerCase().includes(query) ||
      post.tags.some(t => t.toLowerCase().includes(query));

    return matchesFilter && matchesQuery;
  });


  // 2. Sort
  filtered.sort((a, b) => {
    if (currentSort === 'latest') return 1; // Simulated
    if (currentSort === 'likes') return b.likes - a.likes;
    if (currentSort === 'comments') return b.comments.length - a.comments.length;
    return b.likes + b.comments.length - (a.likes + a.comments.length); // Default Trending
  });

  // 3. Render
  const grid = document.getElementById('masonry-feed');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="search-no-results" style="grid-column: span 2; width: 100%; padding: 4rem 0;">No community outfits match your search criteria. Try filtering by another style chip!</p>`;
    return;
  }

  grid.innerHTML = filtered.map(post => renderPostCardHTML(post)).join('');

  // Attach carousel button click listeners for multi-image posts
  initializeCarouselSliders();
}

function renderPostCardHTML(post) {
  // Carousel images
  let mediaHTML = '';
  if (post.images && post.images.length > 0) {
    const slides = post.images.map(img => `
      <div class="carousel-slide-item">
        <img src="${img}" alt="Outfit post media" class="carousel-img">
      </div>
    `).join('');

    const arrows = post.images.length > 1 ? `
      <button class="carousel-arrow prev" aria-label="Previous image">&#10094;</button>
      <button class="carousel-arrow next" aria-label="Next image">&#10095;</button>
    ` : '';

    const dots = post.images.length > 1 ? `
      <div class="carousel-indicators">
        ${post.images.map((_, idx) => `<span class="carousel-indicator-dot ${idx === 0 ? 'active' : ''}"></span>`).join('')}
      </div>
    ` : '';

    mediaHTML = `
      <div class="post-media-carousel" data-slides-count="${post.images.length}">
        <div class="carousel-slides-wrapper">
          ${slides}
        </div>
        ${arrows}
        ${dots}
        ${post.location ? `<span class="post-location-tag">📍 ${post.location}</span>` : ''}
      </div>
    `;
  }

  // Poll card contents
  let pollHTML = '';
  if (post.type === 'poll' && post.poll) {
    const totalVotes = post.poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    pollHTML = `
      <div class="post-poll-box" id="poll-${post.id}">
        <h4 class="poll-question">${post.poll.question}</h4>
        <div class="poll-options-list">
          ${post.poll.options.map((opt, idx) => {
            const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
            return `
              <button class="poll-option-item" onclick="submitPollVote('${post.id}', ${idx})">
                <span class="poll-fill-bar" style="width: ${post.poll.voted ? pct : 0}%"></span>
                <span class="poll-option-text">
                  <span>${opt.text}</span>
                  <span class="poll-option-pct" style="display: ${post.poll.voted ? 'inline' : 'none'}">${pct}%</span>
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  // Question post contents
  let questionHTML = '';
  if (post.type === 'question') {
    questionHTML = `
      <div class="post-question-box">
        <span class="question-post-lbl">❓ Question</span>
        <p class="question-post-text">"${post.caption}"</p>
      </div>
    `;
  }

  // Caption block (not shown inside question box separately for readability)
  const captionBlock = post.type !== 'question' ? `<p class="post-caption">${post.caption}</p>` : '';

  return `
    <article class="post-card card-premium" id="${post.id}">
      <!-- User info header -->
      <div class="post-header" data-username="${post.user.username}">
        <img src="${post.user.avatar}" alt="${post.user.name}" class="creator-avatar">
        <div class="post-user-details">
          <div class="post-username-row">
            <span class="post-username">${post.user.name}</span>
            ${post.user.verified ? `
              <span class="verification-badge" title="Verified Creator">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </span>` : ''}
          </div>
          <span class="post-time">${post.time}</span>
        </div>
        <button class="btn-follow-user" onclick="togglePostUserFollow('${post.id}')">Follow</button>
      </div>

      <!-- Main Visual Media -->
      ${mediaHTML}

      <!-- Caption & Tags info -->
      <div class="post-info-area">
        ${questionHTML}
        ${captionBlock}
        ${pollHTML}
        
        <div class="post-hashtags-row">
          ${post.tags.map(t => `<span class="post-tag-pill">#${t}</span>`).join(' ')}
        </div>
      </div>

      <!-- Social Interactions Footer -->
      <div class="post-actions-footer">
        <button class="btn-post-action ${post.liked ? 'liked' : ''}" onclick="toggleLikePost('${post.id}')" aria-label="Like">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span class="like-count">${post.likes}</span>
        </button>

        <button class="btn-post-action" onclick="openCommentModal('${post.id}')" aria-label="Comment">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>${post.comments.length}</span>
        </button>

        <button class="btn-post-action" onclick="triggerShareAction('${post.id}')" aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
        </button>

        <button class="btn-detail-trigger" onclick="openCommentModal('${post.id}')">View Details</button>
      </div>
    </article>
  `;
}

/**
 * 3. Media Carousel Logic
 */
function initializeCarouselSliders() {
  const carousels = document.querySelectorAll('.post-media-carousel');

  carousels.forEach(car => {
    const wrapper = car.querySelector('.carousel-slides-wrapper');
    const prevBtn = car.querySelector('.carousel-arrow.prev');
    const nextBtn = car.querySelector('.carousel-arrow.next');
    const dots = car.querySelectorAll('.carousel-indicator-dot');
    const total = parseInt(car.getAttribute('data-slides-count'));

    if (total <= 1 || !wrapper) return;

    let index = 0;

    const updateSlider = () => {
      wrapper.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === index);
      });
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        index = (index + 1) % total;
        updateSlider();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        index = (index - 1 + total) % total;
        updateSlider();
      });
    }
  });
}

/**
 * 4. Poll Voting Logic
 */
function submitPollVote(postId, optionIdx) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post || !post.poll || post.poll.voted) return;

  // Cast vote
  post.poll.options[optionIdx].votes += 1;
  post.poll.voted = true;

  // Refresh post card visual representation
  filterAndRenderFeed();
  alert(`Vote cast: ${post.poll.options[optionIdx].text}`);
}

/**
 * 5. Interaction updates (Likes, Follows, Saves)
 */
async function toggleLikePost(id) {

    const response = await fetch(`/community/like/${id}/`);
    const data = await response.json();

    const likeBtn = document.querySelector(
        `[onclick="toggleLikePost('${id}')"]`
    );

    if (!likeBtn) return;

    const count = likeBtn.querySelector(".like-count");

    count.textContent = data.likes;

    if (data.liked) {
        likeBtn.classList.add("liked");
    } else {
        likeBtn.classList.remove("liked");
    }
}

function togglePostUserFollow(id) {
  const post = communityPosts.find(p => p.id === id);
  if (!post) return;

  const btn = document.querySelector(`#${id} .btn-follow-user`);
  if (!btn) return;

  const following = btn.classList.toggle('following');
  btn.textContent = following ? 'Following' : 'Follow';
  alert(following ? `Following ${post.user.name}` : `Unfollowed ${post.user.name}`);
}

function triggerShareAction(id) {
  activePostIdForShare = id;
  const shareModal = document.getElementById('share-modal');
  if (shareModal) {
    openModal(shareModal);
  }
}

function toggleSavePost(id) {
  const post = communityPosts.find(p => p.id === id);
  if (!post) return;

  post.saved = !post.saved;
  filterAndRenderFeed();

  if (post.saved) {
    showToast('Saved to your collection.', '🔖');
    openMoodboardDrawer(id);
  } else {
    showToast('Removed from saved looks.', '🗑️');
  }
}
async function addComment(postId) {

    const input = document.getElementById(`comment-input-${postId}`);

    const text = input.value.trim();

    if (!text) return;

    const formData = new FormData();

    formData.append("comment", text);

    const response = await fetch(`/community/comment/${postId}/`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: formData
    });

    const data = await response.json();

    if (data.success) {

        const post = communityPosts.find(p => p.id == postId);

        post.comments.push({
            user: data.user,
            text: data.comment
        });

        input.value = "";

        filterAndRenderFeed();
    }
}
/**
 * 6. Detailed Comments & CRUD Panel
 */
function openCommentModal(id) {
  activePostIdForComments = id;
  const post = communityPosts.find(p => p.id === id);
  if (!post) return;

  const modal = document.getElementById('post-detail-modal');
  const layoutBox = document.getElementById('detail-modal-content');
  if (!modal || !layoutBox) return;

  renderPostDetails(post);
  openModal(modal);

  // Auto-focus comment input
  setTimeout(() => {
    const input = document.getElementById('detail-comment-input');
    if (input) input.focus();
  }, 350);
}

function closeCommentModal() {
  const modal = document.getElementById('post-detail-modal');
  if (modal) {
    closeModal(modal);
  }
  activePostIdForComments = null;
}

function renderPostDetails(post) {

    const layoutBox = document.getElementById("detail-modal-content");
    if (!layoutBox) return;

    let imageHTML = "";

    if (post.images.length > 0) {
        imageHTML = `<img src="${post.images[0]}" alt="Post Image">`;
    } else {
        imageHTML = `<div class="no-image">No Image</div>`;
    }

    let commentsHTML = "";

    if (post.comments.length > 0) {

        commentsHTML = post.comments.map(comment => `
            <div class="comment-node">

                <div class="comment-author-row">
                    <img src="${comment.avatar}" class="comment-author-avatar">

                    <div class="comment-main-body">
                        <span class="comment-author-name">
                            ${comment.user}
                        </span>

                        <p class="comment-body-text">
                            ${comment.text}
                        </p>
                    </div>
                </div>

                <div class="comment-actions-bar">
                    <span>${comment.time}</span>
                </div>

            </div>
        `).join("");

    } else {

        commentsHTML = `
            <p class="search-no-results" style="padding:2rem 0;">
                No comments yet. Start the discussion!
            </p>
        `;

    }

    layoutBox.innerHTML = `

        <div class="detail-image-pane">
            ${imageHTML}
        </div>

        <div class="detail-info-pane">

            <div class="detail-user-block">

                <img src="${post.user.avatar}" alt="${post.user.name}">

                <div class="detail-meta-text">
                    <h3>${post.user.name}</h3>
                    <span>
                        ${post.time}
                        ${post.location ? " • " + post.location : ""}
                    </span>
                </div>

            </div>

            <p class="detail-caption">
                ${post.caption}
            </p>

            <div class="post-hashtags-row" style="margin-bottom:20px;">
                ${post.tags.map(tag =>
                    `<span class="post-tag-pill">#${tag}</span>`
                ).join("")}
            </div>

            <div class="comments-container-box">

                <div class="comments-header-row">
                    <span class="comments-title">
                        Discussion (${post.comments.length})
                    </span>
                </div>

                <div class="comments-list-wrapper" id="comments-timeline">
                    ${commentsHTML}
                </div>

                <form
                    class="comment-input-form-row"
                    id="detail-comment-form"
                    onsubmit="submitNewComment(event)"
                >

                    <input
                        type="text"
                        id="detail-comment-input"
                        class="comment-txt-input"
                        placeholder="Write a comment..."
                        required
                    >

                    <button
                        class="btn-submit-comment"
                        type="submit"
                    >
                        Send
                    </button>

                </form>

            </div>

        </div>
    `;
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
async function submitNewComment(e) {

    e.preventDefault();

    const input = document.getElementById("detail-comment-input");

    const text = input.value.trim();

    if (!text) return;

    const response = await fetch(
        `/community/comment/${activePostIdForComments}/`,
        {
            method: "POST",

            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
                "Content-Type": "application/x-www-form-urlencoded",
            },

            body: new URLSearchParams({
                comment: text
            })
        }
    );

    const data = await response.json();

    if (data.success) {

        const post = communityPosts.find(
            p => p.id == activePostIdForComments
        );

        post.comments.push(data.comment);

        input.value = "";

        renderPostDetails(post);
    }

}

function toggleCommentLike(postId, commentId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;
  const comment = post.comments.find(c => c.id === commentId);
  if (!comment) return;

  comment.liked = !comment.liked;
  comment.likes += comment.liked ? 1 : -1;

  renderPostDetails(post);
}

function focusCommentReply(username) {
  const input = document.getElementById('detail-comment-input');
  if (input) {
    input.value = `@${username.replace(/\s+/g, '')} `;
    input.focus();
  }
}

function triggerEditComment(postId, commentId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;
  const comment = post.comments.find(c => c.id === commentId);
  if (!comment) return;

  const textEl = document.getElementById(`text-${commentId}`);
  if (!textEl) return;

  const currentText = comment.text;
  const inputHTML = `
    <div class="edit-comment-wrapper" style="display:flex; gap:0.5rem; width:100%; margin-top:0.5rem;">
      <input type="text" class="comment-txt-input" id="edit-input-${commentId}" value="${currentText}" style="padding: 4px 10px;">
      <button class="btn-primary" style="padding: 2px 10px; font-size:0.75rem; border-radius:8px;" onclick="saveEditedComment('${postId}', '${commentId}')">Save</button>
      <button class="btn-secondary" style="padding: 2px 10px; font-size:0.75rem; border-radius:8px;" onclick="renderPostDetails(communityPosts.find(p => p.id === '${postId}'))">Cancel</button>
    </div>
  `;
  textEl.innerHTML = inputHTML;
}

function saveEditedComment(postId, commentId) {
  const post = communityPosts.find(p => p.id === postId);
  const input = document.getElementById(`edit-input-${commentId}`);
  if (!post || !input) return;

  const newText = input.value.trim();
  if (!newText) return;

  const comment = post.comments.find(c => c.id === commentId);
  if (comment) {
    comment.text = newText;
    comment.time = 'Edited just now';
  }

  renderPostDetails(post);
}

function triggerDeleteComment(postId, commentId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  if (confirm('Are you sure you want to delete this comment?')) {
    post.comments = post.comments.filter(c => c.id !== commentId);
    renderPostDetails(post);
    filterAndRenderFeed();
  }
}

function sortComments(type) {
  const post = communityPosts.find(p => p.id === activePostIdForComments);
  if (!post) return;

  if (type === 'latest') {
    post.comments.reverse();
  } else {
    // Sort by likes
    post.comments.sort((a,b) => b.likes - a.likes);
  }
  renderPostDetails(post);
}

/**
 * 7. Profile Preview Popover
 */
function initProfilePopover() {
  const popover = document.getElementById('profile-popover');
  if (!popover) return;

  // Show popover on hovering elements
  document.addEventListener('mouseover', (e) => {
    const parentHeader = e.target.closest('.post-header');
    const sidebarRow = e.target.closest('.creator-item-row');
    
    let targetUser = null;
    if (parentHeader) {
      const postId = parentHeader.closest('.post-card').id;
      const post = communityPosts.find(p => p.id === postId);
      if (post) targetUser = post.user;
    } else if (sidebarRow) {
      const username = sidebarRow.getAttribute('data-username');
      const creator = suggestedCreators.find(c => c.username === username);
      if (creator) {
        targetUser = {
          name: creator.name,
          username: creator.username,
          avatar: creator.avatar,
          bio: 'Zivra fashion creator. Sharing weekly style challenges and seasonal picks.',
          followers: creator.followers,
          following: '310',
          postsCount: '48'
        };
      }
    }

    if (targetUser) {
      const rect = e.target.getBoundingClientRect();
      popover.style.display = 'block';
      popover.style.top = `${window.scrollY + rect.bottom + 8}px`;
      popover.style.left = `${rect.left}px`;
      
      popover.innerHTML = `
        <div class="popover-header">
          <img src="${targetUser.avatar}" alt="${targetUser.name}">
          <div class="popover-username-meta">
            <h4>${targetUser.name}</h4>
            <p>${targetUser.username}</p>
          </div>
        </div>
        <p class="popover-bio">${targetUser.bio}</p>
        <div class="popover-stats-row">
          <div class="popover-stat-box">
            <span class="popover-stat-num">${targetUser.postsCount}</span>
            <span class="popover-stat-lbl">Posts</span>
          </div>
          <div class="popover-stat-box">
            <span class="popover-stat-num">${targetUser.followers}</span>
            <span class="popover-stat-lbl">Followers</span>
          </div>
          <div class="popover-stat-box">
            <span class="popover-stat-num">${targetUser.following}</span>
            <span class="popover-stat-lbl">Following</span>
          </div>
        </div>
        <div class="popover-actions-row">
          <button class="btn-primary" onclick="alert('Following ${targetUser.name}'); document.getElementById('profile-popover').style.display='none';">Follow</button>
          <button class="btn-secondary" onclick="alert('Loading full profile view...'); document.getElementById('profile-popover').style.display='none';">View Profile</button>
        </div>
      `;
    }
  });

  // Hide popover when mouse leaves
  document.addEventListener('mousemove', (e) => {
    if (!e.target.closest('.post-header') && !e.target.closest('.creator-item-row') && !e.target.closest('.profile-hover-popover')) {
      popover.style.display = 'none';
    }
  });
}

/**
 * 8. Save to Mood Board drawer
 */
let activePostIdForMoodboard = null;

function openMoodboardDrawer(postId) {
  activePostIdForMoodboard = postId;
  const drawer = document.getElementById('moodboard-drawer');
  if (drawer) drawer.classList.add('open');
}

function closeMoodboardDrawer() {
  const drawer = document.getElementById('moodboard-drawer');
  if (drawer) drawer.classList.remove('open');
  activePostIdForMoodboard = null;
}

function initMoodboardDrawer() {
  const drawer = document.getElementById('moodboard-drawer');
  const closeBtn = document.getElementById('close-drawer-btn');
  const options = document.querySelectorAll('.moodboard-option-item');
  const createBtn = document.querySelector('.btn-create-board');
  const boardInput = document.getElementById('new-board-input');

  if (!drawer) return;

  if (closeBtn) closeBtn.addEventListener('click', closeMoodboardDrawer);

  // Collection select
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const boardName = opt.getAttribute('data-board');
      alert(`Outfit successfully saved into collection: "${boardName}"`);
      closeMoodboardDrawer();
    });
  });

  // Create new collection
  if (createBtn && boardInput) {
    createBtn.addEventListener('click', () => {
      const val = boardInput.value.trim();
      if (!val) return;

      alert(`Created collection "${val}" and saved look.`);
      boardInput.value = '';
      closeMoodboardDrawer();
    });
  }
}

/**
 * 9. Search, Filter & sorting binds
 */
function initFeedControls() {
  const searchInput = document.getElementById('feed-search');
  const sortSelect = document.getElementById('feed-sort');
  const chips = document.querySelectorAll('.filter-chip');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      filterAndRenderFeed();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentSort = sortSelect.value;
      filterAndRenderFeed();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      filterAndRenderFeed();
    });
  });
}

/**
 * 10. Post creation modals
 */
document.querySelectorAll(".btn-challenge-join").forEach(btn => {

    btn.addEventListener("click", function () {

        const modal = document.getElementById("create-post-modal");

        openModal(modal);

    });

});
function initCreatePostModal() {
  const modal = document.getElementById('create-post-modal');
  const openBtn = document.getElementById('btn-hero-create-post');
  const closeBtn = document.getElementById('close-create-btn');
  const form = document.getElementById('create-post-form');
  const typeBtns = document.querySelectorAll('.type-tab-btn');
  const uploadZone = document.getElementById('form-upload-zone');
  const fileInput = document.getElementById('post-images-input');
  const pollEditor = document.getElementById('poll-editor');

  if (!modal || !form) return;
  

  // Open / Close
  if (openBtn) {
    openBtn.addEventListener('click', () => {
      openModal(modal);
      savedImagesBase64 = []; // Reset uploads
      const previews = document.getElementById('previews-container');
      if (previews) previews.innerHTML = '';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal(modal);
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // Switch post type tabs
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const type = btn.getAttribute('data-type');
const labelText = document.getElementById('caption-label-text');
const hiddenType = document.getElementById('post-type');

// Set hidden input value for Django
if (type === "outfit") {
    hiddenType.value = "image";
} else {
    hiddenType.value = type;
}

if (type === 'poll') {
    pollEditor.style.display = 'block';
    uploadZone.style.display = 'block';

    if (labelText) {
        labelText.textContent = 'Write Poll Details';
    }
}
else if (type === 'question') {
    pollEditor.style.display = 'none';
    uploadZone.style.display = 'none';

    if (labelText) {
        labelText.textContent = 'Ask Question';
    }
}
else {
    // Outfit Post
    pollEditor.style.display = 'none';
    uploadZone.style.display = 'block';

    if (labelText) {
        labelText.textContent = 'Write Caption';
    }
}
    });
  });

  // Image upload triggers
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', (e) => {
      if (!e.target.closest('#previews-container')) {
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files) {
        handleImageUploadPreviews(fileInput.files);
      }
    });
  }

  // Submit Publish
  form.addEventListener("submit", function (e) {

    const caption = document.getElementById("post-caption").value.trim();

    if (!caption) {
        e.preventDefault();
        alert("Please enter a caption.");
        return;
    }

    // Don't call e.preventDefault() here otherwise.
    // The browser will submit the form to Django.
});
}

function handleImageUploadPreviews(files) {
  const container = document.getElementById('previews-container');
  if (!container) return;

  // Process files
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.match('image.*')) continue;

    const reader = new FileReader();
    reader.onload = (e) => {
      savedImagesBase64.push(e.target.result);
      
      const thumb = document.createElement('div');
      thumb.className = 'upload-preview-thumb';
      thumb.innerHTML = `
        <img src="${e.target.result}" alt="Preview thumb">
      `;
      container.appendChild(thumb);
    };
    reader.readAsDataURL(file);
  }
}

/**
 * 11. Infinite Scroll Sim
 */
function initInfiniteScroll() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  let page = 1;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      loader.style.visibility = 'visible';
      
      setTimeout(() => {
        // Load mock posts
        const mockOutfits = [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=300',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=300'
        ];
        
        const newPost = {
          id: `post-lazy-${Date.now()}`,
          type: 'outfit',
          user: {
            name: 'Oliver Sterling',
            username: '@oliver_s',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
            verified: false,
            bio: 'Fashion designer.',
            followers: '8K',
            following: '400',
            postsCount: '45'
          },
          time: '1 day ago',
          images: [mockOutfits[page % 2]],
          caption: 'Late autumn layering setups. Warm sand overcoats work incredibly well with neutral light elements.',
          tags: ['Casual', 'Winter'],
          likes: 45,
          liked: false,
          saves: 14,
          saved: false,
          comments: []
        };

        communityPosts.push(newPost);
        page++;
        filterAndRenderFeed();
        
        loader.style.visibility = 'hidden';
      }, 1500);
    }
  }, { threshold: 0.1 });

  observer.observe(loader);
}

function initCommunityDetailsModal() {

    console.log("Community modal initialized");

    const modal = document.getElementById("post-detail-modal");
    const closeBtn = document.getElementById("close-detail-btn");

    console.log(modal);
    console.log(closeBtn);

    if (closeBtn) {
        console.log("Listener attached");

        closeBtn.addEventListener("click", function () {

            console.log("Close clicked");

            closeModal(modal);

        });
    }
}

function initShareModalControls() {
  const closeBtn = document.getElementById('close-share-btn');
  const shareModal = document.getElementById('share-modal');
  const copyLinkBtn = document.getElementById('share-copy-link');
  const shareZivraBtn = document.getElementById('share-zivra');
  const whatsappBtn = document.getElementById('share-whatsapp');
  const xBtn = document.getElementById('share-x');
  const facebookBtn = document.getElementById('share-facebook');
  
  if (closeBtn) closeBtn.addEventListener('click', closeShareModal);
  if (shareModal) {
    shareModal.addEventListener('click', (e) => {
      if (e.target === shareModal) closeShareModal();
    });
  }
  
  const handleShareClick = (platform) => {
    if (platform === 'Copy Link') {
      navigator.clipboard.writeText(`https://zivra.com/community/posts/${activePostIdForShare}`);
      showToast('Link copied to clipboard!');
    } else {
      showToast(`Shared to ${platform}!`, '📤');
    }
    closeShareModal();
  };
  
  if (copyLinkBtn) copyLinkBtn.addEventListener('click', () => handleShareClick('Copy Link'));
  if (shareZivraBtn) shareZivraBtn.addEventListener('click', () => handleShareClick('Zivra Feed'));
  if (whatsappBtn) whatsappBtn.addEventListener('click', () => handleShareClick('WhatsApp'));
  if (xBtn) xBtn.addEventListener('click', () => handleShareClick('X'));
  if (facebookBtn) facebookBtn.addEventListener('click', () => handleShareClick('Facebook'));
}

function initLightboxControls() {
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const closeBtn = document.getElementById('close-lightbox-btn');
  const lightbox = document.getElementById('image-lightbox');
  const img = document.getElementById('lightbox-image');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(-1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateLightbox(1);
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
  
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  if (img) {
    img.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      img.classList.toggle('zoomed');
    });
  }

  // Event delegation to open lightbox when clicking carousel-img or detail image
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('carousel-img')) {
      const postCard = e.target.closest('.post-card');
      if (!postCard) return;
      
      const imgElements = Array.from(postCard.querySelectorAll('.carousel-img'));
      const imageUrls = imgElements.map(el => el.src);
      const clickedIndex = imgElements.indexOf(e.target);
      
      openLightbox(imageUrls, clickedIndex >= 0 ? clickedIndex : 0);
    } 
    else if (e.target.closest('.detail-image-pane img')) {
      const imgSrc = e.target.src;
      openLightbox([imgSrc], 0);
    }
  });
}

function closeShareModal() {
  const shareModal = document.getElementById('share-modal');
  if (shareModal) {
    closeModal(shareModal);
  }
  activePostIdForShare = null;
}

// ESC key modal closer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const createModal = document.getElementById('create-post-modal');
    if (createModal && createModal.classList.contains('show')) {
      closeModal(createModal);
    }
    const detailModal = document.getElementById('post-detail-modal');
    if (detailModal && detailModal.classList.contains('show')) {
      closeCommentModal();
    }
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox && lightbox.classList.contains('show')) {
      closeLightbox();
    }
    const shareModal = document.getElementById('share-modal');
    if (shareModal && shareModal.classList.contains('show')) {
      closeShareModal();
    }
  }
});

// Binds
document.addEventListener('DOMContentLoaded', () => {

  initUserProfile();
  initNavbarDropdowns();
  renderSidebarCollections();
  filterAndRenderFeed();
  initFeedControls();
  initCreatePostModal();
  initCommunityDetailsModal();
  initShareModalControls();
  initLightboxControls();
  initProfilePopover();
  initMoodboardDrawer();
  initInfiniteScroll();
});

console.log("Community JS Loaded");