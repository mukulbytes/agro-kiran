import { renderAdminNav } from '../components/adminNav.js';
import { productService } from '../services/productService.js';
import { API_CONFIG } from '../config/api.js';
import { getAuthHeaders } from '../utils/adminAuth.js';

let products = [];
let filteredProducts = [];
let searchTimeout;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Render admin navigation
  renderAdminNav();
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Load initial products
  loadProducts();
});

// Event Listeners
function initializeEventListeners() {
  // Delete Modal Buttons
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  cancelDeleteBtn.addEventListener('click', hideDeleteModal);

  // Search and Filter
  const searchInput = document.querySelector('input[placeholder="Search products..."]');
  const categorySelect = document.querySelector('select');
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.toLowerCase();

    // Debounce search
    searchTimeout = setTimeout(() => {
      filterProducts(query, categorySelect.value);
    }, 300);
  });

  categorySelect.addEventListener('change', () => {
    filterProducts(searchInput.value.toLowerCase(), categorySelect.value);
  });

  // Initialize category dropdown with actual categories
  initializeCategoryDropdown();
}

// Product CRUD Operations
async function loadProducts() {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to load products');
    }

    const data = await response.json();
    products = data.data;
    filteredProducts = [...products];
    renderProducts(filteredProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Failed to load products', 'error');
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS}/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    await loadProducts(); // Reload products list
    showToast('Product deleted successfully', 'success');
  } catch (error) {
    console.error('Error deleting product:', error);
    showToast('Failed to delete product', 'error');
  }
}

// Helper Functions
function renderProducts(products) {
  const tableBody = document.getElementById('products-table-body');
  
  tableBody.innerHTML = products.map(product => `
    <tr class="border-b border-primary/10">
      <td class="py-3 px-4">
        <img src="${product.img['5kg']}" alt="${product.title}" class="h-12 w-12 object-cover rounded-lg">
      </td>
      <td class="py-3 px-4">${product.title}</td>
      <td class="py-3 px-4">${product.category.main} - ${product.category.sub}</td>
      <td class="py-3 px-4">
        5kg: ₹${product.price['5kg']}<br>
        20kg: ₹${product.price['20kg']}
      </td>
      <td class="py-3 px-4">
        5kg: ${product.stock['5kg']}<br>
        20kg: ${product.stock['20kg']}
      </td>
      <td class="py-3 px-4">
        <span class="bg-${getStatusColor(product.status)}/20 text-${getStatusColor(product.status)} px-2 py-1 rounded-full text-sm">
          ${formatStatus(product.status)}
        </span>
      </td>
      <td class="py-3 px-4">
        <a href="admin-product-form.html?id=${product.id}" class="text-secondary hover:text-white transition-colors mr-2">
          <i class="fas fa-edit"></i>
        </a>
        <button onclick="showDeleteModal('${product.id}')" class="text-red-500 hover:text-red-400 transition-colors">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function filterProducts(searchTerm, category) {
  let filtered = [...products];

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(product =>
      product.title.toLowerCase().includes(searchTerm) ||
      product.shortDesc.toLowerCase().includes(searchTerm) ||
      product.category.main.toLowerCase().includes(searchTerm) ||
      product.category.sub.toLowerCase().includes(searchTerm)
    );
  }

  // Apply category filter
  if (category) {
    filtered = filtered.filter(product =>
      product.category.main === category
    );
  }

  filteredProducts = filtered;
  renderProducts(filteredProducts);
}

function initializeCategoryDropdown() {
  const categorySelect = document.querySelector('select');
  const mainCategories = [
    "Inorganic Fertilizers",
    "Organic Fertilizers",
    "Slow Release Fertilizers",
    "Liquid Fertilizers",
    "Foliar Fertilizers",
    "Specialty Fertilizers"
  ];

  categorySelect.innerHTML = `
    <option value="">All Categories</option>
    ${mainCategories.map(category => `
      <option value="${category}">${category}</option>
    `).join('')}
  `;
}

function showDeleteModal(productId) {
  const modal = document.getElementById('delete-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  
  confirmDeleteBtn.onclick = () => {
    deleteProduct(productId);
    hideDeleteModal();
  };
  
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function hideDeleteModal() {
  const modal = document.getElementById('delete-modal');
  modal.classList.remove('flex');
  modal.classList.add('hidden');
}

function getStatusColor(status) {
  switch (status) {
    case 'active':
      return 'green-500';
    case 'inactive':
      return 'amber-500';
    case 'out_of_stock':
      return 'red-500';
    default:
      return 'gray-500';
  }
}

function formatStatus(status) {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function showToast(message, type = 'success') {
  // Implement toast notification
  console.log(`${type}: ${message}`);
}

// Make functions available globally for onclick handlers
window.showDeleteModal = showDeleteModal; 