const {Storage} = require("../../src/entities/storage")
const path = require("path")
const fs = require("fs")
const {connectDB, collections, closeDB} = require("../../src/config/dbConnection");
const {createStorage, getStorages, findStorageByCode, updateStorageData, deleteStorage} = require("../../src/repositories/storageRepository");

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

    it('should find a storage by code', async () => {
        const storage = await findStorageByCode("001549")
        const zoneCodeList = ["000120", "001200", "013400"]
        expect(storage._zoneCodeList).toEqual(zoneCodeList)
    });

    it('should return null if storage is not found', async () => {
        const codStorage = '000123'
        const storage = await findStorageByCode(codStorage)

        expect(storage).toBeNull()
    });

    it('should return an updated storage with new list of zone', async() => {
        const newZoneCodeList = ["000123", "123098"]
        const filter = { _codStorage: "001549" }
        const update = { $set: { _zoneCodeList: newZoneCodeList } }

        const updatedStorage = await updateStorageData(filter, update)
        expect(updatedStorage._zoneCodeList).toEqual(newZoneCodeList)
    })

    it('should return null if the filter is not correct', async() => {
        const newZoneCodeList = ["000123", "123098"]
        const filter = { _codStorage: "" }
        const update = { $set: { _zoneCodeList: newZoneCodeList } }

        const updatedStorage = await updateStorageData(filter, update)
        expect(updatedStorage).toBeNull()
    })

    it('should return null if the storage has been deleted', async() => {
        const storageCode = '001549'
        await deleteStorage(storageCode)
        const deletedStorage = await findStorageByCode(storageCode)

        expect(deletedStorage).toBeNull()
    })
});