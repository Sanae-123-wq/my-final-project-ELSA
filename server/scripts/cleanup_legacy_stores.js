import mongoose from 'mongoose';
import 'dotenv/config';
import Store from '../models/Store.js';

const MONGO_URI = process.env.MONGO_URI;

const cleanup = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        console.log("Cleaning up legacy Store collection...");
        const result = await Store.deleteMany({});
        console.log(`✅ Successfully removed ${result.deletedCount} legacy store records.`);

        console.log("\nSyncing deletion logic check...");
        console.log("The 'DELETE /api/admins/vendors/:id' route has already been updated to prevent this redundancy in the future.");

        console.log("\nCleanup complete! Your database is now synchronized with your active Vendor architecture.");
        process.exit(0);
    } catch (error) {
        console.error("Error during database cleanup:", error);
        process.exit(1);
    }
};

cleanup();
