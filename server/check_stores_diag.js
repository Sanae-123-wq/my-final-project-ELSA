import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from './models/Store.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sanaeelbelghiti2_db_user:s8hvmk2e7kKYuYg9@cluster0.uoxcc6m.mongodb.net/elsa-patisserie?retryWrites=true&w=majority";

const check = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const stores = await Store.find({}, 'name location phone description');
        console.log("STORES_COUNT:" + stores.length);
        console.log(JSON.stringify(stores, null, 2));

        mongoose.connection.close();
    } catch (error) {
        console.error("Error:", error);
    }
};

check();
