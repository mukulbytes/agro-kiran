import { renderFooter } from "../components/footer.js";
import { renderHeader, toggleUserActions } from "../components/header.js";
import { renderHighlights } from "../components/keyhighlights.js";
import { renderFeaturedProducts } from "../components/products.js";
import { initSwiper, renderTestimonials } from "../components/testimonials.js";


document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    renderHighlights();
    toggleUserActions();
    renderFeaturedProducts();
    renderTestimonials();
    const swiper = initSwiper();
})
