const {connectDB, closeDB, collections} = require("../src/config/dbConnection");
const {resolve} = require("path");
const {readFileSync} = require("fs");
const {describe, beforeAll, afterAll} = require('@jest/globals')
const {storageService} = require("./services/storageService");
const {zoneService} = require("./services/zoneService");

describe('Services testing', () => {
    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_SERVICES);

        await collections.storage.deleteMany()
        await collections.zones.deleteMany()

        const jsonFilePathStorage = resolve(__dirname, 'Resources/MongoDB/WMS.Storage.json');
        const storageData =  JSON.parse(readFileSync(jsonFilePathStorage, 'utf-8'));
        await collections.storage.insertMany(storageData)

        const jsonFilePathZone = resolve(__dirname, 'Resources/MongoDB/WMS.Zone.json');
        const zoneData = JSON.parse(readFileSync(jsonFilePathZone, 'utf-8'));
        await collections.zones.insertOne(zoneData)
    });

    afterAll(async () => {
        await closeDB()
    });

    storageService()
    zoneService()

});