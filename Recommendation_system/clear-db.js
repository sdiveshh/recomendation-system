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

async function clearDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('recommendation_system');
        const products = db.collection('products');

        // Get the count of documents before deletion
        const initialCount = await products.countDocuments();
        console.log(`Found ${initialCount} products in the database`);

        // Delete all documents from the products collection
        const result = await products.deleteMany({});
        console.log(`✅ Successfully deleted ${result.deletedCount} products from the database`);

    } catch (error) {
        console.error('❌ Error clearing database:', error);
    } finally {
        await client.close();
        console.log('\n🔌 Database connection closed');
    }
}

// Run the clear function
clearDatabase();
