import Product from "../model/products.js";
import { uploadImage, deleteImage } from "../utils/cloudinaryHelpers.js";

// Same error format as the other controllers; bad input -> 400, not 500
const sendError = (res, error) => {
    const badInput = error.name === "ValidationError" || error.name === "CastError";

    return res.status(badInput ? 400 : 500).json({
        message: error.message,
        status: 0
    });
};


// =====================================
// CREATE PRODUCT
// =====================================

export const createProduct = async (req, res) => {
    let uploaded = null;
    let product = null;
    try {
        const { name, category, gender, price, stock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required", status: 0 });
        }

        uploaded = await uploadImage(req.file.buffer);
        console.log("Image received:", !!req.file);
        console.log("Cloudinary cloud name:", process.env.CLOUDINARY_CLOUD_NAME);

        product = await Product.create({
            name,
            category,
            gender: gender || undefined,
            price,
            stock,
            image: uploaded.secure_url,
            imagePublicId: uploaded.public_id
        });

        const populatedProduct = await Product.findById(product._id).populate("category");

        res.status(201).json({
            message: "Product created successfully",
            status: 1,
            data: populatedProduct
        });
    } catch (error) {
        // product wasn't saved, so don't leave an orphan image in Cloudinary
        if (uploaded && !product) await deleteImage(uploaded.public_id).catch(() => { });
        sendError(res, error);
    }
};


// =====================================
// GET ALL PRODUCTS
// =====================================

export const getProducts = async (req, res) => {
    try {

        const products = await Product.find({
            isDeleted: false
        })
            .populate("category")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Products fetched successfully",
            status: 1,
            data: products
        });

    } catch (error) {
        sendError(res, error);
    }
};


// =====================================
// GET PRODUCT BY ID
// =====================================

export const getProductById = async (req, res) => {
    try {

        const product = await Product.findOne({
            _id: req.params.id,
            isDeleted: false
        }).populate("category");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                status: 0
            });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            status: 1,
            data: product
        });

    } catch (error) {
        sendError(res, error);
    }
};


// =====================================
// UPDATE PRODUCT
// =====================================

export const updateProduct = async (req, res) => {
    let uploaded = null;
    let saved = false;
    try {
        const product = await Product.findOne({ _id: req.params.id, isDeleted: false });

        if (!product) {
            return res.status(404).json({ message: "Product not found", status: 0 });
        }

        ["name", "category", "gender", "price", "stock"].forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field];
            }
        });

        const oldPublicId = product.imagePublicId;

        if (req.file) {
            uploaded = await uploadImage(req.file.buffer);
            product.image = uploaded.secure_url;
            product.imagePublicId = uploaded.public_id;
        }

        await product.save();
        saved = true;

        // remove the old image only after the new one is saved
        if (uploaded) await deleteImage(oldPublicId).catch(() => { });

        const updatedProduct = await Product.findById(product._id).populate("category");

        res.status(200).json({
            message: "Product updated successfully",
            status: 1,
            data: updatedProduct
        });
    } catch (error) {
        if (uploaded && !saved) await deleteImage(uploaded.public_id).catch(() => { });
        sendError(res, error);
    }
};


// =====================================
// SOFT DELETE PRODUCT
// =====================================

export const deleteProduct = async (req, res) => {
    try {

        const product = await Product.findOne({
            _id: req.params.id,
            isDeleted: false
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                status: 0
            });
        }

        product.isDeleted = true;
        product.deletedAt = new Date();

        await product.save();

        res.status(200).json({
            message: "Product deleted successfully",
            status: 1
        });

    } catch (error) {
        sendError(res, error);
    }
};
