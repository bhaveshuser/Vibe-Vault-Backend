import express from "express";

import {
    createOffer,
    getOffers,
    getOfferById,
    updateOffer,
    deleteOffer
} from "../controller/offerController.js";

import authenToken from "../utils/authMiddleware.js";
import { isAdmin } from "../utils/roleMiddleware.js";

const router = express.Router();

// PUBLIC - the shop's Offers page needs these
router.get("/api/get-offers", getOffers);
router.get("/api/get-offer/:id", getOfferById);

// ADMIN ONLY
router.post("/api/add-offer", authenToken, isAdmin, createOffer);
router.put("/api/update-offer/:id", authenToken, isAdmin, updateOffer);
router.delete("/api/delete-offer/:id", authenToken, isAdmin, deleteOffer);

export default router;
