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

const STORE_METADATA_MAP = {
    "Au Délices Patisserie": {
        location: "Rue Omar Ibn Al Khattab, Agadir",
        phone: "+212 703 740 884",
        description: "A classic pastry shop offering a variety of cakes, pastries, and desserts. Good quality and suitable for everyday orders or small events."
    },
    "Caramel": {
        location: "Agadir Bay Technopole, Bloc C, Agadir",
        phone: "+212 528 844 812",
        description: "A modern pastry concept focused on creative desserts and stylish presentation, with a contemporary touch."
    },
    "La Baguette D'or": {
        location: "Avenue Moulay Hassan I, Agadir",
        phone: "+212 528 215 456",
        description: "A well-known bakery offering fresh bread, pastries, and traditional sweets. Ideal for daily breakfast and quick purchases."
    },
    "Patisserie Azalée": {
        location: "Tighanimine district, Agadir",
        phone: "+212 720 576 298",
        description: "An artisanal pastry shop known for high-quality, refined desserts and excellent customer ratings."
    },
    "Patisserie Fatima": {
        location: "Bloc F12, Dakhla, Agadir",
        phone: "+212 658 156 545",
        description: "A simple local pastry shop offering traditional pastries at affordable prices, perfect for everyday needs."
    },
    "Patisserie Glavan": {
        location: "Avenue des FAR, Agadir",
        phone: "+212 776 325 052",
        description: "A high-end pastry shop offering elegant French-style desserts with premium quality and presentation."
    },
    "Patisserie Mega Pain": {
        location: "Lot Rmel, Inzegane (near Agadir)",
        phone: "+212 528 836 363",
        description: "A popular bakery providing bread, pastries, and sweets at affordable prices, widely frequented by locals."
    },
    "Patisserie Mini Pain": {
        location: "Avenue des FAR, Agadir",
        phone: "+212 528 380 808",
        description: "A known chain combining bakery and pastry products, offering a wide selection at moderate prices."
    },
    "Paul": {
        name: "Paul (Agadir Bay)",
        location: "Agadir Bay",
        phone: "+212 528 292 479",
        description: "An international French brand famous for its bread, croissants, and elegant pastries, offering a café-style experience."
    }
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
            
            // Check for specific metadata metadata
            const metadata = STORE_METADATA_MAP[cleanName];

            // Try to find existing VENDOR (User collection)
            const existingVendor = await User.findOne({ 
                role: 'vendor',
                shopName: { $regex: new RegExp(`^${cleanName}$`, 'i') } 
            });

            if (existingVendor) {
                existingVendor.image = relativePath;
                
                // Always update metadata if present in map, otherwise update if placeholder
                if (metadata) {
                    existingVendor.shopName = metadata.name || cleanName;
                    existingVendor.city = metadata.location || "Agadir";
                    existingVendor.phone = metadata.phone || existingVendor.phone;
                    existingVendor.description = metadata.description || existingVendor.description;
                } else if (!existingVendor.description || existingVendor.description.includes('Welcome to our bakery') || existingVendor.description.includes('Lieu très populaire')) {
                     existingVendor.description = `Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30`;
                }
                
                await existingVendor.save();
                console.log(`✅ Updated Vendor: ${existingVendor.shopName} (${existingVendor.email})`);
            } else {
                // Check if user already exists by name (as fallback)
                let vendorByName = await User.findOne({ role: 'vendor', name: { $regex: new RegExp(`^${cleanName}$`, 'i') } });
                
                if (vendorByName) {
                    vendorByName.shopName = metadata?.name || cleanName;
                    vendorByName.image = relativePath;
                    if (metadata) {
                        vendorByName.city = metadata.location || "Agadir";
                        vendorByName.phone = metadata.phone || vendorByName.phone;
                        vendorByName.description = metadata.description || vendorByName.description;
                    }
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
                        shopName: metadata?.name || cleanName,
                        email: email,
                        password: 'partnerPassword123!', // Placeholder
                        role: 'vendor',
                        status: 'approved',
                        image: relativePath,
                        city: metadata?.location || "Agadir",
                        phone: metadata?.phone || "+212 5XX-XXXXXX",
                        description: metadata?.description || `Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30`
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
