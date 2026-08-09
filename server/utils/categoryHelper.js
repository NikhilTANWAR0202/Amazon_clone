export const inferCategoryFromTitle = (title) => {
  const text = (title || '').toLowerCase()
  if (!text) return 'Other'

  const rules = [
    { category: 'Mobiles', keywords: ['phone', 'mobile', 'iphone', 'galaxy', 'oneplus', 'pixel', 'xiaomi', 'redmi', 'moto', 'nokia'] },
    { category: 'Laptops', keywords: ['laptop', 'macbook', 'xps', 'pavilion', 'thinkpad', 'notebook', 'air', 'pro', 'surface'] },
    { category: 'Electronics', keywords: ['headphone', 'earbuds', 'speaker', 'camera', 'tv', 'monitor', 'charger', 'router', 'keyboard', 'mouse', 'watch', 'smartwatch', 'tablet'] },
    { category: 'Gaming', keywords: ['playstation', 'ps5', 'xbox', 'nintendo', 'controller', 'gaming', 'console', 'dungeon', 'gamer', 'stadia'] },
    { category: 'Shoes', keywords: ['shoe', 'sneaker', 'boot', 'sandals', 'trainer', 'air max', 'ultraboost', 'runner', 'running'] },
    { category: 'Books', keywords: ['book', 'novel', 'paperback', 'hardcover', 'kindle', 'guide', 'memoir', 'story'] },
    { category: 'Kitchen', keywords: ['kitchen', 'mixer', 'blender', 'air fryer', 'coffee', 'toaster', 'oven', 'cookware', 'fryer'] },
    { category: 'Home', keywords: ['sofa', 'table', 'chair', 'lamp', 'decor', 'mattress', 'furniture', 'cushion', 'home'] },
    { category: 'Fashion', keywords: ['hoodie', 'jacket', 'shirt', 'dress', 'jeans', 'trouser', 'leggings', 'coat', 'fashion', 'hoodie'] },
    { category: 'Beauty', keywords: ['shampoo', 'makeup', 'skincare', 'perfume', 'cosmetic', 'beauty', 'lotion', 'cream'] },
    { category: 'Sports', keywords: ['ball', 'racket', 'fitness', 'gym', 'bicycle', 'bike', 'treadmill', 'sports'] },
    { category: 'Accessories', keywords: ['case', 'cover', 'bag', 'belt', 'sunglasses', 'wallet', 'charger', 'headphones', 'earbuds', 'bracelet'] },
  ]

  const matched = rules.find((rule) => rule.keywords.some((keyword) => text.includes(keyword)))
  return matched ? matched.category : 'Other'
}
