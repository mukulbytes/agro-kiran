import { cart, calculateCartQuantity } from "../data/cart.js";
import { formatPriceINR } from "../utils/utils.js";
import { productService } from "../services/productService.js";
import { deliveryOptions } from "../data/delivery.js";

export async function updatePaymentSummary() {
  const orderSummaryContainer = document.querySelector('.js-order-summary');
  const products = await productService.fetchProducts();

  //Payment Summary Variables and Calculation
  let itemsCost = 0, deliveryCost = 0, totalBeforeTax = 0, tax = 0, orderTotal = 0;

  for (const cartItem of cart) {
    const { productId, deliveryOptionId } = cartItem;
    const product = products.find(p => p.id === productId);
    if (!product) continue;

    const deliveryOption = deliveryOptions.find(d => d.deliveryOptionId === deliveryOptionId);
    
    itemsCost += cartItem.quantity * product.price[cartItem.variant];
    deliveryCost += deliveryOption ? deliveryOption.cost : 0;
  }

  orderTotal = itemsCost + deliveryCost;

  //DOM 
  let orderSummaryHTML = `
            <div class="text-secondary text-xl font-bold mb-5">Order Summary</div>
            <div class="mb-5 grid grid-cols-[1fr_auto] gap-2.5 border-b border-b-secondary pb-3">
              <div class="items">Items (${calculateCartQuantity()}):</div>
              <div class="price text-right font-bold">${formatPriceINR(itemsCost)}</div>
              <div class="shipping">Shipping & handling:</div>
              <div class="shipping-cost text-right font-bold">${formatPriceINR(deliveryCost)}</div>
          </div>

          <div class="order-total-grid grid grid-cols-[1fr_auto] gap-2.5 text-secondary text-lg font-bold">
            <div class="mb-5">Order total:</div>
            <div class="text-right">${formatPriceINR(orderTotal)}</div>
          </div>
          <button class="w-full py-3 bg-primary font-bold text-white duration-150 ease-in-out hover:text-secondary border-3 border-accent hover:border-secondary  rounded-xl cursor-pointer ${cart.length === 0 ? "opacity-30 pointer-events-none" : ""}" ${cart.length === 0 ? "disabled" : ""}>Place your order</button>
            `
  orderSummaryContainer.innerHTML = orderSummaryHTML;
}



