import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'vendor', 'delivery', 'admin'], default: 'client' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    
    // Dynamic fields depending on role:
    address: { type: String }, // client
    shopName: { type: String }, // vendor
    city: { type: String }, // vendor
    phone: { type: String }, // vendor / delivery
    description: { type: String }, // vendor
    vehicleType: { type: String, enum: ['bike', 'scooter', 'car'] } // delivery
}, { timestamps: true });

// Password Hash Middleware
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password Methods
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
