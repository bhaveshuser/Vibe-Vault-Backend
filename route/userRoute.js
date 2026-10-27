import express from "express";

import {
    adduser,
    getUser,
    getSingleUser,
    DeleteUser,
    UpdateUser,
    loginUser,
    registerUser
} from "../controller/userDataController.js";

import { getCart, saveCart } from "../controller/Cartcontroller.js";
import authenToken from "../utils/authMiddleware.js";
import { isAdmin } from "../utils/roleMiddleware.js";
import { chatWithAI } from "../controller/chatController.js";

const router = express.Router();


// ==========================
// ADMIN ONLY ROUTES
// ==========================

router.post('/api/add-user', authenToken, isAdmin, adduser);

router.get('/api/get-user', authenToken, isAdmin, getUser);

router.get('/api/get-single-user/:id', authenToken, isAdmin, getSingleUser);

router.delete('/api/delete-user/:id', authenToken, isAdmin, DeleteUser);

router.put('/api/update-user/:id', authenToken, isAdmin, UpdateUser);


// ==========================
// LOGGED-IN USER CART
// ==========================

router.get('/api/cart', authenToken, getCart);

router.put('/api/cart', authenToken, saveCart);


// ==========================
// PUBLIC AUTH ROUTES
// ==========================

router.post('/api/login', loginUser);

router.post('/api/register', registerUser);



export default router;