const {Storage} = require("../../src/entities/storage")
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../../src/config/dbConnection");
const {createStorage, getStorages} = require("../../src/repositories/storageRepository");

describe('storageRepository testing', () => {
    beforeAll(async () => {
        await connectDB(process.env.DB_NAME_TEST_REPOSITORY);
    });

    beforeEach(async() => {
        await collections.storage.deleteMany()
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Storage.json');
        const storageData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
        await collections.storage.insertOne(storageData)
    })
    afterAll(async () => {
        await closeDB()
    });

    it("should create a new storage", async ()  => {
        let zoneCodeList = [ "00120", "00124"]
        const result = await createStorage(new Storage(zoneCodeList, "000878"))
        expect(result).toBeDefined()
    })

    it('should return all the storages', async() => {
        const result = await getStorages()
        const numDoc = await collections.storage.countDocuments()
        expect(result.length).toEqual(numDoc)
    })

});