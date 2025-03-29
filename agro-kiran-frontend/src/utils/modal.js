/**
 * Creates and shows a modal dialog
 * @param {Object} options Modal configuration options
 * @param {string} options.title Modal title
 * @param {string} options.message Modal message/content
 * @param {string} options.confirmText Text for confirm button
 * @param {string} options.cancelText Text for cancel button
 * @param {string} options.type Type of modal ('danger' | 'warning' | 'info')
 * @param {Function} options.onConfirm Callback function when confirmed
 * @returns {Promise} Resolves with true if confirmed, false if cancelled
 */
export function showModal({ 
    title, 
    message, 
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'info',
    onConfirm
}) {
    return new Promise((resolve) => {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn';

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-primary border-2 border-secondary rounded-xl p-6 max-w-md w-full shadow-2xl relative overflow-clip animate-slideIn';

        // Add hero image decoration
        modalContent.innerHTML = `
            <img src="assets/hero-Animated.png" alt="" class="absolute size-50 -top-28 -right-20 rounded-full mx-auto pointer-events-none blur-xs">
            
            <div class="space-y-4">
                <div class="flex items-center gap-3">
                    ${type === 'danger' ? '<i class="fas fa-exclamation-triangle text-red-500 text-xl"></i>' : 
                      type === 'warning' ? '<i class="fas fa-exclamation-circle text-amber-500 text-xl"></i>' :
                      '<i class="fas fa-info-circle text-secondary text-xl"></i>'}
                    <h3 class="text-xl font-semibold text-white">${title}</h3>
                </div>
                
                <p class="text-white/90">${message}</p>
                
                <div class="flex justify-end gap-3 mt-6">
                    <button class="js-modal-cancel button-primary bg-accent px-5 py-1.5 rounded-lg">
                        ${cancelText}
                    </button>
                    <button class="js-modal-confirm button-primary ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-accent'} px-5 py-1.5 rounded-lg">
                        ${confirmText}
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const confirmBtn = modalContent.querySelector('.js-modal-confirm');
        const cancelBtn = modalContent.querySelector('.js-modal-cancel');

        function closeModal(confirmed = false) {
            modalContainer.classList.remove('animate-fadeIn');
            modalContent.classList.remove('animate-slideIn');
            modalContent.classList.add('animate-slideOut');
            modalContainer.classList.add('animate-fadeOut');

            // Wait for animation to complete
            setTimeout(() => {
                modalContainer.remove();
                if (confirmed && onConfirm) {
                    onConfirm();
                }
                resolve(confirmed);
            }, 200);
        }

        confirmBtn.addEventListener('click', () => closeModal(true));
        cancelBtn.addEventListener('click', () => closeModal(false));

        // Close on background click
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeModal(false);
            }
        });

        // Add to DOM
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);
    });
} 