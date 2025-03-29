import { orderService } from '../services/orderService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../utils/toast.js';
import { formatPriceINR, formatDate } from '../utils/utils.js';

// Initialize page
async function initPage() {
  renderHeader();
  renderFooter();
  await loadOrderDetails();
}

// Load and render order details
async function loadOrderDetails() {
  try {
    const orderId = new URLSearchParams(window.location.search).get('id');
    if (!orderId) {
      showToast('Order ID not found', 'error');
      window.location.href = 'profile.html';
      return;
    }

    const order = await orderService.getOrderDetails(orderId);
    renderOrderDetails(order);
    updateOrderStatus(order.status, order.statusHistory);
  } catch (error) {
    console.error('Error loading order details:', error);
    showToast('Error loading order details', 'error');
  }
}

// Render order details
function renderOrderDetails(order) {
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
                <p class="font-medium">${item.product.title} (${item.size})</p>
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

// Update order status display
function updateOrderStatus(currentStatus, statusHistory) {
  const statusSteps = document.querySelectorAll('.status-step');
  const progressBar = document.querySelector('.js-progress-bar');
  
  // Define status order
  const statusOrder = ['order_received', 'packing', 'shipping', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  
  // Calculate progress percentage
  const progressPercentage = (currentIndex / (statusOrder.length - 1)) * 100;
  progressBar.style.width = `${progressPercentage}%`;

  // Update each status step
  statusSteps.forEach(step => {
    const status = step.dataset.status;
    const statusIndex = statusOrder.indexOf(status);
    const statusTime = statusHistory.find(h => h.status === status)?.timestamp;

    // Update circle and icon color
    const circle = step.querySelector('.status-circle');
    const icon = circle.querySelector('i');
    
    if (statusIndex <= currentIndex) {
      circle.classList.remove('border-gray-300');
      circle.classList.add('border-secondary');
      icon.classList.remove('text-gray-300');
      icon.classList.add('text-secondary');
    }

    // Update timestamp if available
    const timeEl = step.querySelector('.js-status-time');
    if (statusTime) {
      timeEl.textContent = formatDate(statusTime);
    }
  });
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 