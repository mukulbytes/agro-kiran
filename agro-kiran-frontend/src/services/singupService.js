import { API_CONFIG } from '../config/api.js';
import { showToast } from '../utils/toast.js';

// Validation configurations
const VALIDATION_RULES = {
    name: {
        pattern: /^[a-zA-Z\s]{2,50}$/,
        minLength: 2,
        maxLength: 50,
        errorMessages: {
            required: "Name is required",
            pattern: "Name should only contain letters and spaces",
            length: "Name should be between 2 and 50 characters"
        }
    },
    email: {
        // RFC 5322 compliant email regex
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        errorMessages: {
            required: "Email is required",
            pattern: "Please enter a valid email address"
        }
    },
    password: {
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        minLength: 8,
        errorMessages: {
            required: "Password is required",
            pattern: "Password must include uppercase, lowercase, number and special character",
            length: "Password must be at least 8 characters long"
        }
    }
};

class SignupValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errorDisplays = new Map();
        this.debounceTimers = new Map();
        this.init();
    }

    init() {
        // Create error display elements for each input
        this.form.querySelectorAll('input').forEach(input => {
            const errorDisplay = document.createElement('div');
            errorDisplay.className = 'text-red-500 font-extralight text-sm mt-1 hidden';
            input.parentNode.appendChild(errorDisplay);
            this.errorDisplays.set(input.id, errorDisplay);

            // Add real-time validation
            input.addEventListener('input', () => this.debounceValidation(input));
            input.addEventListener('blur', () => this.validateField(input));
        });

        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    debounceValidation(input, delay = 500) {
        if (this.debounceTimers.has(input.id)) {
            clearTimeout(this.debounceTimers.get(input.id));
        }

        this.debounceTimers.set(
            input.id,
            setTimeout(() => this.validateField(input), delay)
        );
    }

    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.id;
        const errorDisplay = this.errorDisplays.get(fieldName);
        let error = '';

        // Required field validation
        if (!value) {
            error = VALIDATION_RULES[fieldName]?.errorMessages.required;
        }
        // Pattern validation
        else if (VALIDATION_RULES[fieldName]?.pattern && !VALIDATION_RULES[fieldName].pattern.test(value)) {
            error = VALIDATION_RULES[fieldName].errorMessages.pattern;
        }
        // Length validation
        else if (VALIDATION_RULES[fieldName]?.minLength && value.length < VALIDATION_RULES[fieldName].minLength) {
            error = VALIDATION_RULES[fieldName].errorMessages.length;
        }

        // Special case for confirm password
        if (fieldName === 'confirm-password') {
            const password = document.getElementById('password').value;
            if (value !== password) {
                error = "Passwords do not match";
            }
        }

        this.showError(errorDisplay, error);
        return !error;
    }

    showError(errorDisplay, error) {
        if (error) {
            errorDisplay.textContent = error;
            errorDisplay.classList.remove('hidden');
            errorDisplay.classList.add('block');
        } else {
            errorDisplay.classList.add('hidden');
            errorDisplay.classList.remove('block');
        }
    }

    validateForm() {
        let isValid = true;
        this.form.querySelectorAll('input').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        try {
            // Update UI to loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Signing up...';

            const formData = {
                name: this.form.querySelector('#name').value.trim(),
                email: this.form.querySelector('#email').value.trim(),
                password: this.form.querySelector('#password').value
            };

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Store token
            localStorage.setItem('token', data.token);

            // Show success toast and redirect
            showToast('Registration successful! Redirecting...', 'success');

            // Redirect after toast animation
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 1500);

        } catch (error) {
            showToast(error.message || 'An error occurred during signup', 'error');
            
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }
}

export const validationService = {
    SignupValidator
}; 