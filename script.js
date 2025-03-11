import { renderFooter } from "./public/components/footer.js";
import { renderHeader, navToggle, toggleUserActions } from "./public/components/header.js";
import { renderHighlights } from "./public/components/keyhighlights.js";
import { renderFeaturedProducts } from "./public/components/products.js";
import { initSwiper, renderTestimonials } from "./public/components/testimonials.js";


document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
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
