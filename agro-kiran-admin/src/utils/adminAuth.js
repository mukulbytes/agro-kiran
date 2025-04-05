// Get admin token from localStorage
export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

// Get admin data from localStorage
export const getAdminData = () => {
  const data = localStorage.getItem('adminData');
  return data ? JSON.parse(data) : null;
};

// Check if admin is logged in
export const isAdminLoggedIn = () => {
  return !!getAdminToken();
};

// Get headers for API requests
export const getAuthHeaders = () => {
  const token = getAdminToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Check if admin has specific permission
export const hasPermission = (permission) => {
  const adminData = getAdminData();
  if (!adminData) return false;
  
  // Super admin has all permissions
  if (adminData.role === 'super_admin') return true;
  
  return adminData.permissions[permission] === true;
};

// Protect admin routes
export const protectAdminRoute = () => {
  if (!isAdminLoggedIn()) {
    window.location.href = '/admin-login.html';
    return false;
  }
  return true;
};

// Logout admin
export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
  window.location.href = '/admin-login.html';
}; 