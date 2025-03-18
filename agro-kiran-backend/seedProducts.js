import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/productModel.js";  // Adjust path if needed

dotenv.config();

// Your MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

const products = [
    {
        id: "urea-plus",
        img: {
            "5kg": "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/5kg-urea-plus.webp",
            "20kg": "https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/20kg-urea-plus.webp"
        },
        title: "Urea Plus",
        shortDesc: "A high nitrogen fertilizer containing 46% nitrogen for rapid vegetative growth.",
        longDesc: "",
        highlights: {
            li1: "Provides an immediate nitrogen boost.",
            li2: "Supports lush green, rapid leaf development.",
            li3: "Water-soluble for fast uptake."
        },
        price: { "5kg": 1500, "20kg": 5200 },
        category: { main: "Inorganic Fertilizers", sub: "Single Nutrient" },
        featured: false
    },
    // Add more products here...
];

// Function to insert products
const seedProducts = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ MongoDB Connected");

        await Product.deleteMany();  // Clears existing products
        await Product.insertMany(products);

        console.log("✅ Products added successfully!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error seeding products:", error);
        mongoose.connection.close();
    }
};

seedProducts();
