import { orderService } from '../services/orderService.js';
import { userService } from '../services/userService.js';
import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../utils/toast.js';
import { formatPriceINR } from '../utils/utils.js';
import { updatePaymentSummary } from '../components/paymentSummary.js';
import { getAuthToken, getUserId } from '../utils/auth.js';
import { deliveryOptions } from '../data/delivery.js';

// Initialize page
async function initPage() {
  renderHeader();
  renderFooter();
  await loadOrderSummary();
  setupEventListeners();
}

// Load and render order summary
async function loadOrderSummary() {
  try {
    updatePaymentSummary();
  } catch (error) {
    console.error('Error loading order summary:', error);
    showToast('Error loading order summary', 'error');
  }
}

// Setup event listeners
function setupEventListeners() {
  const placeOrderBtn = document.getElementById('place-order-btn');
  placeOrderBtn.addEventListener('click', handlePlaceOrder);
}

// Handle place order
async function handlePlaceOrder() {
  try {
    // Get shipping address from session storage
    const shippingAddress = JSON.parse(sessionStorage.getItem('shippingAddress'));
    if (!shippingAddress) {
      window.location.href = '/shipping.html';
      return;
    }

    // Get cart items
    const cart = await userService.getCart();
    if (!cart || cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    // Get delivery option ID from cart or use default
    let deliveryOptionId = cart[0]?.deliveryOptionId || '1';
    
    // Validate delivery option ID
    const validDeliveryOption = deliveryOptions.find(opt => opt.deliveryOptionId === deliveryOptionId);
    if (!validDeliveryOption) {
      deliveryOptionId = '1'; // Fallback to standard delivery if invalid
    }

    // Prepare order data
    const orderData = {
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        variant: item.variant
      })),
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phoneNumber: shippingAddress.phoneNumber,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode
      },
      deliveryOptionId
    };

    // Add user ID if authenticated, otherwise use guest email
    const userId = getUserId();
    if (userId) {
      orderData.userId = userId;
    } else {
      // For guest checkout, use email from shipping address
      if (!shippingAddress.guestEmail) {
        showToast('Missing guest email. Please fill shipping details again.', 'error');
        window.location.href = '/shipping.html';
        return;
      }
      orderData.guestEmail = shippingAddress.guestEmail;
    }

    // Create order
    const order = await orderService.createOrder(orderData);

    // Store order ID for confirmation page
    sessionStorage.setItem('lastOrderId', order._id);
    
    // Clear cart and shipping data
    await userService.clearCart();
    sessionStorage.removeItem('shippingAddress');

    showToast('Order placed successfully!', 'success');

    // Redirect to confirmation page
    window.location.href = '/order-confirmation.html';
  } catch (error) {
    console.error('Error placing order:', error);
    showToast(error.response?.data?.message || 'Error placing order. Please try again.', 'error');
  }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 