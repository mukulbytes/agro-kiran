import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    renderProductsGrid();
}
);