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
            id: productId,
            variant,
            quantity,
            deliveryOptionId: '1'
        });
    }
    saveCart();
    renderHeader();
    console.log(cart);
}

export function listenerForAddToCart() {
    document.querySelectorAll(".js-add-to-cart").forEach((button) => {
        button.addEventListener("click", function () {
            const productCard =
                this.closest(".js-product-card") ||
                document.querySelector(".js-single-product-container");
            const productId = productCard.getAttribute("data-id");
            console.log(productId);

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