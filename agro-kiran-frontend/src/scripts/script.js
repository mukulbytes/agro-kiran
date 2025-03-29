import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { renderHighlights } from "../components/keyhighlights.js";
import { renderFeaturedProducts } from "../data/products.js";
import { initSwiper, renderTestimonials } from "../components/testimonials.js";


document.addEventListener('DOMContentLoaded', () => {
    renderHeader();
    renderFooter();
    renderHighlights();
    renderFeaturedProducts();
    renderTestimonials();
    const swiper = initSwiper();
})
