/**
 * Zivra Authentication - Login Page interactions
 * 
 * Includes:
 * 1. Password Visibility Toggle (Show/Hide)
 * 2. Form Validation (Email syntax & Password check)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggle();
  initFormValidation();
});

/**
 * 1. Password Visibility Toggle
 * Toggles input type between 'password' and 'text' and updates the visual eye icon.
 */
function initPasswordToggle() {
  const toggleBtn = document.querySelector('.auth-input-icon-btn');
  const passwordInput = document.getElementById('password');
  
  if (!toggleBtn || !passwordInput) return;

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const isPassword = passwordInput.getAttribute('type') === 'password';
    
    if (isPassword) {
      passwordInput.setAttribute('type', 'text');
      toggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      `;
    } else {
      passwordInput.setAttribute('type', 'password');
      toggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      `;
    }
  });
}

/**
 * 2. Form Validation
 * Checks syntax and adds red error highlights to invalid inputs.
 */
function initFormValidation() {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form) return;

  form.addEventListener('submit', function(e) {

    emailInput.style.borderColor = '';
    passwordInput.style.borderColor = '';

    let isValid = true;

    if (!emailInput.value.trim()) {
      emailInput.style.borderColor = '#FF3B30';
      isValid = false;
    }

    if (!passwordInput.value.trim()) {
      passwordInput.style.borderColor = '#FF3B30';
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault();   // Stop only if validation fails
    }

    // If valid, DON'T stop the form.
    // Django will receive the POST request automatically.
  });
}
