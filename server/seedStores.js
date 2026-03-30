import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from './models/Store.js';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sanaeelbelghiti2_db_user:s8hvmk2e7kKYuYg9@cluster0.uoxcc6m.mongodb.net/elsa-patisserie?retryWrites=true&w=majority";

const storesData = [
  {
    name: "Pâtisserie Galavan",
    location: "Av. des Forces Armées Royales, Agadir",
    phone: "+212776325052",
    openingHours: "07:30‑22:30",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000",
    description: "Highly rated for cakes, pastries & artisanal desserts."
  },
  {
    name: "Plaisirs Sucrés",
    location: "Lahoucine Achengli, Immeuble Yasmine, Founty Sonaba, Agadir",
    phone: "+212601117835",
    openingHours: "10:30‑23:00",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000",
    description: "Wide variety of pastries & sweet desserts."
  },
  {
    name: "Pastry shop TIMIMT",
    location: "Rue de Marrakech, Agadir",
    phone: "+212601883476",
    openingHours: "08:00‑21:00",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000",
    description: "Popular local pastry shop."
  },
  {
    name: "Les Délices d'Assiya",
    location: "Rue Omar El Khyam, Agadir",
    phone: "+212528212579",
    openingHours: "06:00‑23:00",
    image: "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=1000",
    description: "Bakery with sweet delicacies."
  },
  {
    name: "BAM CAKE",
    location: "Agadir",
    phone: "+212608492590",
    openingHours: "06:00‑23:00",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1000",
    description: "Pastries and cakes."
  },
  {
    name: "Sweeties",
    location: "Av. Al Abrar, Agadir",
    phone: "+212650772953",
    openingHours: "15:30‑23:00",
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000",
    description: "Highly rated for cakes and sweets."
  },
  {
    name: "Pâtisserie Azalée",
    location: "Rue Tighanimine, Agadir",
    phone: "+212720576298",
    openingHours: "08:00‑20:00",
    image: "https://images.unsplash.com/photo-1464305795204-6f5bdee7351a?q=80&w=1000",
    description: "Fine and elegant desserts."
  },
  {
    name: "Au délice pâtisserie",
    location: "Rue Omar bnou Al Khattab, Agadir",
    phone: "+212703740884",
    openingHours: "08:00‑21:30",
    image: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000",
    description: "Pastries and small cakes."
  },
  {
    name: "Souss Sweets",
    location: "Av. Président Kennedy, Agadir",
    image: "https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=1000",
    description: "Local bakery and pastry shop."
  },
  {
    name: "Les Dou' Délices",
    location: "Sonaba, Agadir",
    phone: "+212637293553",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000",
    description: "Fresh pastries and breads."
  },
  {
    name: "Pâtisserie Mini Pain",
    location: "Av. des Forces Armées Royales, Agadir",
    phone: "+212528380808",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000",
    description: "Pastries and small breads."
  },
  {
    name: "Pâtisserie Tagadirt",
    location: "Agadir",
    image: "https://images.unsplash.com/photo-1579372781878-67bb21cd839d?q=80&w=1000",
    description: "Popular pastries."
  },
  {
    name: "Tafarnout",
    location: "Boulevard Hassan II, Agadir",
    phone: "+212528844450",
    openingHours: "06:00‑22:30",
    image: "https://images.unsplash.com/photo-1511018556340-d16986a1c194?q=80&w=1000",
    description: "Pastries with coffee and meals (very popular place)."
  },
  {
    name: "Le Pain 9",
    location: "Avenue Hassan II, Agadir 80000, Morocco",
    phone: "+212 5282-34567",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000",
    description: "A modern bakery in Agadir known for its fresh bread, sandwiches, and simple pastries. Popular for quick bites at affordable prices."
  },
  {
    name: "La Baguette Dorée",
    location: "Boulevard Mohammed V, Agadir 80000, Morocco",
    phone: "+212 5288-76543",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000",
    description: "A well-known bakery offering fresh baguettes, croissants, and a variety of pastries. Appreciated for its quality products and cleanliness."
  }
];

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        await Store.deleteMany({});
        await Product.deleteMany({});
        console.log("Cleared old stores and products");

        for (const storeInfo of storesData) {
            const newStore = await Store.create(storeInfo);
            
            await Product.create([
                {
                    name: `Artisanal Croissant - ${newStore.name}`,
                    price: 15,
                    image: newStore.image,
                    category: "Pastry",
                    description: "Golden, flaky, and buttery layers. A classic French delight.",
                    stock: 50,
                    storeId: newStore._id,
                    approvalStatus: "approved"
                },
                {
                    name: `Signature Dessert - ${newStore.name}`,
                    price: 45,
                    image: newStore.image,
                    category: "Cake",
                    description: "A signature masterpiece crafted with fresh ingredients.",
                    stock: 20,
                    storeId: newStore._id,
                    approvalStatus: "approved"
                }
            ]);
            
            console.log(`Inserted Store: ${newStore.name}`);
        }

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
};

seed();
