import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { API_CONFIG } from "../config/api.js";

class LoginHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            // Update UI to loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Logging in...';

            const formData = {
                email: this.form.querySelector('#email').value.trim(),
                password: this.form.querySelector('#password').value
            };

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Show success message with animation
            const successDiv = document.createElement('div');
            successDiv.className = 'text-green-500 font-bold text-sm mt-4 text-center opacity-0 transition-opacity duration-300';
            successDiv.textContent = 'Login successful! Redirecting...';
            this.form.appendChild(successDiv);

            // Fade in success message
            requestAnimationFrame(() => {
                successDiv.classList.remove('opacity-0');
            });

            // Redirect after animation
            setTimeout(() => {
                window.location.href = '/profile.html';
            }, 1500);

        } catch (error) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'text-red-500 font-bold text-sm mt-4 text-center';
            errorDiv.textContent = error.message || 'An error occurred during login';
            this.form.appendChild(errorDiv);
            
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}

// Password visibility toggle functionality
function initializePasswordToggles() {
    document.querySelectorAll('.js-toggle-icon').forEach(icon => {
        icon.addEventListener("click", () => {
            const passwordInput = icon.closest('div').querySelector('input');
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";
            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initializePasswordToggles();

    // Initialize login handler
    new LoginHandler('login-form');
}); 