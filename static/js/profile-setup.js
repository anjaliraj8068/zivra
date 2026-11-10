/**
 * Zivra Profile Setup (Onboarding) Wizard Interactions
 * 
 * Includes:
 * 1. Step Navigation & Progress Indicator updates
 * 2. Drag & Drop File Upload and Image Previews
 * 3. LocalStorage Auto-Save State Restore
 * 4. Step Validation & Final Submit Redirection
 */

document.addEventListener('DOMContentLoaded', () => {
  const wizard = new ProfileSetupWizard();
  wizard.init();
});

class ProfileSetupWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.storageKey = 'zivra_onboarding_data';
    
    // Core Elements
    this.steps = document.querySelectorAll('.wizard-step');
    this.progressLine = document.querySelector('.setup-progress-line');
    this.nodes = document.querySelectorAll('.progress-node');
    this.btnPrev = document.querySelector('.btn-prev');
    this.btnNext = document.querySelector('.btn-next');
    this.btnFinish = document.querySelector('.btn-finish');
    this.form = document.getElementById('onboarding-form');
  }

  init() {
    if (!this.form) return;

    // Attach Wizard Button Events
    this.btnNext.addEventListener('click', () => this.navigate(1));
    this.btnPrev.addEventListener('click', () => this.navigate(-1));
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Initialize Image Upload Drag-and-Drops
    this.initImageUploads();

    // Auto-Restore data if saved
    this.restoreData();

    // Display Initial Step
    this.updateWizard();
    
    // Listen for form changes to auto-save to localStorage
    this.form.addEventListener('input', () => this.saveData());
    this.form.addEventListener('change', () => this.saveData());
  }

  // Handle Wizard Transitions
  navigate(direction) {
    if (direction === 1 && !this.validateStep(this.currentStep)) {
      return; // Stop if step validation fails
    }

    this.currentStep += direction;
    this.updateWizard();
  }

  // Update progress nodes, fills, and step slides visibility
  updateWizard() {
    // Clamp values
    if (this.currentStep < 1) this.currentStep = 1;
    if (this.currentStep > this.totalSteps) this.currentStep = this.totalSteps;

    // Toggle steps views
    this.steps.forEach((step, idx) => {
      if (idx + 1 === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Update Progress Indicator Line Width
    const progressPercent = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
    this.progressLine.style.width = `${progressPercent}%`;

    // Update nodes states
    this.nodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      node.className = 'progress-node';
      
      if (stepNum < this.currentStep) {
        node.classList.add('completed');
      } else if (stepNum === this.currentStep) {
        node.classList.add('active');
      }
    });

    // Toggle navigation button visibility
    if (this.currentStep === 1) {
      this.btnPrev.style.display = 'none';
    } else {
      this.btnPrev.style.display = 'inline-flex';
    }

    if (this.currentStep === this.totalSteps) {
      this.btnNext.style.display = 'none';
      this.btnFinish.style.display = 'inline-flex';
    } else {
      this.btnNext.style.display = 'inline-flex';
      this.btnFinish.style.display = 'none';
    }

    // Scroll back to top of onboarding container smoothly
    document.querySelector('.auth-form-side').scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Validate fields for each setup section
  validateStep(step) {
    let isValid = true;
    const currentStepContainer = this.steps[step - 1];

    // Clear previous input styling
    currentStepContainer.querySelectorAll('input, select').forEach(el => {
      el.style.borderColor = '';
    });

    if (step === 1) {
      // Step 1: Gender, Age, Height, Weight checks
      const genderChecked = currentStepContainer.querySelector('input[name="gender"]:checked');
      const age = document.getElementById('age');
      const height = document.getElementById('height');
      const weight = document.getElementById('weight');

      if (!genderChecked) {
        isValid = false;
        alert('Please select your gender.');
        return false;
      }
      if (!age.value || age.value < 10 || age.value > 120) {
        isValid = false;
        age.style.borderColor = '#FF3B30';
      }
      if (!height.value || height.value < 50 || height.value > 250) {
        isValid = false;
        height.style.borderColor = '#FF3B30';
      }
      if (!weight.value || weight.value < 20 || weight.value > 300) {
        isValid = false;
        weight.style.borderColor = '#FF3B30';
      }

      if (!isValid) {
        alert('Please enter valid details for Age, Height, and Weight.');
      }
    } 
    else if (step === 2) {
      // Step 2: Body shape, skin tone, face shape, hair type selections
      const bodyShape = currentStepContainer.querySelector('input[name="body_shape"]:checked');
      const skinTone = currentStepContainer.querySelector('input[name="skin_tone"]:checked');
      const faceShape = currentStepContainer.querySelector('input[name="face_shape"]:checked');
      const hairType = currentStepContainer.querySelector('input[name="hair_type"]:checked');

      if (!bodyShape || !skinTone || !faceShape || !hairType) {
        isValid = false;
        alert('Please fill out all physical features (Body Shape, Skin Tone, Face Shape, Hair Type) to assist AI scanning.');
      }
    }
    else if (step === 3) {
      // Step 3: Preferred styles & occasions checks
      const style = currentStepContainer.querySelector('input[name="fashion_style"]:checked');
      const occasionChecked = currentStepContainer.querySelector('input[name="occasions"]:checked');

      if (!style) {
        isValid = false;
        alert('Please select your preferred fashion style.');
        return false;
      }
      if (!occasionChecked) {
        isValid = false;
        alert('Please select at least one frequently attended occasion.');
        return false;
      }
    }

    return isValid;
  }

  // Handle Drag & Drop photo selection
  initImageUploads() {
    const uploadZones = document.querySelectorAll('.upload-zone');

    uploadZones.forEach(zone => {
      const input = zone.querySelector('.upload-file-input');
      const preview = zone.querySelector('.upload-preview');
      const removeBtn = zone.querySelector('.btn-remove-photo');
      const previewImg = preview.querySelector('img');

      // Click to open file dialog
      zone.addEventListener('click', (e) => {
        if (!e.target.closest('.upload-preview')) {
          input.click();
        }
      });

      // File dialog change event
      input.addEventListener('change', () => {
        if (input.files && input.files[0]) {
          this.displayPreview(input.files[0], preview, previewImg);
        }
      });

      // Drag and Drop triggers
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--color-primary)';
        zone.style.background = 'var(--color-secondary-light)';
      });

      const resetZoneBorder = () => {
        zone.style.borderColor = '';
        zone.style.background = '';
      };

      zone.addEventListener('dragleave', resetZoneBorder);
      zone.addEventListener('dragend', resetZoneBorder);

      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        resetZoneBorder();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          input.files = e.dataTransfer.files;
          this.displayPreview(e.dataTransfer.files[0], preview, previewImg);
        }
      });

      // Remove photo trigger
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering parent uploadZone click
        input.value = '';
        preview.style.display = 'none';
        previewImg.src = '';
        this.saveData();
      });
    });
  }

  // Show selected file in DOM preview area
  displayPreview(file, previewContainer, previewImage) {
    if (!file.type.match('image.*')) {
      alert('Please upload an image file (PNG/JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewContainer.style.display = 'block';
      this.saveData(); // Save changes containing preview dataURL
    };
    reader.readAsDataURL(file);
  }

  // Collect onboarding form values and save to local storage
  saveData() {
    const formData = new FormData(this.form);
    const data = {};

    formData.forEach((value, key) => {
      if (key === 'gender' || key === 'body_shape' || key === 'skin_tone' || key === 'face_shape' || key === 'hair_type' || key === 'fashion_style' || key === 'budget') {
        data[key] = value;
      } else if (key === 'occasions' || key === 'favorite_colors') {
        if (!data[key]) data[key] = [];
        data[key].push(value);
      } else {
        data[key] = value;
      }
    });

    // Save image preview values to restore them on page refreshes
    const facePreview = document.getElementById('face-preview-img');
    const bodyPreview = document.getElementById('body-preview-img');
    if (facePreview && facePreview.src) data.face_photo_preview = facePreview.src;
    if (bodyPreview && bodyPreview.src) data.body_photo_preview = bodyPreview.src;

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Restores inputs back from localStorage
  restoreData() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      // Restore simple inputs (text, number, select)
      ['age', 'height', 'weight', 'brands'].forEach(id => {
        const el = document.getElementById(id);
        if (el && data[id]) el.value = data[id];
      });

      // Restore radios
      const radioKeys = ['gender', 'body_shape', 'skin_tone', 'face_shape', 'hair_type', 'fashion_style', 'budget'];
      radioKeys.forEach(key => {
        if (data[key]) {
          const radio = this.form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
          if (radio) radio.checked = true;
        }
      });

      // Restore multiple checkboxes (occasions & colors)
      ['occasions', 'favorite_colors'].forEach(key => {
        if (data[key] && Array.isArray(data[key])) {
          data[key].forEach(val => {
            const cb = this.form.querySelector(`input[name="${key}"][value="${val}"]`);
            if (cb) cb.checked = true;
          });
        }
      });

      // Restore photo previews
      if (data.face_photo_preview && data.face_photo_preview.startsWith('data:image')) {
        const zone = document.getElementById('face-upload-zone');
        const preview = zone.querySelector('.upload-preview');
        const previewImg = preview.querySelector('img');
        previewImg.src = data.face_photo_preview;
        preview.style.display = 'block';
      }

      if (data.body_photo_preview && data.body_photo_preview.startsWith('data:image')) {
        const zone = document.getElementById('body-upload-zone');
        const preview = zone.querySelector('.upload-preview');
        const previewImg = preview.querySelector('img');
        previewImg.src = data.body_photo_preview;
        preview.style.display = 'block';
      }

    } catch (e) {
      console.error('Error parsing restored onboarding state:', e);
    }
  }

  // Handle final submission redirect
  handleSubmit(e) {
    e.preventDefault();

    // Final check for photo uploads
    const faceInput = document.getElementById('face-photo');
    const bodyInput = document.getElementById('body-photo');
    const saved = JSON.parse(localStorage.getItem(this.storageKey) || '{}');

    const hasFaceImage = (faceInput.files && faceInput.files[0]) || saved.face_photo_preview;
    const hasBodyImage = (bodyInput.files && bodyInput.files[0]) || saved.body_photo_preview;

    if (!hasFaceImage || !hasBodyImage) {
      alert('Please upload both your Face and Full Body photos to finalize AI style calibration.');
      return;
    }

    // Merge physical characteristics to user profile data
    const userProfileRaw = localStorage.getItem('zivra_user_profile');
    let userProfile = userProfileRaw ? JSON.parse(userProfileRaw) : {};
    
    userProfile = {
      ...userProfile,
      gender: saved.gender || 'female',
      body_shape: saved.body_shape || 'rectangle',
      skin_tone: saved.skin_tone || 'light',
      face_shape: saved.face_shape || 'oval',
      hair_type: saved.hair_type || 'wavy',
      fashion_style: saved.fashion_style || 'minimalist',
      budget: saved.budget || 'premium'
    };
    localStorage.setItem('zivra_user_profile', JSON.stringify(userProfile));

    // Success and Clear cache
    alert('AI Style profile successfully calibrated! Entering Dashboard...');
    localStorage.removeItem(this.storageKey);
    window.location.href = 'home.html';
  }
}
