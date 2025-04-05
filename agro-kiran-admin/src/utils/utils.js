export function formatPriceINR(price) {
    if (price == null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

export function initializePasswordToggles() {
    document.querySelectorAll('.js-toggle-icon').forEach(icon => {
        icon.addEventListener("click", () => {
            const passwordInput = icon.closest('div').querySelector('input');
            const isPassword = passwordInput.type === "password";

            passwordInput.type = isPassword ? "text" : "password";
            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
        });
    });
}

export function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}