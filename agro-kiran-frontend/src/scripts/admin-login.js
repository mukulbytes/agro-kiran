import { API_CONFIG } from '../config/api.js';
import { getAuthHeaders } from '../utils/adminAuth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');

  // Redirect to dashboard if already logged in
  const token = localStorage.getItem('adminToken');
  if (token) {
    window.location.href = '/admin-dashboard.html';
    return;
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
      // Hide any previous error messages
      errorMessage.classList.add('hidden');
      
      const formData = new FormData(loginForm);
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
      window.location.href = '/admin-dashboard.html';
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message;
      errorMessage.classList.remove('hidden');
    }
  });
}); 