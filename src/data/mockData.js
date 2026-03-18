export const mockProducts = [
    {
        _id: '1',
        name: 'Classic Croissant',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Buttery, flaky, and golden brown French pastry.',
        category: 'Pastry',
        price: 3.50,
    },
    {
        _id: '2',
        name: 'Chocolate Eclair',
        image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Choux dough filled with cream and topped with chocolate icing.',
        category: 'Pastry',
        price: 4.00,
    },
    {
        _id: '3',
        name: 'Macarons (Box of 6)',
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Assorted flavors of delicate almond meringue cookies.',
        category: 'Traditional',
        price: 12.00,
    },
    {
        _id: '4',
        name: 'Strawberry Cheesecake',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Creamy cheesecake topped with fresh strawberries.',
        category: 'Cake',
        price: 6.50,
    },
    {
        _id: '5',
        name: 'Baklava',
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Rich, sweet dessert pastry made of layers of filo filled with chopped nuts.',
        category: 'Traditional',
        price: 5.50,
    },
    {
        _id: '6',
        name: 'Tiramisu',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Coffee-flavoured Italian dessert. Ladyfingers dipped in coffee, layered with mascarpone.',
        category: 'Cake',
        price: 7.00,
    },
    {
        _id: '7',
        name: 'Fruit Tart',
        image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Crispy pastry shell with vanilla cream and fresh seasonal fruits.',
        category: 'Pastry',
        price: 4.50,
    },
    {
        _id: '8',
        name: 'Opera Cake',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'French cake made with layers of almond sponge, coffee buttercream, and ganache.',
        category: 'Cake',
        price: 7.50,
    },
    {
        _id: '9',
        name: 'Pistachio Baklava',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Middle Eastern pastry with layers of filo, chopped pistachios, and honey syrup.',
        category: 'Traditional',
        price: 6.00,
    },
    {
        _id: '10',
        name: 'Pain au Chocolat',
        image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Classic French chocolate-filled pastry made with buttery puff pastry.',
        category: 'Pastry',
        price: 3.80,
    },
    {
        _id: '11',
        name: 'Lemon Meringue Tart',
        image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Zesty lemon curd topped with a cloud of toasted meringue.',
        category: 'Pastry',
        price: 4.80,
    },
    {
        _id: '12',
        name: 'Red Velvet Cake',
        image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Rich, crimson layered cake with smooth cream cheese frosting.',
        category: 'Cake',
        price: 7.00,
    },
    {
        _id: '13',
        name: 'Blueberry Muffin',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Moist golden muffin packed with fresh juicy blueberries.',
        category: 'Pastry',
        price: 3.20,
    },
    {
        _id: '14',
        name: 'Kunafa',
        image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Traditional Middle Eastern cheese pastry soaked in sweet syrup.',
        category: 'Traditional',
        price: 6.50,
    },
    {
        _id: '15',
        name: 'Vanilla Cupcake',
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Light vanilla cake topped with a swirl of classic buttercream.',
        category: 'Cake',
        price: 3.50,
    }
];

export const mockUsers = [
    {
        _id: 'u1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password', // In real app, never store plain text
        token: 'mock-jwt-token-123'
    }
];

export const mockPacks = [
    {
        _id: 'pack_kika',
        name: 'Kika Pack',
        name_fr: 'Pack Kika',
        name_ar: 'باقة كيكا',
        price: 25.00,
        image: '/src/assets/cake_pack.png',
        type: 'pack'
    },
    {
        _id: 'pack_tarte',
        name: 'Tarte Pack',
        name_fr: 'Pack Tarte',
        name_ar: 'باقة التارت',
        price: 35.00,
        image: '/src/assets/tart_pack.png',
        type: 'pack'
    },
    {
        _id: 'pack_macaron',
        name: 'Macaron Pack',
        name_fr: 'Pack Macaron',
        name_ar: 'باقة الماكرون',
        price: 45.00,
        image: '/src/assets/macaron_pack.png',
        type: 'pack'
    }
];
