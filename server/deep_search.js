import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function deepSearch() {
    try {
        const baseUri = process.env.MONGO_URI.split('/elsa-patisserie')[0];
        console.log('Connecting to cluster root...');
        const conn = await mongoose.createConnection(baseUri).asPromise();
        const admin = conn.db.admin();
        const { databases } = await admin.listDatabases();
        
        console.log('Databases in cluster:', databases.map(d => d.name));

        for (const dbInfo of databases) {
            if (['admin', 'local', 'config'].includes(dbInfo.name)) continue;
            
            const db = conn.useDb(dbInfo.name);
            const collections = await db.db.listCollections().toArray();
            const hasProducts = collections.some(c => c.name === 'products');
            
            if (hasProducts) {
                const count = await db.collection('products').countDocuments();
                console.log(`[${dbInfo.name}] Found "products" collection with ${count} docs.`);
                if (count > 0) {
                    const last = await db.collection('products').find().sort({ createdAt: -1 }).limit(1).toArray();
                    console.log(`   Latest: "${last[0].name}" created at ${last[0].createdAt}`);
                }
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

deepSearch();
