import { productService } from '../services/productService.js';
import { showToast } from '../utils/toast.js';
import { userService } from '../services/userService.js';
import { isAuthenticated } from '../utils/auth.js';

async function saveWishlist() {
    let wishlist = await userService.getWishlist();
    // Ensure wishlist is always an array
    wishlist = wishlist || [];
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    
    if (isAuthenticated()) {
        try {
            await userService.updateWishlist(wishlist);
        } catch (error) {
            console.error('Error syncing wishlist with backend:', error);
            showToast('Error syncing wishlist with server', 'error');
        }
    }
}

async function addToWishlist(productId) {
    if (!productId) return;

    const products = await productService.fetchProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const wishlist = await userService.getWishlist();
    const existingItem = wishlist.find(item => item.productId === productId);

    if (existingItem) {
        showToast(`${product.title} is already in your wishlist`);
        return;
    }

    try {
        await userService.updateWishlist(productId);
        showToast(`${product.title} added to wishlist`);
        updateWishlistUI(productId, true);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        showToast('Failed to add to wishlist', 'error');
    }
}

async function removeFromWishlist(productId) {
    if (!productId) return;

    const products = await productService.fetchProducts();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    try {
        await userService.removeFromWishlist(productId);
        showToast(`${product.title} removed from wishlist`);
        updateWishlistUI(productId, false);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        showToast('Failed to remove from wishlist', 'error');
    }
}

export async function isInWishlist(productId) {
    const wishlist = await userService.getWishlist();
    return wishlist.some(item => item.productId === productId);
}

function updateWishlistUI(productId, isWishlisted) {
    // Update all instances of the heart icon for this product
    document.querySelectorAll(`.js-wishlist-btn[data-product-id="${productId}"]`).forEach(btn => {
        const heartIcon = btn.querySelector('.heart-icon');
        if (isWishlisted) {
            heartIcon.classList.remove('text-white');
            heartIcon.classList.add('text-red-500');
        } else {
            heartIcon.classList.remove('text-red-500');
            heartIcon.classList.add('text-white');
        }
    });
}

export function listenerForWishlist() {
    document.querySelectorAll(".js-wishlist-btn").forEach((button) => {
        button.addEventListener("click", async function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!isAuthenticated()) {
                showToast('Please login to use wishlist', 'error');
                return;
            }

            const productId = this.getAttribute("data-product-id");
            const isWishlisted = await isInWishlist(productId);

            if (isWishlisted) {
                await removeFromWishlist(productId);
            } else {
                await addToWishlist(productId);
            }
        });
    });
}

export async function initializeWishlistState() {
    const wishlist = await userService.getWishlist();
    wishlist.forEach(item => {
        updateWishlistUI(item.productId, true);
    });
} 