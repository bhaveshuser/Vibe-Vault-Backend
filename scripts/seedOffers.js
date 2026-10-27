// scripts/seedOffers.js

import mongoose from "mongoose";
import "dotenv/config";
import Offer from "../model/offers.js";

const hardCodedOffers = [
    {
        name: "Men's Casual Shirt",
        oldPrice: 999,
        price: 699,
        discount: "30% OFF",
        discountType: "percentage",
        discountValue: 30,
        image:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Women's Summer Dress",
        oldPrice: 1799,
        price: 1199,
        discount: "35% OFF",
        discountType: "percentage",
        discountValue: 35,
        image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Men's T-Shirt",
        oldPrice: 799,
        price: 499,
        discount: "38% OFF",
        discountType: "percentage",
        discountValue: 38,
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Women's Top",
        oldPrice: 1199,
        price: 799,
        discount: "33% OFF",
        discountType: "percentage",
        discountValue: 33,
        image:
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "White Sneakers",
        oldPrice: 2499,
        price: 1699,
        discount: "32% OFF",
        discountType: "percentage",
        discountValue: 32,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Denim Jacket",
        oldPrice: 2999,
        price: 1999,
        discount: "33% OFF",
        discountType: "percentage",
        discountValue: 33,
        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Leather Handbag",
        oldPrice: 1999,
        price: 1299,
        discount: "35% OFF",
        discountType: "percentage",
        discountValue: 35,
        image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    },
    {
        name: "Classic Sunglasses",
        oldPrice: 999,
        price: 599,
        discount: "40% OFF",
        discountType: "percentage",
        discountValue: 40,
        image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80",
    },
];

async function seedOffers() {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGO_URI is missing from your .env file");
        }

        await mongoose.connect(process.env.MONGODB_URL);

        let inserted = 0;
        let updated = 0;
        let skippedDeleted = 0;

        for (const item of hardCodedOffers) {
            const existingOffer = await Offer.findOne({
                name: item.name,
            });

            if (existingOffer) {
                // Do not reactivate an offer that was deliberately soft-deleted.
                if (existingOffer.isDeleted) {
                    skippedDeleted++;
                    console.log(`Skipped deleted offer: ${item.name}`);
                    continue;
                }

                // Update only the display fields; preserve existing admin settings.
                existingOffer.oldPrice = item.oldPrice;
                existingOffer.price = item.price;
                existingOffer.discount = item.discount;
                existingOffer.image = item.image;

                await existingOffer.save();
                updated++;

                console.log(`Updated existing offer: ${item.name}`);
            } else {
                await Offer.create({
                    ...item,
                    description: `Special deal on ${item.name}`,
                    minimumAmount: 0,
                    isActive: true,
                    isDeleted: false,
                    deletedAt: null,
                });

                inserted++;
                console.log(`Inserted offer: ${item.name}`);
            }
        }

        console.log("\nOffer seeding finished.");
        console.log(`Inserted: ${inserted}`);
        console.log(`Updated: ${updated}`);
        console.log(`Skipped soft-deleted: ${skippedDeleted}`);
    } catch (error) {
        console.error("Offer seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedOffers();