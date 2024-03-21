
const path = require("path");
const fs = require("fs");
const {createStorageFromData} = require("../../src/factories/storageFactory");
describe('Order testing', () => {
    let storage;

    beforeAll(() => {
        const jsonFilePath = path.resolve(__dirname, '../Resources/MongoDB/WMS.Storage.json')
        const storageData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'))
        storage = createStorageFromData(storageData)
    });

    it('should return the correct codStorage', () => {
        expect(storage.codStorage).toBe("001549");
    });

    it('should return the number of zones', () => {
        expect(storage.zoneList.length).toBe(3);
    });
});