
const path = require("path");
const fs = require("fs");
const {createStorageFromData} = require("../../src/factories/storageFactory");
describe('Storage testing', () => {
    let storage;

    beforeAll(() => {
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Storage.json')
        const storageData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
        storage = createStorageFromData(storageData)
    });

    it('should return the correct code of storage', () => {
        expect(storage.codStorage).toBe("001549");
    });

    it('should return the number of zones', () => {
        expect(storage.zoneCodeList.length).toBe(3);
    });

    it('it should set a new code of storage', () => {
        let newCode = "000013"
        storage.codStorage = newCode
        expect(storage.codStorage).toBe(newCode)
    })

    it('it should set a new zones of storage', () => {
        let newZoneCodeList = ["003204", "001644", "009067"]
        storage.zoneCodeList = newZoneCodeList
        expect(storage.zoneCodeList).toBe(newZoneCodeList)
    })
});