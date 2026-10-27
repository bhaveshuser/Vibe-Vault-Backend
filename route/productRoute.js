import express from "express";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controller/productController.js";

import authenToken from "../utils/authMiddleware.js";
import { isAdmin } from "../utils/roleMiddleware.js";
import upload from "../utils/uploadMiddleware.js";

// returns a clean JSON error (too big, not an image) instead of an HTML page
const handleImageUpload = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message, status: 0 });
        next();
    });
};

const router = express.Router();

// PUBLIC - the shop pages need these
router.get("/get-products", getProducts);
router.get("/get-single-product/:id", getProductById);

// ADMIN ONLY
router.post("/add-product", authenToken, isAdmin, handleImageUpload, createProduct);
router.put("/update-product/:id", authenToken, isAdmin, handleImageUpload, updateProduct);
router.delete("/delete-product/:id", authenToken, isAdmin, deleteProduct);

export default router;
