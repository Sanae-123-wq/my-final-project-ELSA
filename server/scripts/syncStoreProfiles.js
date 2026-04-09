import mongoose from 'mongoose';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI;
const IMAGES_DIR = path.join(__dirname, '../uploads/stores/profiles');

const formatName = (filename) => {
    let name = path.parse(filename).name;
    name = name.replace(/[_-]/g, ' ');
    name = name.replace(/\s+/g, ' ');
    name = name.split(' ').map(word => {
        if (!word) return '';
        if (word.includes("'")) {
            return word.split("'").map(sub => sub.charAt(0).toUpperCase() + sub.slice(1).toLowerCase()).join("'");
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
    return name.trim();
};

const sync = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        if (!fs.existsSync(IMAGES_DIR)) {
            console.error(`Images directory not found: ${IMAGES_DIR}`);
            process.exit(1);
        }

        const files = fs.readdirSync(IMAGES_DIR);
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

        for (const file of files) {
            const ext = path.extname(file).toLowerCase();
            if (!imageExtensions.includes(ext)) continue;

            const cleanName = formatName(file);
            const relativePath = `/uploads/stores/profiles/${file}`;

            // Try to find existing VENDOR (User collection)
            const existingVendor = await User.findOne({ 
                role: 'vendor',
                shopName: { $regex: new RegExp(`^${cleanName}$`, 'i') } 
            });

            if (existingVendor) {
                existingVendor.image = relativePath;
                // Update description if it is generic or placeholder (optional)
                if (!existingVendor.description || existingVendor.description.includes('Welcome to our bakery')) {
                     existingVendor.description = `Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30`;
                }
                await existingVendor.save();
                console.log(`✅ Updated Vendor: ${existingVendor.shopName} (${existingVendor.email})`);
            } else {
                // Check if user already exists by name (as fallback)
                let vendorByName = await User.findOne({ role: 'vendor', name: { $regex: new RegExp(`^${cleanName}$`, 'i') } });
                
                if (vendorByName) {
                    vendorByName.shopName = cleanName;
                    vendorByName.image = relativePath;
                    await vendorByName.save();
                    console.log(`✅ Updated Vendor (by name): ${vendorByName.name}`);
                } else {
                    // Create new Vendor User
                    const email = `${cleanName.toLowerCase().replace(/\s+/g, '')}@elsa-partner.com`;
                    
                    // Critical Fix: Check if email already exists to prevent duplication error
                    const emailExists = await User.findOne({ email });
                    if (emailExists) {
                        console.log(`⚠️ Skip creation: Email ${email} already used by ${emailExists.name}`);
                        continue;
                    }

                    await User.create({
                        name: cleanName,
                        shopName: cleanName,
                        email: email,
                        password: 'partnerPassword123!', // Placeholder
                        role: 'vendor',
                        status: 'approved',
                        image: relativePath,
                        city: "Agadir",
                        phone: "+212 5XX-XXXXXX",
                        description: `Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30`
                    });
                    console.log(`✨ Created New Vendor: ${cleanName} (${email})`);
                }
            }
        }

        console.log("Vendor Profile Synchronization complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error syncing vendors:", error);
        process.exit(1);
    }
};

sync();
