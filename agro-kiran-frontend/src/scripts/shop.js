import { renderFooter } from "../components/footer.js";
import { renderHeader } from "../components/header.js";
import { renderFilteredProducts } from '../data/products.js';
import { productService } from '../services/productService.js';

let products = [];
let filteredProducts = [];
let searchTimeout;
let currentSort = '';
let currentFilter = '';

document.addEventListener("DOMContentLoaded", async () => {
    renderHeader();
    renderFooter();

    // Fetch all products
    products = await productService.fetchProducts();
    filteredProducts = [...products];

    // Initial render
    const container = document.querySelector('.js-products-grid');
    renderFilteredProducts(container, filteredProducts);

    // Search input handler
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');

    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();

        // Show/hide suggestions container
        if (query.length > 0) {
            suggestionsContainer.classList.remove('hidden');
        } else {
            suggestionsContainer.classList.add('hidden');
            filteredProducts = applyFiltersAndSort();
            renderFilteredProducts(container, filteredProducts);
            return;
        }

        // Debounce search
        searchTimeout = setTimeout(() => {
            // Filter products based on search query
            const suggestions = products.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.shortDesc.toLowerCase().includes(query) ||
                product.category.main.toLowerCase().includes(query) ||
                product.category.sub.toLowerCase().includes(query)
            );

            // Render suggestions
            suggestionsContainer.innerHTML = suggestions.length ?
                suggestions.map(product => `
                    <div class="suggestion-item p-2 hover:bg-gray-100 cursor-pointer" data-id="${product.id}">
                        <div class="flex items-center gap-2">
                            <img src="${product.img["20kg"]}" class="w-12 h-12 object-contain" alt="${product.title}" />
                            <div>
                                <div class="font-semibold text-primary">${product.title}</div>
                                <div class="text-sm text-accent">${product.category.main} - ${product.category.sub}</div>
                            </div>
                        </div>
                    </div>
                `).join('') :
                '<div class="p-2 text-gray-500">No products found</div>';

            // Add click handlers to suggestions
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const selectedProduct = products.find(p => p.id === item.dataset.id);
                    searchInput.value = selectedProduct.title;
                    suggestionsContainer.classList.add('hidden');
                    filteredProducts = [selectedProduct];
                    renderFilteredProducts(container, filteredProducts);
                });
            });

            // Update main product grid
            filteredProducts = suggestions;
            renderFilteredProducts(container, filteredProducts);
        }, 300);
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.classList.add('hidden');
        }
    });

    // Sort handlers
    const sortDropdown = document.getElementById('sort-dropdown');
    const sortButton = document.getElementById('sort-button');
    const sortButtonText = sortButton.querySelector('span');

    // Sort button handler
    sortButton.addEventListener('click', () => {
        sortDropdown.classList.toggle('hidden');
        document.getElementById('filter-dropdown').classList.add('hidden');
    });

    // Sort options handler
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;
            currentSort = value;
            sortButtonText.textContent = text;
            sortDropdown.classList.add('hidden');
            filteredProducts = applyFiltersAndSort();
            renderFilteredProducts(container, filteredProducts);
        });
    });

    // Filter handlers
    const filterDropdown = document.getElementById('filter-dropdown');
    const filterButton = document.getElementById('filter-button');
    const filterButtonText = filterButton.querySelector('span');

    // Filter button handler
    filterButton.addEventListener('click', () => {
        filterDropdown.classList.toggle('hidden');
        sortDropdown.classList.add('hidden');
    });

    // Filter options handler
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', () => {
            const value = option.dataset.value;
            const text = option.textContent;
            currentFilter = value;
            filterButtonText.textContent = text;
            filterDropdown.classList.add('hidden');
            filteredProducts = applyFiltersAndSort();
            renderFilteredProducts(container, filteredProducts);
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!sortButton.contains(e.target) && !sortDropdown.contains(e.target)) {
            sortDropdown.classList.add('hidden');
        }
        if (!filterButton.contains(e.target) && !filterDropdown.contains(e.target)) {
            filterDropdown.classList.add('hidden');
        }
    });
});

function applyFiltersAndSort() {
    const searchInput = document.getElementById('search-input');
    let result = [...products];

    // Apply search filter
    const searchQuery = searchInput.value.toLowerCase();
    if (searchQuery) {
        result = result.filter(product =>
            product.title.toLowerCase().includes(searchQuery) ||
            product.shortDesc.toLowerCase().includes(searchQuery) ||
            product.category.main.toLowerCase().includes(searchQuery) ||
            product.category.sub.toLowerCase().includes(searchQuery)
        );
    }

    // Apply category filter
    if (currentFilter) {
        result = result.filter(product =>
            product.category.main === currentFilter
        );
    }

    // Apply sorting
    switch (currentSort) {
        case 'price-asc':
            result.sort((a, b) => a.price["20kg"] - b.price["20kg"]);
            break;
        case 'price-desc':
            result.sort((a, b) => b.price["20kg"] - a.price["20kg"]);
            break;
        case 'name-asc':
            result.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            result.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    return result;
}