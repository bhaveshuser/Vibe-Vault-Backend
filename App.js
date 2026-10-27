import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import userRouter from "./route/userRoute.js";
import productRouter from "./route/productRoute.js";
import categoryRouter from "./route/categoryRoutes.js";
import offerRouter from "./route/offerRoutes.js";
import billRouter from "./route/billRoutes.js";
import chatRouter from "./route/chatRoute.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// These route files already include /api in their paths
app.use(userRouter);
app.use(categoryRouter);
app.use(offerRouter);
app.use(billRouter);
app.use(chatRouter);

// productRoute paths have no /api prefix, so mount it under /api
// -> /api/get-products, /api/add-product, ...
app.use("/api", productRouter);

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Backend is called");
});

connectDB().then(() => {
    app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
});
