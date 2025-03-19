import { renderHeader } from "../components/header.js";
import { productService } from '../services/productService.js';
import { showToast } from '../utils/toast.js';

export const cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

async function addToCart(productId, variant = "20kg") {
    const products = await productService.fetchProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    showToast(`${product.title} added to cart`);

    const productQuantityDropdown = document.querySelector(`.js-product-quantity-dropdown-${productId}`);
    const quantity = Number(productQuantityDropdown.value);
    const existingItem = cart.find(
        (item) => item.id === productId && item.variant === variant
    );
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId,
            variant,
            quantity,
            deliveryOptionId: '1'
        });
    }
    saveCart();
    renderHeader();
}

//Calculate quantity of items in the cart
export function calculateCartQuantity() {
    let cartQty = 0;
    cart.forEach(cartItem => {
        cartQty += cartItem.quantity;
    });
    return cartQty;
}

export function listenerForAddToCart() {
    document.querySelectorAll(".js-add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const productCard =
                this.closest(".js-product-card") ||
                document.querySelector(".js-single-product-container");
            const productId = productCard.getAttribute("data-id");
            let variant = "20kg"; // Default variant

            // Check if user selected a different variant (only on product page)
            const selectedVariant = document.querySelector(".js-variant-radio:checked");
            if (selectedVariant) {
                variant = selectedVariant.value;
            }

            addToCart(productId, variant);
        });
    });
}

export function updateCartQuantity(productId, value) {
    let cartItem = cart.find((cartItem) => cartItem.productId === productId);
    cartItem.quantity = value;
    saveCart();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let cartItem = cart.find((cartItem) => cartItem.productId === productId);
    cartItem.deliveryOptionId = deliveryOptionId;
    saveCart();
}

export function deleteFromCart(i) {
    cart.splice(i, 1);
    saveCart();

    const cartItems = document.querySelectorAll('.js-cart-item');
    cartItems.forEach((item, index) => {
        if (index === i) {
            item.remove();
        }
    })

    const itemsContainer = document.querySelector('.js-cart-items-grid');
    let cartHTML = '';

    if (cart.length === 0) {
        cartHTML = `<div class="empty-cart-container">
                    <p class="mb-3 font-medium text-secondary shadow-2xl">Your Cart is empty</p>
                    <a href="/shop.html" class="shadow-2xl py-1.5 px-2.5 bg-primary font-bold text-white duration-150 ease-in-out hover:text-secondary border-3 border-accent hover:border-secondary rounded-lg"> 
                    View Products </a>
                </div>`
        itemsContainer.innerHTML = cartHTML;
    }
    renderHeader();
}