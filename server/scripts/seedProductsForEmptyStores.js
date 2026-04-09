import mongoose from 'mongoose';
import 'dotenv/config';
import User from '../models/User.js';
import Product from '../models/Product.js';

const MONGO_URI = process.env.MONGO_URI;

const productPool = {
    bakery: [
        {
            name: 'Artisanal Baguette',
            name_fr: 'Baguette Artisanale',
            price: 1.20,
            category: 'Bread',
            image: 'https://images.unsplash.com/photo-1589367920969-ab8e0509aae2?auto=format&fit=crop&q=80&w=800',
            description: 'Traditional French sourdough baguette with a crispy crust and airy interior.'
        },
        {
            name: 'Butter Croissant',
            name_fr: 'Croissant au Beurre',
            price: 1.50,
            category: 'Viennoiseries',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=800',
            description: 'Flaky, buttery, and golden brown French pastry.'
        },
        {
            name: 'Pain au Chocolat',
            name_fr: 'Pain au Chocolat',
            price: 1.80,
            category: 'Viennoiseries',
            image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&q=80&w=800',
            description: 'Delicious French pastry filled with premium dark chocolate.'
        },
        {
            name: 'Sourdough Country Loaf',
            name_fr: 'Pain de Campagne',
            price: 4.50,
            category: 'Bread',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
            description: 'Slow-fermented sourdough with a deep, complex flavor profile.'
        }
    ],
    patisserie: [
        {
            name: 'Strawberry Tart',
            name_fr: 'Tarte aux Fraises',
            price: 4.50,
            category: 'Tarts',
            image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&q=80&w=800',
            description: 'Sweet pastry shell filled with vanilla cream and topped with fresh strawberries.'
        },
        {
            name: 'Chocolate Macarons (Box of 6)',
            name_fr: 'Macarons au Chocolat (Boîte de 6)',
            price: 12.00,
            category: 'Macarons',
            image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800',
            description: 'Delicate almond meringue shells with a rich chocolate ganache filling.'
        },
        {
            name: 'Cheesecake Royale',
            name_fr: 'Cheesecake Royal',
            price: 6.00,
            category: 'Cheesecakes',
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800',
            description: 'Creamy New York style cheesecake on a buttery graham cracker crust.'
        },
        {
            name: 'Classic Tiramisu',
            name_fr: 'Tiramisu Classique',
            price: 5.50,
            category: 'Tiramisu',
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&q=80&w=800',
            description: 'Traditional Italian espresso-soaked ladyfingers with mascarpone cream.'
        }
    ],
    general: [
        {
            name: 'Belgium Chocolate Box',
            name_fr: 'Boîte de Chocolat Belge',
            price: 25.00,
            category: 'Chocolates',
            image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800',
            description: 'Assorted premium pralines and truffles handmade with Belgian chocolate.'
        },
        {
            name: 'Assorted Macarons',
            name_fr: 'Macarons Assortis',
            price: 15.00,
            category: 'Macarons',
            image: 'https://images.unsplash.com/photo-1548506062-29b0ad38d802?auto=format&fit=crop&q=80&w=800',
            description: 'A colorful selection of our most popular macaron flavors.'
        },
        {
            name: 'Red Velvet Cupcakes',
            name_fr: 'Cupcakes Red Velvet',
            price: 3.50,
            category: 'Cupcakes',
            image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&q=80&w=800',
            description: 'Moist red velvet cake topped with smooth cream cheese frosting.'
        }
    ]
};

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        const vendors = await User.find({ role: 'vendor' });
        console.log(`Found ${vendors.length} vendors.`);

        for (const vendor of vendors) {
            const productCount = await Product.countDocuments({ vendorId: vendor._id.toString() });
            
            if (productCount === 0) {
                console.log(` Seeding empty store: ${vendor.shopName || vendor.name}`);
                
                let niche = 'general';
                const nameLower = (vendor.shopName || vendor.name || '').toLowerCase();
                if (nameLower.includes('bakery') || nameLower.includes('pain') || nameLower.includes('baguette')) {
                    niche = 'bakery';
                } else if (nameLower.includes('patisserie') || nameLower.includes('pâtisserie') || nameLower.includes('cake') || nameLower.includes('sweet')) {
                    niche = 'patisserie';
                }

                const productsToSeed = productPool[niche];
                
                for (const p of productsToSeed) {
                    await Product.create({
                        ...p,
                        vendorId: vendor._id.toString(),
                        storeId: vendor._id, // Add both for compatibility
                        stock: 20,
                        approvalStatus: 'approved'
                    });
                }
                console.log(`   ✅ Added ${productsToSeed.length} products to ${vendor.shopName || vendor.name}`);
            }
        }

        console.log("Product seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
};

seed();
