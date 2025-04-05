import { API_CONFIG } from '../config/api.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  // Redirect to dashboard if already logged in
  const token = localStorage.getItem('adminToken');
  if (token) {
    window.location.href = './admin-dashboard.html';
    return;
  }

  async function attemptLogin(formData, retries = 3) {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      if (retries > 0 && (error.message.includes('timeout') || error.message.includes('failed to fetch'))) {
        // Wait for 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        return attemptLogin(formData, retries - 1);
      }
      throw error;
    }
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable form and show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="inline-block animate-spin mr-2">↻</span> Signing In...';
    errorMessage.classList.add('hidden');

    try {
      const formData = new FormData(loginForm);
      const data = await attemptLogin(formData);

      // Store the token
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminData', JSON.stringify({
        id: data.data.id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        permissions: data.data.permissions
      }));

      // Redirect to admin dashboard
      window.location.href = './admin-dashboard.html';
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message;
      errorMessage.classList.remove('hidden');
      
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}); 