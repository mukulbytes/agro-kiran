import { addressService } from '../services/addressService.js';
import { showToast } from '../utils/toast.js';
import { showModal } from '../utils/modal.js';
import { isAuthenticated } from '../utils/auth.js';

export function renderAddressForm(address = null, options = { asModal: false, onSave: null }) {
    const formHTML = `
        <div class="bg-primary p-6 rounded-lg border-2 border-secondary shadow-2xl relative overflow-clip ${options.asModal ? '' : 'mt-6'}">
            <img src="assets/hero-Animated.png" alt="" class="absolute size-50 -top-28 -right-20 rounded-full mx-auto pointer-events-none blur-xs">
            <h3 class="text-xl font-bold text-white mb-6">${address ? 'Edit' : 'Add New'} Address</h3>
            <form id="address-form" class="space-y-4" ${address ? `data-edit-id="${address._id}"` : ''}>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">Address Title</label>
                        <input type="text" name="title" placeholder="e.g., Home, Work, Office"
                            value="${address?.title || ''}"
                            class="profile-inputs">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">Full Name<span class="text-red-500">*</span></label>
                        <input type="text" name="fullName" required
                            value="${address?.fullName || ''}"
                            class="profile-inputs">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">Phone Number<span class="text-red-500">*</span></label>
                        <input type="tel" name="phoneNumber" required
                            value="${address?.phoneNumber || ''}"
                            class="profile-inputs">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">Street Address<span class="text-red-500">*</span></label>
                        <input type="text" name="street" required
                            value="${address?.street || ''}"
                            class="profile-inputs">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">City<span class="text-red-500">*</span></label>
                        <input type="text" name="city" required
                            value="${address?.city || ''}"
                            class="profile-inputs">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">State<span class="text-red-500">*</span></label>
                        <input type="text" name="state" required
                            value="${address?.state || ''}"
                            class="profile-inputs">
                    </div>
                    <div class="flex flex-col gap-1">
                        <label class="profile-labels">Pincode<span class="text-red-500">*</span></label>
                        <input type="text" name="pincode" required
                            value="${address?.pincode || ''}"
                            class="profile-inputs">
                    </div>
                </div>
                <div class="flex justify-end gap-4 mt-6">
                    <button type="button" class="js-close-form button-primary bg-accent px-5 py-1.5 rounded-lg">
                        Cancel
                    </button>
                    <button type="submit" class="button-primary bg-accent px-5 py-1.5 rounded-lg">
                        ${address ? 'Update' : 'Save'} Address
                    </button>
                </div>
            </form>
        </div>
    `;

    if (options.asModal) {
        // Create modal container with animations
        const modalContainer = document.createElement('div');
        modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn';

        // Create modal content with animations
        const modalContent = document.createElement('div');
        modalContent.className = 'max-w-3xl w-full animate-slideIn';
        modalContent.innerHTML = formHTML;

        // Add click handler to close modal when clicking outside
        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                closeAddressModal(modalContainer);
            }
        });

        // Add to DOM
        modalContainer.appendChild(modalContent);
        document.body.appendChild(modalContainer);

        // Setup form event listeners
        setupAddressFormListeners(modalContainer, address, options.onSave);
    } else {
        const formContainer = document.getElementById('js-address-form');
        formContainer.innerHTML = formHTML;
        formContainer.classList.remove('hidden');

        // Setup form event listeners
        setupAddressFormListeners(formContainer, address, options.onSave);
    }
}

function closeAddressModal(container) {
    // Add exit animations
    container.classList.remove('animate-fadeIn');
    container.classList.add('animate-fadeOut');
    const modalContent = container.querySelector('div:first-child');
    modalContent.classList.remove('animate-slideIn');
    modalContent.classList.add('animate-slideOut');

    // Remove modal after animation
    setTimeout(() => {
        container.remove();
    }, 200);
}

function setupAddressFormListeners(container, address, onSave) {
    const form = container.querySelector('#address-form');
    const closeButtons = container.querySelectorAll('.js-close-form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const addressData = Object.fromEntries(formData.entries());
        const editId = e.target.dataset.editId;

        try {
            if (editId) {
                await addressService.updateAddress(editId, addressData);
                showToast('Address updated successfully', 'success');
            } else {
                await addressService.addAddress(addressData);
                showToast('Address added successfully', 'success');
            }

            if (onSave) {
                await onSave();
            }

            if (container.classList.contains('fixed')) {
                closeAddressModal(container);
            } else {
                container.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            showToast(error.response?.data?.message || 'Error saving address', 'error');
        }
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (container.classList.contains('fixed')) {
                closeAddressModal(container);
            } else {
                container.classList.add('hidden');
            }
        });
    });
}

export function renderAddresses(addresses, options = { selectable: false, onSelect: null }) {
    const addressesGrid = document.querySelector('.js-addresses-grid');
    if (!addressesGrid) return;

    if (!addresses || addresses.length === 0) {
        addressesGrid.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-white/75 mb-4">No saved addresses yet</p>
            </div>
        `;
        return;
    }

    addressesGrid.innerHTML = addresses.map(address => `
        <div class="bg-primary p-6 rounded-lg border-2 border-secondary shadow-2xl relative overflow-clip">
            <img src="assets/hero-Animated.png" alt="" class="absolute size-50 -top-28 -right-20 rounded-full mx-auto pointer-events-none blur-xs">
            
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-semibold text-white">${address.title}</h3>
                ${address.isDefault ? '<span class="text-xs text-secondary font-medium">Default</span>' : ''}
            </div>

            <div class="text-sm text-white/75 space-y-1">
                <p>${address.fullName}</p>
                <p>${address.street}</p>
                <p>${address.city}, ${address.state} - ${address.pincode}</p>
                <p>Phone: ${address.phoneNumber}</p>
            </div>

            <div class="flex justify-end gap-2 mt-4">
                ${options.selectable ? 
                    `<button class="js-select-address button-primary bg-accent px-3 py-1 rounded-lg text-sm" data-id="${address._id}">
                        Select Address
                    </button>` : 
                    `<button class="js-edit-address button-primary bg-accent px-3 py-1 rounded-lg text-sm" data-id="${address._id}">
                        Edit
                    </button>
                    <button class="js-delete-address button-primary bg-red-600 px-3 py-1 rounded-lg text-sm" data-id="${address._id}">
                        Delete
                    </button>`
                }
            </div>
        </div>
    `).join('');

    // Add event listeners
    if (options.selectable) {
        addressesGrid.querySelectorAll('.js-select-address').forEach(btn => {
            btn.addEventListener('click', async () => {
                const addressId = btn.dataset.id;
                const address = addresses.find(a => a._id === addressId);
                if (address && options.onSelect) {
                    await options.onSelect(address);
                }
            });
        });
    } else {
        // Edit button listeners
        addressesGrid.querySelectorAll('.js-edit-address').forEach(btn => {
            btn.addEventListener('click', () => {
                const addressId = btn.dataset.id;
                const address = addresses.find(a => a._id === addressId);
                if (address) {
                    renderAddressForm(address, { asModal: true, onSave: options.onSelect });
                }
            });
        });

        // Delete button listeners
        addressesGrid.querySelectorAll('.js-delete-address').forEach(btn => {
            btn.addEventListener('click', async () => {
                const addressId = btn.dataset.id;
                const confirmed = await showModal({
                    title: 'Delete Address',
                    message: 'Are you sure you want to delete this address?',
                    confirmText: 'Delete',
                    type: 'danger'
                });

                if (confirmed) {
                    try {
                        await addressService.deleteAddress(addressId);
                        showToast('Address deleted successfully', 'success');
                        if (options.onSelect) {
                            await options.onSelect();
                        }
                    } catch (error) {
                        console.error('Error deleting address:', error);
                        showToast(error.response?.data?.message || 'Error deleting address', 'error');
                    }
                }
            });
        });
    }
} 