import mongoose from "mongoose";
import Bill from "../model/bills.js";
import Product from "../model/products.js";
import Offer from "../model/offers.js";
// =====================================
// CREATE BILL
// =====================================


export const createBill = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const userId = req.user?.id;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(401).json({
                message: "Please log in to place an order",
                status: 0
            });
        }

        const { items, paymentMethod, offerId } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Your cart is empty",
                status: 0
            });
        }

        if (!["Cash", "UPI", "Card"].includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method",
                status: 0
            });
        }

        // Validate product IDs and quantities.
        const quantities = new Map();

        for (const item of items) {
            const productId = item.productId || item.id || item._id;
            const quantity = Number(item.quantity);

            if (
                !mongoose.isValidObjectId(productId) ||
                !Number.isSafeInteger(quantity) ||
                quantity < 1
            ) {
                return res.status(400).json({
                    message: "Invalid product or quantity",
                    status: 0
                });
            }

            const key = String(productId);
            quantities.set(
                key,
                (quantities.get(key) || 0) + quantity
            );
        }

        let createdBill;

        await session.withTransaction(async () => {
            const billItems = [];
            let subtotal = 0;

            // Fetch products and deduct stock.
            for (const [productId, quantity] of quantities) {
                const product = await Product.findOne({
                    _id: productId,
                    isDeleted: false
                }).session(session);

                if (!product) {
                    throw new Error(`Product not found: ${productId}`);
                }

                const updatedProduct = await Product.findOneAndUpdate(
                    {
                        _id: product._id,
                        isDeleted: false,
                        stock: { $gte: quantity }
                    },
                    {
                        $inc: { stock: -quantity }
                    },
                    {
                        new: true,
                        session
                    }
                );

                if (!updatedProduct) {
                    throw new Error(
                        `Insufficient stock for ${product.name}. Available stock may have changed.`
                    );
                }

                const price = Number(product.price);
                const total = price * quantity;

                subtotal += total;

                billItems.push({
                    productId: product._id,
                    productName: product.name,
                    price,
                    quantity,
                    total
                });
            }

            // Calculate the offer discount.
            let discount = 0;

            if (offerId) {
                if (!mongoose.isValidObjectId(offerId)) {
                    throw new Error("Invalid offer");
                }

                const now = new Date();

                const offer = await Offer.findOne({
                    _id: offerId,
                    isActive: true,
                    isDeleted: false,
                    $and: [
                        {
                            $or: [
                                { startDate: { $exists: false } },
                                { startDate: null },
                                { startDate: { $lte: now } }
                            ]
                        },
                        {
                            $or: [
                                { endDate: { $exists: false } },
                                { endDate: null },
                                { endDate: { $gte: now } }
                            ]
                        }
                    ]
                }).session(session);

                if (!offer) {
                    throw new Error(
                        "This offer is unavailable or expired"
                    );
                }

                if (subtotal < offer.minimumAmount) {
                    throw new Error(
                        `This offer requires a minimum purchase of ₹${offer.minimumAmount}`
                    );
                }

                if (offer.discountType === "percentage") {
                    discount =
                        subtotal * Number(offer.discountValue) / 100;
                } else {
                    discount = Number(offer.discountValue);
                }

                if (offer.maximumDiscount != null) {
                    discount = Math.min(
                        discount,
                        Number(offer.maximumDiscount)
                    );
                }

                discount = Math.min(subtotal, discount);
            }

            subtotal = Number(subtotal.toFixed(2));
            discount = Number(discount.toFixed(2));

            // Cash on Delivery has an additional ₹50 charge.
            const codCharges = paymentMethod === "Cash" ? 50 : 0;

            const totalAmount = Number(
                Math.max(0, subtotal - discount + codCharges).toFixed(2)
            );

            const isCashOnDelivery = paymentMethod === "Cash";

            const bills = await Bill.create(
                [{
                    userId,
                    items: billItems,
                    subtotal,
                    discount,
                    codCharges,
                    totalAmount,
                    paymentMethod,
                    paymentStatus: isCashOnDelivery ? "Pending" : "Paid",
                    billStatus: isCashOnDelivery ? "Pending" : "Completed"
                }],
                { session }
            );

            // IMPORTANT: Save the created bill for use after the transaction.
            createdBill = bills[0];
        });

        // The transaction has completed. Now populate and return the bill.
        const populatedBill = await Bill.findById(createdBill._id)
            .populate("userId", "name email phone address")
            .populate("items.productId", "name price image");

        return res.status(201).json({
            message: "Order created successfully",
            status: 1,
            data: populatedBill
        });

    } catch (error) {
        const message = error.message || "Failed to create order";

        const clientError =
            message.startsWith("Product not found:") ||
            message.startsWith("Insufficient stock") ||
            message.startsWith("This offer") ||
            message === "Invalid offer";

        return res.status(clientError ? 400 : 500).json({
            message,
            status: 0
        });

    } finally {
        await session.endSession();
    }
};



// =====================================
// GET ALL BILLS
// =====================================

export const getBills = async (req, res) => {
    try {

        const bills = await Bill.find({
            isDeleted: false
        })
            .populate("userId", "name email phone")
            .populate("items.productId", "name price image")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Bills fetched successfully",
            status: 1,
            data: bills
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
            status: 0
        });

    }
};


// =====================================
// GET SINGLE BILL
// =====================================

export const getBillById = async (req, res) => {
    try {

        const bill = await Bill.findOne({
            _id: req.params.id,
            isDeleted: false
        })
            .populate("userId", "name email phone")
            .populate("items.productId", "name price image");

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found",
                status: 0
            });
        }

        res.status(200).json({
            message: "Bill fetched successfully",
            status: 1,
            data: bill
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
            status: 0
        });

    }
};


// =====================================
// UPDATE BILL
// =====================================

export const updateBill = async (req, res) => {
    try {

        const {
            items,
            subtotal,
            discount,
            totalAmount,
            paymentMethod,
            paymentStatus,
            billStatus
        } = req.body;

        const bill = await Bill.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found",
                status: 0
            });
        }

        // Only change the fields that were actually sent
        const updates = {
            items,
            subtotal,
            discount,
            totalAmount,
            paymentMethod,
            paymentStatus,
            billStatus
        };

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                bill[key] = value;
            }
        });

        await bill.save();

        const updatedBill = await Bill.findById(bill._id)
            .populate("userId", "name email phone")
            .populate("items.productId", "name price image");

        res.status(200).json({
            message: "Bill updated successfully",
            status: 1,
            data: updatedBill
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
            status: 0
        });

    }
};


// =====================================
// SOFT DELETE BILL
// =====================================

export const deleteBill = async (req, res) => {
    try {

        const bill = await Bill.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found",
                status: 0
            });
        }

        bill.isDeleted = true;
        bill.deletedAt = new Date();

        await bill.save();

        res.status(200).json({
            message: "Bill deleted successfully",
            status: 1
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
            status: 0
        });

    }
};