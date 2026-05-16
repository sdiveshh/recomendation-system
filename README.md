# Product Recommendation System

A Node.js-based recommendation system that uses content-based filtering to suggest similar products based on categories, brands, and tags.

## Features

- Content-based product recommendations
- RESTful API endpoints
- MongoDB integration
- Real product data across multiple categories:
  - Electronics
  - Clothing
  - Dairy & Groceries
  - Home & Kitchen
  - Personal Care

## Prerequisites

- Node.js (v20.15.0 or higher)
- MongoDB Atlas account
- npm (Node Package Manager)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd recommendation_system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your MongoDB connection string:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## Database Management

### Clear Database
To remove all existing products from the database:
```bash
node clear-db.js
```

### Populate Database
To populate the database with sample products:
```bash
node populate-db.js
```

### Reset Database
To clear and repopulate the database:
```bash
node clear-db.js && node populate-db.js
```

## Running the Application

1. Start the server:
```bash
npm run dev
```
This will start the server in development mode with auto-reload enabled.

2. The server will be running at `http://localhost:3000`

## API Endpoints

### Get Product Recommendations
```http
GET /recommendations?product=ProductName
```

Example:
```http
GET http://localhost:3000/recommendations?product=iPhone 14 Pro
```

Response format:
```json
{
  "success": true,
  "targetProduct": {
    "name": "iPhone 14 Pro",
    "category": "Electronics",
    "brand": "Apple",
    "tags": ["smartphone", "mobile", "camera"]
  },
  "recommendations": [
    {
      "name": "Galaxy S23 Ultra",
      "category": "Electronics",
      "brand": "Samsung",
      "tags": ["smartphone", "mobile", "camera"],
      "similarityScore": 0.8
    },
    // ... more recommendations
  ]
}
```

## How Recommendations Work

The system uses content-based filtering with the following weights:
- Category matching: 30%
- Brand matching: 20%
- Tag similarity: 50%

Products are scored based on:
1. Exact category matches
2. Same brand matches
3. Tag similarity using Jaccard coefficient

## Sample Products

You can find recommendations for these example products:

### Electronics
- iPhone 14 Pro
- MacBook Pro 16"
- Galaxy S23 Ultra

### Clothing
- Nike Air Zoom Pegasus
- Levi's 501 Original Jeans
- Adidas Ultraboost

### Dairy & Groceries
- Organic Valley Whole Milk
- Chobani Greek Yogurt Pack
- Kerrygold Pure Irish Butter

### Home & Kitchen
- KitchenAid Stand Mixer
- Instant Pot Duo
- Ninja Air Fryer

### Personal Care
- Neutrogena Face Wash
- Dove Body Wash
- Cetaphil Moisturizing Cream

## Error Handling

The API returns appropriate error responses:
- 400: Invalid request (missing product name)
- 404: Product not found
- 500: Server error

## Development Scripts

- `npm run dev`: Start server with auto-reload
- `npm start`: Start server in production mode

## Project Structure

```
recommendation_system/
├── server.js           # Main server file
├── recommend.js        # Recommendation logic
├── populate-db.js      # Database seeding script
├── clear-db.js        # Database cleanup script
├── .env               # Environment variables
└── package.json       # Project dependencies
```
