import { renderHeader } from "../components/header.js";
import { productService } from '../services/productService.js';
import { showToast } from '../utils/toast.js';
import { userService } from '../services/userService.js';
import { isAuthenticated } from '../utils/auth.js';

async function saveCart() {
    let cart = await userService.getCart();
    // Ensure cart is always an array
    cart = cart || [];
    localStorage.setItem("cart", JSON.stringify(cart));
    
    if (isAuthenticated()) {
        try {
            const backendCart = cart.map(item => ({
                productId: item.productId,
                variant: item.variant,
                quantity: item.quantity,
                deliveryOptionId: item.deliveryOptionId
            }));
            await userService.updateCart(backendCart);
        } catch (error) {
            console.error('Error syncing cart with backend:', error);
            showToast('Error syncing cart with server', 'error');
        }
    }
}

async function addToCart(productId, variant = "20kg") {
    const products = await productService.fetchProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    showToast(`${product.title} added to cart`);

    const productQuantityDropdown = document.querySelector(`.js-product-quantity-dropdown-${productId}`);
    const quantity = Number(productQuantityDropdown.value);
    const cart = await userService.getCart();
    const existingItem = cart.find(
        (item) => item.productId === productId && item.variant === variant
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
export async function calculateCartQuantity() {
    const cart = await userService.getCart();
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

            // Check if user selected a different variant (scoped to the product card)
            const selectedVariant = productCard.querySelector(".js-variant-radio:checked");
            if (selectedVariant) {
                variant = selectedVariant.value;
            }

            addToCart(productId, variant);
        });
    });
}

export async function updateCartQuantity(productId, value, variant) {
    const cart = await userService.getCart();
    let cartItem = cart.find((cartItem) => cartItem.productId === productId && cartItem.variant === variant);
    if (cartItem) {
        cartItem.quantity = value;
        await saveCart();
    }
}

export async function updateDeliveryOption(productId, deliveryOptionId, variant) {
    const cart = await userService.getCart();
    let cartItem = cart.find((cartItem) => cartItem.productId === productId && cartItem.variant === variant);
    if (cartItem) {
        cartItem.deliveryOptionId = deliveryOptionId;
        await saveCart();
    }
}

export async function deleteFromCart(i) {
    let cart = await userService.getCart();
    cart.splice(i, 1);
    
    // Ensure cart is initialized as an array even when empty
    cart = cart || [];
    
    // Save empty cart to both localStorage and backend
    await saveCart();

    const cartItems = document.querySelectorAll('.js-cart-item');
    cartItems.forEach((item, index) => {
        if (index === i) {
            item.remove();
        }
    });

    const itemsContainer = document.querySelector('.js-cart-items-grid');
    
    // Show empty cart message when no items left
    if (cart.length === 0) {
        const emptyCartHTML = `<div class="empty-cart-container">
            <p class="mb-3 font-medium text-secondary shadow-2xl">Your Cart is empty</p>
            <a href="/shop.html" class="shadow-2xl py-1.5 px-2.5 bg-primary font-bold text-white duration-150 ease-in-out hover:text-secondary border-3 border-accent hover:border-secondary rounded-lg"> 
            View Products </a>
        </div>`;
        itemsContainer.innerHTML = emptyCartHTML;
    }
    
    renderHeader();
}