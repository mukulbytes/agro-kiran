import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { renderSingleProduct } from "../data/products.js";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderSingleProduct();
}
);
