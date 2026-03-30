import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminEmail = 'admin@test.com';
        const adminExists = await User.findOne({ email: adminEmail });
        
        if (adminExists) {
            console.log('Admin already exists in the database.');
            process.exit(0);
        }

        const admin = await User.create({
            name: 'ELSA Admin',
            email: adminEmail,
            password: 'password', // same as the mockData
            role: 'admin',
            status: 'approved'
        });

        console.log(`Successfully created admin account:\nEmail: ${admin.email}\nPassword: password\nRole: ${admin.role}`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
