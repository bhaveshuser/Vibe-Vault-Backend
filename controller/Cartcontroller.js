import userData from "../model/user.js";


// ==========================
// GET LOGGED-IN USER'S CART
// ==========================
export const getCart = async (req, res) => {
    try {

        const user = await userData
            .findOne({ _id: req.user.id, isDeleted: { $ne: true } })
            .select("cart");

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                cart: []
            });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart: user.cart || []
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


// ==========================
// SAVE LOGGED-IN USER'S CART
// ==========================
export const saveCart = async (req, res) => {
    try {

        const incoming = req.body.cart;

        if (!Array.isArray(incoming) || incoming.length > 100) {
            return res.status(400).json({
                message: "Cart must be an array of up to 100 items"
            });
        }

        // keep only valid items and make sure quantity/price are numbers
        const cart = incoming
            .filter((item) => item && item.id !== undefined)
            .map((item) => ({
                ...item,
                price: Number(String(item.price).replace(/[₹,]/g, "")) || 0,
                quantity: Math.min(
                    Math.max(parseInt(item.quantity, 10) || 1, 1),
                    99
                )
            }));

        const user = await userData.findOneAndUpdate(
            { _id: req.user.id, isDeleted: { $ne: true } },
            { cart: cart },
            { new: true }
        ).select("cart");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Cart saved successfully",
            cart: user.cart
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};