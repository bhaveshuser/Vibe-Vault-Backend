import express from "express";

import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controller/categoryController.js";

import authenToken from "../utils/authMiddleware.js";
import { isAdmin } from "../utils/roleMiddleware.js";

const router = express.Router();

// PUBLIC - the shop pages need these
router.get("/api/get-categories", getCategories);
router.get("/api/get-category/:id", getCategoryById);

// ADMIN ONLY
router.post("/api/add-category", authenToken, isAdmin, createCategory);
router.put("/api/update-category/:id", authenToken, isAdmin, updateCategory);
router.delete("/api/delete-category/:id", authenToken, isAdmin, deleteCategory);

export default router;
