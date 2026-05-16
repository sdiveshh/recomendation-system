import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

/**
 * Calculate similarity scores between a target product and all other products
 * using content-based filtering based on tags, brand, and category.
 * 
 * @param {Object} targetProduct - The product to find similarities for
 * @param {Array} allProducts - Array of all products to compare against
 * @param {Object} options - Optional weights for different features
 * @returns {Array} Array of products with similarity scores, sorted by similarity (highest first)
 */
function findSimilarProducts(targetProduct, allProducts, options = {}) {
    // Default weights for different features
    const weights = {
        category: options.categoryWeight ?? 0.3,  // Same category is a strong signal
        brand: options.brandWeight ?? 0.2,        // Same brand is a moderate signal
        tags: options.tagsWeight ?? 0.5           // Tags provide the most granular matching
    };

    // Remove the target product from comparison if it exists in allProducts
    const otherProducts = allProducts.filter(p => p._id.toString() !== targetProduct._id.toString());

    // Calculate similarity scores for each product
    const productsWithScores = otherProducts.map(product => {
        let score = 0;

        // Category similarity (exact match)
        if (product.category === targetProduct.category) {
            score += weights.category;
        }

        // Brand similarity (exact match)
        if (product.brand === targetProduct.brand) {
            score += weights.brand;
        }

        // Tags similarity (Jaccard similarity coefficient)
        const targetTags = new Set(targetProduct.tags);
        const productTags = new Set(product.tags);
        const intersectionSize = [...targetTags].filter(tag => productTags.has(tag)).length;
        const unionSize = new Set([...targetTags, ...productTags]).size;
        const tagSimilarity = unionSize === 0 ? 0 : intersectionSize / unionSize;
        score += weights.tags * tagSimilarity;

        return {
            ...product,
            similarityScore: parseFloat(score.toFixed(3))
        };
    });

    // Sort by similarity score (highest first) and filter out low-similarity products
    return productsWithScores
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .filter(product => product.similarityScore > 0);
}

/**
 * Get product recommendations based on a product name
 * @param {string} productName - Name of the target product
 * @param {number} limit - Number of recommendations to return (default: 5)
 * @param {Object} weights - Optional custom weights for similarity calculation
 * @returns {Promise<Array>} Array of recommended products with similarity scores
 */
async function getRecommendations(productName, limit = 5, weights = {}) {
    try {
        await client.connect();
        const db = client.db('recommendation_system');
        const products = db.collection('products');

        // Get the target product
        const targetProduct = await products.findOne({ name: productName });
        if (!targetProduct) {
            throw new Error('Product not found');
        }

        // Get all products for comparison
        const allProducts = await products.find().toArray();

        // Calculate similarities and get recommendations
        const similarProducts = findSimilarProducts(targetProduct, allProducts, weights);

        return {
            targetProduct: {
                name: targetProduct.name,
                category: targetProduct.category,
                brand: targetProduct.brand,
                tags: targetProduct.tags
            },
            recommendations: similarProducts
                .slice(0, limit)
                .map(product => ({
                    name: product.name,
                    category: product.category,
                    brand: product.brand,
                    tags: product.tags,
                    similarityScore: product.similarityScore
                }))
        };

    } catch (error) {
        console.error('Error getting recommendations:', error);
        throw error;
    } finally {
        await client.close();
    }
}

// Export functions for use in other modules
export { findSimilarProducts, getRecommendations };
