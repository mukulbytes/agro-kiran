import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { renderProductsGrid } from "../components/products.js";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderProductsGrid();
}
);