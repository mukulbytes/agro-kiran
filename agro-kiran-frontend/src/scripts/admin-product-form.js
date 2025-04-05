import { renderAdminNav } from '../components/adminNav.js';
import { API_CONFIG } from '../config/api.js';
import { getAuthHeaders, getAdminToken } from '../utils/adminAuth.js';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  // Render admin navigation
  renderAdminNav();
  
  // Initialize event listeners
  initializeEventListeners();
  
  // Check if we're editing an existing product
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  
  if (productId) {
    loadProduct(productId);
    document.getElementById('page-title').textContent = 'Edit Product';
    // Make product ID field readonly when editing
    document.querySelector('[name="productId"]').value = productId;
    document.querySelector('[name="productId"]').readOnly = true;
  }
});

// Event Listeners
function initializeEventListeners() {
  // Product Form
  const productForm = document.getElementById('product-form');
  productForm.addEventListener('submit', handleProductSubmit);

  // Image Preview
  const imageInputs = productForm.querySelectorAll('input[type="file"]');
  imageInputs.forEach(input => {
    input.addEventListener('change', handleImagePreview);
  });

  // Product ID validation
  const productIdInput = productForm.querySelector('[name="productId"]');
  productIdInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  });
}

// Load existing product data
async function loadProduct(productId) {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to load product');
    }

    const { data: product } = await response.json();
    fillFormWithProduct(product);
  } catch (error) {
    console.error('Error loading product:', error);
    showToast('Failed to load product', 'error');
  }
}

// Fill form with product data
function fillFormWithProduct(product) {
  const form = document.getElementById('product-form');
  
  // Fill form fields
  form.querySelector('[name="productId"]').value = product.id;
  form.querySelector('[name="title"]').value = product.title;
  form.querySelector('[name="shortDesc"]').value = product.shortDesc;
  form.querySelector('[name="longDesc"]').value = product.longDesc || '';
  form.querySelector('[name="highlight1"]').value = product.highlights.li1;
  form.querySelector('[name="highlight2"]').value = product.highlights.li2;
  form.querySelector('[name="highlight3"]').value = product.highlights.li3;
  form.querySelector('[name="price5kg"]').value = product.price['5kg'];
  form.querySelector('[name="price20kg"]').value = product.price['20kg'];
  form.querySelector('[name="stock5kg"]').value = product.stock['5kg'];
  form.querySelector('[name="stock20kg"]').value = product.stock['20kg'];
  form.querySelector('[name="categoryMain"]').value = product.category.main;
  form.querySelector('[name="categorySub"]').value = product.category.sub;
  form.querySelector('[name="status"]').value = product.status;
  form.querySelector('[name="featured"]').value = product.featured;
  
  // Show image previews
  const preview5kg = document.getElementById('image-preview-5kg');
  const preview20kg = document.getElementById('image-preview-20kg');
  if (product.img['5kg']) {
    preview5kg.src = product.img['5kg'];
    preview5kg.classList.remove('hidden');
  }
  if (product.img['20kg']) {
    preview20kg.src = product.img['20kg'];
    preview20kg.classList.remove('hidden');
  }
}

// Handle form submission
async function handleProductSubmit(event) {
  event.preventDefault();
  
  try {
    const formData = new FormData(event.target);
    const productId = formData.get('productId');
    const isEditing = !!document.querySelector('[name="productId"]').readOnly;
    
    // Create product data object
    const productData = {
      id: productId,
      title: formData.get('title'),
      shortDesc: formData.get('shortDesc'),
      longDesc: formData.get('longDesc') || '',
      highlights: {
        li1: formData.get('highlight1'),
        li2: formData.get('highlight2'),
        li3: formData.get('highlight3')
      },
      price: {
        "5kg": Number(formData.get('price5kg')),
        "20kg": Number(formData.get('price20kg'))
      },
      stock: {
        "5kg": Number(formData.get('stock5kg')),
        "20kg": Number(formData.get('stock20kg'))
      },
      category: {
        main: formData.get('categoryMain'),
        sub: formData.get('categorySub')
      },
      status: formData.get('status'),
      featured: formData.get('featured') === 'true'
    };

    const url = isEditing 
      ? `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS}/${productId}`
      : `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN.PRODUCTS}`;

    // Get file inputs
    const image5kg = formData.get('image5kg');
    const image20kg = formData.get('image20kg');

    // If there are new images, send as FormData
    if (image5kg?.size > 0 || image20kg?.size > 0) {
      const formDataToSend = new FormData();
      
      // Append product data with the correct key 'data'
      formDataToSend.append('data', JSON.stringify(productData));
      
      // Append images if they exist
      if (image5kg?.size > 0) {
        formDataToSend.append('image5kg', image5kg);
      }
      if (image20kg?.size > 0) {
        formDataToSend.append('image20kg', image20kg);
      }
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        // Remove Content-Type header to let browser set it with boundary
        headers: {
          'Authorization': `Bearer ${getAdminToken()}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save product');
      }
    } else {
      // If no new images, send as JSON
      const response = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save product');
      }
    }

    // Redirect back to products list
    window.location.href = 'admin-products.html';
  } catch (error) {
    console.error('Error saving product:', error);
    showToast(error.message || 'Failed to save product', 'error');
  }
}

// Handle image preview
function handleImagePreview(event) {
  const file = event.target.files[0];
  const size = event.target.dataset.size;
  const imagePreview = document.getElementById(`image-preview-${size}`);
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.classList.add('hidden');
  }
}

function showToast(message, type = 'success') {
  // Implement toast notification
  console.log(`${type}: ${message}`);
}