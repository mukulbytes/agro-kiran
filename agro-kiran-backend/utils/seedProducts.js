import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

export const products = [
    {
        id: "urea-plus",
        slug: "urea-plus",
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
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "phos-boost",
        slug: "phos-boost",
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
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "potash-pro",
        slug: "potash-pro",
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
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "balance-mix",
        slug: "balance-mix",
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
        featured: true,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "veggie-plus",
        slug: "veggie-plus",
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
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "eco-grow",
        slug: "eco-grow",
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
            main: "Organic Fertilizers",
            sub: "Natural Compost"
        },
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "bio-boost",
        slug: "bio-boost",
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
            main: "Organic Fertilizers",
            sub: "Manure Blend"
        },
        featured: true,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "time-feed",
        slug: "time-feed",
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
            main: "Slow Release Fertilizers",
            sub: "Controlled Release"
        },
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "ultra-guard",
        slug: "ultra-guard",
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
            main: "Slow Release Fertilizers",
            sub: "Controlled Release"
        },
        featured: true,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "liquid-max",
        slug: "liquid-max",
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
            main: "Liquid Fertilizers",
            sub: "Concentrate"
        },
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "seaweed-gold",
        slug: "seaweed-gold",
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
            main: "Liquid Fertilizers",
            sub: "Organic Extract"
        },
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "leaf-guard",
        slug: "leaf-guard",
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
            main: "Foliar Fertilizers",
            sub: "Micronutrient Spray"
        },
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "bloom-power",
        slug: "bloom-power",
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
            main: "Specialty Fertilizers",
            sub: "Bloom Enhancer"
        },
        featured: true,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    },
    {
        id: "root-boost",
        slug: "root-boost",
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
            main: "Specialty Fertilizers",
            sub: "Root Development"
        },
        featured: false,
        stock: {
            "5kg": 100,
            "20kg": 50
        },
        status: "active"
    }

];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert products one by one to better handle errors
        for (const product of products) {
            try {
                await Product.create(product);
                console.log(`Added product: ${product.title}`);
            } catch (error) {
                console.error(`Error adding ${product.title}:`, error.message);
            }
        }

        console.log('Products seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
}

seedProducts(); 