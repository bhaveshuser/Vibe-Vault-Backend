import Offer from "../model/offers.js";

// =====================================
// CREATE OFFER
// =====================================
export const createOffer = async (req, res) => {
    try {
        const {
            name,
            description,
            discountType,
            discountValue,
            minimumAmount,
            maximumDiscount,
            startDate,
            endDate,
            isActive,
            oldPrice,
            price,
            discount,
            image
        } = req.body;

        if (!name || !name.trim() ||
            !discountType ||
            discountValue === undefined ||
            discountValue === null ||
            discountValue === "") {
            return res.status(400).json({
                message: "Name, discount type and discount value are required",
                status: 0
            });
        }

        if (!["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({
                message: "Invalid discount type",
                status: 0
            });
        }

        const numericDiscount = Number(discountValue);

        if (!Number.isFinite(numericDiscount) || numericDiscount < 0) {
            return res.status(400).json({
                message: "Discount value must be a non-negative number",
                status: 0
            });
        }

        if (discountType === "percentage" && numericDiscount > 100) {
            return res.status(400).json({
                message: "Percentage discount must be between 0 and 100",
                status: 0
            });
        }

        if (
            oldPrice !== undefined &&
            oldPrice !== "" &&
            (!Number.isFinite(Number(oldPrice)) || Number(oldPrice) < 0)
        ) {
            return res.status(400).json({
                message: "Old price must be a non-negative number",
                status: 0
            });
        }

        if (
            price !== undefined &&
            price !== "" &&
            (!Number.isFinite(Number(price)) || Number(price) < 0)
        ) {
            return res.status(400).json({
                message: "Price must be a non-negative number",
                status: 0
            });
        }

        if (
            oldPrice !== undefined &&
            oldPrice !== "" &&
            price !== undefined &&
            price !== "" &&
            Number(price) > Number(oldPrice)
        ) {
            return res.status(400).json({
                message: "Sale price cannot exceed old price",
                status: 0
            });
        }

        if (
            startDate &&
            endDate &&
            new Date(endDate) < new Date(startDate)
        ) {
            return res.status(400).json({
                message: "End date cannot be before start date",
                status: 0
            });
        }

        const existingOffer = await Offer.findOne({
            name: name.trim(),
            isDeleted: false
        });

        if (existingOffer) {
            return res.status(400).json({
                message: "Offer already exists",
                status: 0
            });
        }

        const offer = await Offer.create({
            name: name.trim(),
            description,
            discountType,
            discountValue: numericDiscount,
            minimumAmount,
            maximumDiscount,
            startDate,
            endDate,
            isActive: isActive === undefined ? true : isActive,
            oldPrice,
            price,
            discount,
            image
        });

        return res.status(201).json({
            message: "Offer created successfully",
            status: 1,
            data: offer
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};


// =====================================
// GET ALL OFFERS
// =====================================
export const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({
            isDeleted: false
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            message: "Offers fetched successfully",
            status: 1,
            data: offers
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};


// =====================================
// GET SINGLE OFFER
// =====================================
export const getOfferById = async (req, res) => {
    try {
        const offer = await Offer.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!offer) {
            return res.status(404).json({
                message: "Offer not found",
                status: 0
            });
        }

        return res.status(200).json({
            message: "Offer fetched successfully",
            status: 1,
            data: offer
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};


// =====================================
// UPDATE OFFER
// =====================================
export const updateOffer = async (req, res) => {
    try {
        const {
            name,
            description,
            discountType,
            discountValue,
            minimumAmount,
            maximumDiscount,
            startDate,
            endDate,
            isActive,
            oldPrice,
            price,
            discount,
            image
        } = req.body;

        const offer = await Offer.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!offer) {
            return res.status(404).json({
                message: "Offer not found",
                status: 0
            });
        }

        const finalName =
            name !== undefined ? name.trim() : offer.name;

        if (!finalName) {
            return res.status(400).json({
                message: "Offer name cannot be empty",
                status: 0
            });
        }

        const finalDiscountType =
            discountType !== undefined
                ? discountType
                : offer.discountType;

        const finalDiscountValue =
            discountValue !== undefined
                ? Number(discountValue)
                : offer.discountValue;

        if (!["percentage", "fixed"].includes(finalDiscountType)) {
            return res.status(400).json({
                message: "Invalid discount type",
                status: 0
            });
        }

        if (
            !Number.isFinite(finalDiscountValue) ||
            finalDiscountValue < 0 ||
            (finalDiscountType === "percentage" &&
                finalDiscountValue > 100)
        ) {
            return res.status(400).json({
                message: "Invalid discount value",
                status: 0
            });
        }

        const finalStartDate =
            startDate !== undefined ? startDate : offer.startDate;

        const finalEndDate =
            endDate !== undefined ? endDate : offer.endDate;

        if (
            finalStartDate &&
            finalEndDate &&
            new Date(finalEndDate) < new Date(finalStartDate)
        ) {
            return res.status(400).json({
                message: "End date cannot be before start date",
                status: 0
            });
        }

        if (finalName.toLowerCase() !== offer.name.toLowerCase()) {
            const existingOffer = await Offer.findOne({
                name: finalName,
                isDeleted: false,
                _id: { $ne: offer._id }
            });

            if (existingOffer) {
                return res.status(400).json({
                    message: "Offer with this name already exists",
                    status: 0
                });
            }
        }

        const finalOldPrice =
            oldPrice !== undefined ? oldPrice : offer.oldPrice;

        const finalPrice =
            price !== undefined ? price : offer.price;

        if (
            finalOldPrice !== undefined &&
            finalOldPrice !== null &&
            finalOldPrice !== "" &&
            (!Number.isFinite(Number(finalOldPrice)) ||
                Number(finalOldPrice) < 0)
        ) {
            return res.status(400).json({
                message: "Old price must be a non-negative number",
                status: 0
            });
        }

        if (
            finalPrice !== undefined &&
            finalPrice !== null &&
            finalPrice !== "" &&
            (!Number.isFinite(Number(finalPrice)) ||
                Number(finalPrice) < 0)
        ) {
            return res.status(400).json({
                message: "Price must be a non-negative number",
                status: 0
            });
        }

        if (
            finalOldPrice !== undefined &&
            finalOldPrice !== null &&
            finalOldPrice !== "" &&
            finalPrice !== undefined &&
            finalPrice !== null &&
            finalPrice !== "" &&
            Number(finalPrice) > Number(finalOldPrice)
        ) {
            return res.status(400).json({
                message: "Sale price cannot exceed old price",
                status: 0
            });
        }

        // Update only fields supplied in the request.
        offer.name = finalName;
        offer.discountType = finalDiscountType;
        offer.discountValue = finalDiscountValue;

        if (description !== undefined) offer.description = description;
        if (minimumAmount !== undefined) offer.minimumAmount = minimumAmount;
        if (maximumDiscount !== undefined) offer.maximumDiscount = maximumDiscount;
        if (startDate !== undefined) offer.startDate = startDate || null;
        if (endDate !== undefined) offer.endDate = endDate || null;
        if (isActive !== undefined) offer.isActive = isActive;

        if (oldPrice !== undefined) {
            offer.oldPrice = oldPrice === "" ? undefined : oldPrice;
        }

        if (price !== undefined) {
            offer.price = price === "" ? undefined : price;
        }

        if (discount !== undefined) offer.discount = discount;
        if (image !== undefined) offer.image = image;

        await offer.save();

        return res.status(200).json({
            message: "Offer updated successfully",
            status: 1,
            data: offer
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};


// =====================================
// SOFT DELETE OFFER
// =====================================
export const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!offer) {
            return res.status(404).json({
                message: "Offer not found",
                status: 0
            });
        }

        offer.isDeleted = true;
        offer.deletedAt = new Date();

        await offer.save();

        return res.status(200).json({
            message: "Offer deleted successfully",
            status: 1
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};