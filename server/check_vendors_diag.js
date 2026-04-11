import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sanaeelbelghiti2_db_user:s8hvmk2e7kKYuYg9@cluster0.uoxcc6m.mongodb.net/elsa-patisserie?retryWrites=true&w=majority";

const check = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const vendors = await User.find({ role: 'vendor' }, 'shopName city phone description email');
        console.log("VENDORS_COUNT:" + vendors.length);
        console.log(JSON.stringify(vendors, null, 2));

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

check();
