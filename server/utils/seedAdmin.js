// utils/seedAdmin.js - Create or upgrade a default admin user
// Run with: npm run seed:admin
//
// Default credentials (change via env or after login):
//   email:    admin@shopsphere.com
//   password: Admin@123

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/User");

const run = async () => {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@shopsphere.com";
    const password = process.env.ADMIN_PASSWORD || "Admin@123";
    const name = process.env.ADMIN_NAME || "ShopSphere Admin";

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    let user = await User.findOne({ email });
    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`Existing user ${email} promoted to admin`);
    } else {
      user = await User.create({ name, email, password, role: "admin" });
      console.log(`Admin created: ${email} / ${password}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed admin error:", error);
    process.exit(1);
  }
};

run();
