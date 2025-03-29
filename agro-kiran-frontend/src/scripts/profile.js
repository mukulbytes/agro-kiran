import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { showToast } from '../utils/toast.js';
import { requireAuth, getUserData, clearAuthData, setUserData } from '../utils/auth.js';
import { formatDate, formatPriceINR } from '../utils/utils.js';
import { showModal } from '../utils/modal.js';
import { userService } from '../services/userService.js';
import { addressService } from '../services/addressService.js';
import { orderService } from '../services/orderService.js';
import { renderAddresses, renderAddressForm } from '../components/addressComponents.js';

// Initialize page
async function initPage() {
    // Check authentication first
    if (!requireAuth()) {
        return; // This will redirect to login if not authenticated
    }

    renderHeader();
    renderFooter();
    await loadUserProfile();
    setupEventListeners();
    setupTabs();
}

// Load user profile data
async function loadUserProfile() {
    try {
        const profile = getUserData() || await userService.getProfile();
        renderProfile(profile);
        await loadAddresses();
        await loadOrders();
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load profile data', 'error');
    }
}

// Render profile data
function renderProfile(profile) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const profileForm = document.getElementById('profile-form');
    
    if (!nameInput || !emailInput || !profileForm) return;

    // Update input values and disable them
    nameInput.value = profile.name || '';
    emailInput.value = profile.email || '';
    nameInput.disabled = true;
    emailInput.disabled = true;

    // Store original values in the form's dataset
    profileForm.dataset.originalName = profile.name || '';
    profileForm.dataset.originalEmail = profile.email || '';

    // Remove any existing buttons
    profileForm.querySelectorAll('.js-edit-btn, .js-action-buttons').forEach(el => el.remove());

    // Add edit button to the card header
    const editButton = document.createElement('button');
    editButton.className = 'js-edit-btn absolute right-6 top-6 text-white hover:text-secondary';
    editButton.innerHTML = '<i class="fas fa-edit text-xl"></i>';
    profileForm.appendChild(editButton);

    // Create action buttons container (initially hidden)
    const actionButtons = document.createElement('div');
    actionButtons.className = 'js-action-buttons hidden flex justify-end gap-2 mt-4';
    actionButtons.innerHTML = `
        <button type="button" class="js-cancel-btn button-primary bg-red-600 px-5 py-1.5 rounded-lg">Cancel</button>
        <button type="button" class="js-save-btn button-primary bg-accent px-5 py-1.5 rounded-lg">Save Changes</button>
    `;
    profileForm.appendChild(actionButtons);

    // Add event listener for edit button
    editButton.addEventListener('click', handleEditProfile);
}

// Handle edit profile
async function handleEditProfile() {
    const profileForm = document.getElementById('profile-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const editButton = profileForm.querySelector('.js-edit-btn');
    const actionButtons = profileForm.querySelector('.js-action-buttons');

    const confirmed = await showModal({
        title: 'Edit Profile',
        message: 'Are you sure you want to edit your profile information?',
        confirmText: 'Edit',
        type: 'warning'
    });

    if (confirmed) {
        // Hide edit button and show action buttons
        editButton.classList.add('hidden');
        actionButtons.classList.remove('hidden');

        // Enable inputs
        nameInput.disabled = false;
        emailInput.disabled = false;
        nameInput.focus();

        // Remove any existing event listeners
        const saveBtn = actionButtons.querySelector('.js-save-btn');
        const cancelBtn = actionButtons.querySelector('.js-cancel-btn');
        const newSaveBtn = saveBtn.cloneNode(true);
        const newCancelBtn = cancelBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        // Add new event listeners
        newSaveBtn.addEventListener('click', async () => {
            try {
                const updatedData = {
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim()
                };

                // Only include fields that have changed
                const originalData = {
                    name: profileForm.dataset.originalName,
                    email: profileForm.dataset.originalEmail
                };

                const changedData = {};
                if (updatedData.name !== originalData.name) changedData.name = updatedData.name;
                if (updatedData.email !== originalData.email) changedData.email = updatedData.email;

                if (Object.keys(changedData).length === 0) {
                    showToast('No changes made', 'info');
                    resetProfileEditState();
                    return;
                }

                await userService.updateProfile(changedData);

                // Update the local storage with new user data
                const currentUserData = getUserData();
                const newUserData = { ...currentUserData, ...changedData };
                setUserData(newUserData);

                showToast('Profile updated successfully', 'success');
                resetProfileEditState();

                // Reload profile data to ensure UI is in sync
                await loadUserProfile();
            } catch (error) {
                console.error('Update error:', error);
                showToast(error.message || 'Failed to update profile', 'error');
            }
        });

        // Handle cancel button click
        newCancelBtn.addEventListener('click', () => {
            nameInput.value = profileForm.dataset.originalName;
            emailInput.value = profileForm.dataset.originalEmail;
            resetProfileEditState();
        });
    }
}

// Reset profile edit state
function resetProfileEditState() {
    const profileForm = document.getElementById('profile-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const editButton = profileForm.querySelector('.js-edit-btn');
    const actionButtons = profileForm.querySelector('.js-action-buttons');

    nameInput.disabled = true;
    emailInput.disabled = true;
    editButton.classList.remove('hidden');
    actionButtons.classList.add('hidden');
}

// Load and render addresses
async function loadAddresses() {
    try {
        const addresses = await addressService.getAddresses();
        renderAddresses(addresses, {
            onSelect: async () => {
                await loadAddresses(); // Reload addresses after any changes
            }
        });
    } catch (error) {
        console.error('Error loading addresses:', error);
        showToast('Failed to load addresses', 'error');
    }
}

// Load and render orders
async function loadOrders() {
    try {
        const orders = await orderService.getOrders();
        renderOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Failed to load orders', 'error');
    }
}

// Render orders
function renderOrders(orders) {
    const ordersGrid = document.querySelector('.js-orders-grid');
    if (!ordersGrid) return;
    if(orders.length === 0) {
        ordersGrid.innerHTML = `
        <div class="flex flex-col gap-5">
            <div class="text-white">No orders found</div>
            <a href="/shop.html" class="bg-primary w-fit text-white px-6 py-2 rounded-lg hover:bg-accent transition-colors"> SHOP NOW </a>
        </div>`;
        return;
    }

    ordersGrid.innerHTML = orders.map(order => `
        <div class="bg-white p-4 rounded-lg shadow-md">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <p class="text-sm text-gray-600">Order ID</p>
                    <p class="font-medium">#${order._id}</p>
                </div>
                <div class="text-right">
                    <p class="text-sm text-gray-600">Order Date</p>
                    <p class="font-medium">${formatDate(order.createdAt)}</p>
                </div>
            </div>
            <div class="mt-4">
                <p class="text-sm text-gray-600">Status</p>
                <p class="font-medium capitalize">${order.status.replace(/_/g, ' ')}</p>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <p class="font-bold">${formatPriceINR(order.totalAmount)}</p>
                <a href="order-tracking.html?id=${order._id}" class="text-primary underline">Track Order</a>
            </div>
        </div>
    `).join('');
}

// Setup tabs functionality
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active', 'border-primary'));
            tabContents.forEach(content => content.classList.add('hidden'));

            // Add active class to clicked tab and show corresponding content
            tab.classList.add('active', 'border-primary');
            const tabId = tab.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.remove('hidden');
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Password form submission
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordUpdate);
    }

    // Account actions
    const deactivateBtn = document.getElementById('deactivate-account');
    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', handleDeactivateAccount);
    }

    const deleteBtn = document.getElementById('delete-account');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', handleDeleteAccount);
    }

    // Add address button
    const addAddressBtn = document.getElementById('add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => {
            renderAddressForm(null, {
                onSave: async () => {
                    await loadAddresses(); // Reload addresses after saving
                }
            });
        });
    }
}

// Handle profile update
async function handleProfileUpdate(e) {
    e.preventDefault();
}

// Handle password update
async function handlePasswordUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const passwordData = {
        currentPassword: formData.get('current-password'),
        newPassword: formData.get('new-password'),
        confirmPassword: formData.get('confirm-password')
    };

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }

    try {
        await userService.updatePassword(passwordData);
        e.target.reset();
        showToast('Password updated successfully', 'success');
    } catch (error) {
        console.error('Password update error:', error);
        showToast(error.message || 'Failed to update password', 'error');
    }
}

// Handle account deactivation
async function handleDeactivateAccount() {
    const confirmed = await showModal({
        title: 'Deactivate Account',
        message: 'Are you sure you want to deactivate your account? You can reactivate it later by contacting support.',
        confirmText: 'Deactivate',
        type: 'warning'
    });

    if (confirmed) {
        try {
            await userService.deactivateAccount();
            clearAuthData();
            showToast('Account deactivated successfully', 'success');
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Account deactivation error:', error);
            showToast(error.message || 'Failed to deactivate account', 'error');
        }
    }
}

// Handle account deletion
async function handleDeleteAccount() {
    const confirmed = await showModal({
        title: 'Delete Account',
        message: 'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
        confirmText: 'Delete Account',
        type: 'danger'
    });

    if (confirmed) {
        try {
            await userService.deleteAccount();
            clearAuthData();
            showToast('Account deleted successfully', 'success');
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Account deletion error:', error);
            showToast(error.message || 'Failed to delete account', 'error');
        }
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 