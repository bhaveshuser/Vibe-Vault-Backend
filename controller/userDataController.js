import bcrypt from "bcrypt";
import userData from "../model/user.js";
import generateToken from "../utils/jwtUtils.js";


// ==========================
// LOGIN USER
// ==========================
export const loginUser = async (req, res) => {
    try {

        const uData = await userData.findOne({
            email: req.body.email.toLowerCase()
        });

        if (!uData || uData.isDeleted) {
            return res.status(404).json({
                message: "User not found",
                status: 0
            });
        }

        const comparePassword = await bcrypt.compare(
            req.body.password,
            uData.password
        );

        if (!comparePassword) {
            return res.status(401).json({
                message: "Wrong Password",
                status: 0
            });
        }

        // Generate JWT token
        const token = generateToken(uData);

        return res.status(200).json({
            message: "Login Successfully",
            status: 1,
            token: token,
            user: {
                id: uData._id,
                name: uData.name,
                email: uData.email,
                phone: uData.phone,
                address: uData.address,
                role: uData.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};


// ==========================
// REGISTER USER
// ==========================
export const registerUser = async (req, res) => {
    try {

        const {
            name,
            email,
            password,
            phone,
            address
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
                status: 0
            });
        }

        const uData = await userData.findOne({
            email: email.toLowerCase()
        });

        if (uData) {
            return res.status(409).json({
                message: "User already exists",
                status: 0
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userData({
            name: name,
            email: email.toLowerCase(),
            phone: phone || "",
            address: address || "",
            password: hashedPassword,
            role: "user"
        });

        await newUser.save();
        try {
            const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    sender: { name: "StyleHub", email: "newmail.12345789@gmail.com" },
                    to: [{ email: req.body.email }],
                    subject: "Welcome to VibeVault",
                    htmlContent: "<p>Welcome to a luxury cloths shop</p>",
                }),
            })
            if (!brevoRes.ok) {
                console.error('Brevo email failed', brevoRes.status, await brevoRes.text())
            }
        }
        catch (emailError) {
            console.error('Brevo email error', emailError.message)
        }


        return res.status(201).json({
            message: "Registration Successfully",
            status: 1,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                address: newUser.address,
                role: newUser.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: 0
        });
    }
};


// ==========================
// ADD USER
// ==========================
export const adduser = async (req, res) => {
    try {

        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await userData.findOne({
            email: req.body.email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "A user with this email already exists"
            });
        }

        const password = await bcrypt.hash(
            req.body.password,
            10
        );

        const userDataVal = {
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            phone: req.body.phone || "",
            address: req.body.address || "",
            password: password,
            role: req.body.role || "user"
        };

        const saveUserData = await userData.create(userDataVal);

        // Don't send password back
        const userResponse = {
            id: saveUserData._id,
            name: saveUserData.name,
            email: saveUserData.email,
            phone: saveUserData.phone,
            address: saveUserData.address,
            role: saveUserData.role
        };

        return res.status(201).json({
            message: "User added successfully",
            data: userResponse
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


// ==========================
// GET ALL USERS
// ==========================
export const getUser = async (req, res) => {
    try {

        // $ne: true also matches old users created before isDeleted existed
        const getUserData = await userData.find({ isDeleted: { $ne: true } })
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Users fetched successfully",
            data: getUserData
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


// ==========================
// GET SINGLE USER
// ==========================
export const getSingleUser = async (req, res) => {
    try {

        const id = req.params.id;

        const getSingleUserData = await userData.findById(id)
            .select("-password");

        if (!getSingleUserData) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            data: getSingleUserData
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};


// ==========================
// DELETE USER
// ==========================
export const DeleteUser = async (req, res) => {
    try {
        const id = req.params.uid;
        const loggedInUserId = req.user?.id;

        // Find the target user.
        const user = await userData.findById(id);

        if (!user) {
            return res.status(404).json({
                status: 0,
                message: "User not found."
            });
        }

        // Prevent an admin from deleting their own account.
        if (
            req.user?.role === "admin" &&
            String(loggedInUserId) === String(id)
        ) {
            return res.status(403).json({
                status: 0,
                message: "Admins cannot delete their own account."
            });
        }

        // Preserve the existing soft-delete behavior.
        user.isDeleted = true;
        user.deletedAt = new Date();

        await user.save();

        return res.status(200).json({
            status: 1,
            message: "User deleted successfully."
        });

    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            status: 0,
            message: "Server error while deleting user."
        });
    }
};


// ==========================
// UPDATE USER
// ==========================
export const UpdateUser = async (req, res) => {
    try {

        const id = req.params.id;

        if (
            id === String(req.user?.id) &&
            req.body.role !== undefined &&
            req.body.role !== "admin"
        ) {
            return res.status(400).json({
                message: "You can't remove your own admin role"
            });
        }

        // Only change the fields that were sent
        const userDataVal = {};

        if (req.body.name !== undefined) userDataVal.name = req.body.name;
        if (req.body.email !== undefined) userDataVal.email = req.body.email.toLowerCase();
        if (req.body.phone !== undefined) userDataVal.phone = req.body.phone;
        if (req.body.address !== undefined) userDataVal.address = req.body.address;
        if (req.body.role !== undefined) userDataVal.role = req.body.role;

        // New password is optional - leave blank to keep the old one
        if (req.body.password) {
            userDataVal.password = await bcrypt.hash(req.body.password, 10);
        }

        const updateUserData = await userData.findByIdAndUpdate(
            id,
            userDataVal,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updateUserData) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User updated successfully",
            data: updateUserData
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};