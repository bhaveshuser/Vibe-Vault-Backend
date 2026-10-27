import "dotenv/config";
import mongoose from "mongoose";
import Product from "../model/products.js";
import Category from "../model/categories.js";
import ConnectDB from "../config/db.js";

// Seed data copied from the Products.js file you provided.
// The source array contains 91 products.
const products = [

    // =====================================================
    // 15 MEN'S WEAR
    // =====================================================

    {
        id: 101,
        name: "Men's Casual Shirt",
        category: "Men",
        price: 799,
        image:
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 102,
        name: "Men's T-Shirt",
        category: "Men",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 103,
        name: "Men's Formal Shirt",
        category: "Men",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 104,
        name: "Men's Hoodie",
        category: "Men",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 105,
        name: "Men's Polo Shirt",
        category: "Men",
        price: 899,
        image:
            "https://images.unsplash.com/photo-1625910513413-5fc45f9d7c7e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 106,
        name: "Men's Denim Shirt",
        category: "Men",
        price: 1099,
        image:
            "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 107,
        name: "Men's Checked Shirt",
        category: "Men",
        price: 849,
        image:
            "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 108,
        name: "Men's Black T-Shirt",
        category: "Men",
        price: 649,
        image:
            "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 109,
        name: "Men's White T-Shirt",
        category: "Men",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 110,
        name: "Men's Summer Shirt",
        category: "Men",
        price: 749,
        image:
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 111,
        name: "Men's Kurta",
        category: "Men",
        price: 1199,
        image:
            "https://images.unsplash.com/photo-1622445275576-721325763afe?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 112,
        name: "Men's Sweatshirt",
        category: "Men",
        price: 1099,
        image:
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 113,
        name: "Men's Cargo Pants",
        category: "Men",
        price: 1399,
        image:
            "https://images.unsplash.com/photo-1517445312882-9f4fdb5c6f5f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 114,
        name: "Men's Jeans",
        category: "Men",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 115,
        name: "Men's Track Pants",
        category: "Men",
        price: 899,
        image:
            "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80"
    },

    // =====================================================
    // 18 WOMEN'S WEAR
    // =====================================================

    {
        id: 201,
        name: "Women's Dress",
        category: "Women",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 202,
        name: "Women's Top",
        category: "Women",
        price: 899,
        image:
            "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 203,
        name: "Women's T-Shirt",
        category: "Women",
        price: 699,
        image:
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 204,
        name: "Women's Casual Dress",
        category: "Women",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 205,
        name: "Women's Summer Dress",
        category: "Women",
        price: 1399,
        image:
            "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 206,
        name: "Women's Blouse",
        category: "Women",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1564257577054-3f8d5e0f5f65?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 207,
        name: "Women's Jeans",
        category: "Women",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 208,
        name: "Women's Skirt",
        category: "Women",
        price: 1099,
        image:
            "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 209,
        name: "Women's Kurti",
        category: "Women",
        price: 1199,
        image:
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 210,
        name: "Women's Saree",
        category: "Women",
        price: 1999,
        image:
            "https://images.unsplash.com/photo-1610030469668-8e9f641aaf9e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 211,
        name: "Women's Hoodie",
        category: "Women",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 212,
        name: "Women's Sweatshirt",
        category: "Women",
        price: 1199,
        image:
            "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 213,
        name: "Women's Palazzo",
        category: "Women",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 214,
        name: "Women's Jumpsuit",
        category: "Women",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 215,
        name: "Women's Party Dress",
        category: "Women",
        price: 1899,
        image:
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 216,
        name: "Women's Crop Top",
        category: "Women",
        price: 699,
        image:
            "https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 217,
        name: "Women's Cardigan",
        category: "Women",
        price: 1399,
        image:
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 218,
        name: "Women's Formal Wear",
        category: "Women",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80"
    },

    // =====================================================
    // 20 ACCESSORIES
    // =====================================================

    {
        id: 301,
        name: "Fashion Watch",
        category: "Accessories",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 302,
        name: "Sunglasses",
        category: "Accessories",
        price: 499,
        image:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 303,
        name: "Leather Bag",
        category: "Accessories",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 304,
        name: "Fashion Cap",
        category: "Accessories",
        price: 399,
        image:
            "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 305,
        name: "Leather Wallet",
        category: "Accessories",
        price: 699,
        image:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 306,
        name: "Backpack",
        category: "Accessories",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 307,
        name: "Handbag",
        category: "Accessories",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 308,
        name: "Necklace",
        category: "Accessories",
        price: 799,
        image:
            "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 309,
        name: "Bracelet",
        category: "Accessories",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 310,
        name: "Earrings",
        category: "Accessories",
        price: 499,
        image:
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 311,
        name: "Fashion Ring",
        category: "Accessories",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 312,
        name: "Leather Belt",
        category: "Accessories",
        price: 699,
        image:
            "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 313,
        name: "Scarf",
        category: "Accessories",
        price: 399,
        image:
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 314,
        name: "Beanie",
        category: "Accessories",
        price: 449,
        image:
            "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 315,
        name: "Tie",
        category: "Accessories",
        price: 499,
        image:
            "https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 316,
        name: "Hair Accessories",
        category: "Accessories",
        price: 299,
        image:
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 317,
        name: "Travel Bag",
        category: "Accessories",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1553531384-cc64ac80f931?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 318,
        name: "Phone Bag",
        category: "Accessories",
        price: 599,
        image:
            "https://images.unsplash.com/photo-1585488435944-0f1f5f0d7e2d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 319,
        name: "Umbrella",
        category: "Accessories",
        price: 499,
        image:
            "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 320,
        name: "Keychain",
        category: "Accessories",
        price: 199,
        image:
            "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=600&q=80"
    },

    // =====================================================
    // 8 JACKETS
    // =====================================================

    {
        id: 401,
        name: "Men's Leather Jacket",
        category: "Jackets",
        price: 2499,
        image:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 402,
        name: "Women's Leather Jacket",
        category: "Jackets",
        price: 2299,
        image:
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 403,
        name: "Denim Jacket",
        category: "Jackets",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 404,
        name: "Winter Jacket",
        category: "Jackets",
        price: 2199,
        image:
            "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 405,
        name: "Bomber Jacket",
        category: "Jackets",
        price: 1899,
        image:
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 406,
        name: "Hooded Jacket",
        category: "Jackets",
        price: 1999,
        image:
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 407,
        name: "Casual Jacket",
        category: "Jackets",
        price: 1699,
        image:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 408,
        name: "Puffer Jacket",
        category: "Jackets",
        price: 2399,
        image:
            "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=600&q=80"
    },

    // =====================================================
    // 15 MEN'S SHOES
    // =====================================================

    {
        id: 501,
        name: "Men's Sports Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 502,
        name: "Men's Running Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 503,
        name: "Men's Casual Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1399,
        image:
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 504,
        name: "Men's Formal Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1899,
        image:
            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 505,
        name: "Men's Sneakers",
        category: "Shoes",
        gender: "Men",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 506,
        name: "Men's High Top Sneakers",
        category: "Shoes",
        gender: "Men",
        price: 1999,
        image:
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 507,
        name: "Men's Walking Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 508,
        name: "Men's Basketball Shoes",
        category: "Shoes",
        gender: "Men",
        price: 2199,
        image:
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 509,
        name: "Men's Training Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1699,
        image:
            "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 510,
        name: "Men's Slip On Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1199,
        image:
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 511,
        name: "Men's Loafers",
        category: "Shoes",
        gender: "Men",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 512,
        name: "Men's Boots",
        category: "Shoes",
        gender: "Men",
        price: 2299,
        image:
            "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 513,
        name: "Men's Leather Shoes",
        category: "Shoes",
        gender: "Men",
        price: 2499,
        image:
            "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 514,
        name: "Men's Canvas Shoes",
        category: "Shoes",
        gender: "Men",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 515,
        name: "Men's Outdoor Shoes",
        category: "Shoes",
        gender: "Men",
        price: 1899,
        image:
            "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80"
    },

    // =====================================================
    // 15 WOMEN'S SHOES
    // =====================================================

    {
        id: 516,
        name: "Women's Sneakers",
        category: "Shoes",
        gender: "Women",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 517,
        name: "Women's Running Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1899,
        image:
            "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 518,
        name: "Women's Casual Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 519,
        name: "Women's High Heels",
        category: "Shoes",
        gender: "Women",
        price: 1799,
        image:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 520,
        name: "Women's Sandals",
        category: "Shoes",
        gender: "Women",
        price: 899,
        image:
            "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 521,
        name: "Women's Flat Shoes",
        category: "Shoes",
        gender: "Women",
        price: 999,
        image:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 522,
        name: "Women's Boots",
        category: "Shoes",
        gender: "Women",
        price: 2199,
        image:
            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 523,
        name: "Women's Loafers",
        category: "Shoes",
        gender: "Women",
        price: 1399,
        image:
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 524,
        name: "Women's Platform Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1699,
        image:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 525,
        name: "Women's Sports Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1499,
        image:
            "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 526,
        name: "Women's Training Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1599,
        image:
            "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 527,
        name: "Women's Slip On Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1199,
        image:
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 528,
        name: "Women's Party Shoes",
        category: "Shoes",
        gender: "Women",
        price: 1999,
        image:
            "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 529,
        name: "Women's Wedges",
        category: "Shoes",
        gender: "Women",
        price: 1299,
        image:
            "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 530,
        name: "Women's Fashion Boots",
        category: "Shoes",
        gender: "Women",
        price: 2399,
        image:
            "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80"
    }
];

const normalize = (value) =>
    String(value ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

const categoryAliases = {
    Men: ["men", "menswear", "menwear"],
    Women: ["women", "womenswear", "womenwear"],
    Accessories: ["accessories", "accessory"],
    Jackets: ["jackets", "jacket"],
    Shoes: ["shoes", "shoe"],
};

async function seedProducts() {
    try {
        await ConnectDB();

        const categories = await Category.find({
            isDeleted: { $ne: true },
        }).lean();

        if (!categories.length) {
            throw new Error(
                'No categories found in the "categories" collection. Create your categories first.'
            );
        }

        const categoryByAlias = new Map();

        for (const category of categories) {
            categoryByAlias.set(normalize(category.name), category);
        }

        const resolveCategory = (categoryName) => {
            const candidates = categoryAliases[categoryName] ?? [categoryName];

            for (const candidate of candidates) {
                const match = categoryByAlias.get(normalize(candidate));
                if (match) return match;
            }

            // Also allow a category document named exactly as the source category.
            return categoryByAlias.get(normalize(categoryName));
        };

        const operations = [];
        const missingCategories = new Set();

        for (const item of products) {
            const category = resolveCategory(item.category);

            if (!category) {
                missingCategories.add(item.category);
                continue;
            }

            const productData = {
                name: item.name,
                category: category._id,
                price: item.price,
                image: item.image,
                stock: 50,
                isDeleted: false,
                deletedAt: null,
            };

            if (item.gender) {
                productData.gender = item.gender;
            }

            operations.push({
                updateOne: {
                    // Rerunning the seed updates the same product instead of duplicating it.
                    filter: {
                        name: item.name,
                        category: category._id,
                    },
                    update: { $set: productData },
                    upsert: true,
                },
            });
        }

        if (missingCategories.size > 0) {
            throw new Error(
                `Missing category documents for: ${[...missingCategories].join(", ")}. ` +
                "Create or rename these categories, then run the seed script again."
            );
        }

        if (operations.length !== products.length) {
            throw new Error(
                `Prepared ${operations.length} of ${products.length} products; no changes were made.`
            );
        }

        const result = await Product.bulkWrite(operations, { ordered: true });

        console.log("Product seeding completed.");
        console.log(`Products in seed file: ${products.length}`);
        console.log(`Inserted: ${result.upsertedCount ?? 0}`);
        console.log(`Matched existing: ${result.matchedCount ?? 0}`);
        console.log(`Updated: ${result.modifiedCount ?? 0}`);
    } catch (error) {
        console.error("Product seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect().catch(() => { });
    }
}

await seedProducts();