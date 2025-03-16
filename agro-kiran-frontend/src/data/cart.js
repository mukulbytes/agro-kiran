import { products } from "./products";

const cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productId, variant = "20kg") {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId && item.variant === variant);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            variant,
            quantity: 1
        });
    }
    saveCart();
    console.log(cart);

}

export function listenerForAddToCart() {
    document.querySelectorAll(".js-add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productCard = this.closest(".js-product-card") || document.querySelector(".js-single-product-container");
            const productId = productCard.getAttribute("data-id");
            console.log(productId);

            let variant = "20kg";  // Default variant

            // Check if the user selected a different variant (only on product page)
            const selectedVariant = document.querySelector(".js-variant-radio:checked");
            if (selectedVariant) {
                variant = selectedVariant.value;
            }

            addToCart(productId, variant);
        });
    });
}


