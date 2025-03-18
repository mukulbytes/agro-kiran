import flower from "../assets/flower-primary-stroke.png"
import productbg from "../assets/Product-bg.png"
import { listenerForAddToCart } from "./cart.js";
import { formatPriceINR } from "../utils/utils.js";
import { API_CONFIG } from "../config/api.js";
import { productService } from '../services/productService.js';

const bgURL = new URL(productbg, import.meta.url).href;

export async function renderFeaturedProducts() {
    const container = document.querySelector('.js-featured-products-container');
    container.innerHTML = '<div class="text-center">Loading featured products...</div>';

    const products = await productService.fetchProducts();
    const featuredProducts = products.filter(product => product.featured);

    if (!featuredProducts.length) {
        container.innerHTML = '<div class="text-center">No featured products available</div>';
        return;
    }

    let productHTML = "";
    featuredProducts.forEach(product => {
        productHTML += `
            <div class="js-product-card grid grid-cols-1 lg:grid-cols-2 relative bg-accent rounded-2xl shadow-xs z-8 p-3 lg:py-10 lg:pr-10 justify-center items-center max-w-[50rem] ease-in-out duration-200 hover:shadow-2xl" data-id="${product.id}">
                    <img src="${flower}" class="blur-xs absolute h-80 -bottom-50 -right-20" alt="" />
                
                <!-- Image Div -->
                <div class="relative flex items-center justify-center bg-center bg-no-repeat bg-contain" style="background-image: url('${bgURL}') !important;">
                    <img src="${product.img["20kg"]}" class="h-[13rem] md:h-[15rem] xl:h-[20rem] z-[2] drop-shadow-2xl" alt="${product.title}" />
                </div>
                
                <!-- Product Details Div -->
                <div class="flex flex-col gap-0.5 xl:gap-3 lg:pl-10 text-white">
                    <a href="/product.html?id=${product.id}" class="hover:underline text-secondary text-[1.8rem] xs:max-sm:text-[1.45rem] max-lg:self-center font-bold whitespace-nowrap">${product.title}</a >
                    <p class="text-pretty text-sm/[135%] xl:text-lg/[110%] line-clamp-4 lg:hidden xl:block">
                        ${product.shortDesc}
                    </p>
                    <ul class="hidden sm:block text-sm/[120%] xl:text-lg/[100%] lg:max-xl:text-white pl-4 lg:p-0 list-disc text-secondary lg:mt-auto xl:mt-3">
                        <li>${product.highlights.li1}</li>
                        <li>${product.highlights.li2}</li>
                        <li>${product.highlights.li3}</li>
                    </ul>
                    <p class="text-[2rem] font-extrabold">${formatPriceINR(product.price["20kg"])}</p>
                    <select
                        name="quantity-selector"
                        id="product-qty"
                        class="font-bold text-center w-14 py-1 px-2 mb-1 bg-primary text-white rounded-lg shadow-2xl js-product-quantity-dropdown-${product.id}"
                        >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <button class="js-add-to-cart rounded-lg max-w-40 bg-primary py-1.5 px-5 text-sm font-bold text-white duration-100 ease-in-out border-2 border-primary hover:border-secondary hover:text-secondary">
                        Add to cart
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = productHTML;
    listenerForProductCard();
    listenerForAddToCart();
}

export async function renderProductsGrid() {
    const container = document.querySelector('.js-products-grid');
    container.innerHTML = '<div class="text-center text-white">Loading products...</div>';

    const products = await productService.fetchProducts();

    if (!products.length) {
        container.innerHTML = '<div class="text-center text-white">No products available</div>';
        return;
    }

    let productHTML = "";
    products.forEach(product => {
        productHTML += `
        <div class="js-product-card grid grid-cols-1 gap-2 relative bg-accent rounded-2xl shadow-xs z-8 p-5 justify-center items-end ease-in-out duration-200 hover:shadow-2xl" data-id="${product.id}">
            <img src="images/flower-primary-stroke.png" class="blur-xs absolute h-80 -bottom-50 -right-20" alt="" />
            
            <!-- Image Div -->
            <div class="relative flex items-center justify-center bg-center bg-no-repeat bg-contain" style="background-image: url('${bgURL}') !important;">
                <img src="${product.img["20kg"]}" class="h-[13rem] drop-shadow-2xl z-[2]" alt="${product.title}" />
            </div>
            
            <!-- Product Details Div -->
            <div class="flex flex-col gap-2 text-white">
                <a href="/product.html?id=${product.id}" class="hover:underline text-secondary text-[1.8rem] font-bold whitespace-nowrap">${product.title}</a>
                <p class="text-pretty text-sm line-clamp-4">${product.shortDesc}</p>
                <ul class="text-sm list-disc text-secondary pl-4">
                    <li>${product.highlights.li1}</li>
                    <li>${product.highlights.li2}</li>
                    <li>${product.highlights.li3}</li>
                </ul>
                <p class="text-[2rem] font-extrabold">${formatPriceINR(product.price["20kg"])}</p>
                <select
                    name="quantity-selector"
                    id="product-qty"
                    class="font-bold text-center w-14 py-1 px-2 mb-1 bg-primary text-white rounded-lg shadow-2xl js-product-quantity-dropdown-${product.id}"
                    >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                <button class="js-add-to-cart rounded-lg bg-primary py-1.5 px-5 text-sm font-bold text-white duration-100 ease-in-out border-2 border-primary hover:border-secondary hover:text-secondary">
                    Add to cart
                </button>
            </div>
        </div>`;
    });

    container.innerHTML = productHTML;
    listenerForProductCard();
    listenerForAddToCart();
}

export async function renderSingleProduct() {
    const container = document.querySelector('.js-single-product-container');
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        container.innerHTML = `<p class="text-white text-lg">Product not found.</p>`;
        return;
    }

    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${productId}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch product');
        }

        const product = result.data;
        let selectedVariant = "20kg";

        function updateProductView() {
            const productImage = document.querySelector(".js-product-image");
            const productPrice = document.querySelector(".js-product-price");
            const selectedInput = document.querySelector("input[name='variant']:checked");

            if (selectedInput) {
                selectedVariant = selectedInput.value;
            }

            productImage.src = product.img[selectedVariant];
            productPrice.textContent = formatPriceINR(product.price[selectedVariant]);

            // Update radio button markers
            document.querySelectorAll(".js-variant-radio").forEach(radio => {
                const marker = radio.nextElementSibling.querySelector("span");
                if (radio.checked) {
                    marker.classList.remove("hidden");
                } else {
                    marker.classList.add("hidden");
                }
            });
        }

        container.innerHTML = `        
            <div class="js-product-card grid grid-cols-1 sm:grid-cols-2 relative bg-accent rounded-2xl shadow-xs z-8 p-3 sm:py-10 max-w-[50rem] items-center" data-id="${product.id}">
                <img src="${flower}" class="blur-xs absolute h-80 -bottom-50 -right-20" alt="" />

                <!-- Image Div -->
                <div class="relative flex items-center justify-center bg-center bg-no-repeat bg-contain" style="background-image: url('${bgURL}') !important">
                    <img src="${product.img[selectedVariant]}" class="js-product-image h-[13rem]  sm:h-[20rem] z-[2] drop-shadow-2xl" alt="${product.title}" />
                </div>

                <!-- Product Details Div -->
                <div class="flex flex-col gap-5 sm:gap-3 sm:pl-10 text-white">
                    <h2 class="text-secondary text-[1.8rem] max-sm:self-center font-bold whitespace-nowrap">${product.title}</h2>
                    <p class="text-pretty text-lg/[110%] max-sm:text-center line-clamp-4">${product.shortDesc}</p>
                    
                    <ul class="text-lg/[100%] pl-4 sm:p-0 list-disc text-secondary sm:mt-3">
                        <li>${product.highlights.li1}</li>
                        <li>${product.highlights.li2}</li>
                        <li>${product.highlights.li3}</li>
                    </ul>

                    <!-- Variant Selection -->
                    <div class="flex flex-row gap-3 mt-3">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="variant" value="5kg" class="js-variant-radio hidden" />
                            <span class="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                                <span class="w-3 h-3 bg-secondary rounded-full hidden"></span>
                            </span>
                            <span class="font-bold">5kg</span>
                        </label>

                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="variant" value="20kg" class="js-variant-radio hidden" checked />
                            <span class="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                                <span class="w-3 h-3 bg-secondary rounded-full"></span>
                            </span>
                            <span class="font-bold">20kg</span>
                        </label>
                    </div>

                    <p class="js-product-price text-[2rem] font-extrabold mt-2">
                        ${formatPriceINR(product.price[selectedVariant])}
                    </p>
                    <select
                        name="quantity-selector"
                        id="product-qty"
                        class="font-bold text-center w-14 py-1 px-2 mb-1 bg-primary text-white rounded-lg shadow-2xl js-product-quantity-dropdown-${product.id}"
                        >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <button class="js-add-to-cart max-sm:self-center rounded-lg max-w-40 bg-primary py-1.5 px-5 text-sm font-bold text-white duration-100 ease-in-out border-2 border-primary hover:border-secondary hover:text-secondary">
                        Add to cart
                    </button>
                </div>
            </div>
        `;

        // Attach event listeners to variant radio buttons
        document.querySelectorAll(".js-variant-radio").forEach(radio => {
            radio.addEventListener("change", updateProductView);
        });

        updateProductView(); // Ensure initial state is correct
        listenerForAddToCart();
    } catch (error) {
        console.error('Error fetching product:', error);
        container.innerHTML = `<p class="text-white text-lg">Error loading product. Please try again later.</p>`;
    }
}

export async function fetchProductData(productId, field) {
    const products = await productService.fetchProducts();
    const product = products.find(p => p.id === productId);
    return product ? product[field] : null;
}

export function listenerForProductCard() {
    document.querySelectorAll(".js-product-card").forEach(card => {
        card.addEventListener("click", function (event) {

            if (event.target.closest(".js-add-to-cart") || event.target.closest("select")) {
                return;
            }

            // Get product ID from data attribute
            const productId = this.getAttribute("data-id");

            // Navigate to product page
            window.location.href = `/product.html?id=${productId}`;
        });
    });
}

// Clear cache when needed (e.g., after certain time period)
export function clearProductsCache() {
    productsCache = null;
}

