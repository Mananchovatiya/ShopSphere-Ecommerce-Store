// utils/seed.js - Populate MongoDB with sample categories and products
// Run with: npm run seed

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = require("../models/Category");
const Product = require("../models/Product");

const categories = [
  { name: "Electronics", slug: "electronics", description: "Gadgets and devices" },
  { name: "Fashion", slug: "fashion", description: "Clothing and accessories" },
  { name: "Home", slug: "home", description: "Home and living" },
  { name: "Books", slug: "books", description: "Books and stationery" },
  { name: "Sports", slug: "sports", description: "Sports and fitness" },
];

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Comfortable over-ear headphones with 30-hour battery life and deep bass.",
    price: 1999,
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=800",
    category: "electronics",
    brand: "SoundMax",
    stock: 25,
    rating: 4.4,
    numReviews: 32,
    featured: true,
  },
  {
    name: "Smart Fitness Watch",
    description: "Track steps, heart rate and sleep with a bright AMOLED display.",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800",
    category: "electronics",
    brand: "PulseFit",
    stock: 40,
    rating: 4.2,
    numReviews: 21,
    featured: true,
  },
  {
    name: "Classic Cotton T-Shirt",
    description: "Soft, breathable everyday t-shirt made from 100% cotton.",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    category: "fashion",
    brand: "Everyday",
    stock: 100,
    rating: 4.1,
    numReviews: 58,
    featured: true,
  },
  {
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned soles for daily use.",
    price: 2299,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    category: "sports",
    brand: "StrideX",
    stock: 35,
    rating: 4.5,
    numReviews: 44,
    featured: true,
  },
  {
    name: "Ceramic Coffee Mug Set",
    description: "Set of 4 minimal ceramic mugs, dishwasher and microwave safe.",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800",
    category: "home",
    brand: "Homely",
    stock: 60,
    rating: 4.3,
    numReviews: 12,
    featured: false,
  },
  {
    name: "The Complete Node.js Guide",
    description: "A practical, project-based book to master Node.js and Express.",
    price: 649,
    image:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
    category: "books",
    brand: "TechPress",
    stock: 20,
    rating: 4.7,
    numReviews: 19,
    featured: true,
  },
  {
    name: "Leather Wallet",
    description: "Slim genuine leather wallet with 6 card slots.",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800",
    category: "fashion",
    brand: "Urban",
    stock: 45,
    rating: 4.0,
    numReviews: 8,
    featured: false,
  },
  {
    name: "Yoga Mat",
    description: "Non-slip 6mm yoga mat, ideal for beginners and daily practice.",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800",
    category: "sports",
    brand: "ZenFit",
    stock: 30,
    rating: 4.4,
    numReviews: 15,
    featured: false,
  },
  {
    name: "Table Lamp",
    description: "Warm-light LED table lamp with adjustable brightness.",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800",
    category: "home",
    brand: "LumaCo",
    stock: 22,
    rating: 4.2,
    numReviews: 10,
    featured: false,
  },
  {
    name: "Bluetooth Speaker",
    description: "Portable speaker with rich sound and 12-hour battery.",
    price: 1499,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    category: "electronics",
    brand: "SoundMax",
    stock: 28,
    rating: 4.3,
    numReviews: 26,
    featured: true,
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Category.deleteMany();
    await Product.deleteMany();

    await Category.insertMany(categories);
    await Product.insertMany(products);

    console.log(`Seeded ${categories.length} categories and ${products.length} products`);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

run();
