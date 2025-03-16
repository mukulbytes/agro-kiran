import { renderHeader } from "../components/header";
import { products } from "./products";

export const cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}
// localStorage.clear();

// Toast timeout tracker
const addedMessageTimeouts = {};

function showToast(productName) {
    let toastContainer = document.getElementById("toast-container");

    // Create toast container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.className = "fixed top-5 right-5 flex flex-col gap-2 z-50";
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className =
        "toast flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg bg-primary text-secondary opacity-0 translate-x-5 transition-all duration-300 ease-in-out";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-accent"></i>
        <p>${productName} added to cart</p>
    `;

    // Append toast to the container
    toastContainer.appendChild(toast);

    // Force reflow and trigger fade-in effect
    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "translate-x-5");
        toast.classList.add("opacity-100", "translate-x-0");
    });

    // Hide and remove toast after 2 seconds
    const timeoutId = setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");

        setTimeout(() => toast.remove(), 300); // Remove after fade-out transition
    }, 2000);

    addedMessageTimeouts[productName] = timeoutId;
}

function addToCart(productId, variant = "20kg") {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    showToast(product.title); // Show toast notification

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

//Update delivery option id in the cart
export function updateDeliveryOption(productId, deliveryOptionId) {
    let cartItem = cart.find((cartItem) => cartItem.productId === productId);
    cartItem.deliveryOptionId = deliveryOptionId;

    //Export Cart To local storage
    saveCart();
}

//Delete Products from cart
export function deleteFromCart(i) {
    //Remvove item from cart
    cart.splice(i, 1);

    //Export cart to localStorage
    saveCart();

    //Remove cart item from checkout page
    const cartItems = document.querySelectorAll('.js-cart-item');
    cartItems.forEach((item, index) => {
        if (index === i) {
            item.remove();
        }
    })

    //Added this check so if cart becomes empty after deletion then the view products dialog is rendered
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