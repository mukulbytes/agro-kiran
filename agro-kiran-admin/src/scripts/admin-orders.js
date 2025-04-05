import { renderAdminNav } from '../components/adminNav.js';
import { formatPriceINR, formatDate } from '../utils/utils.js';
import { showToast } from '../utils/toast.js';
import { API_CONFIG } from '../config/api.js';
import { getAuthHeaders } from '../utils/adminAuth.js';

// State management
let currentFilter = '';
let currentSearch = '';
let selectedOrderId = null;

// Initialize page
async function initPage() {
  renderAdminNav();
  setupEventListeners();
  await loadOrders();
}

// Setup event listeners
function setupEventListeners() {
  // Filter and search
  const statusFilter = document.getElementById('status-filter');
  const searchInput = document.getElementById('search-input');
  const retryBtn = document.getElementById('retry-btn');
  const cancelStatusBtn = document.getElementById('cancel-status-update');
  const confirmStatusBtn = document.getElementById('confirm-status-update');

  if (statusFilter) {
    statusFilter.addEventListener('change', handleFilterChange);
  }
  
  if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
  }

  // Modal
  if (cancelStatusBtn) {
    cancelStatusBtn.addEventListener('click', closeStatusModal);
  }
  
  if (confirmStatusBtn) {
    confirmStatusBtn.addEventListener('click', handleStatusUpdate);
  }

  // Retry button
  if (retryBtn) {
    retryBtn.addEventListener('click', loadOrders);
  }

  // Filter form
  const filterForm = document.getElementById('filter-form');
  if (filterForm) {
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loadOrders();
    });
  }

  // Status update buttons
  document.getElementById('orders-table').addEventListener('click', (e) => {
    if (e.target.classList.contains('status-btn')) {
      const orderId = e.target.dataset.orderId;
      const newStatus = e.target.dataset.status;
      updateOrderStatus(orderId, newStatus);
    }
  });
}

// Load orders with filtering and search
async function loadOrders() {
  showLoadingState();

  try {
    const params = new URLSearchParams();
    
    // Add filter and search parameters if they exist
    if (currentFilter) {
      params.append('status', currentFilter);
    }
    if (currentSearch) {
      params.append('search', currentSearch);
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/orders?${params}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to load orders' }));
      throw new Error(errorData.message || 'Failed to load orders');
    }

    const { data: orders } = await response.json();
    renderOrders(orders);
    hideLoadingState();
  } catch (error) {
    console.error('Error loading orders:', error);
    showToast('Failed to load orders', 'error');
    showErrorState();
  }
}

// Render orders in the table
function renderOrders(orders) {
  const tableBody = document.getElementById('orders-table-body');
  
  if (!orders.length) {
    showEmptyState();
    return;
  }

  tableBody.innerHTML = orders.map(order => `
    <tr class="border-b border-gray-200 hover:bg-gray-50">
      <td class="px-6 py-4">#${order._id}</td>
      <td class="px-6 py-4">
        ${order.user ? order.user.name : order.guestInfo.email}
      </td>
      <td class="px-6 py-4">${formatDate(order.createdAt)}</td>
      <td class="px-6 py-4">${formatPriceINR(order.totalAmount)}</td>
      <td class="px-6 py-4">
        <span class="px-3 py-1 rounded-full text-sm ${getStatusClass(order.status)}">
          ${formatStatus(order.status)}
        </span>
      </td>
      <td class="px-6 py-4">
        <button 
          class="text-primary hover:text-accent mr-4"
          onclick="window.location.href='order-tracking.html?id=${order._id}'">
          <i class="fas fa-eye"></i>
        </button>
        <button 
          class="text-secondary hover:text-accent"
          onclick="openStatusModal('${order._id}', '${order.status}')">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Update order status
async function handleStatusUpdate() {
  const newStatus = document.getElementById('status-select').value;

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/orders/${selectedOrderId}/status`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    showToast('Order status updated successfully');
    closeStatusModal();
    await loadOrders();
  } catch (error) {
    console.error('Error updating order status:', error);
    showToast('Failed to update order status', 'error');
  }
}

// Handle filter change
function handleFilterChange(event) {
  currentFilter = event.target.value;
  loadOrders();
}

// Handle search
let searchTimeout;
function handleSearch(event) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentSearch = event.target.value;
    loadOrders();
  }, 300);
}

// Modal functions
function openStatusModal(orderId, currentStatus) {
  selectedOrderId = orderId;
  document.getElementById('status-select').value = currentStatus;
  document.getElementById('status-modal').classList.remove('hidden');
}

function closeStatusModal() {
  selectedOrderId = null;
  document.getElementById('status-modal').classList.add('hidden');
}

// UI state functions
function showLoadingState() {
  document.getElementById('loading-state').classList.remove('hidden');
  document.getElementById('empty-state').classList.add('hidden');
  document.getElementById('error-state').classList.add('hidden');
  document.getElementById('orders-table-body').innerHTML = '';
}

function hideLoadingState() {
  document.getElementById('loading-state').classList.add('hidden');
}

function showEmptyState() {
  document.getElementById('empty-state').classList.remove('hidden');
}

function showErrorState() {
  document.getElementById('error-state').classList.remove('hidden');
  document.getElementById('loading-state').classList.add('hidden');
}

// Helper functions
function getStatusClass(status) {
  const classes = {
    order_received: 'bg-blue-100 text-blue-800',
    packing: 'bg-yellow-100 text-yellow-800',
    shipping: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

function formatStatus(status) {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

// Make modal functions globally accessible
window.openStatusModal = openStatusModal;

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    // Reload orders to show updated status
    loadOrders();
    showToast('Order status updated successfully');
  } catch (error) {
    console.error('Error updating order status:', error);
    showToast('Failed to update order status', 'error');
  }
}
