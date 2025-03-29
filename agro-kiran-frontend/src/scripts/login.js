import { renderHeader } from "../components/header.js";
import { renderFooter } from "../components/footer.js";
import { API_CONFIG } from "../config/api.js";
import { showToast } from "../utils/toast.js";
import { setAuthToken, setUserData, handleRedirectAfterLogin } from '../utils/auth.js';
import { initializePasswordToggles } from "../utils/utils.js";
import { userService } from "../services/userService.js";

// Initialize page
function initPage() {
    renderHeader();
    renderFooter();
    initializePasswordToggles();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store auth token and user data
        setAuthToken(data.token);
        setUserData(data.user);

        // Handle cart merging after login
        await userService.handleCartAfterLogin();

        showToast('Login successful', 'success');

        // Redirect to appropriate page
        handleRedirectAfterLogin();
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message || 'Login failed', 'error');
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 