import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { initializePasswordToggles } from "../utils/utils.js";
import { validationService } from "../services/singupService.js";

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
    initializePasswordToggles();

    // Initialize form validation
    new validationService.SignupValidator('signup-form');
});
