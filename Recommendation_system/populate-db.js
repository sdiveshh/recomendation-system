import { MongoClient, ServerApiVersion } from 'mongodb';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Define categories and their related tags with real products
const productData = {
    'Electronics': {
        brands: ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'Bose'],
        tags: ['smartphone', 'laptop', 'audio', 'tv', 'gaming', 'camera', 'tablet', 'wearable'],
        products: [
            { name: 'iPhone 14 Pro', tags: ['smartphone', 'mobile', 'camera'], brand: 'Apple', price: 999 },
            { name: 'MacBook Pro 16"', tags: ['laptop', 'computer', 'professional'], brand: 'Apple', price: 2499 },
            { name: 'Galaxy S23 Ultra', tags: ['smartphone', 'mobile', 'camera'], brand: 'Samsung', price: 1199 },
            { name: 'Sony WH-1000XM4', tags: ['audio', 'wireless', 'headphones'], brand: 'Sony', price: 349 },
            { name: 'LG C2 OLED 65"', tags: ['tv', 'entertainment', 'gaming'], brand: 'LG', price: 1799 },
            { name: 'iPad Pro 12.9"', tags: ['tablet', 'mobile', 'creative'], brand: 'Apple', price: 1099 }
        ]
    },
    'Clothing': {
        brands: ['Nike', 'Adidas', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s'],
        tags: ['casual', 'sports', 'formal', 'outdoor', 'comfort', 'fashion', 'seasonal', 'athleisure'],
        products: [
            { name: 'Nike Air Zoom Pegasus', tags: ['sports', 'running', 'comfort'], brand: 'Nike', price: 120 },
            { name: 'Levi\'s 501 Original Jeans', tags: ['casual', 'denim', 'classic'], brand: 'Levi\'s', price: 98 },
            { name: 'Adidas Ultraboost', tags: ['sports', 'running', 'comfort'], brand: 'Adidas', price: 180 },
            { name: 'Uniqlo AIRism T-Shirt', tags: ['casual', 'comfort', 'basic'], brand: 'Uniqlo', price: 15 },
            { name: 'H&M Slim Fit Blazer', tags: ['formal', 'office', 'fashion'], brand: 'H&M', price: 50 },
            { name: 'Zara Pleated Midi Skirt', tags: ['fashion', 'formal', 'seasonal'], brand: 'Zara', price: 49 },
            { name: 'Nike Dri-FIT Running Jacket', tags: ['sports', 'outdoor', 'athleisure'], brand: 'Nike', price: 85 },
            { name: 'Adidas Track Pants', tags: ['sports', 'casual', 'athleisure'], brand: 'Adidas', price: 60 }
        ]
    },
    'Dairy & Groceries': {
        brands: ['Organic Valley', 'Chobani', 'Kerrygold', 'Tillamook', 'Horizon', 'Siggi\'s'],
        tags: ['organic', 'fresh', 'healthy', 'breakfast', 'snack', 'cooking', 'protein', 'natural'],
        products: [
            { name: 'Organic Valley Whole Milk', tags: ['organic', 'fresh', 'breakfast'], brand: 'Organic Valley', price: 5.99 },
            { name: 'Chobani Greek Yogurt Pack', tags: ['protein', 'healthy', 'breakfast'], brand: 'Chobani', price: 6.99 },
            { name: 'Kerrygold Pure Irish Butter', tags: ['cooking', 'natural', 'premium'], brand: 'Kerrygold', price: 4.99 },
            { name: 'Tillamook Sharp Cheddar', tags: ['snack', 'protein', 'natural'], brand: 'Tillamook', price: 7.99 },
            { name: 'Horizon Organic Heavy Cream', tags: ['organic', 'cooking', 'fresh'], brand: 'Horizon', price: 4.49 },
            { name: 'Siggi\'s Skyr Yogurt', tags: ['protein', 'healthy', 'breakfast'], brand: 'Siggi\'s', price: 2.29 }
        ]
    },
    'Home & Kitchen': {
        brands: ['KitchenAid', 'Instant Pot', 'Ninja', 'OXO', 'Cuisinart', 'Lodge'],
        tags: ['cooking', 'baking', 'storage', 'preparation', 'appliance', 'utensils', 'organization'],
        products: [
            { name: 'KitchenAid Stand Mixer', tags: ['baking', 'appliance', 'premium'], brand: 'KitchenAid', price: 379 },
            { name: 'Instant Pot Duo', tags: ['cooking', 'appliance', 'versatile'], brand: 'Instant Pot', price: 89 },
            { name: 'Ninja Air Fryer', tags: ['cooking', 'appliance', 'healthy'], brand: 'Ninja', price: 119 },
            { name: 'OXO Storage Container Set', tags: ['storage', 'organization', 'kitchen'], brand: 'OXO', price: 29.99 },
            { name: 'Cuisinart Food Processor', tags: ['preparation', 'appliance', 'versatile'], brand: 'Cuisinart', price: 199 },
            { name: 'Lodge Cast Iron Skillet', tags: ['cooking', 'utensils', 'durable'], brand: 'Lodge', price: 24.95 }
        ]
    },
    'Personal Care': {
        brands: ['Dove', 'Neutrogena', 'Cetaphil', 'Colgate', 'Oral-B', 'Nivea'],
        tags: ['skincare', 'haircare', 'dental', 'hygiene', 'body care', 'face care'],
        products: [
            { name: 'Neutrogena Face Wash', tags: ['skincare', 'face care', 'daily'], brand: 'Neutrogena', price: 8.99 },
            { name: 'Dove Body Wash', tags: ['body care', 'hygiene', 'moisturizing'], brand: 'Dove', price: 6.99 },
            { name: 'Cetaphil Moisturizing Cream', tags: ['skincare', 'face care', 'body care'], brand: 'Cetaphil', price: 12.99 },
            { name: 'Oral-B Electric Toothbrush', tags: ['dental', 'hygiene', 'electric'], brand: 'Oral-B', price: 99.99 },
            { name: 'Colgate Whitening Toothpaste', tags: ['dental', 'hygiene', 'whitening'], brand: 'Colgate', price: 4.99 },
            { name: 'Nivea Body Lotion', tags: ['body care', 'moisturizing', 'daily'], brand: 'Nivea', price: 7.99 }
        ]
    }
};

// Function to get all predefined products
function getAllProducts() {
    const allProducts = [];
    
    // Iterate through each category and its products
    for (const [category, categoryData] of Object.entries(productData)) {
        for (const product of categoryData.products) {
            allProducts.push({
                name: product.name,
                description: `The ${product.name} is a high-quality ${category.toLowerCase()} product, perfect for ${product.tags.join(' and ')}.`,
                category: category,
                brand: product.brand,
                price: product.price,
                tags: product.tags,
                inStock: Math.random() > 0.2, // 80% chance of being in stock
                rating: (3.5 + Math.random() * 1.5).toFixed(1), // Rating between 3.5 and 5.0
                createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
                updatedAt: new Date()
            });
        }
    }
    
    return allProducts;
}

async function populateProducts() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('recommendation_system');
        const products = db.collection('products');

        // Get all predefined products
        const allProducts = getAllProducts();
        
        // Insert all products
        const result = await products.insertMany(allProducts);
        console.log(`Successfully inserted ${result.insertedCount} products!`);

        // Get some statistics about the inserted data
        const categoryCounts = await products.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]).toArray();

        console.log('\nProducts distribution by category:');
        categoryCounts.forEach(cat => {
            console.log(`${cat._id}: ${cat.count} products`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nDatabase connection closed');
    }
}

// Run the population script
populateProducts();