import { renderHeader, navToggle, toggleUserActions } from "./components/header.js";
import { renderHighlights } from "./components/keyhighlights.js";
import { renderFeaturedProducts } from "./components/products.js";
import { initSwiper, renderTestimonials } from "./components/testimonials.js";


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
