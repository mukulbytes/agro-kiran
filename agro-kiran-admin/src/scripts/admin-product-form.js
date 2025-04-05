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

  // Add Usage Entry
  document.getElementById('add-usage').addEventListener('click', () => {
    const container = document.getElementById('usage-container');
    const template = container.children[0].cloneNode(true);
    // Clear input values
    template.querySelectorAll('input').forEach(input => input.value = '');
    container.appendChild(template);
  });

  // Add FAQ Entry
  document.getElementById('add-faq').addEventListener('click', () => {
    const container = document.getElementById('faq-container');
    const template = container.children[0].cloneNode(true);
    // Clear input values
    template.querySelectorAll('input').forEach(input => input.value = '');
    container.appendChild(template);
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
  
  // Fill basic fields
  form.querySelector('[name="productId"]').value = product.id;
  form.querySelector('[name="title"]').value = product.title;
  form.querySelector('[name="shortDesc"]').value = product.shortDesc;
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

  // Fill longDesc fields
  if (product.longDesc) {
    form.querySelector('[name="overview"]').value = product.longDesc.overview || '';

    // Fill benefits
    if (product.longDesc.benefits?.length) {
      form.querySelector('[name="benefits"]').value = product.longDesc.benefits.join('\n');
    }

    // Fill recommended usage
    if (product.longDesc.recommendedUsage?.length) {
      const usageContainer = document.getElementById('usage-container');
      usageContainer.innerHTML = ''; // Clear existing entries
      
      product.longDesc.recommendedUsage.forEach(usage => {
        const template = document.createElement('div');
        template.className = 'usage-entry grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-primary/30 rounded-lg';
        template.innerHTML = `
          <div>
            <label class="block text-white/70 text-sm mb-1">Crop</label>
            <input type="text" name="usage_crop[]" value="${usage.crop}"
                   class="w-full bg-primary/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>
          <div>
            <label class="block text-white/70 text-sm mb-1">Application Timing</label>
            <input type="text" name="usage_timing[]" value="${usage.applicationTiming}"
                   class="w-full bg-primary/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>
          <div>
            <label class="block text-white/70 text-sm mb-1">Dosage per Acre</label>
            <input type="text" name="usage_dosage[]" value="${usage.dosagePerAcre}"
                   class="w-full bg-primary/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>
          <div>
            <label class="block text-white/70 text-sm mb-1">Notes (Optional)</label>
            <input type="text" name="usage_notes[]" value="${usage.notes || ''}"
                   class="w-full bg-primary/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>
        `;
        usageContainer.appendChild(template);
      });
    }

    // Fill nutrient content
    if (product.longDesc.nutrientContent) {
      form.querySelector('[name="nutrient_nitrogen"]').value = product.longDesc.nutrientContent.nitrogen || '';
      form.querySelector('[name="nutrient_phosphorus"]').value = product.longDesc.nutrientContent.phosphorus || '';
      form.querySelector('[name="nutrient_potassium"]').value = product.longDesc.nutrientContent.potassium || '';
      form.querySelector('[name="nutrient_form"]').value = product.longDesc.nutrientContent.form || '';
    }

    // Fill arrays as newline-separated text
    if (product.longDesc.applicationMethod?.length) {
      form.querySelector('[name="application_methods"]').value = product.longDesc.applicationMethod.join('\n');
    }
    if (product.longDesc.storageHandling?.length) {
      form.querySelector('[name="storage_handling"]').value = product.longDesc.storageHandling.join('\n');
    }
    if (product.longDesc.precautions?.length) {
      form.querySelector('[name="precautions"]').value = product.longDesc.precautions.join('\n');
    }
    if (product.longDesc.soilCompatibility?.length) {
      form.querySelector('[name="soil_compatibility"]').value = product.longDesc.soilCompatibility.join('\n');
    }
    if (product.longDesc.regulatoryCompliance?.length) {
      form.querySelector('[name="regulatory_compliance"]').value = product.longDesc.regulatoryCompliance.join('\n');
    }
    if (product.longDesc.compatibleFertilizers?.length) {
      form.querySelector('[name="compatible_fertilizers"]').value = product.longDesc.compatibleFertilizers.join('\n');
    }
    if (product.longDesc.incompatibilities?.length) {
      form.querySelector('[name="incompatibilities"]').value = product.longDesc.incompatibilities.join('\n');
    }

    // Fill FAQs
    if (product.longDesc.faqs?.length) {
      const faqContainer = document.getElementById('faq-container');
      faqContainer.innerHTML = ''; // Clear existing entries
      
      product.longDesc.faqs.forEach(faq => {
        const template = document.createElement('div');
        template.className = 'faq-entry grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary/30 rounded-lg';
        template.innerHTML = `
          <div>
            <label class="block text-white/70 text-sm mb-1">Question</label>
            <input type="text" name="faq_question[]" value="${faq.question}"
                   class="w-full bg-primary/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>
          <div>
            <label class="block text-white/70 text-sm mb-1">Answer</label>
            <input type="text" name="faq_answer[]" value="${faq.answer}"
                   class="w-full bg-primary/20 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary">
          </div>
        `;
        faqContainer.appendChild(template);
      });
    }
  }
  
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
      featured: formData.get('featured') === 'true',
      longDesc: {
        overview: formData.get('overview'),
        benefits: formData.get('benefits').split('\n').filter(b => b.trim()),
        recommendedUsage: Array.from(document.querySelectorAll('.usage-entry')).map(entry => ({
          crop: entry.querySelector('[name="usage_crop[]"]').value,
          applicationTiming: entry.querySelector('[name="usage_timing[]"]').value,
          dosagePerAcre: entry.querySelector('[name="usage_dosage[]"]').value,
          notes: entry.querySelector('[name="usage_notes[]"]').value || undefined
        })),
        nutrientContent: {
          nitrogen: formData.get('nutrient_nitrogen') || undefined,
          phosphorus: formData.get('nutrient_phosphorus') || undefined,
          potassium: formData.get('nutrient_potassium') || undefined,
          form: formData.get('nutrient_form') || undefined
        },
        applicationMethod: formData.get('application_methods').split('\n').filter(m => m.trim()),
        storageHandling: formData.get('storage_handling').split('\n').filter(s => s.trim()),
        precautions: formData.get('precautions').split('\n').filter(p => p.trim()),
        soilCompatibility: formData.get('soil_compatibility').split('\n').filter(s => s.trim()),
        regulatoryCompliance: formData.get('regulatory_compliance').split('\n').filter(r => r.trim()),
        compatibleFertilizers: formData.get('compatible_fertilizers').split('\n').filter(f => f.trim()),
        incompatibilities: formData.get('incompatibilities').split('\n').filter(i => i.trim()),
        faqs: Array.from(document.querySelectorAll('.faq-entry')).map(entry => ({
          question: entry.querySelector('[name="faq_question[]"]').value,
          answer: entry.querySelector('[name="faq_answer[]"]').value
        })).filter(faq => faq.question.trim() && faq.answer.trim())
      }
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