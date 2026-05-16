import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { getRecommendations } from './recommend.js';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection string
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        console.log("✅ Successfully connected to MongoDB Atlas!");

        // Get database reference
        const db = client.db('recommendation_system');
        const products = db.collection('products');

        // A simple route to test the server
        app.get('/', (req, res) => {
            res.json({ message: 'Recommendation System API is running!' });
        });

        // Recommendations endpoint
        app.get('/recommendations', async (req, res) => {
            try {
                const productName = req.query.product;

                if (!productName) {
                    return res.status(400).json({
                        error: 'Product name is required. Use ?product=ProductName in the URL'
                    });
                }

                // Get recommendations using our content-based filtering
                const recommendations = await getRecommendations(
                    productName,
                    5,  // Limit to top 5 recommendations
                    {
                        categoryWeight: 0.3,
                        brandWeight: 0.2,
                        tagsWeight: 0.5
                    }
                );

                res.json({
                    success: true,
                    targetProduct: recommendations.targetProduct,
                    recommendations: recommendations.recommendations
                });

            } catch (error) {
                // Handle specific errors
                if (error.message === 'Product not found') {
                    return res.status(404).json({
                        error: 'Product not found'
                    });
                }

                // Handle unexpected errors
                console.error('Error getting recommendations:', error);
                res.status(500).json({
                    error: 'Internal server error',
                    message: 'Could not fetch recommendations'
                });
            }
        });

        // Start listening for requests
        app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });

    } catch (err) {
        console.error("❌ Could not connect to MongoDB Atlas", err);
        process.exit(1);
    }
}

// Run the connection function
run();

// Gracefully close the connection when the app is terminated
process.on('SIGINT', async () => {
    await client.close();
    console.log("\n🔌 MongoDB connection closed.");
    process.exit(0);
});