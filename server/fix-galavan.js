import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function fix() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({}), 'users');
        await User.updateOne(
            { role: 'vendor', shopName: /Galavan/i },
            { $set: { image: '/src/assets/stores profils/patisserie glavan.jpeg' } }
        );
        console.log('✅ Updated Galavan logo path successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
