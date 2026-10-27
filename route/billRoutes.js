
import express from "express";

import {
    createBill,
    getBills,
    getBillById,
    updateBill,
    deleteBill
} from "../controller/billController.js";
import { sendBillEmail } from "../controller/emailController.js";

import authenToken from "../utils/authMiddleware.js";
import { isAdmin } from "../utils/roleMiddleware.js";

const router = express.Router();

// Authenticated customer places an order.
router.post("/api/add-bill", authenToken, createBill);
router.post("/api/send-bill-email", sendBillEmail);

// Authenticated user can request a bill.
// Add owner/admin authorization inside getBillById before using this in production.
router.get("/api/get-single-bill/:id", authenToken, getBillById);

// Admin-only bill management.
router.get("/api/get-bills", authenToken, isAdmin, getBills);
router.put("/api/update-bill/:id", authenToken, isAdmin, updateBill);
router.delete("/api/delete-bill/:id", authenToken, isAdmin, deleteBill);

export default router;
