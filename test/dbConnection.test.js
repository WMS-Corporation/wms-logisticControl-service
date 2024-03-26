const { MongoClient } = require('mongodb');
const { connectDB, collections, closeDB} = require('../src/config/dbConnection');
const dotenv = require('dotenv');
const {describe, it, expect, beforeAll, afterAll} = require('@jest/globals')
dotenv.config();
describe('Database Connection', () => {
    let connection;
    let db;
    let storageCollection;
    let zonesCollection;
    let corridorsCollection;
    let shelfsCollection;
    
    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.DB_CONN_STRING);
        db = connection.db(process.env.DB_NAME);
        storageCollection = db.collection(process.env.STORAGE_COLLECTION);
        zonesCollection = db.collection(process.env.ZONE_COLLECTION);
        corridorsCollection = db.collection(process.env.CORRIDOR_COLLECTION);
        shelfsCollection = db.collection(process.env.SHELF_COLLECTION);
    });

    afterAll(async () => {
        await connection.close();
        await closeDB()
    });

    it('should connect to the database and collections of storage, zones, corridors and shelfs', async () => {
        await connectDB(process.env.DB_NAME);
        expect(db.databaseName).toBe("WMS");
        expect(collections.storage).toBeDefined();
        expect(collections.zones).toBeDefined();
        expect(collections.corridors).toBeDefined();
        expect(collections.shelfs).toBeDefined();
        expect(collections.storage.collectionName).toBe(storageCollection.collectionName);
        expect(collections.zones.collectionName).toBe(zonesCollection.collectionName);
        expect(collections.corridors.collectionName).toBe(corridorsCollection.collectionName);
        expect(collections.shelfs.collectionName).toBe(shelfsCollection.collectionName);
    });

});