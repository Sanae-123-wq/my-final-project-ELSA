import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function find() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const v = await db.collection('users').findOne({
            $or: [
                { shopName: /fghjiu/i },
                { name: /fghjiu/i }
            ]
        });
        console.log('Result for fghjiu:');
        console.log(v);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
find();
