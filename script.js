import { renderHeader, navToggle, toggleUserActions } from "./src/components/header.js";
import { renderHighlights } from "./src/components/keyhighlights.js";
import { renderFeaturedProducts } from "./src/components/products.js";
import { initSwiper, renderTestimonials } from "./src/components/testimonials.js";


document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderHighlights();
    toggleUserActions();
    renderFeaturedProducts();
    let icon = document.getElementById("icon");
    let black = document.getElementById("black");
    icon.addEventListener('click', navToggle);
    black.addEventListener('click', navToggle);
    renderTestimonials();
    const swiper = initSwiper();
})
