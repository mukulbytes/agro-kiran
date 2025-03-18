export function formatPriceINR(price) {
    // Return ₹0 if price is undefined, null, or not a number
    if (price === undefined || price === null || isNaN(price)) {
        return "₹0";
    }
    return price.toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
}