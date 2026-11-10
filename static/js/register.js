/**
 * Zivra Authentication - Register Page
 * Django Compatible Version
 */

document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
    initPasswordStrengthMeter();
    initFormValidation();
});

/* ==========================================
   Password Show / Hide
========================================== */

function initPasswordToggles() {

    const toggleButtons = document.querySelectorAll('.auth-input-icon-btn');

    toggleButtons.forEach(button => {

        button.addEventListener('click', function (e) {

            e.preventDefault();

            const input = document.getElementById(
                this.dataset.target
            );

            if (!input) return;

            if (input.type === "password") {

                input.type = "text";

                this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
                `;

            } else {

                input.type = "password";

                this.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
                `;
            }

        });

    });

}

/* ==========================================
   Password Strength Meter
========================================== */

function initPasswordStrengthMeter() {

    const passwordInput = document.getElementById("password");
    const strengthBar = document.getElementById("strength-bar");
    const strengthText = document.getElementById("strength-text");

    if (!passwordInput) return;

    passwordInput.addEventListener("input", () => {

        const password = passwordInput.value;

        strengthBar.className = "strength-bar";
        strengthText.className = "strength-text";

        if (password.length === 0) {

            strengthText.textContent = "";
            return;

        }

        let score = 0;

        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (password.length < 6) {

            strengthBar.classList.add("weak");
            strengthText.classList.add("weak");
            strengthText.textContent = "Too Short";

        }

        else if (score <= 1) {

            strengthBar.classList.add("weak");
            strengthText.classList.add("weak");
            strengthText.textContent = "Weak Password";

        }

        else if (score <= 3) {

            strengthBar.classList.add("medium");
            strengthText.classList.add("medium");
            strengthText.textContent = "Medium Password";

        }

        else {

            strengthBar.classList.add("strong");
            strengthText.classList.add("strong");
            strengthText.textContent = "Strong Password";

        }

    });

}

/* ==========================================
   Form Validation
========================================== */

function initFormValidation() {

    const form = document.getElementById("register-form");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        let isValid = true;

        const password = document.getElementById("password");
        const confirmPassword = document.getElementById("confirm-password");
        const terms = document.getElementById("terms");

        // Reset errors

        document.querySelectorAll(".auth-input").forEach(input => {
            input.style.borderColor = "";
        });

        // Required fields

        document.querySelectorAll(".auth-input[required]").forEach(input => {

            if (input.value.trim() === "") {

                isValid = false;
                input.style.borderColor = "#ff3b30";

            }

        });

        // Password match

        if (password.value !== confirmPassword.value) {

            isValid = false;
            confirmPassword.style.borderColor = "#ff3b30";
            alert("Passwords do not match.");

        }

        // Terms

        if (!terms.checked) {

            isValid = false;
            alert("Please accept the Terms & Conditions.");

        }

        // Stop only if invalid

        if (!isValid) {

            e.preventDefault();

        }

        // If valid, Django automatically receives the POST request.

    });

}