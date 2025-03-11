const products = [
    {
        id: "urea-plus",
        img: {
            "5kg": "./images/products/5kg/5kg-urea-plus.png",
            "20kg": "./images/products/20kg/20kg-urea-plus.png"
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
            "5kg": "./images/products/5kg/5kg-phos-boost.png",
            "20kg": "./images/products/20kg/20kg-phos-boost.png"
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
            "5kg": "./images/products/5kg/5kg-potash-pro.png",
            "20kg": "./images/products/20kg/20kg-potash-pro.png"
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
            "5kg": "./images/products/5kg/5kg-balance-mix.png",
            "20kg": "./images/products/20kg/20kg-balance-mix.png"
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
            "5kg": "./images/products/5kg/5kg-veggie-plus.png",
            "20kg": "./images/products/20kg/20kg-veggie-plus.png"
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
            "5kg": "./images/products/5kg/5kg-eco-grow.png",
            "20kg": "./images/products/20kg/20kg-eco-grow.png"
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
            "5kg": "./images/products/5kg/5kg-bio-boost.png",
            "20kg": "./images/products/20kg/20kg-bio-boost.png"
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
            "5kg": "./images/products/5kg/5kg-time-feed.png",
            "20kg": "./images/products/20kg/20kg-time-feed.png"
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
            "5kg": "./images/products/5kg/5kg-ultra-guard.png",
            "20kg": "./images/products/20kg/20kg-ultra-guard.png"
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
            "5kg": "./images/products/5kg/5kg-liquid-max.png",
            "20kg": "./images/products/20kg/20kg-liquid-max.png"
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
            "5kg": "./images/products/5kg/5kg-seaweed-gold.png",
            "20kg": "./images/products/20kg/20kg-seaweed-gold.png"
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
            "5kg": "./images/products/5kg/5kg-leaf-guard.png",
            "20kg": "./images/products/20kg/20kg-leaf-guard.png"
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
            "5kg": "./images/products/5kg/5kg-bloom-power.png",
            "20kg": "./images/products/20kg/20kg-bloom-power.png"
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
            "5kg": "./images/products/5kg/5kg-root-boost.png",
            "20kg": "./images/products/20kg/20kg-root-boost.png"
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


export function renderFeaturedProducts() {
    const container = document.querySelector('.js-featured-products-container');
    let productHTML = "";

    products
        .filter(product => product.featured) // Only include featured products
        .forEach(product => {
            productHTML += `
                <div class="grid grid-cols-1 lg:grid-cols-2 relative bg-accent rounded-2xl shadow-xs z-8 p-3 lg:py-10 lg:pr-10 justify-center items-center max-w-[50rem]">
                    <img src="images/flower-primary-stroke.png" class="blur-xs absolute h-80 -bottom-50 -right-20" alt="" />
                    
                    <!-- Image Div -->
                    <div class="image-test relative flex items-center justify-center bg-center bg-no-repeat bg-contain bg-[url(../images/Product-bg.png)]">
                        <img src="${product.img["20kg"]}" class="h-[13rem] md:h-[15rem] xl:h-[20rem] z-[2] drop-shadow-2xl" alt="${product.title}" />
                    </div>
                    
                    <!-- Product Details Div -->
                    <div class="flex flex-col gap-0.5 xl:gap-3 lg:pl-10 text-white">
                        <h2 class="text-secondary text-[1.8rem] xs:max-sm:text-[1.45rem] max-lg:self-center font-bold whitespace-nowrap">${product.title}</h2>
                        <p class="text-pretty text-sm/[135%] xl:text-lg/[110%] line-clamp-4 lg:hidden xl:block">
                            ${product.shortDesc}
                        </p>
                        <ul class="hidden sm:block text-sm/[120%] xl:text-lg/[100%] lg:max-xl:text-white pl-4 lg:p-0 list-disc text-secondary lg:mt-auto xl:mt-3">
                            <li>${product.highlights.li1}</li>
                            <li>${product.highlights.li2}</li>
                            <li>${product.highlights.li3}</li>
                        </ul>
                        <p class="text-[2rem] font-extrabold">${product.price["20kg"].toLocaleString("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
                        <button class="rounded-lg max-w-40 bg-primary py-1.5 px-5 text-sm font-bold text-white duration-100 ease-in-out border-2 border-primary hover:border-secondary hover:text-secondary">
                            Add to cart
                        </button>
                    </div>
                </div>
            `;
        });

    container.innerHTML = productHTML;
}
