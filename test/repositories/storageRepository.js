const {Storage} = require("../../src/entities/storage")
const {createStorage, getStorages, findStorageByCode, updateStorageData, deleteStorage} = require("../../src/repositories/storageRepository");
const {describe, it, expect} = require('@jest/globals')
const storageRepository = () => describe('Storage testing', () => {

    it("it should create a new storage", async ()  => {
        let zoneCodeList = [ "00120", "00124"]
        const result = await createStorage(new Storage(zoneCodeList, "000878"))
        expect(result).toBeDefined()
    })

    it('it should return all the storages', async() => {
        const result = await getStorages()
        expect(result).toBeDefined()
    })

    it('it should find a storage by code', async () => {
        const storage = await findStorageByCode("001549")
        const zoneCodeList = ["000120", "001200", "013400"]
        expect(storage._zoneCodeList).toEqual(zoneCodeList)
    });

    it('it should return null if storage is not found', async () => {
        const codStorage = '000123'
        const storage = await findStorageByCode(codStorage)

        expect(storage).toBeNull()
    });

    it('it should return an updated storage with new list of zone', async() => {
        const newZoneCodeList = ["000123", "123098"]
        const filter = { _codStorage: "001549" }
        const update = { $set: { _zoneCodeList: newZoneCodeList } }

        const updatedStorage = await updateStorageData(filter, update)
        expect(updatedStorage._zoneCodeList).toEqual(newZoneCodeList)
    })

    it('it should return null if the filter is not correct', async() => {
        const newZoneCodeList = ["000123", "123098"]
        const filter = { _codStorage: "" }
        const update = { $set: { _zoneCodeList: newZoneCodeList } }

        const updatedStorage = await updateStorageData(filter, update)
        expect(updatedStorage).toBeNull()
    })

    it('it should return null if the storage has been deleted', async() => {
        const storageCode = '001549'
        await deleteStorage(storageCode)
        const deletedStorage = await findStorageByCode(storageCode)

        expect(deletedStorage).toBeNull()
    })
});

module.exports = {storageRepository}