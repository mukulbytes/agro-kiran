// Toast timeout tracker
const messageTimeouts = {};

export function showToast(message, type = 'success') {
    let toastContainer = document.getElementById("toast-container");

    // Create toast container if it doesn't exist
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.className = "fixed top-20 right-5 flex flex-col gap-2 z-50";
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast flex items-center gap-3 px-4 py-2 rounded-lg shadow-lg opacity-0 translate-x-5 transition-all duration-300 ease-in-out ${
        type === 'error' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-primary'
    }`;

    // Set icon based on type
    const icon = type === 'error' ? 'fa-circle-xmark' : 'fa-circle-check';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon} ${type === 'error' ? 'text-red-500' : 'text-accent'}"></i>
        <p>${message}</p>
    `;

    // Append toast to the container
    toastContainer.appendChild(toast);

    // Force reflow and trigger fade-in effect
    requestAnimationFrame(() => {
        toast.classList.remove("opacity-0", "translate-x-5");
        toast.classList.add("opacity-100", "translate-x-0");
    });

    // Clear existing timeout for this message if it exists
    if (messageTimeouts[message]) {
        clearTimeout(messageTimeouts[message]);
    }

    // Hide and remove toast after 2 seconds
    const timeoutId = setTimeout(() => {
        toast.classList.remove("opacity-100");
        toast.classList.add("opacity-0");

        setTimeout(() => toast.remove(), 300); // Remove after fade-out transition
    }, 2000);

    messageTimeouts[message] = timeoutId;
} 