import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const vendors = [
    {
        name: "Pâtisserie Galavan",
        shopName: "Pâtisserie Galavan",
        email: "galavan@elsa.com",
        city: "Av. des Forces Armées Royales, Agadir",
        phone: "+212 776-325-052",
        description: "Très bien notée pour gâteaux, viennoiseries & desserts artisanaux. Ouvert généralement 07:30-22:30",
    },
    {
        name: "Plaisirs Sucrés",
        shopName: "Plaisirs Sucrés",
        email: "plaisirs@elsa.com",
        city: "Lahoucine Achengli, Immeuble Yasmine, Founty Sonaba, Agadir",
        phone: "+212 601-117-835",
        description: "Pâtisseries variées & desserts sucrés. ~10:30-23:00",
    },
    {
        name: "Pastry shop TIMIMT",
        shopName: "Pastry shop TIMIMT",
        email: "timimt@elsa.com",
        city: "Rue de Marrakech, Agadir",
        phone: "+212 601-883-476",
        description: "Pâtisserie locale appréciée. ~08:00-21:00",
    },
    {
        name: "Les Délices d'Assiya",
        shopName: "Les Délices d'Assiya",
        email: "assiya@elsa.com",
        city: "Rue Omar El Khyam, Agadir",
        phone: "+212 528-212-579",
        description: "Boulangerie + douceurs sucrées. ~06:00-23:00",
    },
    {
        name: "BAM CAKE",
        shopName: "BAM CAKE",
        email: "bamcake@elsa.com",
        city: "Agadir",
        phone: "+212 608-492-590",
        description: "Pâtisserie & cakes. ~06:00-23:00",
    },
    {
        name: "Sweeties",
        shopName: "Sweeties",
        email: "sweeties@elsa.com",
        city: "Av. Al Abrar, Agadir",
        phone: "+212 650-772-953",
        description: "Très bien notée, gâteaux & sucreries. ~15:30-23:00",
    },
    {
        name: "Pâtisserie Azalée",
        shopName: "Pâtisserie Azalée",
        email: "azalee@elsa.com",
        city: "Rue Tighanimine, Agadir",
        phone: "+212 720-576-298",
        description: "Desserts raffinés. ~08:00-20:00",
    },
    {
        name: "Au délice pâtisserie",
        shopName: "Au délice pâtisserie",
        email: "audelice@elsa.com",
        city: "Rue Omar bnou Al Khattab, Agadir",
        phone: "+212 703-740-884",
        description: "Pâtisseries & petits gâteaux. ~08:00-21:30",
    },
    {
        name: "حلويات سوس",
        shopName: "حلويات سوس",
        email: "souss@elsa.com",
        city: "Av. Président Kennedy, Agadir",
        phone: "N/A",
        description: "Pâtisserie/boulangerie locale.",
    },
    {
        name: "Les Dou' Délices",
        shopName: "Les Dou' Délices",
        email: "doudelices@elsa.com",
        city: "Sonaba, Agadir",
        phone: "+212 637-293-553",
        description: "Pâtisseries & pains frais.",
    },
    {
        name: "Pâtisserie Mini Pain",
        shopName: "Pâtisserie Mini Pain",
        email: "minipain@elsa.com",
        city: "Av. des Forces Armées Royales, Agadir",
        phone: "+212 528-380-808",
        description: "Pâtisseries & petits pains.",
    },
    {
        name: "Pâtisserie Tagadirt",
        shopName: "Pâtisserie Tagadirt",
        email: "tagadirt@elsa.com",
        city: "Agadir",
        phone: "N/A",
        description: "Pâtisseries populaires.",
    },
    {
        name: "Tafarnout",
        shopName: "Tafarnout",
        email: "tafarnout@elsa.com",
        city: "Boulevard Hassan II, Agadir",
        phone: "+212 528-844-450",
        description: "Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30",
    },
    {
        name: "Pâtisserie JAWAHIR",
        shopName: "Pâtisserie JAWAHIR",
        email: "jawahir@elsa.com",
        city: "Avenue 29 Février, Rue Ihchach Talborjt, Agadir",
        phone: "+212 028-820-134",
        description: "Pâtisserie marocaine traditionnelle.",
    },
    {
        name: "Pâtisserie Mega Pain",
        shopName: "Pâtisserie Mega Pain",
        email: "megapain@elsa.com",
        city: "36 Rue de Fès, Agadir",
        phone: "+212 5288-46666",
        description: "Pâtisserie & boulangerie bien connue en ville.",
    },
    {
        name: "La Baguette Dorée",
        shopName: "La Baguette Dorée",
        email: "baguette@elsa.com",
        city: "Talborjt district, Agadir",
        phone: "+212 528-84-56-78",
        description: "La Baguette Dorée is a well-known bakery and pastry shop offering viennoiseries, cakes, and sandwiches.",
    },
    {
        name: "Le Pain 9",
        shopName: "Le Pain 9",
        email: "lepain9@elsa.com",
        city: "Hay Salam / Talborjt, Agadir",
        phone: "+212 528-23-45-67",
        description: "Modern pastry shop known for fine pastries, high-end cakes, and elegant presentation.",
    }
];

const seedVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        for (const v of vendors) {
            const userExists = await User.findOne({ email: v.email });
            if (userExists) {
                console.log(`⚠️ Vendor ${v.name} already exists, skipping.`);
                continue;
            }

            // Create vendor user
            await User.create({
                ...v,
                password: 'password123', // Default password
                role: 'vendor',
                status: 'approved',
                image: '/uploads/vendors/placeholder.png' // Default placeholder
            });
            console.log(`✅ Added vendor: ${v.name}`);
        }

        console.log('✨ Seeding completed!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedVendors();
