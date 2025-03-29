import { renderHeader } from '../components/header.js';
import { renderFooter } from '../components/footer.js';
import { addressService } from '../services/addressService.js';
import { showToast } from '../utils/toast.js';
import { isAuthenticated } from '../utils/auth.js';
import { renderAddresses } from '../components/addressComponents.js';

// Initialize page
async function initPage() {
    renderHeader();
    renderFooter();
    setupUserInterface();
    await loadAddresses();
    setupEventListeners();
}

// Setup user interface based on authentication
function setupUserInterface() {
    const loggedInElements = document.querySelectorAll('.js-logged-in-only');
    const guestElements = document.querySelectorAll('.js-guest-only');

    if (isAuthenticated()) {
        loggedInElements.forEach(el => el.classList.remove('hidden'));
        guestElements.forEach(el => el.classList.add('hidden'));
    } else {
        loggedInElements.forEach(el => el.classList.add('hidden'));
        guestElements.forEach(el => el.classList.remove('hidden'));
    }
}

// Load and render addresses
async function loadAddresses() {
    if (!isAuthenticated()) return;

    try {
        const addresses = await addressService.getAddresses();
        renderAddresses(addresses, { 
            selectable: true, 
            onSelect: async (selectedAddress) => {
                if (selectedAddress) {
                    fillFormWithAddress(selectedAddress);
                }
                await loadAddresses();
            }
        });
    } catch (error) {
        console.error('Error loading addresses:', error);
        showToast('Error loading addresses', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    const addressForm = document.querySelector('#address-form');
    const fillDummyBtn = document.querySelector('#fill-dummy-data');
    const editButtons = document.querySelectorAll('.js-edit-field');

    addressForm.addEventListener('submit', handleAddressSubmit);
    fillDummyBtn?.addEventListener('click', fillDummyData);

    editButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.dataset.field;
            const input = document.querySelector(`[name="${field}"]`);
            input.disabled = false;
            input.focus();
            btn.style.display = 'none';
        });
    });
}

// Handle address form submission
async function handleAddressSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const saveAddress = formData.get('saveAddress') === 'on';
    
    try {
        // Get the original address data
        const originalAddress = JSON.parse(form.dataset.originalAddress || '{}');
        
        // Get all required fields
        const addressData = {
            fullName: form.querySelector('[name="fullName"]').value.trim(),
            phoneNumber: form.querySelector('[name="phoneNumber"]').value.trim(),
            street: form.querySelector('[name="street"]').value.trim(),
            city: form.querySelector('[name="city"]').value.trim(),
            state: form.querySelector('[name="state"]').value.trim(),
            pincode: form.querySelector('[name="pincode"]').value.trim()
        };

        // Add guest email for non-authenticated users
        if (!isAuthenticated()) {
            const guestEmail = form.querySelector('[name="email"]').value.trim();
            if (!guestEmail) {
                showToast('Please provide an email address for order updates', 'error');
                return;
            }
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(guestEmail)) {
                showToast('Please provide a valid email address', 'error');
                return;
            }
            addressData.guestEmail = guestEmail;
        }

        // Validate all required fields are present
        const requiredFields = ['fullName', 'phoneNumber', 'street', 'city', 'state', 'pincode'];
        const missingFields = requiredFields.filter(field => !addressData[field]);
        
        if (missingFields.length > 0) {
            showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        if (isAuthenticated() && saveAddress) {
            if (originalAddress._id) {
                // Update existing address
                await addressService.updateAddress(originalAddress._id, addressData);
                showToast('Address updated successfully', 'success');
            } else {
                // Create new address
                await addressService.addAddress(addressData);
                showToast('Address saved successfully', 'success');
            }
            await loadAddresses();
        }

        // Store complete address data in session storage for payment page
        sessionStorage.setItem('selectedAddressId', originalAddress._id || '');
        sessionStorage.setItem('shippingAddress', JSON.stringify(addressData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    } catch (error) {
        console.error('Error saving address:', error);
        const errorMessage = error.response?.data?.message || 'Error saving address';
        showToast(errorMessage, 'error');
    }
}

// Fill form with dummy data
function fillDummyData() {
    const dummyAddress = addressService.getDummyAddress();
    fillFormWithAddress(dummyAddress);
}

// Fill form with address data
function fillFormWithAddress(address) {
    const form = document.querySelector('#address-form');
    const fields = ['fullName', 'phoneNumber', 'street', 'city', 'state', 'pincode'];
    
    // Store complete original address data including _id
    form.dataset.originalAddress = JSON.stringify({
        _id: address._id,
        ...fields.reduce((obj, field) => {
            obj[field] = address[field] || '';
            return obj;
        }, {})
    });
    
    fields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
            input.value = address[field] || '';
            input.disabled = true;
            
            // Add change event listener to track modifications
            input.addEventListener('input', checkAddressModification);
        }
    });

    // Show edit buttons
    fields.forEach(field => {
        const fieldContainer = form.querySelector(`[name="${field}"]`).parentElement;
        if (!fieldContainer.querySelector('.js-edit-field')) {
            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.className = 'js-edit-field absolute right-3 top-9 text-accent hover:text-secondary';
            editButton.dataset.field = field;
            editButton.innerHTML = '<i class="fas fa-edit"></i>';
            fieldContainer.style.position = 'relative';
            fieldContainer.appendChild(editButton);

            editButton.addEventListener('click', () => {
                const input = form.querySelector(`[name="${field}"]`);
                input.disabled = false;
                input.focus();
                editButton.style.display = 'none';
                
                // Check for modifications when edit button is clicked
                checkAddressModification();
            });
        }
    });

    // Initialize save address checkbox state
    updateSaveAddressCheckbox(false);
}

// Check if the address has been modified
function checkAddressModification() {
    const form = document.querySelector('#address-form');
    const fields = ['fullName', 'phoneNumber', 'street', 'city', 'state', 'pincode'];
    
    // Get original address data
    const originalAddress = JSON.parse(form.dataset.originalAddress || '{}');
    
    // Compare current values with original values
    const isModified = fields.some(field => {
        const input = form.querySelector(`[name="${field}"]`);
        return input && input.value !== originalAddress[field];
    });
    
    // Update checkbox state based on modifications
    updateSaveAddressCheckbox(isModified);
}

// Update save address checkbox visibility and state
function updateSaveAddressCheckbox(showCheckbox) {
    const form = document.querySelector('#address-form');
    const saveAddressCheckbox = form.querySelector('[name="saveAddress"]');
    if (!saveAddressCheckbox || !isAuthenticated()) return;

    const checkboxContainer = saveAddressCheckbox.parentElement;
    
    if (showCheckbox) {
        saveAddressCheckbox.disabled = false;
        checkboxContainer.classList.remove('opacity-50');
        checkboxContainer.classList.remove('hidden');
    } else {
        saveAddressCheckbox.checked = false;
        saveAddressCheckbox.disabled = true;
        checkboxContainer.classList.add('opacity-50');
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage); 
document.addEventListener('DOMContentLoaded', initPage); 