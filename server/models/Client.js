import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    phone: { type: String },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;
