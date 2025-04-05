import { protectAdminRoute, getAdminData, logoutAdmin, hasPermission } from '../utils/adminAuth.js';

// Admin Navigation Component
export const renderAdminNav = () => {
  // Protect the route
  if (!protectAdminRoute()) return;

  const adminData = getAdminData();
  const adminSidebar = document.querySelector('.js-admin-sidebar');

  adminSidebar.innerHTML = `
    <aside class="fixed top-0 left-0 w-64 h-screen bg-accent border-r-2 border-secondary">
      <div class="p-6">
        <h2 class="text-white text-2xl font-bold mb-1">Agro Kiran</h2>
        <p class="text-white/70 text-sm">Admin Dashboard</p>
      </div>

      <nav class="mt-4">
        <a href="admin-dashboard.html" class="flex items-center text-white px-6 py-3 hover:bg-primary/20 transition-colors">
          <i class="fas fa-chart-line w-6"></i>
          <span>Dashboard</span>
        </a>

        ${hasPermission('manageProducts') ? `
          <a href="admin-products.html" class="flex items-center text-white px-6 py-3 hover:bg-primary/20 transition-colors">
            <i class="fas fa-box w-6"></i>
            <span>Products</span>
          </a>
        ` : ''}

        ${hasPermission('manageOrders') ? `
          <a href="admin-orders.html" class="flex items-center text-white px-6 py-3 hover:bg-primary/20 transition-colors">
            <i class="fas fa-shopping-cart w-6"></i>
            <span>Orders</span>
          </a>
        ` : ''}
      </nav>

      <div class="absolute bottom-0 left-0 w-full p-6">
        <div class="flex items-center justify-between text-white mb-4">
          <div>
            <p class="font-medium">${adminData.name}</p>
            <p class="text-sm text-white/70">${adminData.email}</p>
          </div>
          <button onclick="handleLogout()" class="text-secondary hover:text-white transition-colors">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>
  `;

  // Add logout handler to window object
  window.handleLogout = logoutAdmin;
}; 