// Constants
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Get authentication token from localStorage
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Set authentication token in localStorage
export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove authentication token from localStorage
export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthToken();
}

// Store user data in localStorage
export function setUserData(userData) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

// Get user data from localStorage
export function getUserData() {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
}

// Get user ID from stored user data
export function getUserId() {
  const userData = getUserData();
  return userData ? userData.id : null;
}

// Clear all auth related data
export function clearAuthData() {
  clearAuthToken();
  localStorage.removeItem(USER_KEY);
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    // Store the current URL to redirect back after login
    sessionStorage.setItem('redirectUrl', window.location.pathname);
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

// Handle redirect after login
export function handleRedirectAfterLogin() {
  const redirectUrl = sessionStorage.getItem('redirectUrl') || '/profile.html';
  sessionStorage.removeItem('redirectUrl'); // Clear the stored redirect URL
  window.location.href = redirectUrl;
}

// Clear user data
export function clearUserData() {
  localStorage.removeItem(USER_KEY);
} 
