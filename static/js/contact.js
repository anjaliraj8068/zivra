/* =============================================================
   Zivra — Contact & Feedback Page JS
   Pure Vanilla JS, no dependencies
   ============================================================= */

'use strict';

/* ---------------------------------------------------------------
   DOM REFS
   --------------------------------------------------------------- */
const form          = document.getElementById('ct-contact-form');
const formCard      = document.getElementById('ct-form-card');
const successCard   = document.getElementById('ct-success-card');
const submitBtn     = document.getElementById('ct-submit-btn');
const clearBtn      = document.getElementById('ct-clear-btn');
const anotherBtn    = document.getElementById('ct-another-btn');

const nameInput     = document.getElementById('ct-name');
const emailInput    = document.getElementById('ct-email');
const purposeSelect = document.getElementById('ct-purpose');
const descTextarea  = document.getElementById('ct-description');
const extraTextarea = document.getElementById('ct-extra');
const descCount     = document.getElementById('desc-count');
const extraCount    = document.getElementById('extra-count');

const priorityInput      = document.getElementById('ct-priority');
const contactMethodInput = document.getElementById('ct-contact-method');

const dropzone      = document.getElementById('ct-dropzone');
const fileInput     = document.getElementById('ct-file');
const dropzoneBody  = document.getElementById('ct-dropzone-body');
const fileSelected  = document.getElementById('ct-file-selected');
const fileName      = document.getElementById('ct-file-name');
const fileRemove    = document.getElementById('ct-file-remove');

/* ---------------------------------------------------------------
   CHARACTER COUNTERS
   --------------------------------------------------------------- */
function updateCharCount(textarea, counter, max) {
  const len = textarea.value.length;
  counter.textContent = `${len} / ${max}`;
  counter.classList.toggle('near-limit', len >= max * 0.8 && len < max);
  counter.classList.toggle('at-limit', len >= max);
}

descTextarea.addEventListener('input', () => updateCharCount(descTextarea, descCount, 1000));
extraTextarea.addEventListener('input', () => updateCharCount(extraTextarea, extraCount, 500));

/* ---------------------------------------------------------------
   PILL TOGGLE (Priority + Contact Method)
   --------------------------------------------------------------- */
document.querySelectorAll('.ct-pill[data-group]').forEach(pill => {
  pill.addEventListener('click', () => {
    const group = pill.dataset.group;
    const value = pill.dataset.value;

    // Deactivate siblings in same group
    document.querySelectorAll(`.ct-pill[data-group="${group}"]`).forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Update hidden input
    if (group === 'priority')       priorityInput.value      = value;
    if (group === 'contact-method') contactMethodInput.value = value;
  });
});

/* ---------------------------------------------------------------
   FILE DROPZONE
   --------------------------------------------------------------- */
// Drag events
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.classList.add('dragging');
});
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragging');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    showToast('Only PNG, JPG, or PDF files are allowed.', 'error');
    return;
  }
  if (file.size > maxSize) {
    showToast('File size must be under 5MB.', 'error');
    return;
  }

  fileName.textContent = file.name;
  dropzoneBody.style.display = 'none';
  fileSelected.style.display = 'flex';
}

fileRemove.addEventListener('click', e => {
  e.stopPropagation();
  fileInput.value = '';
  dropzoneBody.style.display = 'flex';
  fileSelected.style.display = 'none';
});

// Allow clicking dropzone label to trigger file input
dropzone.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});


/* ---------------------------------------------------------------
   FIELD VALIDATION
   --------------------------------------------------------------- */
const validations = [
  {
    el: nameInput,
    fg: 'fg-name',
    err: 'err-name',
    validate: v => v.trim().length >= 2,
  },
  {
    el: emailInput,
    fg: 'fg-email',
    err: 'err-email',
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  },
  {
    el: purposeSelect,
    fg: 'fg-purpose',
    err: 'err-purpose',
    validate: v => v !== '',
  },
  {
    el: descTextarea,
    fg: 'fg-description',
    err: 'err-description',
    validate: v => v.trim().length >= 20,
  },
];

function validateField(rule) {
  const fg = document.getElementById(rule.fg);
  const isValid = rule.validate(rule.el.value);
  fg.classList.toggle('invalid', !isValid);
  return isValid;
}

function validateAll() {
  return validations.map(validateField).every(Boolean);
}

// Inline validation on blur
validations.forEach(rule => {
  rule.el.addEventListener('blur', () => validateField(rule));
  rule.el.addEventListener('input', () => {
    if (document.getElementById(rule.fg).classList.contains('invalid')) {
      validateField(rule);
    }
  });
});

/* ---------------------------------------------------------------
   FORM SUBMIT
   --------------------------------------------------------------- */
form.addEventListener('submit', e => {
  e.preventDefault();

  if (!validateAll()) {
    // Scroll to first invalid field
    const firstInvalid = form.querySelector('.ct-field-group.invalid');
    if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  // Simulate async submission (1.6s)
  setTimeout(() => {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    showSuccess();
  }, 1600);
});

/* ---------------------------------------------------------------
   CLEAR FORM
   --------------------------------------------------------------- */
clearBtn.addEventListener('click', () => {
  form.reset();

  // Reset char counters
  descCount.textContent = '0 / 1000';
  extraCount.textContent = '0 / 500';
  descCount.classList.remove('near-limit', 'at-limit');
  extraCount.classList.remove('near-limit', 'at-limit');

  // Reset pills
  document.querySelectorAll('.ct-pill[data-group="priority"]').forEach(p => p.classList.toggle('active', p.dataset.value === 'normal'));
  document.querySelectorAll('.ct-pill[data-group="contact-method"]').forEach(p => p.classList.toggle('active', p.dataset.value === 'email'));
  priorityInput.value = 'normal';
  contactMethodInput.value = 'email';

  // Reset file
  fileInput.value = '';
  dropzoneBody.style.display = 'flex';
  fileSelected.style.display = 'none';

  // Remove validation state
  validations.forEach(rule => {
    document.getElementById(rule.fg).classList.remove('invalid');
  });
});

/* ---------------------------------------------------------------
   SUCCESS STATE
   --------------------------------------------------------------- */
function showSuccess() {
  formCard.style.display = 'none';
  successCard.style.display = 'flex';
  successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

anotherBtn.addEventListener('click', () => {
  successCard.style.display = 'none';
  formCard.style.display = 'block';

  // Reset form completely
  form.reset();
  descCount.textContent = '0 / 1000';
  extraCount.textContent = '0 / 500';
  descCount.classList.remove('near-limit', 'at-limit');
  extraCount.classList.remove('near-limit', 'at-limit');
  document.querySelectorAll('.ct-pill[data-group="priority"]').forEach(p => p.classList.toggle('active', p.dataset.value === 'normal'));
  document.querySelectorAll('.ct-pill[data-group="contact-method"]').forEach(p => p.classList.toggle('active', p.dataset.value === 'email'));
  priorityInput.value = 'normal';
  contactMethodInput.value = 'email';
  fileInput.value = '';
  dropzoneBody.style.display = 'flex';
  fileSelected.style.display = 'none';
  validations.forEach(rule => document.getElementById(rule.fg).classList.remove('invalid'));

  formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ---------------------------------------------------------------
   TOAST NOTIFICATION
   --------------------------------------------------------------- */
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.ct-toast');
  if (existing) existing.remove();

  const colors = {
    error: 'linear-gradient(135deg, #E74C3C, #C0392B)',
    info:  'linear-gradient(135deg, #FF4F9A, #E03E82)',
  };

  const toast = document.createElement('div');
  toast.className = 'ct-toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${colors[type] || colors.info};
    color: white;
    padding: 0.85rem 1.75rem;
    border-radius: 50px;
    font-size: 0.88rem;
    font-weight: 500;
    z-index: 9999;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    font-family: var(--font-body, Inter, sans-serif);
    pointer-events: none;
    white-space: nowrap;
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
  }, 3000);
}
