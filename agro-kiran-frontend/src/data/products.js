import flower from "../assets/flower-primary-stroke.png"
import productbg from "../assets/Product-bg.png"
import { listenerForAddToCart } from "./cart.js";
import { formatPriceINR } from "../utils/utils.js";

const bgURL = new URL(productbg, import.meta.url).href;

export const products = [
    {
        id: "urea-plus",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861471/5kg-urea-plus_u9dnym.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861475/20kg-urea-plus_ie49x8.webp"
        },
        title: "Urea Plus",
        shortDesc: "A high nitrogen fertilizer containing 46% nitrogen for rapid vegetative growth.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Provides an immediate nitrogen boost.",
            li2: "Supports lush green, rapid leaf development.",
            li3: "Water-soluble for fast uptake."
        },
        price: {
            "5kg": 1500,
            "20kg": 5200
        },
        category: {
            main: "Inorganic Fertilizers",
            sub: "Single Nutrient"
        },
        featured: false
    },
    {
        id: "phos-boost",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861472/5kg-phos-boost_a3i6tx.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861474/20kg-phos-boost_acf1zd.webp"
        },
        title: "Phos Boost",
        shortDesc: "A concentrated phosphorus fertilizer to promote root development and flowering.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Enhances root formation and flowering.",
            li2: "Suitable for pre-planting soil amendment.",
            li3: "Boosts fruit set in vegetables and ornamentals."
        },
        price: {
            "5kg": 1800,
            "20kg": 6000
        },
        category: {
            main: "Inorganic Fertilizers",
            sub: "Single Nutrient"
        },
        featured: false
    },
    {
        id: "potash-pro",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861472/5kg-potash-pro_tg0bfn.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861474/20kg-potash-pro_a0yb9y.webp"
        },
        title: "Potash Pro",
        shortDesc: "A potassium fertilizer with 60% soluble potash for plant health and disease resistance.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Improves drought and stress resistance.",
            li2: "Encourages strong cell development.",
            li3: "Essential for plant metabolic processes."
        },
        price: {
            "5kg": 2000,
            "20kg": 6800
        },
        category: {
            main: "Inorganic Fertilizers",
            sub: "Single Nutrient"
        },
        featured: false
    },
    {
        id: "balance-mix",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861470/5kg-balance-mix_wjmuhj.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861472/20kg-balance-mix_peto4x.webp"
        },
        title: "Balance Mix",
        shortDesc: "An all-purpose fertilizer providing balanced nitrogen, phosphorus, and potassium.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Universal formula for home gardens and commercial crops.",
            li2: "Water-soluble for quick feeding.",
            li3: "Ensures balanced growth across plant stages."
        },
        price: {
            "5kg": 1600,
            "20kg": 5400
        },
        category: {
            main: "Inorganic Fertilizers",
            sub: "Compound"
        },
        featured: true
    },
    {
        id: "veggie-plus",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861472/5kg-veggie-plus_jzchd7.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861476/20kg-veggie-plus_erymja.webp"
        },
        title: "Veggie Plus",
        shortDesc: "A balanced fertilizer tailored for vegetable gardens, promoting leafy growth and fruiting.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Tailored for fast-growing vegetables and herbs.",
            li2: "Enhances both vegetative growth and fruiting.",
            li3: "Provides optimal nutrient absorption."
        },
        price: {
            "5kg": 1700,
            "20kg": 5600
        },
        category: {
            main: "Inorganic Fertilizers",
            sub: "Compound"
        },
        featured: false
    },
    {
        id: "eco-grow",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861470/5kg-eco-grow_d7focz.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861473/20kg-eco-grow_mm8pr7.webp"
        },
        title: "Eco Grow",
        shortDesc: "A nutrient-rich, all-natural compost to improve soil structure and microbial health.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Enhances soil structure and water retention.",
            li2: "Provides a slow-release supply of nutrients.",
            li3: "Ideal for food crops and ornamental gardens."
        },
        price: {
            "5kg": 1300,
            "20kg": 4900
        },
        category: {
            main: "Organic Fertilizers"
        },
        featured: false
    },
    {
        id: "bio-boost",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861470/5kg-bio-boost_xnyxfm.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861473/20kg-bio-boost_vlhuev.webp"
        },
        title: "Bio Boost",
        shortDesc: "A certified organic manure blend enriched with micronutrients for sustainable soil fertility.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Stimulates microbial growth.",
            li2: "Gradually releases nitrogen, phosphorus, and potassium.",
            li3: "Suitable for organic vegetable gardens and landscapes."
        },
        price: {
            "5kg": 1400,
            "20kg": 5000
        },
        category: {
            main: "Organic Fertilizers"
        },
        featured: true
    },
    {
        id: "time-feed",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861470/5kg-time-feed_ll2iqy.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861475/20kg-time-feed_rfkb2r.webp"
        },
        title: "Time Feed",
        shortDesc: "A balanced slow-release fertilizer providing nutrients over 8-10 weeks.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Reduces fertilizer burn.",
            li2: "Provides consistent nutrient supply.",
            li3: "Ideal for established gardens, turf, and perennials."
        },
        price: {
            "5kg": 1800,
            "20kg": 6200
        },
        category: {
            main: "Slow Release Fertilizers"
        },
        featured: false
    },
    {
        id: "ultra-guard",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861471/5kg-ultra-guard_iyj4t2.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861475/20kg-ultra-guard_fbwjrc.webp"
        },
        title: "Ultra Guard",
        shortDesc: "A premium slow-release fertilizer minimizing nutrient loss while ensuring steady growth.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Improves nutrient uptake efficiency.",
            li2: "Suitable for water-sensitive areas.",
            li3: "Enhances long-term soil fertility."
        },
        price: {
            "5kg": 1900,
            "20kg": 6500
        },
        category: {
            main: "Slow Release Fertilizers"
        },
        featured: true
    },
    {
        id: "liquid-max",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861472/5kg-liquid-max_wodw6q.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861474/20kg-liquid-max_c2eidm.webp"
        },
        title: "Liquid Max",
        shortDesc: "A fast-acting water-soluble fertilizer concentrate for immediate nutrient uptake.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Fast-acting for immediate nutrient uptake.",
            li2: "Easily diluted for different crop needs.",
            li3: "Enhances overall plant vigor."
        },
        price: {
            "5kg": 2000,
            "20kg": 7000
        },
        category: {
            main: "Liquid Fertilizers"
        },
        featured: false
    },
    {
        id: "seaweed-gold",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861473/5kg-seaweed-gold_ad1fpv.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861475/20kg-seaweed-gold_ufyd0d.webp"
        },
        title: "Seaweed Gold",
        shortDesc: "An organic seaweed extract fertilizer enriched with phytohormones and trace minerals.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Stimulates root development and improves stress resistance.",
            li2: "Ideal for foliar application or irrigation.",
            li3: "Boosts overall plant health."
        },
        price: {
            "5kg": 2100,
            "20kg": 7200
        },
        category: {
            main: "Liquid Fertilizers"
        },
        featured: false
    },
    {
        id: "leaf-guard",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861471/5kg-leaf-guard_tpvazw.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861473/20kg-leaf-guard_l2pyln.webp"
        },
        title: "Leaf Guard",
        shortDesc: "A foliar spray containing essential micronutrients to correct deficiencies quickly.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Quick correction of nutrient deficiencies.",
            li2: "Boosts chlorophyll production for greener foliage.",
            li3: "Ideal for high-value crops and stressed plants."
        },
        price: {
            "5kg": 1600,
            "20kg": 5800
        },
        category: {
            main: "Foliar Fertilizers"
        },
        featured: false
    },
    {
        id: "bloom-power",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861472/5kg-bloom-power_sb7n0u.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861473/20kg-bloom-power_eqamia.webp"
        },
        title: "Bloom Power",
        shortDesc: "A bloom enhancer designed to increase flower production and color vibrancy.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Increases flower size and number.",
            li2: "Enhances color and fragrance in blooms.",
            li3: "Ideal for ornamental plants and flowering shrubs."
        },
        price: {
            "5kg": 1750,
            "20kg": 6000
        },
        category: {
            main: "Specialty Fertilizers"
        },
        featured: true
    },
    {
        id: "root-boost",
        img: {
            "5kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861473/5kg-root-boost_bimwac.webp",
            "20kg": "https://res.cloudinary.com/dgoc0j8ll/image/upload/v1741861475/20kg-root-boost_v9mjtk.webp"
        },
        title: "Root Boost",
        shortDesc: "A starter fertilizer for seedlings and transplants, enhancing root establishment.",
        longDesc: "", // To be crafted later
        highlights: {
            li1: "Stimulates early root development.",
            li2: "Helps transplants overcome shock.",
            li3: "Suitable for gardens, nurseries, and greenhouses."
        },
        price: {
            "5kg": 1800,
            "20kg": 6300
        },
        category: {
            main: "Specialty Fertilizers"
        },
        featured: false
    }

];


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
export function renderFeaturedProducts() {
    const container = document.querySelector('.js-featured-products-container');
    let productHTML = "";

    products
        .filter(product => product.featured) // Only include featured products
        .forEach(product => {
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

export function renderProductsGrid() {
    const container = document.querySelector('.js-products-grid');
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

export function renderSingleProduct() {
    const container = document.querySelector('.js-single-product-container');
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        container.innerHTML = `<p class="text-white text-lg">Product not found.</p>`;
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = `<p class="text-white text-lg">Product not found.</p>`;
        return;
    }

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
}


