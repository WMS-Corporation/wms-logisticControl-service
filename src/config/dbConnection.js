const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();

const collections = {};
let client = null;

/**
 * Connects to the database.
 *
 * This function establishes a connection to the MongoDB database using the connection string
 * specified in the environment variables. It initializes the MongoDB client, connects to the
 * database, and sets up the users, storage, corridors, shelfs and zones collections for further database operations.
 */
async function connectDB(dbName) {
    try {
        client = new MongoClient(process.env.DB_CONN_STRING);
        await client.connect();
        const db = client.db(dbName);
        collections.storage = db.collection(process.env.STORAGE_COLLECTION);
        collections.zones = db.collection(process.env.ZONE_COLLECTION);
        collections.corridors = db.collection(process.env.CORRIDOR_COLLECTION);
        collections.shelfs = db.collection(process.env.SHELF_COLLECTION);
        collections.users = db.collection(process.env.USER_COLLECTION);
        collections.counter = db.collection(process.env.COUNTER_COLLECTION);
        if(await collections.counter.countDocuments() === 0){
            await collections.counter.insertOne({count : 1})
        }
        console.log(`Successfully connected to database: ${db.databaseName} and collections: ${collections.storage.collectionName}, ${collections.zones.collectionName}, ${collections.corridors.collectionName}, ${collections.shelfs.collectionName}`);
    } catch (error) {
        console.error('Error during the connection to db: ', error);
    }
}

/**
 * Closes the database connection.
 *
 * This function closes the MongoDB client connection and performs cleanup tasks.
 */
async function closeDB() {
    try {
        if (client) {
            await client.close();
            console.log('Database connection closed successfully.');
        } else {
            console.warn('No database connection to close.');
        }
    } catch (error) {
        console.error('Error while closing database connection: ', error);
    }
}

module.exports = {
    connectDB,
    collections,
    closeDB
};