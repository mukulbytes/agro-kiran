import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { updateCartSummary } from "../components/cartSummary.js";
import { updatePaymentSummary } from "../components/paymentSummary.js";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    updatePaymentSummary();
    updateCartSummary();
    renderFooter();
}
);

