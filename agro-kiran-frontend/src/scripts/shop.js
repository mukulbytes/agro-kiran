import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { renderProductsGrid } from "../data/products.js";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderProductsGrid();
}
);