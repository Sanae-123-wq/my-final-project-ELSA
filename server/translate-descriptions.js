import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const translations = {
    "Très bien notée pour gâteaux, viennoiseries & desserts artisanaux. Ouvert généralement 07:30-22:30": "Highly rated for artisan cakes, pastries & desserts. Generally open 07:30-22:30.",
    "Pâtisseries variées & desserts sucrés. ~10:30-23:00": "Variety of pastries & sweet desserts. Open daily ~10:30-23:00.",
    "Pâtisserie locale appréciée. ~08:00-21:00": "A beloved local pastry shop. Open ~08:00-21:00.",
    "Boulangerie + douceurs sucrées. ~06:00-23:00": "Bakery and sweet treats. Open ~06:00-23:00.",
    "Pâtisserie & cakes. ~06:00-23:00": "Pastries and specialty cakes. Open ~06:00-23:00.",
    "Très bien notée, gâteaux & sucreries. ~15:30-23:00": "Highly rated cakes and sweets. Open ~15:30-23:00.",
    "Desserts raffinés. ~08:00-20:00": "Refined and elegant desserts. Open ~08:00-20:00.",
    "Pâtisseries & petits gâteaux. ~08:00-21:30": "Selection of pastries and small cakes. Open ~08:00-21:30.",
    "Pâtisserie/boulangerie locale.": "A cozy local pastry and bakery shop.",
    "Pâtisseries & pains frais.": "Freshly baked pastries and breads.",
    "Pâtisseries & petits pains.": "Delicious pastries and small breads.",
    "Pâtisseries populaires.": "Popular pastries and traditional treats.",
    "Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30": "Café, Restaurant, Bakery, Pastry & Pizzeria. A very popular spot. Open ~06:00-22:30.",
    "Pâtisserie marocaine traditionnelle.": "Traditional Moroccan pastries and sweets.",
    "Pâtisserie & boulangerie bien connue en ville.": "A well-known pastry and bakery shop in the city.",
    "Découvrez l'art de la pâtisserie faite maison par Sanae. Des créations uniques, des saveurs authentiques et une passion pour le délice sucré, directement d'Agadir à votre table.": "Discover the art of homemade pastry by Sanae. Unique creations, authentic flavors, and a passion for sweet delights, straight from Agadir to your table."
};

async function translateAll() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const vendors = await db.collection('users').find({ role: 'vendor' }).toArray();
        
        let count = 0;
        for (const v of vendors) {
            if (v.description && translations[v.description]) {
                await db.collection('users').updateOne(
                    { _id: v._id },
                    { $set: { description: translations[v.description] } }
                );
                count++;
            } else if (v.description && v.description.includes('Café, Restaurant')) {
                 await db.collection('users').updateOne(
                    { _id: v._id },
                    { $set: { description: translations["Café, Restaurant, Boulangerie, Pâtisserie & Pizzeria. Lieu très populaire. ~06:00-22:30"] } }
                );
                count++;
            }
        }
        
        console.log(`✅ Translated descriptions for ${count} vendors.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
translateAll();
