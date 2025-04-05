import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: [true, "Product ID is required"],
            unique: true,
            trim: true,
            minlength: [3, "Product ID must be at least 3 characters long"],
            maxlength: [50, "Product ID must not exceed 50 characters"]
        },
        img: {
            "5kg": {
                type: String,
                required: [true, "5kg image URL is required"],
                validate: {
                    validator: function (v) {
                        return /\.(webp|jpg|jpeg|png)$/i.test(v);
                    },
                    message: "Invalid image format (must be .webp, .jpg, .jpeg, or .png)"
                }
            },
            "20kg": {
                type: String,
                required: [true, "20kg image URL is required"],
                validate: {
                    validator: function (v) {
                        return /\.(webp|jpg|jpeg|png)$/i.test(v);
                    },
                    message: "Invalid image format (must be .webp, .jpg, .jpeg, or .png)"
                }
            }
        },
        title: {
            type: String,
            required: [true, "Product title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
            maxlength: [100, "Title must not exceed 100 characters"]
        },
        shortDesc: {
            type: String,
            required: [true, "Short description is required"],
            trim: true,
            minlength: [10, "Short description must be at least 10 characters"],
            maxlength: [200, "Short description must not exceed 200 characters"]
        },
        longDesc: {
            overview: {
                type: String,
                required: [true, "Product overview is required"],
                trim: true
            },
            benefits: [{
                type: String,
                required: true
            }],
            recommendedUsage: [{
                crop: {
                    type: String,
                    required: true
                },
                applicationTiming: {
                    type: String,
                    required: true
                },
                dosagePerAcre: {
                    type: String,
                    required: true
                },
                notes: String
            }],
            nutrientContent: {
                nitrogen: String,
                phosphorus: String,
                potassium: String,
                form: String
            },
            applicationMethod: [{
                type: String
            }],
            storageHandling: [{
                type: String
            }],
            precautions: [{
                type: String
            }],
            soilCompatibility: [{
                type: String
            }],
            regulatoryCompliance: [{
                type: String
            }],
            compatibleFertilizers: [{
                type: String
            }],
            incompatibilities: [{
                type: String
            }],
            faqs: [{
                question: {
                    type: String,
                    required: true
                },
                answer: {
                    type: String,
                    required: true
                }
            }]
        },
        highlights: {
            li1: {
                type: String,
                required: [true, "First highlight is required"],
                trim: true
            },
            li2: {
                type: String,
                required: [true, "Second highlight is required"],
                trim: true
            },
            li3: {
                type: String,
                required: [true, "Third highlight is required"],
                trim: true
            }
        },
        price: {
            "5kg": {
                type: Number,
                required: [true, "Price for 5kg is required"],
                min: [1, "Price must be at least 1"]
            },
            "20kg": {
                type: Number,
                required: [true, "Price for 20kg is required"],
                min: [1, "Price must be at least 1"]
            }
        },
        category: {
            main: {
                type: String,
                required: [true, "Main category is required"],
                enum: [
                    "Inorganic Fertilizers",
                    "Organic Fertilizers",
                    "Slow Release Fertilizers",
                    "Liquid Fertilizers",
                    "Foliar Fertilizers",
                    "Specialty Fertilizers"
                ]
            },
            sub: {
                type: String,
                required: [true, "Subcategory is required"]
            }
        },
        featured: {
            type: Boolean,
            default: false
        },
        stock: {
            "5kg": {
                type: Number,
                required: [true, "Stock for 5kg is required"],
                min: [0, "Stock cannot be negative"]
            },
            "20kg": {
                type: Number,
                required: [true, "Stock for 20kg is required"],
                min: [0, "Stock cannot be negative"]
            }
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'out_of_stock'],
            default: 'active'
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.index({ title: 1 });
productSchema.index({ category: 1 });

// Add pre-save middleware for slug generation
productSchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    }
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
