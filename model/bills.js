import mongoose from "mongoose";


// =====================================
// BILL ITEM SCHEMA
// =====================================

const billItemSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        productName: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        total: {
            type: Number,
            required: true,
            min: 0
        },
        codCharges: {
            type: Number,
            default: 0
        },
    },
    {
        _id: false
    }
);


// =====================================
// BILL SCHEMA
// =====================================

const billSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userData",
            required: true
        },

        items: {
            type: [billItemSchema],
            required: true,
            validate: {
                validator: function (items) {
                    return items.length > 0;
                },
                message: "Bill must contain at least one item"
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMethod: {
            type: String,
            enum: ["Cash", "UPI", "Card"],
            required: true
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },

        billStatus: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled"],
            default: "Pending"
        },

        // =====================================
        // SOFT DELETE
        // =====================================

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
        collection: "bills"
    }
);


export default mongoose.model("Bill", billSchema);