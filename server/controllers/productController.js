import Product from '../models/Product.js'

export const seedProducts = async (req,res) => {
  try{
    const products = [
      {
        title: 'Apple iPhone 16 Pro',
        brand: 'Apple',
        category: 'Mobiles',
        price: 1299,
        oldPrice: 1499,
        discountPercentage: 13,
        description: 'A powerful smartphone with advanced camera and cutting-edge performance.',
        images: ['https://m.media-amazon.com/images/I/71ZOtNdaZCL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71ZOtNdaZCL._AC_SL1500_.jpg',
        rating: 4.8,
        reviews: 1234,
        stock: 48,
        isFeatured: true,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Samsung Galaxy S25 Ultra',
        brand: 'Samsung',
        category: 'Mobiles',
        price: 1199,
        oldPrice: 1399,
        discountPercentage: 14,
        description: 'A premium Android smartphone with a stunning display and powerful camera.',
        images: ['https://m.media-amazon.com/images/I/71q7RR9fWOL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71q7RR9fWOL._AC_SL1500_.jpg',
        rating: 4.7,
        reviews: 980,
        stock: 35,
        isFeatured: true,
        prime: true,
        deliveryDays: 3,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Sony WH1000XM6 Wireless Headphones',
        brand: 'Sony',
        category: 'Electronics',
        price: 349,
        oldPrice: 399,
        discountPercentage: 12,
        description: 'Noise cancelling headphones with premium sound and extended battery life.',
        images: ['https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
        rating: 4.6,
        reviews: 830,
        stock: 75,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Dell XPS 15 Laptop',
        brand: 'Dell',
        category: 'Laptops',
        price: 1449,
        oldPrice: 1699,
        discountPercentage: 14,
        description: 'Ultra-premium laptop with a stunning display and powerful Intel performance.',
        images: ['https://m.media-amazon.com/images/I/91z8fpVl3jL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/91z8fpVl3jL._AC_SL1500_.jpg',
        rating: 4.6,
        reviews: 412,
        stock: 29,
        isFeatured: true,
        prime: false,
        deliveryDays: 4,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'MacBook Air M4',
        brand: 'Apple',
        category: 'Laptops',
        price: 1299,
        oldPrice: 1499,
        discountPercentage: 13,
        description: 'Thin, light laptop with Apple M4 performance and long battery life.',
        images: ['https://m.media-amazon.com/images/I/71sq8iIi5DL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71sq8iIi5DL._AC_SL1500_.jpg',
        rating: 4.9,
        reviews: 620,
        stock: 58,
        isFeatured: true,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'PlayStation 5 Console',
        brand: 'Sony',
        category: 'Gaming',
        price: 499,
        oldPrice: 549,
        discountPercentage: 9,
        description: 'Next-gen console with immersive gaming experiences and ultra-fast loading.',
        images: ['https://m.media-amazon.com/images/I/619BkvKW35L._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/619BkvKW35L._AC_SL1500_.jpg',
        rating: 4.8,
        reviews: 1040,
        stock: 18,
        isFeatured: true,
        prime: false,
        deliveryDays: 4,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Nike Air Max 2024',
        brand: 'Nike',
        category: 'Shoes',
        price: 149,
        oldPrice: 179,
        discountPercentage: 17,
        description: 'Comfortable running shoes with modern cushioning and style.',
        images: ['https://m.media-amazon.com/images/I/71AQBJkVpaL._AC_UX695_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71AQBJkVpaL._AC_UX695_.jpg',
        rating: 4.5,
        reviews: 540,
        stock: 110,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Adidas Ultraboost 24',
        brand: 'Adidas',
        category: 'Shoes',
        price: 179,
        oldPrice: 209,
        discountPercentage: 14,
        description: 'Premium running shoes engineered for comfort and energy return.',
        images: ['https://m.media-amazon.com/images/I/71XViPeMhHL._AC_UX695_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71XViPeMhHL._AC_UX695_.jpg',
        rating: 4.7,
        reviews: 470,
        stock: 84,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'KitchenAid Artisan Stand Mixer',
        brand: 'KitchenAid',
        category: 'Kitchen',
        price: 429,
        oldPrice: 499,
        discountPercentage: 14,
        description: 'Versatile stand mixer for baking, cooking, and meal prep.',
        images: ['https://m.media-amazon.com/images/I/71W0Xx+5XfL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71W0Xx+5XfL._AC_SL1500_.jpg',
        rating: 4.8,
        reviews: 710,
        stock: 60,
        isFeatured: true,
        prime: false,
        deliveryDays: 3,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Boat Rockerz 330',
        brand: 'Boat',
        category: 'Electronics',
        price: 49,
        oldPrice: 79,
        discountPercentage: 38,
        description: 'Wireless Bluetooth headphones with long battery and bass sound.',
        images: ['https://m.media-amazon.com/images/I/61JatGMt-XL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/61JatGMt-XL._AC_SL1500_.jpg',
        rating: 4.3,
        reviews: 361,
        stock: 180,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Nothing Phone 3',
        brand: 'Nothing',
        category: 'Mobiles',
        price: 699,
        oldPrice: 799,
        discountPercentage: 13,
        description: 'A stylish Android phone with transparent design and powerful chipset.',
        images: ['https://m.media-amazon.com/images/I/717HTqj+v4L._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/717HTqj+v4L._AC_SL1500_.jpg',
        rating: 4.2,
        reviews: 210,
        stock: 92,
        isFeatured: false,
        prime: true,
        deliveryDays: 3,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'OnePlus 13',
        brand: 'OnePlus',
        category: 'Mobiles',
        price: 799,
        oldPrice: 899,
        discountPercentage: 11,
        description: 'High-performance smartphone with fluid display and fast charging.',
        images: ['https://m.media-amazon.com/images/I/712uTAuPfDL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/712uTAuPfDL._AC_SL1500_.jpg',
        rating: 4.6,
        reviews: 395,
        stock: 66,
        isFeatured: true,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Kindle Paperwhite',
        brand: 'Amazon',
        category: 'Books',
        price: 139,
        oldPrice: 159,
        discountPercentage: 13,
        description: 'Waterproof e-reader with a high-resolution display and weeks of battery life.',
        images: ['https://m.media-amazon.com/images/I/61u48FEsdHL._AC_SL1000_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/61u48FEsdHL._AC_SL1000_.jpg',
        rating: 4.7,
        reviews: 2100,
        stock: 125,
        isFeatured: true,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Canon EOS R50 Mirrorless Camera',
        brand: 'Canon',
        category: 'Electronics',
        price: 899,
        oldPrice: 999,
        discountPercentage: 10,
        description: 'Compact mirrorless camera with 4K video, great autofocus, and creative controls.',
        images: ['https://m.media-amazon.com/images/I/81ZYHkQh7uL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/81ZYHkQh7uL._AC_SL1500_.jpg',
        rating: 4.5,
        reviews: 250,
        stock: 40,
        isFeatured: false,
        prime: false,
        deliveryDays: 4,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'HP Pavilion 15 Laptop',
        brand: 'HP',
        category: 'Laptops',
        price: 749,
        oldPrice: 849,
        discountPercentage: 12,
        description: 'Reliable everyday laptop with fast performance and vibrant display.',
        images: ['https://m.media-amazon.com/images/I/71jXkI1l5sL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71jXkI1l5sL._AC_SL1500_.jpg',
        rating: 4.3,
        reviews: 310,
        stock: 55,
        isFeatured: false,
        prime: true,
        deliveryDays: 3,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Samsung 55-inch QLED Smart TV',
        brand: 'Samsung',
        category: 'Electronics',
        price: 899,
        oldPrice: 1099,
        discountPercentage: 18,
        description: 'Crisp QLED display with smart features and immersive audio.',
        images: ['https://m.media-amazon.com/images/I/91z0V2XPssL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/91z0V2XPssL._AC_SL1500_.jpg',
        rating: 4.6,
        reviews: 520,
        stock: 34,
        isFeatured: true,
        prime: false,
        deliveryDays: 4,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Sony PlayStation DualSense Controller',
        brand: 'Sony',
        category: 'Gaming',
        price: 69,
        oldPrice: 79,
        discountPercentage: 13,
        description: 'Next-gen controller with adaptive triggers and haptic feedback.',
        images: ['https://m.media-amazon.com/images/I/61b8Jd5f4BL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/61b8Jd5f4BL._AC_SL1500_.jpg',
        rating: 4.7,
        reviews: 870,
        stock: 95,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Logitech MX Master 3S Mouse',
        brand: 'Logitech',
        category: 'Electronics',
        price: 99,
        oldPrice: 129,
        discountPercentage: 23,
        description: 'Ergonomic mouse built for productivity with precision tracking.',
        images: ['https://m.media-amazon.com/images/I/61xVnOeTN9L._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/61xVnOeTN9L._AC_SL1500_.jpg',
        rating: 4.8,
        reviews: 1450,
        stock: 125,
        isFeatured: true,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Philips Air Fryer XXL',
        brand: 'Philips',
        category: 'Kitchen',
        price: 199,
        oldPrice: 249,
        discountPercentage: 20,
        description: 'Large-capacity air fryer for healthier meals with crisp results.',
        images: ['https://m.media-amazon.com/images/I/71wOQtpWxTL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71wOQtpWxTL._AC_SL1500_.jpg',
        rating: 4.4,
        reviews: 660,
        stock: 90,
        isFeatured: false,
        prime: true,
        deliveryDays: 3,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Apple Watch Series 10',
        brand: 'Apple',
        category: 'Electronics',
        price: 399,
        oldPrice: 449,
        discountPercentage: 11,
        description: 'Smartwatch with health monitoring and seamless Apple ecosystem integration.',
        images: ['https://m.media-amazon.com/images/I/71fXdG05YlL._AC_SL1500_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/71fXdG05YlL._AC_SL1500_.jpg',
        rating: 4.7,
        reviews: 780,
        stock: 68,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      },
      {
        title: 'Adidas Essentials Hoodie',
        brand: 'Adidas',
        category: 'Fashion',
        price: 69,
        oldPrice: 89,
        discountPercentage: 22,
        description: 'Comfortable hoodie for everyday wear with a relaxed fit.',
        images: ['https://m.media-amazon.com/images/I/61cW07lxywL._AC_UX679_.jpg'],
        thumbnail: 'https://m.media-amazon.com/images/I/61cW07lxywL._AC_UX679_.jpg',
        rating: 4.5,
        reviews: 410,
        stock: 140,
        isFeatured: false,
        prime: true,
        deliveryDays: 2,
        returnPolicy: '30-day return policy'
      }
    ]
    await Product.insertMany(products)
    res.json({ message:'Seeded products successfully', count: products.length })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const getProducts = async (req,res) => {
  try{
    const { q, category, featured, page = 1, limit = 100, sort } = req.query
    const filter = {}
    if(category) filter.category = new RegExp(`^${category}$`, 'i')
    if(featured === 'true') filter.isFeatured = true
    if(q) filter.$or = [
      { title: new RegExp(q, 'i') },
      { brand: new RegExp(q, 'i') },
      { category: new RegExp(q, 'i') },
      { description: new RegExp(q, 'i') }
    ]

    const skip = (Number(page) - 1) * Number(limit)
    const sortValue = sort === 'priceAsc' ? { price: 1 } : sort === 'priceDesc' ? { price: -1 } : { createdAt: -1 }

    const [products, count, categories] = await Promise.all([
      Product.find(filter).sort(sortValue).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
      Product.distinct('category')
    ])

    res.json({ products, count, categories })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const getProductById = async (req,res) => {
  try{
    const product = await Product.findById(req.params.id)
    if(!product) return res.status(404).json({ message:'Product not found' })
    res.json({ product })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const getProductsByCategory = async (req,res) => {
  try{
    const category = req.params.category
    const products = await Product.find({ category: new RegExp(`^${category}$`, 'i') })
    res.json({ products })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const searchProducts = async (req,res) => {
  try{
    const q = req.query.q || ''
    const filter = q ? {
      $or: [
        { title: new RegExp(q, 'i') },
        { brand: new RegExp(q, 'i') },
        { category: new RegExp(q, 'i') },
        { description: new RegExp(q, 'i') }
      ]
    } : {}
    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json({ products })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const addProduct = async (req,res) => {
  try{
    const product = await Product.create(req.body)
    res.status(201).json({ product })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const updateProduct = async (req,res) => {
  try{
    const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now() }, { new:true, runValidators:true })
    if(!product) return res.status(404).json({ message:'Product not found' })
    res.json({ product })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}

export const deleteProduct = async (req,res) => {
  try{
    const product = await Product.findById(req.params.id)
    if(!product) return res.status(404).json({ message:'Product not found' })
    await product.deleteOne()
    res.json({ message:'Product deleted successfully' })
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}
