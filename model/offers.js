import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: false,
            trim: true
        },

        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true
        },

        discountValue: {
            type: Number,
            required: true,
            min: 0
        },

        minimumAmount: {
            type: Number,
            default: 0,
            min: 0
        },

        maximumDiscount: {
            type: Number,
            required: false,
            min: 0
        },

        startDate: {
            type: Date,
            required: false
        },

        endDate: {
            type: Date,
            required: false
        },

        isActive: {
            type: Boolean,
            default: true
        },
        oldPrice: {
            type: Number,
            min: 0
        },

        price: {
            type: Number,
            min: 0
        },

        discount: {
            type: String,
            trim: true
        },

        image: {
            type: String,
            trim: true,
            default: ""
        },

        // Soft Delete
        isDeleted: {
            type: Boolean,
            default: false
        },

        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        collection: "offers"
    }
);

export default mongoose.model("Offer", offerSchema);

