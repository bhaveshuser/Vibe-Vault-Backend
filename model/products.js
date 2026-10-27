import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        gender: {
            type: String,
            enum: ["Men", "Women", "Unisex"],
            required: false,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        image: {
            type: String,
            required: true,
        },
        imagePublicId: {
            type: String,
            default: "",
        },

        stock: {
            type: Number,
            default: 0,
            min: 0,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        collection: "products",
    }
);

export default mongoose.model("Product", productSchema);