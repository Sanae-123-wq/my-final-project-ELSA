import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function updateSanae() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        
        const updateObj = {
            shopName: 'Sanae store',
            phone: '+212771398616',
            city: 'Agadir',
            description: "Découvrez l'art de la pâtisserie faite maison par Sanae. Des créations uniques, des saveurs authentiques et une passion pour le délice sucré, directement d'Agadir à votre table.",
            image: '/src/assets/stores profils/Sanae store.png' 
        };

        const result = await db.collection('users').updateOne(
            { _id: new mongoose.Types.ObjectId('69c94b90c1818341825ed03e') },
            { $set: updateObj }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Sanae store has been updated successfully!');
        } else {
            console.log('❌ Could not find the store or no changes made.');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
updateSanae();
