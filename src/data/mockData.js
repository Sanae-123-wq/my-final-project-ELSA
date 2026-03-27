export let mockProducts = [
    {
        _id: '1',
        name: 'Classic Croissant',
        name_fr: 'Croissant Classique',
        name_ar: 'كرواسون كلاسيك',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1549438102-193c792f65f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Buttery, flaky, and golden brown French pastry.',
        description_fr: 'Pâtisserie française beurrée, feuilletée et dorée.',
        description_ar: 'معجنات فرنسية هشة ومقرمشة ومخبوزة بالزبدة.',
        category: 'Viennoiseries',
        price: 3.50,
        stock: 50,
        rating: 4.8,
        numReviews: 124,
        vendorName: 'Maison du Dessert',
    },
    {
        _id: '2',
        name: 'Chocolate Eclair',
        name_fr: 'Éclair au Chocolat',
        name_ar: 'إكلير الشوكولاتة',
        image: 'https://images.unsplash.com/photo-1612203985729-70726954388c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1612203985729-70726954388c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1481391319762-47dff72954d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Choux dough filled with cream and topped with chocolate icing.',
        description_fr: "Pâte à choux fourrée à la crème et recouverte d'un glaçage au chocolat.",
        description_ar: 'عجينة الشو محشوة بالكريمة ومغطاة بطبقة من الشوكولاتة.',
        category: 'Individual Desserts',
        price: 4.00,
        stock: 8,
        rating: 4.9,
        numReviews: 89,
        isNew: true,
        isPopular: true,
        vendorName: 'Chef Alex',
    },
    {
        _id: '3',
        name: 'Macarons (Box of 6)',
        name_fr: 'Macarons (Boîte de 6)',
        name_ar: 'ماكرون (علبة من 6)',
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1569864358642-9d1684040f43?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1548506062-29b0ad38d802?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Assorted flavors of delicate almond meringue cookies.',
        description_fr: 'Saveurs assorties de délicieux biscuits à la meringue aux amandes.',
        description_ar: 'نكهات متنوعة من كعك الماكرون الهش باللوز.',
        category: 'Individual Desserts',
        price: 12.00,
        stock: 15,
        rating: 4.7,
        numReviews: 45,
        isNew: true,
        vendorName: 'ELSA Patissier',
    },
    {
        _id: '4',
        name: 'Strawberry Cheesecake',
        name_fr: 'Cheesecake aux Fraises',
        name_ar: 'تشيز كيك بالفراولة',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1464305795204-6f5bdf7f8241?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Creamy cheesecake topped with fresh strawberries.',
        description_fr: 'Cheesecake crémeux garni de fraises fraîches.',
        description_ar: 'تشيز كيك كريمي مزين بحبات الفراولة الطازجة.',
        category: 'Cakes',
        price: 6.50,
        stock: 0,
        rating: 4.6,
        numReviews: 67,
        isPopular: true,
        vendorName: 'Maison du Dessert',
    },
    {
        _id: '5',
        name: 'Baklava',
        name_fr: 'Baklava',
        name_ar: 'بقلاوة',
        image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532630571094-734fd2a00c62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Rich, sweet dessert pastry made of layers of filo filled with chopped nuts.',
        description_fr: 'Dessert riche et sucré fait de couches de pâte phyllo et garni de noix hachées.',
        description_ar: 'حلوى غنية وشهية مصنوعة من طبقات الجلاش المحشوة بالمكسرات المفرومة.',
        category: 'Moroccan Sweets',
        price: 5.50,
        stock: 12,
        rating: 4.5,
        numReviews: 32,
        isNew: true,
        isPopular: true,
        vendorName: 'Chef Alex',
    },
    {
        _id: '6',
        name: 'Tiramisu',
        name_fr: 'Tiramisu',
        name_ar: 'تيراميسو',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1541014741259-df529411b96a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1621510456681-229ef55440bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Coffee-flavoured Italian dessert. Ladyfingers dipped in coffee, layered with mascarpone.',
        description_fr: 'Dessert italien au goût de café. Biscuits à la cuillère trempés dans du café et recouverts de mascarpone.',
        description_ar: 'حلوى إيطالية بنكهة القهوة. بسكويت مغمس بالقهوة ومغطى بطبقات من جبنة الماسكربوني.',
        category: 'Cakes',
        price: 7.00,
        stock: 25,
        rating: 4.8,
        numReviews: 142,
        vendorName: 'ELSA Patissier',
    },
    {
        _id: '7',
        name: 'Fruit Tart',
        name_fr: 'Tarte aux Fruits',
        name_ar: 'تارت الفواكه',
        image: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Crispy pastry shell with vanilla cream and fresh seasonal fruits.',
        description_fr: 'Pâte croustillante avec crème à la vanille et fruits frais de saison.',
        description_ar: 'تارت مقرمش محشو بكريمة الفانيليا والفواكه الموسمية الطازجة.',
        category: 'Individual Desserts',
        price: 4.50,
        stock: 4,
        rating: 4.3,
        numReviews: 28,
    },
    {
        _id: '8',
        name: 'Opera Cake',
        name_fr: 'Gâteau Opéra',
        name_ar: 'كعكة الأوبرا',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'French cake made with layers of almond sponge, coffee buttercream, and ganache.',
        description_fr: 'Gâteau français fait de couches de biscuit aux amandes, de crème au beurre au café et de ganache.',
        description_ar: 'كعكة فرنسية مصنوعة من طبقات من كعك اللوز، وكريمة زبدة القهوة، والجناش.',
        category: 'Cakes',
        price: 7.50,
        stock: 10,
        rating: 4.9,
        numReviews: 54,
    },
    {
        _id: '9',
        name: 'Pistachio Baklava',
        name_fr: 'Baklava aux Pistaches',
        name_ar: 'بقلاوة بالفستق',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Middle Eastern pastry with layers of filo, chopped pistachios, and honey syrup.',
        description_fr: 'Pâtisserie orientale avec couches de pâte phyllo, pistaches hachées et sirop de miel.',
        description_ar: 'معجنات شرقية بطبقات الجلاش الرقيقة، محشوة بالفستق المطحون ومغطاة بشراب العسل.',
        category: 'Moroccan Sweets',
        price: 6.00,
        stock: 30,
        rating: 4.7,
        numReviews: 92,
    },
    {
        _id: '10',
        name: 'Pain au Chocolat',
        name_fr: 'Pain au Chocolat',
        name_ar: 'كرواسون الشوكولاتة (بان أو شوكولا)',
        image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Classic French chocolate-filled pastry made with buttery puff pastry.',
        description_fr: 'Délicieuse pâtisserie française fourrée au chocolat et faite de pâte feuilletée pur beurre.',
        description_ar: 'معجنات فرنسية كلاسيكية محشوة بالشوكولاتة ومصنوعة من عجينتها المورقة بالزبدة.',
        category: 'Viennoiseries',
        price: 3.80,
        stock: 0,
        rating: 4.5,
        numReviews: 31,
    },
    {
        _id: '11',
        name: 'Lemon Meringue Tart',
        name_fr: 'Tarte au Citron Meringuée',
        name_ar: 'تارت الليمون بالمارينج',
        image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Zesty lemon curd topped with a cloud of toasted meringue.',
        description_fr: "Crème au citron acidulée recouverte d'un nuage de meringue grillée.",
        description_ar: 'كريمة الليمون المنعشة مغطاة بطبقة خفيفة من المارينج المحمص.',
        category: 'Individual Desserts',
        price: 4.80,
        stock: 6,
        rating: 4.8,
        numReviews: 24,
    },
    {
        _id: '12',
        name: 'Red Velvet Cake',
        name_fr: 'Gâteau Red Velvet',
        name_ar: 'كعكة الريد فيلفيت المخملية',
        image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Rich, crimson layered cake with smooth cream cheese frosting.',
        description_fr: 'Riche gâteau étagé cramoisi avec un glaçage onctueux au fromage à la crème.',
        description_ar: 'كعكة حمراء غنية بطبقات من كريمة الجبنة الناعمة.',
        category: 'Cakes',
        price: 7.00,
        stock: 18,
        rating: 4.6,
        numReviews: 112,
        isPopular: true,
        vendorName: 'Chef Alex',
    },
    {
        _id: '13',
        name: 'Blueberry Muffin',
        name_fr: 'Muffin aux Myrtilles',
        name_ar: 'مافن التوت الأزرق',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Moist golden muffin packed with fresh juicy blueberries.',
        description_fr: 'Muffin doré et moelleux, rempli de myrtilles juteuses et fraîches.',
        description_ar: 'مافن ذهبي رطب وغني بحبات التوت الأزرق الطازجة.',
        category: 'Viennoiseries',
        price: 3.20,
        stock: 40,
        rating: 4.2,
        numReviews: 14,
    },
    {
        _id: '14',
        name: 'Kunafa',
        name_fr: 'Knafeh',
        name_ar: 'كنافة',
        image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Traditional Middle Eastern cheese pastry soaked in sweet syrup.',
        description_fr: 'Pâtisserie traditionnelle du Moyen-Orient au fromage, trempée dans un sirop sucré.',
        description_ar: 'حلوى شرقية تقليدية محشوة بالجبن ومغمورة بالقطر الحلو.',
        category: 'Moroccan Sweets',
        price: 6.50,
        stock: 7,
        rating: 4.7,
        numReviews: 56,
    },
    {
        _id: '15',
        name: 'Vanilla Cupcake',
        name_fr: 'Cupcake à la Vanille',
        name_ar: 'كاب كيك الفانيليا',
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        images: [
            'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Light vanilla cake topped with a swirl of classic buttercream.',
        description_fr: "Gâteau léger à la vanille surmonté d'un tourbillon de crème au beurre classique.",
        description_ar: 'كعكة فانيليا خفيفة مزينة بدوامة من كريمة الزبدة الكلاسيكية.',
        category: 'Cupcakes',
        price: 3.50,
        stock: 15,
        rating: 4.4,
        numReviews: 38,
    },
    {
        _id: '16',
        name: 'Salted Caramel Cookies',
        name_fr: 'Cookies au Caramel Beurre Salé',
        name_ar: 'كوكيز الكراميل المملح',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Giant soft cookies with chunks of chocolate and salted caramel.',
        description_fr: 'Grands cookies moelleux avec des morceaux de chocolat et du caramel au beurre salé.',
        category: 'Cookies & Biscuits',
        price: 5.00,
        stock: 22,
        rating: 4.9,
        numReviews: 72,
    },
    {
        _id: '17',
        name: 'Luxury Pralines Box',
        name_fr: 'Boîte de Pralines de Luxe',
        image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Assorted handmade chocolates and pralines.',
        category: 'Chocolates & Candies',
        price: 22.00,
        stock: 12,
        rating: 4.8,
        numReviews: 15,
    },
    {
        _id: '18',
        name: 'Vegan Avocado Brownie',
        image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'Rich chocolate brownie made with healthy avocado and no sugar.',
        category: 'Healthy Options',
        price: 4.50,
        stock: 0,
        rating: 4.3,
        numReviews: 8,
    },
    {
        _id: '19',
        name: 'Premium Celebration Box',
        image: 'https://images.unsplash.com/photo-1513201099705-a9a44eeef9a2?auto=format&fit=crop&q=80&w=800',
        images: [
            'https://images.unsplash.com/photo-1513201099705-a9a44eeef9a2?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1548506062-29b0ad38d802?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        description: 'A large box filled with our best-selling pastries for your events.',
        category: 'Event Boxes',
        price: 45.00,
        stock: 5,
        rating: 5.0,
        numReviews: 12,
    }
];

export let mockUsers = [
    {
        _id: 'u_admin',
        name: 'ELSA Admin',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin',
        token: 'mock-jwt-token-admin'
    },
    {
        _id: 'u1',
        name: 'Test Client',
        email: 'test@example.com',
        password: 'password',
        role: 'client',
        token: 'mock-jwt-token-client'
    },
    {
        _id: 'u_vendor1',
        name: 'Patissier Chef Alex',
        email: 'alex@patisserie.com',
        password: 'password',
        role: 'vendor',
        token: 'mock-jwt-token-vendor1'
    },
    {
        _id: 'u_delivery1',
        name: 'Fast Delivery Courier',
        email: 'delivery@elsa.com',
        password: 'password',
        role: 'delivery',
        token: 'mock-jwt-token-delivery1'
    }
];

export let mockOrders = [
    {
        _id: 'ord_1',
        user: { _id: 'u1', name: 'Test Client', email: 'test@example.com' },
        items: [
            { _id: '1', name: 'Classic Croissant', price: 3.50, qty: 2 },
            { _id: '4', name: 'Strawberry Cheesecake', price: 6.50, qty: 1 }
        ],
        totalPrice: 13.50,
        status: 'pending',
        deliveryAddress: '123 Test St, Agadir',
        createdAt: new Date().toISOString()
    }
];

// Initialize reviews for mock products
mockProducts = mockProducts.map(product => {
    const initialReviews = [
        {
            _id: Math.random().toString(36).substr(2, 9),
            name: 'Sarah Miller',
            rating: 5,
            comment: 'Absolutely delicious! The best I have ever had.',
            date: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            _id: Math.random().toString(36).substr(2, 9),
            name: 'John Doe',
            rating: 4,
            comment: 'Very tasty, but slightly expensive for the size.',
            date: new Date(Date.now() - 86400000 * 5).toISOString()
        }
    ];
    
    if (product._id === '1') return { ...product, reviews: initialReviews };
    if (product._id === '4') return { 
        ...product, 
        reviews: [
            ...initialReviews, 
            { _id: 'rev3', name: 'Amine Ben', rating: 5, comment: 'My favorite! Highly recommended.', date: new Date(Date.now() - 86400000 * 10).toISOString() }
        ] 
    };
    
    return { ...product, reviews: [] };
});

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
