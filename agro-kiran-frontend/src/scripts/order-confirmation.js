import { orderService } from '../services/orderService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../utils/toast.js';
import { formatPriceINR, formatDate } from '../utils/utils.js';

// Initialize page
async function initPage() {
  renderHeader();
  renderFooter();
  await processOrder();
}

// Process order and show appropriate state
async function processOrder() {
  const orderId = sessionStorage.getItem('lastOrderId');
  if (!orderId) {
    showErrorState();
    return;
  }

  try {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get order details
    const order = await orderService.getOrderDetails(orderId);
    
    // Show success state
    showSuccessState(order);
  } catch (error) {
    console.error('Error processing order:', error);
    showErrorState();
  }
}

// Show success state with order details
function showSuccessState(order) {
  // Hide loading state
  document.getElementById('loading-state').classList.add('hidden');
  
  // Show success state
  const successState = document.getElementById('success-state');
  successState.classList.remove('hidden');

  // Render order details
  const detailsEl = document.querySelector('.js-order-details');
  detailsEl.innerHTML = `
    <div class="space-y-4">
      <div class="flex justify-between items-start">
        <div>
          <p class="text-sm text-gray-600">Order ID</p>
          <p class="font-medium">#${order._id}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-600">Order Date</p>
          <p class="font-medium">${formatDate(order.createdAt)}</p>
        </div>
      </div>

      <hr class="border-gray-300">

      <div>
        <h3 class="font-semibold mb-2">Items</h3>
        <div class="space-y-2">
          ${order.items.map(item => `
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">${item.product.title} (${item.variant})</p>
                <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
              </div>
              <p class="font-medium">${formatPriceINR(item.price * item.quantity)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <hr class="border-gray-300">

      <div>
        <h3 class="font-semibold mb-2">Shipping Address</h3>
        <div class="text-sm text-gray-600">
          <p>${order.shippingAddress.fullName}</p>
          <p>${order.shippingAddress.street}</p>
          <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
          <p>Phone: ${order.shippingAddress.phoneNumber}</p>
        </div>
      </div>

      <hr class="border-gray-300">

      <div class="flex justify-between items-center">
        <p class="text-gray-600">Subtotal</p>
        <p class="font-medium">${formatPriceINR(order.totalAmount - order.deliveryOption.cost)}</p>
      </div>

      <div class="flex justify-between items-center">
        <p class="text-gray-600">Delivery</p>
        <p class="font-medium">${order.deliveryOption.cost === 0 ? 'FREE' : formatPriceINR(order.deliveryOption.cost)}</p>
      </div>

      <hr class="border-gray-300">

      <div class="flex justify-between items-center text-lg font-bold">
        <p>Total</p>
        <p>${formatPriceINR(order.totalAmount)}</p>
      </div>

      <div class="text-center text-sm text-gray-600">
        <p>Estimated Delivery: ${formatDate(order.deliveryOption.estimatedDeliveryDate)}</p>
      </div>
    </div>
  `;
}

// Show error state
function showErrorState() {
  // Hide loading state
  document.getElementById('loading-state').classList.add('hidden');
  
  // Show error state
  document.getElementById('error-state').classList.remove('hidden');
}

// Setup retry functionality
document.getElementById('retry-btn')?.addEventListener('click', () => {
  // Hide error state
  document.getElementById('error-state').classList.add('hidden');
  
  // Show loading state
  document.getElementById('loading-state').classList.remove('hidden');
  
  // Try processing order again
  processOrder();
});

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 