import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('Testing connection to:', uri);

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
})
.then(() => {
    console.log('✅ Connected successfully!');
    process.exit(0);
})
.catch(err => {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
});
